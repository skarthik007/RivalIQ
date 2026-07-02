import { useState, useRef, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Rss, FileText, MessageSquare, Play, ExternalLink,
  ChevronDown, ChevronUp, Send, AlertTriangle, CheckCircle, Clock,
  Plus, X, Database, Upload, Loader2,
} from 'lucide-react';
// Loader2 kept for KnowledgeBase processing spinner
import { baselines, liveSnapshots } from './data/competitors';
import { hardcodedProfiles, generatePlaceholderProfile } from './data/profiles';
import { diff, type CompetitorDiff } from './lib/diffEngine';
import {
  evalDiffs, synthesizeBrief, askBrief,
  extractKBDocument, buildKBContext,
  type ScoredDelta, type Brief, type KBDocument,
  type CompetitorProfilePage, type ProfileSection,
} from './lib/claudeAnalysis';

type View = 'dashboard' | 'feed' | 'digest' | 'ask' | 'kb';
type AnalysisState = 'idle' | 'running' | 'done';

interface AddedCompetitor {
  id: string;
  name: string;
  url: string;
  addedAt: string;
  status: 'active';
}

// ── helpers ────────────────────────────────────────────────────────────────

function statusColor(conf: string) {
  if (conf === 'failed') return 'bg-red-100 text-red-700 border-red-200';
  if (conf === 'low') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-green-100 text-green-700 border-green-200';
}

function scoreBadge(score: number) {
  const cls = score >= 8 ? 'bg-red-600 text-white' : 'bg-amber-500 text-white';
  return <span className={`${cls} text-xs font-semibold px-2 py-0.5 rounded-full`}>{score}/10</span>;
}

function typeBadge(type: string) {
  const map: Record<string, string> = {
    Pricing: 'bg-blue-100 text-blue-700',
    Feature: 'bg-purple-100 text-purple-700',
    Positioning: 'bg-teal-100 text-teal-700',
    CTA: 'bg-orange-100 text-orange-700',
  };
  return <span className={`${map[type] ?? 'bg-gray-100 text-gray-700'} text-xs font-medium px-2 py-0.5 rounded-full`}>{type}</span>;
}

function weightBadge(w: 'high' | 'medium' | 'low') {
  const cls = w === 'high' ? 'bg-green-100 text-green-700' : w === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500';
  return <span className={`${cls} text-xs font-medium px-2 py-0.5 rounded-full capitalize`}>{w}</span>;
}

// ── Add Competitor Modal ───────────────────────────────────────────────────

