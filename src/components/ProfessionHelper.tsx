import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, BookOpen, ChevronRight, Check, Award, LayoutGrid, CheckCircle } from 'lucide-react';

interface ProfessionHelperProps {
  currentProfession: string;
  onSelectProfession: (profession: string) => void;
  onPrefillSkills: (skills: string[]) => void;
  onSetTemplate: (templateId: string) => void;
  onSetSummary: (summary: string) => void;
  appTheme?: 'dark' | 'bloom';
}

interface ProfessionDetails {
  recommendedSkills: string[];
  suggestedSummary: string;
  suggestedBullets: string[];
  bestTemplateId: string;
}

const COMMON_PROFESSIONS = [
  'Software Engineer',
  'UI/UX Designer',
  'Product Manager',
  'Data Analyst',
  'Finance Consultant',
  'Marketing Specialist',
  'Sales Executive',
  'HR Specialist'
];

export default function ProfessionHelper({
  currentProfession,
  onSelectProfession,
  onPrefillSkills,
  onSetTemplate,
  onSetSummary,
  appTheme = 'dark'
}: ProfessionHelperProps) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<ProfessionDetails | null>(null);
  const [searchWord, setSearchWord] = useState('');
  const [appliedTemplate, setAppliedTemplate] = useState(false);
  const [appliedSkills, setAppliedSkills] = useState(false);
  const [appliedSummary, setAppliedSummary] = useState(false);

  const isBloom = appTheme === 'bloom';

  const loadProfessionDetails = async (prof: string) => {
    if (!prof.trim()) return;
    setLoading(true);
    setAppliedTemplate(false);
    setAppliedSkills(false);
    setAppliedSummary(false);
    try {
      const response = await fetch('/api/ai-profession-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profession: prof })
      });
      const data = await response.json();
      if (response.ok) {
        setDetails(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentProfession) {
      loadProfessionDetails(currentProfession);
    }
  }, [currentProfession]);

  const handleApplyTemplate = () => {
    if (details?.bestTemplateId) {
      onSetTemplate(details.bestTemplateId);
      setAppliedTemplate(true);
      setTimeout(() => setAppliedTemplate(false), 2500);
    }
  };

  const handleApplySkills = () => {
    if (details?.recommendedSkills) {
      onPrefillSkills(details.recommendedSkills);
      setAppliedSkills(true);
      setTimeout(() => setAppliedSkills(false), 2500);
    }
  };

  const handleApplySummary = () => {
    if (details?.suggestedSummary) {
      onSetSummary(details.suggestedSummary);
      setAppliedSummary(true);
      setTimeout(() => setAppliedSummary(false), 2500);
    }
  };

  return (
    <div className={`p-5 rounded-xl border space-y-4 text-left ${
      isBloom
        ? 'bg-rose-50/40 border-rose-100/60 text-slate-800 shadow-sm shadow-rose-100/5'
        : 'bg-slate-900/30 border-slate-800/80 text-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Profession Template & Tips Copilot 🧭
          </h3>
        </div>
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-400" />}
      </div>

      <p className="text-slate-400 text-[11px] leading-relaxed">
        Select or enter your target profession below. Our Gemini API automatically recommends the ideal resume templates, hot keywords, summaries, and skills specifically optimized for this career path.
      </p>

      {/* Selector/Input Field */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="Type other profession (e.g. DevOps, Architect)..."
            className="flex-1 px-3 py-2 text-xs rounded-lg border bg-slate-900 border-slate-800 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-600 text-left"
          />
          <button
            onClick={() => {
              if (searchWord.trim()) {
                onSelectProfession(searchWord);
                loadProfessionDetails(searchWord);
              }
            }}
            className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shrink-0"
          >
            Load Tips
          </button>
        </div>

        {/* Quick select buttons */}
        <div className="flex flex-wrap gap-1 pt-1">
          {COMMON_PROFESSIONS.map((prof) => (
            <button
              key={prof}
              onClick={() => {
                setSearchWord(prof);
                onSelectProfession(prof);
                loadProfessionDetails(prof);
              }}
              className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition ${
                currentProfession === prof
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                  : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              {prof}
            </button>
          ))}
        </div>
      </div>

      {details && (
        <div className="pt-3 border-t border-slate-800/60 space-y-4 animate-fadeIn">
          {/* Recommendation summary card */}
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-850 text-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">AI Recommendations for {currentProfession}</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[9px] uppercase font-semibold">
                Match Grade: Stellar
              </span>
            </div>

            {/* Template action */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-900 pb-3">
              <div>
                <span className="block font-bold text-white text-[11px] mb-0.5">🎨 Suggested Layout Style</span>
                <span className="text-[10px] text-slate-400">Recommended Template: <span className="text-yellow-400 font-bold uppercase">{details.bestTemplateId}</span></span>
              </div>
              <button
                onClick={handleApplyTemplate}
                className={`px-2.5 py-1 rounded text-[10px] font-bold border transition shrink-0 flex items-center gap-1 ${
                  appliedTemplate
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400'
                }`}
              >
                {appliedTemplate ? <CheckCircle className="w-3 h-3" /> : <LayoutGrid className="w-3 h-3" />}
                {appliedTemplate ? 'Applied Layout' : 'Apply Layout'}
              </button>
            </div>

            {/* Skills prefill action */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-900 pb-3">
              <div>
                <span className="block font-bold text-white text-[11px] mb-0.5">🛠️ Recommended Tech Skills</span>
                <span className="text-[10px] text-slate-400 max-w-xs block truncate leading-tight">{details.recommendedSkills.slice(0, 4).join(', ')} etc.</span>
              </div>
              <button
                onClick={handleApplySkills}
                className={`px-2.5 py-1 rounded text-[10px] font-bold border transition shrink-0 flex items-center gap-1 ${
                  appliedSkills
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400'
                }`}
              >
                {appliedSkills ? <CheckCircle className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                {appliedSkills ? 'Skills Inserted' : 'Insert Skills'}
              </button>
            </div>

            {/* Summary prefill action */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="block font-bold text-white text-[11px] mb-0.5">📝 Custom Professional Summary</span>
                <p className="text-[10px] text-slate-400 line-clamp-1 leading-tight">{details.suggestedSummary}</p>
              </div>
              <button
                onClick={handleApplySummary}
                className={`px-2.5 py-1 rounded text-[10px] font-bold border transition shrink-0 flex items-center gap-1 ${
                  appliedSummary
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400'
                }`}
              >
                {appliedSummary ? <CheckCircle className="w-3 h-3" /> : <Sparkles className="w-3 h-3 text-yellow-400" />}
                {appliedSummary ? 'Summary Set' : 'Use Summary'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
