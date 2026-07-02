import type { CompetitorDiff, FieldDelta } from './diffEngine';

export interface ScoredDelta extends FieldDelta {
  competitorId: string;
  competitorName: string;
  score: number;
  justification: string;
  recommendedAction: string;
}

export interface Brief {
  executiveSummary: string;
  crossCompetitorPatterns: string;
  priorityActions: string[];
  scoredDeltas: ScoredDelta[];
  generatedAt: string;
  baselineDate: string;
  scanDate: string;
}

export interface KBDocument {
  id: string;
  filename: string;
  uploadedAt: string;
  documentType: string;
  companySummary: string;
  currentPriorities: string[];
  signalWeights: {
    pricing: 'high' | 'medium' | 'low';
    feature: 'high' | 'medium' | 'low';
    positioning: 'high' | 'medium' | 'low';
    cta: 'high' | 'medium' | 'low';
  };
  watchFor: string[];
  extractedContext: string;
}

export interface CompetitorProfile {
  heroCopy: string;
  primaryCTA: string;
  pricingTiers: { name: string; price: string; billingNote: string; keyFeatures: string[] }[];
  keyFeatureClaims: string[];
  targetAudience: string;
  initialInsights: string;
  watchSignals: string[];
}

export interface KBContext {
  preamble: string;
}

const RUBRIC = `
SCORING RUBRIC — apply strictly, do not deviate:

SCORE 8-10 (HIGH SIGNAL):
- Pricing tier added, removed, or price changed
- ICP or target audience shift
- New direct competitive claim against rivals
- AI or major platform capability added to any tier

SCORE 5-7 (MODERATE — include if at or above threshold of 6):
- New feature claim or product capability
- CTA change implying conversion strategy shift
- New beta features signaling near-term roadmap
- Hero copy repositioning without full ICP shift

SCORE 1-4 (NOISE — filter out):
- Wording tweaks with no strategic implication
- Navigation/layout changes
- Image/visual changes
- Punctuation corrections

HARD RULES:
- ONLY reference what is in the before/after fields provided
- Do not infer strategic intent beyond the evidence
- Every justification must cite the specific field and before/after values
- If you cannot trace a score to before/after data, score it 3
- Do not hallucinate numbers, prices, or feature names not in the input
- THRESHOLD: Only return deltas scored 6 or above. Drop everything below 6 silently.
`;

async function callClaude(body: object): Promise<{ content: Array<{ text: string }> }> {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(`Claude API error: ${res.status} — ${errBody?.error?.message ?? errBody?.error ?? JSON.stringify(errBody)}`);
  }
  return res.json();
}