function AddCompetitorModal({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string, url: string) => void }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const submit = () => {
    if (!name.trim()) return;
    if (!url.startsWith('https://')) { setUrlError('URL must start with https://'); return; }
    onAdd(name.trim(), url.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Add Competitor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Company Name</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Asana"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0D7377]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Pricing / Marketing URL</label>
            <input
              value={url} onChange={e => { setUrl(e.target.value); setUrlError(''); }}
              placeholder="https://asana.com/pricing"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0D7377] ${urlError ? 'border-red-400' : 'border-gray-200'}`}
            />
            {urlError && <p className="text-xs text-red-500 mt-1">{urlError}</p>}
          </div>
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={onClose} className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
          <button
            onClick={submit}
            disabled={!name.trim() || !url.trim()}
            className="flex items-center gap-2 bg-[#0D7377] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-800 disabled:opacity-50 transition-colors"
          >
            <Play size={14} />
            Start Tracking
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Knowledge Base View ────────────────────────────────────────────────────

function KnowledgeBase({ docs, onAdd, onDelete }: {
  docs: KBDocument[];
  onAdd: (doc: KBDocument) => void;
  onDelete: (id: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.name.match(/\.(pdf|txt)$/i)) { setError('Only PDF and TXT files are supported.'); return; }
    setProcessing(file.name);
    setError(null);
    try {
      let content: string | { base64: string };
      if (file.name.toLowerCase().endsWith('.txt')) {
        content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target!.result as string);
          reader.onerror = reject;
          reader.readAsText(file);
        });
      } else {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => {
            const result = e.target!.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        content = { base64 };
      }
      const doc = await extractKBDocument(file.name, content);
      onAdd(doc);
    } catch (e) {
      setError(`Failed to process ${file.name}: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setProcessing(null);
    }
  }, [onAdd]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Knowledge Base</h1>
      <p className="text-sm text-gray-500 mb-6">Upload company documents to calibrate signal scoring to your priorities.</p>

      {/* Section C — Context banner */}
      <div className={`rounded-xl px-5 py-4 mb-6 border text-sm ${docs.length > 0 ? 'bg-[#0D7377]/5 border-[#0D7377]/20 text-[#0D7377]' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
        {docs.length === 0
          ? 'No context uploaded yet. Add company documents to calibrate signal scoring to your specific priorities.'
          : `Knowledge base active — ${docs.length} document${docs.length !== 1 ? 's' : ''} informing analysis. Signal scores are calibrated to your company context.`}
      </div>

      {/* Section A — Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`mb-8 border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${dragging ? 'border-[#0D7377] bg-[#0D7377]/5' : 'border-gray-300 bg-white'}`}
        onClick={() => fileRef.current?.click()}
      >
        {processing ? (
          <>
            <Loader2 size={28} className="text-[#0D7377] animate-spin" />
            <p className="text-sm text-gray-600">Processing <span className="font-medium">{processing}</span>…</p>
          </>
        ) : (
          <>
            <Upload size={28} className={dragging ? 'text-[#0D7377]' : 'text-gray-400'} />
            <p className="text-sm text-gray-600">Drag & drop a PDF or TXT file, or <span className="text-[#0D7377] font-medium">browse</span></p>
            <p className="text-xs text-gray-400">Supported: .pdf, .txt</p>
          </>
        )}
        <input ref={fileRef} type="file" accept=".pdf,.txt" className="hidden" onChange={onFileChange} />
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)}><X size={14} className="text-red-400" /></button>
        </div>
      )}

      {/* Section B — Document cards */}
      {docs.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Uploaded Documents</div>
          {docs.map(doc => (
            <div key={doc.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 relative">
              <button onClick={() => onDelete(doc.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition-colors">
                <X size={15} />
              </button>
              <div className="flex items-start gap-3 mb-3 pr-6">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{doc.filename}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{new Date(doc.uploadedAt).toLocaleDateString()}</div>
                </div>
                <span className="bg-teal-100 text-teal-700 text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0">{doc.documentType}</span>
              </div>

              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{doc.extractedContext}</p>

              <div className="mb-3">
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-1.5">Watch For</div>
                <div className="flex flex-wrap gap-1.5">
                  {doc.watchFor.map((w, i) => (
                    <span key={i} className="text-xs bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full">{w}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-1.5">Signal Weights</div>
                <div className="flex flex-wrap gap-2">
                  {(['pricing', 'feature', 'positioning', 'cta'] as const).map(key => (
                    <span key={key} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className="capitalize font-medium">{key}</span>
                      {weightBadge(doc.signalWeights[key])}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────

function Dashboard({ diffs, addedCompetitors, brief, analysisState, logs, kbActive, onRun, onOpenAddModal, onOpenProfile }: {
  diffs: CompetitorDiff[];
  addedCompetitors: AddedCompetitor[];
  brief: Brief | null;
  analysisState: AnalysisState;
  logs: string[];
  kbActive: boolean;
  onRun: () => void;
  onOpenAddModal: () => void;
  onOpenProfile: (id: string) => void;
}) {
  const totalSignals = brief?.scoredDeltas.length ?? 0;
  const highSignals = brief?.scoredDeltas.filter(d => d.score >= 8).length ?? 0;
  const running = analysisState === 'running';

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Competitive Intelligence</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Tracking {5 + addedCompetitors.length} competitors · Week of June 30, 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          {analysisState === 'idle' && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              <Clock size={12} /> Analysis not yet run
            </div>
          )}
          {analysisState === 'done' && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              <CheckCircle size={12} /> Analysis complete
            </div>
          )}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Plus size={15} /> Add Competitor
          </button>
        </div>
      </div>

      {/* CTA hero — pre-first-run */}
      {analysisState === 'idle' && (
        <div className="mb-8 bg-[#0D7377] rounded-2xl p-8 flex items-center justify-between text-white">
          <div>
            <div className="text-lg font-semibold mb-1">Ready to scan this week's changes?</div>
            <div className="text-sm text-teal-100">Diffs are staged — Claude will score each signal against the rubric and generate your brief.</div>
          </div>
          <div className="flex items-center gap-3 ml-8 shrink-0">
            {kbActive && (
              <span className="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Database size={12} /> Knowledge base active
              </span>
            )}
            <button
              onClick={onRun}
              className="flex items-center gap-2 bg-white text-[#0D7377] px-6 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-colors shadow-sm"
            >
              <Play size={16} /> Run Analysis
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Competitors Tracked', value: String(5 + addedCompetitors.length) },
          { label: 'High-Signal Changes', value: analysisState === 'idle' ? '—' : String(highSignals), highlight: highSignals > 0 && analysisState === 'done' },
          { label: 'Total Signals', value: analysisState === 'idle' ? '—' : String(totalSignals) },
        ].map(s => (
          <div key={s.label} className={`bg-white rounded-xl border p-5 shadow-sm ${s.highlight ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-200'}`}>
            <div className={`text-3xl font-bold ${s.highlight ? 'text-red-600' : 'text-gray-900'}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Hardcoded competitor cards */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        {liveSnapshots.map(snap => {
          const d = diffs.find(x => x.id === snap.id);
          const signals = brief?.scoredDeltas.filter(s => s.competitorId === snap.id) ?? [];
          const isFailure = d?.guardrailTripped;

          if (isFailure) {
            return (
              <div key={snap.id} onClick={() => onOpenProfile(snap.id)} className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{snap.name}</span>
                      <span className="bg-amber-100 text-amber-700 border border-amber-200 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle size={10} /> Scrape failed
                      </span>
                    </div>
                    <a href={snap.url} target="_blank" rel="noreferrer" className="text-xs text-gray-400 flex items-center gap-1 hover:text-teal-600">
                      {snap.url} <ExternalLink size={10} />
                    </a>
                    <p className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-relaxed">
                      <span className="font-medium">Why:</span> Page appears JS-rendered or behind an auth wall — key fields returned empty.
                      <span className="block mt-1 text-amber-700"><span className="font-medium">Fix:</span> Check if the page loads without JS, add a cookie/session header, or flag for manual review before next scan.</span>
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 shrink-0">{new Date(snap.scrapedAt).toLocaleDateString()}</div>
                </div>
              </div>
            );
          }

          return (
            <div key={snap.id} onClick={() => onOpenProfile(snap.id)} className={`bg-white rounded-xl border p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${signals.length > 0 ? 'border-gray-300' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-gray-900">{snap.name}</span>
                    {d && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor(d.extractionConfidence)}`}>
                        {d.extractionConfidence === 'low' ? 'Low confidence' : 'Clean'}
                      </span>
                    )}
                  </div>
                  <a href={snap.url} target="_blank" rel="noreferrer" className="text-xs text-gray-400 flex items-center gap-1 hover:text-teal-600">
                    {snap.url} <ExternalLink size={10} />
                  </a>
                  {analysisState === 'done' && signals.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {signals.slice(0, 3).map((s, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1 text-gray-700">
                          {typeBadge(s.deltaType)}
                          <span className="truncate max-w-[180px]">{s.field.replace(/pricingTiers\.\w+\./, '')}</span>
                          {scoreBadge(s.score)}
                        </span>
                      ))}
                      {signals.length > 3 && <span className="text-xs text-gray-400 px-2 py-1">+{signals.length - 3} more</span>}
                    </div>
                  )}
                  {analysisState === 'done' && signals.length === 0 && (
                    <p className="mt-2 text-xs text-gray-400">No changes above threshold this week.</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xs text-gray-400">{new Date(snap.scrapedAt).toLocaleDateString()}</span>
                  {analysisState === 'done' && (
                    <span className={`text-sm font-semibold ${signals.length > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                      {signals.length} signal{signals.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Added competitor cards */}
      {addedCompetitors.map(comp => (
        <div key={comp.id} onClick={() => onOpenProfile(comp.id)} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-3 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-gray-900">{comp.name}</span>
                <span className="bg-green-100 text-green-700 border border-green-200 text-xs font-medium px-2 py-0.5 rounded-full">Active</span>
              </div>
              <a href={comp.url} target="_blank" rel="noreferrer" className="text-xs text-gray-400 flex items-center gap-1 hover:text-teal-600">
                {comp.url} <ExternalLink size={10} />
              </a>
              <p className="mt-2 text-xs text-gray-400">Click to view competitive profile →</p>
            </div>
            <div className="text-xs text-gray-400 shrink-0">{new Date(comp.addedAt).toLocaleDateString()}</div>
          </div>
        </div>
      ))}

      {/* Run button — post-first-run */}
      {analysisState !== 'idle' && (
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={onRun}
            disabled={running}
            className="flex items-center gap-2 bg-[#0D7377] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-800 disabled:opacity-60 transition-colors"
          >
            <Play size={15} />
            {running ? 'Running Analysis…' : 'Re-run Analysis'}
          </button>
          {kbActive && (
            <span className="flex items-center gap-1.5 bg-[#0D7377] text-white text-xs font-medium px-3 py-1.5 rounded-lg">
              <Database size={12} /> Knowledge base active
            </span>
          )}
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-xs text-gray-600 space-y-1 max-h-48 overflow-y-auto">
          {logs.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      )}
    </div>
  );
}

// ── Change Feed ────────────────────────────────────────────────────────────

function ChangeFeed({ brief, diffs }: { brief: Brief | null; diffs: CompetitorDiff[] }) {
  const [filterComp, setFilterComp] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const failedDiffs = diffs.filter(d => d.guardrailTripped);
  const deltas = brief?.scoredDeltas ?? [];
  const filtered = deltas.filter(d =>
    (filterComp === 'all' || d.competitorId === filterComp) &&
    (filterType === 'all' || d.deltaType === filterType)
  );

  const toggle = (key: string) => setExpandedItems(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Change Feed</h1>
      <p className="text-sm text-gray-500 mb-6">All detected changes above relevance threshold · Scored by Claude</p>

      <div className="flex gap-3 mb-6">
        <select value={filterComp} onChange={e => setFilterComp(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
          <option value="all">All Competitors</option>
          {liveSnapshots.filter(s => s.extractionConfidence !== 'failed').map(s =>
            <option key={s.id} value={s.id}>{s.name}</option>
          )}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
          <option value="all">All Types</option>
          {['Pricing', 'Feature', 'Positioning', 'CTA'].map(t =>
            <option key={t} value={t}>{t}</option>
          )}
        </select>
      </div>

      {failedDiffs.map(d => (
        <div key={d.id} className="mb-4 bg-white border border-amber-300 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={15} className="text-amber-500 shrink-0" />
            <span className="font-semibold text-gray-900">{d.name}</span>
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">Scrape failed — excluded from analysis</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{d.guardrailMessage}</p>
          <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 space-y-0.5">
            <div><span className="font-medium text-gray-700">Next step:</span> Verify the page renders without JavaScript. If auth-gated, add a session cookie to the scraper config.</div>
            <div><span className="font-medium text-gray-700">Impact:</span> No signals from this competitor this week. Historical baseline is preserved.</div>
          </div>
        </div>
      ))}

      {!brief && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="text-gray-400 text-sm mb-1">No analysis data yet</div>
          <div className="text-xs text-gray-300">Go to Dashboard → Run Analysis to populate the change feed.</div>
        </div>
      )}

      {filtered.map((delta, i) => {
        const key = `${delta.competitorId}-${delta.field}`;
        const expanded = expandedItems.has(key);
        return (
          <div key={i} className="mb-3 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <button onClick={() => toggle(key)} className="w-full text-left p-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">{delta.competitorName}</span>
                {typeBadge(delta.deltaType)}
                {scoreBadge(delta.score)}
                {!expanded && <span className="text-xs text-gray-400 truncate max-w-[260px]">{delta.justification.slice(0, 80)}…</span>}
              </div>
              {expanded ? <ChevronUp size={16} className="text-gray-400 mt-0.5 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            </button>
            {expanded && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <div className="text-xs uppercase tracking-wide text-red-500 mb-1">Before</div>
                    <div className="text-sm text-gray-800">{delta.before}</div>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                    <div className="text-xs uppercase tracking-wide text-green-600 mb-1">After</div>
                    <div className="text-sm text-gray-800">{delta.after}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Justification</div>
                  <p className="text-sm text-gray-700">{delta.justification}</p>
                </div>
                <div className="bg-[#0D7377]/5 border border-[#0D7377]/20 rounded-lg p-3">
                  <div className="text-xs uppercase tracking-wide text-[#0D7377] mb-1">Recommended Action</div>
                  <p className="text-sm text-gray-800">{delta.recommendedAction}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {brief && filtered.length === 0 && deltas.length > 0 && (
        <div className="text-gray-400 text-sm py-8 text-center">No results match your filters.</div>
      )}
      {brief && deltas.length === 0 && (
        <div className="text-gray-400 text-sm py-8 text-center">No changes above threshold this week.</div>
      )}
    </div>
  );
}

// ── Weekly Digest ──────────────────────────────────────────────────────────

function WeeklyDigest({ brief }: { brief: Brief | null }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setExpanded(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });

  if (!brief) {
    return (
      <div className="p-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Weekly Digest</h1>
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="text-gray-400 text-sm mb-1">No brief generated yet</div>
          <div className="text-xs text-gray-300">Go to Dashboard → Run Analysis to generate your weekly brief.</div>
        </div>
      </div>
    );
  }

  const byCompetitor: Record<string, ScoredDelta[]> = {};
  brief.scoredDeltas.forEach(d => { (byCompetitor[d.competitorName] ??= []).push(d); });

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Weekly Digest</h1>
        <span className="text-xs text-gray-400">Generated {new Date(brief.generatedAt).toLocaleString()}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
        <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">Executive Summary</div>
        <p className="text-base text-gray-800 leading-relaxed">{brief.executiveSummary}</p>
      </div>

      {brief.crossCompetitorPatterns && (
        <div className="bg-[#0D7377]/5 border border-[#0D7377]/20 rounded-xl p-6 mb-4">
          <div className="text-xs uppercase tracking-widest text-[#0D7377] mb-3">Cross-Competitor Patterns</div>
          <p className="text-sm text-gray-800 leading-relaxed">{brief.crossCompetitorPatterns}</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
        <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">Priority Actions</div>
        <ol className="space-y-2">
          {brief.priorityActions.map((action, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-800">
              <span className="text-[#0D7377] font-bold shrink-0">{i + 1}.</span>
              {action}
            </li>
          ))}
        </ol>
      </div>

      <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">Per-Competitor Findings</div>
      {Object.entries(byCompetitor).map(([name, deltas]) => (
        <div key={name} className="mb-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <button onClick={() => toggle(name)} className="w-full text-left px-5 py-4 flex items-center justify-between">
            <span className="font-medium text-gray-900">{name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{deltas.length} signal{deltas.length !== 1 ? 's' : ''}</span>
              {expanded.has(name) ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </div>
          </button>
          {expanded.has(name) && (
            <div className="px-5 pb-4 space-y-3">
              {deltas.map((d, i) => (
                <div key={i} className="text-sm">
                  <div className="flex items-center gap-2 mb-1">{typeBadge(d.deltaType)}{scoreBadge(d.score)}</div>
                  <p className="text-gray-700">{d.justification}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="mt-6 text-xs text-gray-400 flex gap-4">
        <span>Baseline: {brief.baselineDate}</span>
        <span>Scan: {brief.scanDate}</span>
      </div>
    </div>
  );
}

// ── Ask Your Data ──────────────────────────────────────────────────────────

function AskYourData({ brief }: { brief: Brief | null }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || !brief || loading) return;
    const q = input.trim();
    setInput('');
    const history = [...messages, { role: 'user' as const, content: q }];
    setMessages(history);
    setLoading(true);
    try {
      const answer = await askBrief(brief, q, messages.map(m => ({ role: m.role, content: m.content })));
      setMessages([...history, { role: 'assistant', content: answer }]);
    } catch {
      setMessages([...history, { role: 'assistant', content: 'Error contacting Claude. Check your API key.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!brief) {
    return (
      <div className="p-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Ask Your Data</h1>
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="text-gray-400 text-sm mb-1">No brief loaded yet</div>
          <div className="text-xs text-gray-300">Go to Dashboard → Run Analysis, then return here to query your brief.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl flex flex-col" style={{ height: 'calc(100vh - 0px)' }}>
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Ask Your Data</h1>
      <p className="text-sm text-gray-500 mb-4">Claude answers from brief data only — no hallucination outside the scan.</p>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-gray-400 text-sm py-8 text-center">
            Try: "Why did Linear score a 9?" or "What should we do about Notion's CTA change?"
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-[#0D7377] text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 shadow-sm">Thinking…</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask a question about the brief…"
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D7377]"
        />
        <button onClick={send} disabled={loading || !input.trim()}
          className="bg-[#0D7377] text-white p-2.5 rounded-lg hover:bg-teal-800 disabled:opacity-50 transition-colors">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Competitor Profile Page ────────────────────────────────────────────────

const SECTION_KEYS: Array<{ key: keyof CompetitorProfilePage; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'howWeCompare', label: 'How We Compare' },
  { key: 'howWeWin', label: 'How We Win' },
  { key: 'strengths', label: 'Strengths' },
  { key: 'weaknesses', label: 'Weaknesses' },
  { key: 'howToDifferentiate', label: 'How to Differentiate' },
];

function ProfileSectionBlock({ section }: { section: ProfileSection }) {
  return (
    <div>
      <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-1">{section.heading}</h2>
      {section.subheading && <p className="text-[13px] text-[#6B7280] mb-5">{section.subheading}</p>}
      {!section.subheading && <div className="mb-5" />}
      <div className="space-y-2.5">
        {section.points.map((p, i) => (
          <div key={i} className="border-l-[3px] border-[#E5E7EB] px-3.5 py-2.5">
            <span className="font-bold text-[14px] text-[#1A1A1A]">{p.lead}</span>
            <span className="text-[14px] text-[#4B5563]"> — {p.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompetitorProfileView({
  competitorId, competitorName,
  profileCache, onBack,
}: {
  competitorId: string;
  competitorName: string;
  profileCache: Record<string, CompetitorProfilePage>;
  onBack: () => void;
}) {
  const [activeSection, setActiveSection] = useState<keyof CompetitorProfilePage>('overview');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const profile = profileCache[competitorId];

  const scrollTo = (key: keyof CompetitorProfilePage) => {
    setActiveSection(key);
    sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id as keyof CompetitorProfilePage); });
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    Object.values(sectionRefs.current).forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [profile]);

  const initial = competitorName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col h-full">
      {/* Back link */}
      <div className="px-8 pt-6 pb-0 shrink-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-[#0D7377] hover:opacity-75 transition-opacity mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="#0D7377" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to Dashboard
        </button>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-1 min-h-0 mx-8 mb-8 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        {/* Left panel */}
        <div className="w-[220px] shrink-0 bg-[#F3F4F6] flex flex-col border-r border-gray-200">
          <div className="px-4 pt-5 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[6px] bg-[#0D7377] flex items-center justify-center text-white font-bold text-[14px] shrink-0">
                {initial}
              </div>
              <span className="font-bold text-[15px] text-[#1A1A1A] leading-tight">{competitorName}</span>
            </div>
          </div>
          <nav className="flex-1 py-2">
            {SECTION_KEYS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => scrollTo(key)}
                className={`w-full text-left text-[13px] px-4 py-2.5 transition-colors ${
                  activeSection === key
                    ? 'text-[#0D7377] font-semibold border-l-[3px] border-[#0D7377] bg-white/60'
                    : 'text-[#6B7280] hover:text-[#1A1A1A] border-l-[3px] border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right panel */}
        <div className="flex-1 bg-white overflow-y-auto">
          {!profile ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
              <Loader2 size={24} className="text-[#0D7377] animate-spin" />
              <div className="text-sm">
                <span className="font-medium text-[#1A1A1A]">{competitorName}</span> — Generating profile…
              </div>
            </div>
          ) : (
            <div className="px-10 py-8 space-y-0">
              {SECTION_KEYS.map(({ key }, idx) => (
                <div key={key}>
                  <div
                    id={key}
                    ref={el => { sectionRefs.current[key] = el; }}
                    className="py-10"
                  >
                    <ProfileSectionBlock section={profile[key]} />
                  </div>
                  {idx < SECTION_KEYS.length - 1 && <div className="border-t border-[#F3F4F6]" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [diffs] = useState<CompetitorDiff[]>(() =>
    baselines.map((b, i) => diff(b, liveSnapshots[i]))
  );
  const [brief, setBrief] = useState<Brief | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [kbDocs, setKbDocs] = useState<KBDocument[]>([{
    id: 'northlane-brand-guide-2026',
    filename: 'NorthLane Digital — Brand and Positioning Guide.txt',
    uploadedAt: '2026-06-01T00:00:00.000Z',
    documentType: 'Competitive positioning doc',
    companySummary: 'NorthLane Digital is a B2B SaaS marketing specialist agency that builds marketing infrastructure for CMOs at ~100-person SaaS companies competing against larger, better-funded rivals.',
    currentPriorities: [
      'Defend B2B SaaS specialisation positioning — flag any competitor narrowing their ICP to SaaS',
      'Protect pipeline-accountability differentiation — monitor for analytics/attribution feature launches',
      'Watch Monday.com, Notion, and Linear for CRM or marketing automation expansion',
      'Guard RivalIQ-powered competitive intelligence as a unique agency deliverable',
      'Senior team delivery as a retention driver — no bait-and-switch',
    ],
    signalWeights: {
      pricing: 'medium',
      feature: 'high',
      positioning: 'high',
      cta: 'medium',
    },
    watchFor: [
      'Any PM tool positioning itself as "built for SaaS teams specifically" — direct ICP threat',
      'Analytics, attribution, or pipeline reporting features added to Linear, Notion, or Monday.com',
      'Any tracked competitor launching a "competitive brief", "weekly intel", or competitor tracking feature',
      'Monday.com, Notion, or Linear expanding into native CRM or marketing automation territory',
      'Competitors moving away from "activity" messaging toward "pipeline outcomes" language',
      'New agency-adjacent tools entering the AI-powered competitive monitoring space at NorthLane\'s price point',
    ],
    extractedContext: 'NorthLane Digital targets B2B SaaS CMOs at ~100-person companies who are outgunned on budget and need to be smarter, not just more active. Their strongest sales differentiators are SaaS-only specialisation (no onboarding ramp), pipeline-tied contracts (not activity SLAs), and MarTech implementation depth (HubSpot, Marketo, 6sense). They use RivalIQ as a client-facing competitive intelligence deliverable — one of their newest and most defensible service lines. The highest-priority watch signals for NorthLane are PM tools expanding into marketing analytics/attribution territory and any competitor tool or agency launching a structured competitive intelligence product.',
  }]);
  const [addedCompetitors, setAddedCompetitors] = useState<AddedCompetitor[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [profileCache, setProfileCache] = useState<Record<string, CompetitorProfilePage>>(hardcodedProfiles);

  const log = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const runAnalysis = async () => {
    setAnalysisState('running');
    setLogs([]);
    try {
      const kbContext = buildKBContext(kbDocs);
      log('Starting field-level diff across 5 competitors…');
      if (kbContext) log(`Knowledge base active — injecting context from ${kbDocs.length} document(s) into eval prompt.`);
      log(`Height.app → extractionConfidence: failed. Routing to guardrail layer 1. Skipping eval.`);
      log(`Linear → ${diffs.find(d => d.id === 'linear')?.deltas.length ?? 0} raw deltas detected`);
      log(`Shortcut → ${diffs.find(d => d.id === 'shortcut')?.deltas.length ?? 0} raw deltas detected`);
      log(`Monday.com → ${diffs.find(d => d.id === 'monday')?.deltas.length ?? 0} raw deltas detected`);
      log(`Notion → ${diffs.find(d => d.id === 'notion')?.deltas.length ?? 0} raw deltas detected`);
      log('Passing valid diffs to Claude relevance eval (rubric threshold: 6/10)…');

      const scored = await evalDiffs(diffs, kbContext);
      log(`Eval complete. ${scored.length} deltas passed threshold (≥6). Guardrail L3 validation passed.`);
      log('Synthesizing cross-competitor patterns and brief…');

      const result = await synthesizeBrief(scored);
      setBrief(result);
      setAnalysisState('done');
      log(`Brief generated. ${result.scoredDeltas.length} signals · ${result.priorityActions.length} priority actions.`);
    } catch (e) {
      log(`Error: ${e instanceof Error ? e.message : String(e)}`);
      setAnalysisState('idle');
    }
  };

  const handleAddCompetitor = (name: string, url: string) => {
    const id = crypto.randomUUID();
    setAddedCompetitors(prev => [...prev, { id, name, url, addedAt: new Date().toISOString(), status: 'active' }]);
    setProfileCache(prev => ({ ...prev, [id]: generatePlaceholderProfile(name) }));
    setView('dashboard');
  };

  const totalSignals = brief?.scoredDeltas.length ?? 0;
  const highSignals = brief?.scoredDeltas.filter(d => d.score >= 8).length ?? 0;
  const failedCount = diffs.filter(d => d.guardrailTripped).length;
  const kbActive = kbDocs.length > 0;

  const VIEWS: { id: View; label: string; icon: React.ReactNode; badge?: number | null }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, badge: failedCount > 0 ? failedCount : null },
    { id: 'feed', label: 'Change Feed', icon: <Rss size={16} />, badge: totalSignals > 0 ? totalSignals : null },
    { id: 'digest', label: 'Weekly Digest', icon: <FileText size={16} />, badge: highSignals > 0 ? highSignals : null },
    { id: 'ask', label: 'Ask Your Data', icon: <MessageSquare size={16} />, badge: null },
    { id: 'kb', label: 'Knowledge Base', icon: <Database size={16} />, badge: kbDocs.length > 0 ? kbDocs.length : null },
  ];

  return (
    <div className="flex h-screen bg-[#FAFAF9]">
      {showAddModal && (
        <AddCompetitorModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCompetitor}
        />
      )}

      <nav className="w-56 bg-white border-r border-gray-200 flex flex-col py-6 shrink-0">
        <div className="px-5 mb-8">
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="7" fill="#0D7377"/>
              <path d="M7 14 Q10 8 14 14 Q18 20 21 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="14" cy="14" r="2" fill="white"/>
            </svg>
            <span className="text-base font-bold text-[#1A1A1A] tracking-tight">RivalIQ</span>
          </div>
          <div className="text-[11px] text-[#6B7280] mt-1.5 leading-tight">Where Strategy meets Signal</div>
          {analysisState !== 'idle' && (
            <div className={`mt-2 text-xs font-medium flex items-center gap-1 ${analysisState === 'running' ? 'text-amber-600' : 'text-green-600'}`}>
              {analysisState === 'running' ? <><Clock size={10} /> Running…</> : <><CheckCircle size={10} /> Up to date</>}
            </div>
          )}
        </div>
        <div className="space-y-0.5 px-2">
          {VIEWS.map(v => (
            <button key={v.id} onClick={() => setView(v.id)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                view === v.id ? 'bg-[#0D7377]/10 text-[#0D7377] font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              <span className="flex items-center gap-2.5">{v.icon}{v.label}</span>
              {v.badge != null && (
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                  v.id === 'dashboard' ? 'bg-amber-100 text-amber-700' :
                  v.id === 'digest' ? 'bg-red-100 text-red-700' :
                  v.id === 'kb' ? 'bg-teal-100 text-teal-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{v.badge}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto flex flex-col">
        {activeProfileId ? (() => {
          const snap = [...liveSnapshots, ...addedCompetitors.map(c => ({ id: c.id, name: c.name, url: c.url }))].find(s => s.id === activeProfileId);
          if (!snap) return null;
          return (
            <CompetitorProfileView
              competitorId={snap.id}
              competitorName={snap.name}
              profileCache={profileCache}
              onBack={() => setActiveProfileId(null)}
            />
          );
        })() : (
          <>
            {view === 'dashboard' && (
              <Dashboard
                diffs={diffs}
                addedCompetitors={addedCompetitors}
                brief={brief}
                analysisState={analysisState}
                logs={logs}
                kbActive={kbActive}
                onRun={runAnalysis}
                onOpenAddModal={() => setShowAddModal(true)}
                onOpenProfile={id => setActiveProfileId(id)}
              />
            )}
            {view === 'feed' && <ChangeFeed brief={brief} diffs={diffs} />}
            {view === 'digest' && <WeeklyDigest brief={brief} />}
            {view === 'ask' && <AskYourData brief={brief} />}
            {view === 'kb' && (
              <KnowledgeBase
                docs={kbDocs}
                onAdd={doc => setKbDocs(prev => [...prev, doc])}
                onDelete={id => setKbDocs(prev => prev.filter(d => d.id !== id))}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
