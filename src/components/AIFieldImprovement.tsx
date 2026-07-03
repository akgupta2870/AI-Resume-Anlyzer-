import React, { useState } from 'react';
import { Sparkles, Loader2, Check, ArrowRight, Wand2, RefreshCw } from 'lucide-react';

interface AIFieldImprovementProps {
  fieldName: string;
  currentValue: string;
  onUpdate: (newValue: string) => void;
  profession?: string;
  appTheme?: 'dark' | 'bloom';
}

export default function AIFieldImprovement({
  fieldName,
  currentValue,
  onUpdate,
  profession = '',
  appTheme = 'dark'
}: AIFieldImprovementProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [error, setError] = useState('');

  const isBloom = appTheme === 'bloom';

  const handleImprove = async (type: string, instructions?: string) => {
    if (!currentValue && !instructions) {
      setError('Please type some content first so the AI can improve it!');
      return;
    }
    setError('');
    setLoading(true);
    try {
      let promptInstructions = '';
      if (type === 'metrics') {
        promptInstructions = 'Enhance this text to be achievement-oriented, adding realistic quantitative metrics, key performance indicators (KPIs), and high-impact action verbs.';
      } else if (type === 'seo') {
        promptInstructions = 'Optimize this section with highly searchable keywords and career-specific terminology to rank higher in ATS scanners and Google searches.';
      } else if (type === 'concise') {
        promptInstructions = 'Condense this text to make it extremely clear, concise, and punchy while retaining all key achievements and information.';
      } else if (type === 'custom' && instructions) {
        promptInstructions = instructions;
      } else {
        promptInstructions = 'Rewrite this text to sound more elite, professional, and sophisticated.';
      }

      const response = await fetch('/api/ai-improve-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldName,
          value: currentValue || `Write standard professional entry for ${fieldName}`,
          profession,
          instructions: promptInstructions
        })
      });

      const result = await response.json();
      if (response.ok && result.improved) {
        setPreviewText(result.improved);
      } else {
        throw new Error(result.error || 'Failed to improve field content.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with Gemini.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    onUpdate(previewText);
    setPreviewText('');
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left no-print">
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setError('');
          setPreviewText('');
        }}
        className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition duration-200 ${
          isBloom
            ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
            : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-400 hover:bg-indigo-900/50 hover:border-indigo-400'
        }`}
        title="Improve with AI Power"
      >
        <Sparkles className="w-3 h-3 animate-pulse text-yellow-400" />
        <span>AI Power-Up</span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 z-50 mt-1.5 w-80 p-4 rounded-xl border shadow-2xl transition-all animate-fadeIn ${
          isBloom
            ? 'bg-white border-rose-100 text-slate-800'
            : 'bg-slate-950 border-slate-800 text-white'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs font-bold tracking-tight text-slate-300 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-yellow-400" />
              AI Section Enhancer
            </h5>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-300 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {error && (
            <p className="text-[10px] text-red-400 bg-red-950/20 p-2 rounded mb-2 border border-red-500/20">{error}</p>
          )}

          {!previewText ? (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleImprove('professional')}
                  disabled={loading}
                  className={`px-2.5 py-2 text-[10px] font-semibold text-left rounded-lg border transition flex flex-col justify-between ${
                    isBloom
                      ? 'bg-rose-50/20 border-rose-100 hover:bg-rose-100/50'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/80 hover:border-indigo-500/30'
                  }`}
                >
                  <span className="text-white font-bold block text-[11px] mb-0.5">🏆 Executive Rewrite</span>
                  <span className="text-slate-400 text-[9px] leading-tight">Elevate tone & sentence style</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleImprove('metrics')}
                  disabled={loading}
                  className={`px-2.5 py-2 text-[10px] font-semibold text-left rounded-lg border transition flex flex-col justify-between ${
                    isBloom
                      ? 'bg-rose-50/20 border-rose-100 hover:bg-rose-100/50'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/80 hover:border-indigo-500/30'
                  }`}
                >
                  <span className="text-white font-bold block text-[11px] mb-0.5">📊 Add Metrics</span>
                  <span className="text-slate-400 text-[9px] leading-tight">Inject quantities & metrics</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleImprove('seo')}
                  disabled={loading}
                  className={`px-2.5 py-2 text-[10px] font-semibold text-left rounded-lg border transition flex flex-col justify-between ${
                    isBloom
                      ? 'bg-rose-50/20 border-rose-100 hover:bg-rose-100/50'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/80 hover:border-indigo-500/30'
                  }`}
                >
                  <span className="text-white font-bold block text-[11px] mb-0.5">⚡ SEO Keywords</span>
                  <span className="text-slate-400 text-[9px] leading-tight">Match ATS scan search keys</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleImprove('concise')}
                  disabled={loading}
                  className={`px-2.5 py-2 text-[10px] font-semibold text-left rounded-lg border transition flex flex-col justify-between ${
                    isBloom
                      ? 'bg-rose-50/20 border-rose-100 hover:bg-rose-100/50'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/80 hover:border-indigo-500/30'
                  }`}
                >
                  <span className="text-white font-bold block text-[11px] mb-0.5">✂️ Make Punchy</span>
                  <span className="text-slate-400 text-[9px] leading-tight">Shorten for clean readability</span>
                </button>
              </div>

              <div className="pt-1.5 border-t border-slate-800/60">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 text-left">Custom instructions:</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="e.g., Translate to French or add leadership tone"
                    className="flex-1 px-2.5 py-1.5 text-[11px] rounded-lg border bg-slate-900 border-slate-800 focus:outline-none focus:border-indigo-500/60 text-white placeholder-slate-600 text-left"
                  />
                  <button
                    type="button"
                    onClick={() => handleImprove('custom', customInstructions)}
                    disabled={loading || !customInstructions.trim()}
                    className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition flex items-center justify-center"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/60 max-h-40 overflow-y-auto">
                <span className="block text-[9px] uppercase tracking-wide font-bold text-indigo-400 mb-1 text-left">AI Preview Result:</span>
                <p className="text-[11px] text-slate-100 leading-relaxed text-left font-sans">{previewText}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" /> Apply Change
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewText('')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 z-50 bg-slate-950/80 rounded-xl flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
              <span className="text-[10px] text-slate-300 font-bold tracking-wider uppercase">Polishing content...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
