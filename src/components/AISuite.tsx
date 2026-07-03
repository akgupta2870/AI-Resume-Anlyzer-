import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  BrainCircuit, 
  AlertTriangle, 
  CheckCircle, 
  Send, 
  Loader2, 
  MessageSquare,
  FileSearch,
  BookmarkPlus,
  Compass,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { ResumeData, Message } from '../types.ts';

interface AISuiteProps {
  resumeData: ResumeData;
}

export default function AISuite({ resumeData }: AISuiteProps) {
  const [activeTab, setActiveTab] = useState<'ats' | 'jd-match' | 'chat'>('ats');

  // --- Tab 1: ATS Grading ---
  const [atsReport, setAtsReport] = useState<any | null>(null);
  const [analyzingATS, setAnalyzingATS] = useState(false);

  // --- Tab 2: Job Description Matcher ---
  const [jdText, setJdText] = useState('');
  const [matchReport, setMatchReport] = useState<any | null>(null);
  const [matchingJD, setMatchingJD] = useState(false);

  // --- Tab 3: Direct AI Chat ---
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am your personal Gemini Resume Copilot. I have read your resume. Ask me to draft a new summary, write impact experience bullets, suggest missing keywords, or optimize for a specific job post!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  // --- Function: Analyze ATS ---
  const handleAnalyzeATS = async () => {
    setAnalyzingATS(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData })
      });
      const data = await response.json();
      if (response.ok) {
        setAtsReport(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingATS(false);
    }
  };

  // --- Function: Job Matcher ---
  const handleJobMatch = async () => {
    if (!jdText.trim()) return;
    setMatchingJD(true);
    try {
      const response = await fetch('/api/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription: jdText })
      });
      const data = await response.json();
      if (response.ok) {
        setMatchReport(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMatchingJD(false);
    }
  };

  // --- Function: Send Chat message ---
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || sendingChat) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: chatInput,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setSendingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: chatMessages.map(m => ({ role: m.role, content: m.content })),
          message: userMsg.content,
          resumeText: JSON.stringify(resumeData)
        })
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || "Failed to receive copilot reply.");
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${err.message || "I encountered an issue. Please try again."}`,
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setSendingChat(false);
    }
  };

  return (
    <div id="ai-suite-panel" className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 backdrop-blur-md flex flex-col h-full min-h-[550px]">
      
      {/* Header section with tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-left">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          <h3 className="text-white text-sm font-semibold">Gemini 3.5 AI Copilot Tools</h3>
        </div>

        <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
          {[
            { id: 'ats', label: 'ATS Score', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'jd-match', label: 'JD Matching', icon: <FileSearch className="w-3.5 h-3.5" /> },
            { id: 'chat', label: 'AI Chat', icon: <MessageSquare className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                activeTab === tab.id
                  ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT: 1. ATS Grading */}
      {activeTab === 'ats' && (
        <div className="space-y-4 flex-1 flex flex-col justify-between text-left">
          {!atsReport ? (
            <div className="text-center py-10 flex-1 flex flex-col items-center justify-center">
              <Award className="w-12 h-12 text-indigo-500/35 mb-4" />
              <h4 className="text-white font-medium text-sm mb-1">Audit ATS Compliance</h4>
              <p className="text-slate-400 text-xs max-w-sm mb-6">
                Let Gemini audit layout structures, scan grammatical patterns, and flag missing industry keywords.
              </p>
              <button
                id="btn-run-ats-audit"
                onClick={handleAnalyzeATS}
                disabled={analyzingATS}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md transition"
              >
                {analyzingATS ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing compliance...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run ATS Audit</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[460px] pr-1">
              
              {/* Score Gauge Circle */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-slate-400 text-[10px] font-mono uppercase">ATS score grade</div>
                  <div className="text-white text-xl font-bold font-display mt-0.5">
                    Grade: <span className="text-indigo-400 font-extrabold">
                      {atsReport.overallScore >= 90 ? 'A+' : atsReport.overallScore >= 80 ? 'A' : atsReport.overallScore >= 70 ? 'B' : 'C'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">SaaS parsing compatibility metrics.</p>
                </div>
                
                {/* SVG circular progress ring */}
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-400"
                      strokeDasharray={`${atsReport.overallScore || 75}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-mono font-bold text-xs">
                    {atsReport.overallScore || 75}%
                  </div>
                </div>
              </div>

              {/* Score Details list */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Keywords Match</span>
                  <span className="text-white font-mono font-bold">{atsReport.keywordMatch || 80}%</span>
                </div>
                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Formatting Rules</span>
                  <span className="text-white font-mono font-bold">{atsReport.formattingScore || 90}%</span>
                </div>
                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Action Verbs</span>
                  <span className="text-white font-mono font-bold">{atsReport.actionVerbsScore || 85}%</span>
                </div>
                <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Readability Scale</span>
                  <span className="text-white font-mono font-bold">{atsReport.readabilityScore || 95}%</span>
                </div>
              </div>

              {/* Suggested Industry Keywords */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-4 text-left">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-2 uppercase">
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Suggested Industry Keywords</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(!atsReport.missingKeywords || atsReport.missingKeywords.length === 0) ? (
                    <span className="text-slate-500 text-xs italic">No additional keywords recommended.</span>
                  ) : (
                    atsReport.missingKeywords.map((kw: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] text-indigo-300 font-mono">
                        {kw}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Layout suggestions */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-4 text-left">
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-2 uppercase">
                  <Compass className="w-4 h-4" />
                  <span>SaaS Compliance Suggestions</span>
                </div>
                <ul className="list-disc pl-4 text-slate-300 text-[11px] space-y-1.5 leading-relaxed">
                  {(!atsReport.suggestions || atsReport.suggestions.length === 0) ? (
                    <li>Ensure clear font layouts and achievement bullet counts.</li>
                  ) : (
                    atsReport.suggestions.map((sug: string, i: number) => (
                      <li key={i}>{sug}</li>
                    ))
                  )}
                </ul>
              </div>

            </div>
          )}

          {atsReport && (
            <button
              onClick={handleAnalyzeATS}
              disabled={analyzingATS}
              className="w-full mt-2 py-2 bg-slate-950 hover:bg-slate-900 text-slate-300 text-xs font-semibold rounded-lg border border-slate-800 hover:border-slate-700 transition font-mono"
            >
              {analyzingATS ? "Re-running audit..." : "Re-audit Document"}
            </button>
          )}
        </div>
      )}

      {/* TAB CONTENT: 2. JD Matching */}
      {activeTab === 'jd-match' && (
        <div className="space-y-4 flex-1 flex flex-col justify-between text-left">
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] pr-1">
            <label className="block text-slate-400 text-xs font-semibold uppercase">Target Job Description</label>
            <textarea
              rows={4}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              placeholder="Paste the target job description or requirements here to audit compatibility..."
            />

            <div className="flex justify-end">
              <button
                onClick={handleJobMatch}
                disabled={matchingJD || !jdText.trim()}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium text-xs rounded-lg transition"
              >
                {matchingJD ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Evaluating match...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>Run Compatibility Match</span>
                  </>
                )}
              </button>
            </div>

            {matchReport && (
              <div className="space-y-4 mt-4 pt-4 border-t border-slate-850">
                {/* Score badge */}
                <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                  <div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase">Match score</div>
                    <div className="text-white text-sm font-bold">Role Alignment Rate</div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold rounded-full">
                    {matchReport.matchPercentage || 70}% Compatible
                  </span>
                </div>

                {/* Experience Gap Summary */}
                {matchReport.experienceGap && (
                  <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg">
                    <span className="text-xs text-indigo-400 font-semibold block mb-1.5 uppercase">Experience Gap Audit</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{matchReport.experienceGap}</p>
                  </div>
                )}

                {/* Matched vs Missing Skills list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg">
                    <span className="text-xs text-emerald-400 font-semibold block mb-1.5 uppercase">Suggested Keywords</span>
                    <div className="flex flex-wrap gap-1">
                      {matchReport.suggestedKeywords?.map((s: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-emerald-500/5 text-emerald-300 text-[9px] font-mono rounded">
                          {s}
                        </span>
                      ))}
                      {(!matchReport.suggestedKeywords || matchReport.suggestedKeywords.length === 0) && (
                        <span className="text-slate-500 text-xs italic">None recommended.</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg">
                    <span className="text-xs text-rose-400 font-semibold block mb-1.5 uppercase">Missing Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {matchReport.missingSkills?.map((s: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-rose-500/5 text-rose-300 text-[9px] font-mono rounded">
                          {s}
                        </span>
                      ))}
                      {(!matchReport.missingSkills || matchReport.missingSkills.length === 0) && (
                        <span className="text-slate-500 text-xs italic">None detected.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action optimization points */}
                {matchReport.improvedResumeSuggestions && (
                  <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg text-left">
                    <span className="text-xs text-indigo-400 font-semibold block mb-2 uppercase">Suggested Customizations</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{matchReport.improvedResumeSuggestions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. AI Chat Copilot */}
      {activeTab === 'chat' && (
        <div className="flex flex-col flex-1 h-[460px] justify-between text-left">
          
          {/* Scrollable message logs */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 text-left mb-4 max-h-[390px]">
            {chatMessages.map(msg => {
              const isAI = msg.role === 'assistant';
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[85%] ${isAI ? 'self-start mr-auto' : 'self-end ml-auto'}`}
                >
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isAI 
                      ? 'bg-slate-950 border border-slate-850 text-slate-200 rounded-tl-none' 
                      : 'bg-indigo-600 text-white rounded-tr-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
            
            {sendingChat && (
              <div className="flex items-center gap-2 self-start bg-slate-950 border border-slate-850 p-3 rounded-2xl text-xs text-slate-400 rounded-tl-none mr-auto max-w-[85%]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Gemini is composing optimized phrasing...</span>
              </div>
            )}
          </div>

          {/* Prompt/Chat footer input form */}
          <form onSubmit={handleSendChat} className="flex items-center gap-2 bg-slate-950 p-1.5 border border-slate-800 rounded-xl">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask copilot: 'Draft an ATS summary for me'..."
              className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={sendingChat || !chatInput.trim()}
              className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 flex items-center justify-center text-white shrink-0 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
