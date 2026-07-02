# RivalIQ — Project Notes

## What It Is

RivalIQ is a competitive intelligence dashboard built for NorthLane Digital, a B2B SaaS marketing agency. It tracks competitor pricing pages and marketing copy week-over-week, scores changes using Claude, and surfaces actionable signals for the agency and its clients.

**Tagline:** Where Strategy meets Signal  
**Tab title:** RivalIQ — Competitive Intelligence  
**Stack:** React + Vite + TypeScript + Tailwind CSS (@tailwindcss/vite)  
**API:** Claude (claude-sonnet-4-6) via a Vite dev middleware proxy (`/api/claude`)  
**Deployment target:** Vercel (Edge Function in `api/claude.ts`)

---

## Product Features

### 1. Dashboard
- Tracks 5 hardcoded competitors + any added via modal
- Stat cards: competitors tracked, high-signal changes, total signals
- Pre-run CTA hero; post-run re-run button
- Clickable competitor cards → profile pages
- Analysis log with timestamped steps

### 2. Change Feed
- All scored deltas above threshold (≥6/10), filterable by competitor and type
- Expandable cards showing before/after, justification, recommended action
- Failed scrapes shown with explanation and next steps

### 3. Weekly Digest
- Executive summary (3–4 sentences, cross-competitor trends)
- Cross-competitor patterns block
- Priority actions list (3–5 items)
- Per-competitor signal breakdown (collapsible)

### 4. Ask Your Data
- Chat interface grounded strictly in the current brief
- Claude answers only from brief data — no hallucination outside the scan
- Conversation history passed for multi-turn context

### 5. Knowledge Base
- Upload PDF or TXT company documents
- Claude extracts: document type, company summary, priorities, signal weights, watch-for items
- Signal weights (pricing/feature/positioning/cta: high/medium/low) inject adjustments into the scoring rubric
- NorthLane Digital brand guide pre-loaded as the default KB document
- KB active badge shown in sidebar and analysis controls

### 6. Competitor Profile Pages
- Clickable cards open a two-panel profile view
- Left panel: avatar + 6-section nav with IntersectionObserver active tracking
- Right panel: scrollable sections with `lead — detail` point format
- 6 sections: Overview, How We Compare, How We Win, Strengths, Weaknesses, How to Differentiate
- All written from NorthLane Digital's perspective

### 7. Add Competitor
- Modal with name + URL fields (https:// validation)
- On submit: immediately Active, placeholder profile generated, card shows "Click to view profile →"
- Placeholder profile has NorthLane positioning copy ready to use

---

## Architecture

### Data Flow
```
baselines[] + liveSnapshots[] → diff() → CompetitorDiff[]
                                              ↓
                                    evalDiffs() → Claude scores → ScoredDelta[]
                                              ↓
                                    synthesizeBrief() → Brief
```

### Three-Layer Guardrail Pipeline
1. **L1 — Retrieval:** `extractionConfidence` field on snapshots; `failed` → skip eval entirely
2. **L2 — Prompt:** Rubric with explicit score bands and HARD RULES baked into the eval prompt
3. **L3 — Output:** Field trace validation — every returned delta must match a real field from the source diff

### Claude API Proxy
- **Dev:** Vite server middleware in `vite.config.ts` — reads `ANTHROPIC_API_KEY` from `.env` via `loadEnv`, proxies POST `/api/claude` to `https://api.anthropic.com/v1/messages`
- **Prod (Vercel):** `api/claude.ts` Edge Function — reads `ANTHROPIC_API_KEY` from Vercel env vars

### Knowledge Base Signal Injection
- `buildKBContext(docs)` aggregates all KB docs into a structured preamble
- Preamble includes: company context, signals to prioritise, weight adjustments (+1 high, −1 low, clamped 1–10)
- Injected before the rubric in `evalDiffs`, and as `ADDITIONAL COMPANY CONTEXT` in profile generation

### Competitor Profiles (Demo Mode)
- All 5 hardcoded competitor profiles stored in `src/data/profiles.ts`
- Loaded directly into `profileCache` state on init — zero API calls, instant load
- New competitors get `generatePlaceholderProfile(name)` — same shape, NorthLane positioning copy
- No API call needed for profiles in demo mode

---

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root app, all views, state, routing |
| `src/lib/claudeAnalysis.ts` | All Claude call functions + types |
| `src/lib/diffEngine.ts` | Field-level diff between baseline and live snapshots |
| `src/data/competitors.ts` | Hardcoded baseline + live snapshot data for 5 competitors |
| `src/data/profiles.ts` | Hardcoded profile pages for all 5 competitors + placeholder generator |
| `api/claude.ts` | Vercel Edge Function proxy (prod only) |
| `vite.config.ts` | Vite config + dev `/api/claude` middleware |
| `.env` | `ANTHROPIC_API_KEY` (not committed) |

---

## Competitors Tracked

| ID | Name | URL | Notes |
|----|------|-----|-------|
| `linear` | Linear | linear.app/pricing | High confidence; AI Agent platform shipped |
| `shortcut` | Shortcut | shortcut.com/pricing | High confidence; Korey AI agent + price bump |
| `monday` | Monday.com | monday.com/pricing | High confidence; AI rebrand across platform |
| `notion` | Notion | notion.so/pricing | High confidence; "Start with AI" CTA shift |
| `height` | Height | height.app/pricing | Scrape failed (JS-rendered); excluded from analysis |

---

## Scoring Rubric

- **8–10 (High Signal):** Pricing changes, ICP shifts, direct competitive claims, major AI capability
- **5–7 (Moderate):** New feature claims, CTA strategy shifts, hero copy repositioning
- **1–4 (Noise):** Wording tweaks, layout changes, visual updates
- **Threshold:** Only deltas ≥6 are returned. Everything below is dropped silently.

---

## Known Tradeoffs & Decisions

| Decision | Tradeoff |
|----------|----------|
| Hardcoded profile data (demo mode) | Instant load, no API cost — but profiles don't reflect real scraping. Switch to live generation when API is stable. |
| `max_tokens: 4000` in `evalDiffs` | Needed to avoid JSON truncation with 16 deltas across 4 competitors. Higher cost per analysis run. |
| All profile data in one `profiles.ts` | Simple and fast for demo; becomes unwieldy if competitors scale past ~15. Move to JSON or a DB at that point. |
| No router — conditional rendering | Keeps the app single-file friendly; would need React Router if views grow past ~8 or URLs need to be shareable. |
| Vite middleware for `/api/claude` | Avoids running `vercel dev` locally; but means the Edge Function (`api/claude.ts`) is never tested locally. |
| KB docs persisted in React state only | Docs reset on page refresh. Add localStorage or a backend if persistence between sessions is needed. |

---

## Environment Setup

```bash
# Install
cd competitive-intel
npm install

# Add API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env

# Run
npm run dev
```

Server starts on `http://localhost:5173` (increments if port is taken).

---

## Pending / Next Steps

- [ ] Deploy to Vercel: push to GitHub → connect repo → set `ANTHROPIC_API_KEY` env var → deploy
- [ ] Kill old dev server instances between sessions (ports stack up: 5173, 5174, 5175…)
- [ ] Real website scraping to replace hardcoded snapshot data
- [ ] Persist KB docs across page refreshes (localStorage or backend)
- [ ] Shareable URLs for profile pages (needs React Router)
- [ ] Actual scrape of Height.app (currently fails due to JS rendering)