export async function evalDiffs(diffs: CompetitorDiff[], kbContext?: KBContext): Promise<ScoredDelta[]> {
  const validDiffs = diffs.filter(d => !d.guardrailTripped && d.deltas.length > 0);
  if (!validDiffs.length) return [];

  const input = validDiffs.map(d => ({
    competitor: d.name,
    id: d.id,
    deltas: d.deltas.map(delta => ({ field: delta.field, before: delta.before, after: delta.after, deltaType: delta.deltaType })),
  }));

  const contextPreamble = kbContext ? `${kbContext.preamble}\n\n` : '';

  const prompt = `${contextPreamble}${RUBRIC}

You are evaluating competitive intelligence deltas. For each delta below, score it and return ONLY deltas scored 6 or above.

INPUT DATA:
${JSON.stringify(input, null, 2)}

Return a JSON array of objects with this exact shape (no markdown, raw JSON only):
[{
  "competitorId": string,
  "competitorName": string,
  "field": string,
  "before": string,
  "after": string,
  "deltaType": "Pricing"|"Feature"|"Positioning"|"CTA",
  "score": number,
  "justification": string (cite specific field and before/after values),
  "recommendedAction": string (one actionable sentence)
}]

GUARDRAIL: Every claim in justification must trace back to the before/after data provided. Do not introduce external knowledge.`;

  const res = await callClaude({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = res.content[0].text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
  const scored: ScoredDelta[] = JSON.parse(text);

  return scored.filter(s => {
    const source = validDiffs.find(d => d.id === s.competitorId);
    if (!source) return false;
    const sourceDelta = source.deltas.find(d => d.field === s.field);
    if (!sourceDelta) { console.warn('Guardrail L3: dropped hallucinated field', s.field); return false; }
    return true;
  });
}

export async function synthesizeBrief(scoredDeltas: ScoredDelta[]): Promise<Brief> {
  if (!scoredDeltas.length) {
    return {
      executiveSummary: 'No significant competitive changes detected this week across tracked competitors.',
      crossCompetitorPatterns: '',
      priorityActions: ['Continue monitoring; no high-signal changes this week.'],
      scoredDeltas: [],
      generatedAt: new Date().toISOString(),
      baselineDate: '2026-06-23',
      scanDate: '2026-06-30',
    };
  }

  const prompt = `You are synthesizing a competitive intelligence brief for a digital agency.

HARD RULES:
- Only reference the data provided below. Do not introduce external knowledge.
- The executive summary must synthesize cross-competitor trends, not list per-company facts.
- Priority actions must be specific and actionable.

SCORED DELTAS:
${JSON.stringify(scoredDeltas, null, 2)}

Return raw JSON (no markdown) with this shape:
{
  "executiveSummary": string (3-4 sentences, synthesised trends, executive-readable),
  "crossCompetitorPatterns": string (describe patterns visible across 2+ competitors, or empty string if none),
  "priorityActions": string[] (3-5 numbered actionable items)
}`;

  const res = await callClaude({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = res.content[0].text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
  const synthesis = JSON.parse(text);

  return {
    ...synthesis,
    scoredDeltas,
    generatedAt: new Date().toISOString(),
    baselineDate: '2026-06-23',
    scanDate: '2026-06-30',
  };
}

export async function askBrief(brief: Brief, question: string, history: Array<{ role: string; content: string }>): Promise<string> {
  const systemPrompt = `You are a competitive intelligence assistant. Answer questions using ONLY the brief data provided. Do not introduce external knowledge or speculation beyond what the brief contains.

BRIEF DATA:
${JSON.stringify(brief, null, 2)}`;

  const res = await callClaude({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: systemPrompt,
    messages: [...history, { role: 'user', content: question }],
  });

  return res.content[0].text;
}

export async function generateCompetitorProfile(name: string, url: string): Promise<CompetitorProfile> {
  const prompt = `You are a competitive intelligence analyst. A user has just added a new competitor to track: ${name} at ${url}.

Generate an initial competitor profile based on what you know about this company.
Structure it as JSON with exactly these fields:
{
  "heroCopy": string (their likely current hero/headline copy),
  "primaryCTA": string (their likely primary call to action),
  "pricingTiers": [{ "name": string, "price": string, "billingNote": string, "keyFeatures": string[] }],
  "keyFeatureClaims": string[],
  "targetAudience": string,
  "initialInsights": string (2-3 sentence summary of their current positioning and what to watch for — be specific, not generic),
  "watchSignals": string[] (3-4 specific things to monitor for this competitor based on their current market position)
}

Respond ONLY with valid JSON. No markdown, no preamble.`;

  const res = await callClaude({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = res.content[0].text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(text);
}

export async function extractKBDocument(filename: string, content: string | { base64: string }): Promise<KBDocument> {
  const extractPrompt = `You are reading a company strategy or context document uploaded by an agency user. Extract the following and respond ONLY with valid JSON, no markdown:

{
  "documentType": string (e.g. "ICP document", "Product strategy", "Pricing brief", "Competitive positioning doc", "Company overview"),
  "companySummary": string (1-2 sentences: who this company is and what they do),
  "currentPriorities": string[] (3-5 specific strategic priorities mentioned or implied),
  "signalWeights": {
    "pricing": "high" | "medium" | "low",
    "feature": "high" | "medium" | "low",
    "positioning": "high" | "medium" | "low",
    "cta": "high" | "medium" | "low"
  },
  "watchFor": string[] (4-6 specific things to monitor in competitors given this company context — be specific, not generic),
  "extractedContext": string (3-4 sentence summary of what this document tells the AI about what matters to this company right now)
}`;

  let messages: object[];
  if (typeof content === 'string') {
    messages = [{ role: 'user', content: `${extractPrompt}\n\nDOCUMENT CONTENT:\n${content}` }];
  } else {
    messages = [{
      role: 'user',
      content: [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: content.base64 } },
        { type: 'text', text: extractPrompt },
      ],
    }];
  }

  const res = await callClaude({ model: 'claude-sonnet-4-6', max_tokens: 1500, messages });
  const text = res.content[0].text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
  const parsed = JSON.parse(text);
  return { ...parsed, id: crypto.randomUUID(), filename, uploadedAt: new Date().toISOString() };
}

export interface ProfilePoint { lead: string; detail: string; }
export interface ProfileSection { heading: string; subheading?: string; points: ProfilePoint[]; }
export interface CompetitorProfilePage {
  overview: ProfileSection;
  howWeCompare: ProfileSection;
  howWeWin: ProfileSection;
  strengths: ProfileSection;
  weaknesses: ProfileSection;
  howToDifferentiate: ProfileSection;
}

export async function generateCompetitorProfilePage(
  name: string,
  url: string,
  kbDocs: KBDocument[],
): Promise<CompetitorProfilePage> {
  const kbContext = kbDocs.length
    ? `\nADDITIONAL COMPANY CONTEXT:\n${kbDocs.map(d => d.extractedContext).join('\n\n')}\n`
    : '';

  const prompt = `You are a competitive intelligence analyst at NorthLane Digital, a B2B SaaS marketing agency. You are generating a competitor profile for internal use.

NorthLane Digital context:
- We are a B2B digital agency specialising in demand generation, MarTech consulting, and content strategy for mid-market SaaS companies ($5M-$50M ARR)
- We use tools like Linear, Shortcut, Monday.com, and Notion ourselves and recommend them to clients
- Our differentiators: B2B SaaS specialisation, pipeline accountability, MarTech implementation depth, senior team delivery
- We are monitoring competitors to brief clients and to protect our own service positioning
${kbContext}
Generate a competitor profile for: ${name} (${url})

Return ONLY valid JSON with exactly this structure, no markdown:
{
  "overview": {
    "heading": "Overview",
    "points": [
      { "lead": string, "detail": string },
      { "lead": string, "detail": string },
      { "lead": string, "detail": string },
      { "lead": string, "detail": string }
    ]
  },
  "howWeCompare": {
    "heading": "How We Compare",
    "subheading": "NorthLane Digital vs ${name}",
    "points": [
      { "lead": string, "detail": string },
      { "lead": string, "detail": string },
      { "lead": string, "detail": string },
      { "lead": string, "detail": string }
    ]
  },
  "howWeWin": {
    "heading": "How We Win",
    "subheading": "When we beat ${name}",
    "points": [
      { "lead": string, "detail": string },
      { "lead": string, "detail": string },
      { "lead": string, "detail": string },
      { "lead": string, "detail": string }
    ]
  },
  "strengths": {
    "heading": "Strengths",
    "points": [
      { "lead": string, "detail": string },
      { "lead": string, "detail": string },
      { "lead": string, "detail": string },
      { "lead": string, "detail": string }
    ]
  },
  "weaknesses": {
    "heading": "Weaknesses",
    "points": [
      { "lead": string, "detail": string },
      { "lead": string, "detail": string },
      { "lead": string, "detail": string },
      { "lead": string, "detail": string }
    ]
  },
  "howToDifferentiate": {
    "heading": "How to Differentiate",
    "subheading": "Our positioning when ${name} comes up in conversation",
    "points": [
      { "lead": string, "detail": string },
      { "lead": string, "detail": string },
      { "lead": string, "detail": string },
      { "lead": string, "detail": string }
    ]
  }
}

Rules:
- Write from NorthLane Digital's perspective throughout
- How We Compare: contrast NorthLane's approach directly against this competitor's approach — be specific, not generic
- How We Win: specific scenarios or buyer situations where NorthLane wins against this competitor
- Strengths/Weaknesses: about the COMPETITOR, not NorthLane
- How to Differentiate: specific language NorthLane strategists should use when this competitor comes up in a sales or client conversation
- Every lead phrase should be bold and 3-6 words
- Every detail should be 1-2 sentences, specific and direct
- Do not use filler phrases like "robust solution" or "industry-leading"`;

  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2000, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) throw new Error(`Claude API error: ${res.status}`);
  const data = await res.json();
  const text = data.content[0].text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(text);
}

export function buildKBContext(docs: KBDocument[]): KBContext | undefined {
  if (!docs.length) return undefined;

  const weightRank = { high: 2, medium: 1, low: 0 };
  const highest = (key: keyof KBDocument['signalWeights']) => {
    const vals = docs.map(d => d.signalWeights[key]);
    return vals.reduce((best, v) => weightRank[v] > weightRank[best] ? v : best, 'low' as 'high' | 'medium' | 'low');
  };

  const allWatchFor = [...new Set(docs.flatMap(d => d.watchFor))];
  const allContext = docs.map(d => d.extractedContext).join('\n\n');

  const weightLine = (label: string, w: string) => {
    const adj = w === 'high' ? 'add +1 to base rubric score' : w === 'low' ? 'subtract 1 from base rubric score' : 'no adjustment';
    return `- ${label} signals: ${w.toUpperCase()} — ${adj}`;
  };

  const preamble = `COMPANY CONTEXT (calibrate your scoring to these priorities):
${allContext}

SIGNALS TO PRIORITISE:
${allWatchFor.map(w => `• ${w}`).join('\n')}

SIGNAL WEIGHT ADJUSTMENTS (apply on top of base rubric scores, never go above 10 or below 1):
${weightLine('Pricing', highest('pricing'))}
${weightLine('Feature', highest('feature'))}
${weightLine('Positioning', highest('positioning'))}
${weightLine('CTA', highest('cta'))}`;

  return { preamble };
}
