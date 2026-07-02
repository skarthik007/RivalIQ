import type { CompetitorSnapshot } from '../data/competitors';

export interface FieldDelta {
  field: string;
  before: string;
  after: string;
  deltaType: 'Pricing' | 'Feature' | 'Positioning' | 'CTA';
}

export interface CompetitorDiff {
  id: string;
  name: string;
  url: string;
  extractionConfidence: CompetitorSnapshot['extractionConfidence'];
  deltas: FieldDelta[];
  guardrailTripped: boolean;
  guardrailMessage?: string;
}

function tierKey(t: { name: string; price: string; keyFeatures: string[] }) {
  return `${t.name}|${t.price}|${t.keyFeatures.sort().join(',')}`;
}

export function diff(baseline: CompetitorSnapshot, live: CompetitorSnapshot): CompetitorDiff {
  if (live.extractionConfidence === 'failed') {
    return {
      id: live.id, name: live.name, url: live.url,
      extractionConfidence: 'failed', deltas: [], guardrailTripped: true,
      guardrailMessage: 'Scrape failed: page appears to be JS-rendered or behind an auth wall. Key fields returned empty. Flagging for manual review.',
    };
  }

  const deltas: FieldDelta[] = [];
  const b = baseline.fields;
  const l = live.fields;

  if (b.heroCopy !== l.heroCopy && b.heroCopy && l.heroCopy) {
    deltas.push({ field: 'heroCopy', before: b.heroCopy, after: l.heroCopy, deltaType: 'Positioning' });
  }
  if (b.primaryCTA !== l.primaryCTA && b.primaryCTA && l.primaryCTA) {
    deltas.push({ field: 'primaryCTA', before: b.primaryCTA, after: l.primaryCTA, deltaType: 'CTA' });
  }
  if (b.targetAudience !== l.targetAudience && b.targetAudience && l.targetAudience) {
    deltas.push({ field: 'targetAudience', before: b.targetAudience, after: l.targetAudience, deltaType: 'Positioning' });
  }

  // Pricing tier diffs
  const baseKeys = new Set(b.pricingTiers.map(tierKey));
  const liveKeys = new Set(l.pricingTiers.map(tierKey));
  b.pricingTiers.forEach(bt => {
    const lt = l.pricingTiers.find(t => t.name === bt.name);
    if (!lt) return;
    if (bt.price !== lt.price) {
      deltas.push({ field: `pricingTiers.${bt.name}.price`, before: bt.price, after: lt.price, deltaType: 'Pricing' });
    }
    const newFeatures = lt.keyFeatures.filter(f => !bt.keyFeatures.includes(f));
    if (newFeatures.length) {
      deltas.push({ field: `pricingTiers.${bt.name}.keyFeatures`, before: bt.keyFeatures.join(', '), after: lt.keyFeatures.join(', '), deltaType: 'Feature' });
    }
  });

  // New feature claims
  const newClaims = l.keyFeatureClaims.filter(c => !b.keyFeatureClaims.includes(c));
  if (newClaims.length) {
    deltas.push({ field: 'keyFeatureClaims', before: b.keyFeatureClaims.join('; '), after: l.keyFeatureClaims.join('; '), deltaType: 'Feature' });
  }

  // suppress unused var warning
  void baseKeys; void liveKeys;

  return { id: live.id, name: live.name, url: live.url, extractionConfidence: live.extractionConfidence, deltas, guardrailTripped: false };
}
