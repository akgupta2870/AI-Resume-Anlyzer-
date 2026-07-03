import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Eye, RefreshCw, FileText, Calendar, Search, Users, Download, ArrowLeft, BarChart3, TrendingUp, AlertCircle, Trash2 } from 'lucide-react';
import { getUserResumesFromFirebase } from '../firebase.ts';

interface AdminPanelProps {
  onBack: () => void;
  appTheme?: 'dark' | 'bloom';
}

export default function AdminPanel({ onBack, appTheme = 'dark' }: AdminPanelProps) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResume, setSelectedResume] = useState<any | null>(null);

  const isBloom = appTheme === 'bloom';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'AshishAdmin2026') {
      setIsAuthenticated(true);
      setError('');
      fetchData();
    } else {
      setError('Incorrect Administrator Passcode. Please try again.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserResumesFromFirebase();
      // Sort by updatedAt descending
      const sorted = data.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      setResumes(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResumes = resumes.filter(r => {
    const info = r.personalInformation || {};
    const name = (info.fullName || `${info.firstName || ''} ${info.lastName || ''}`).toLowerCase();
    const email = (info.email || '').toLowerCase();
    const profession = (r.professionalSummary || '').toLowerCase();
    const skills = JSON.stringify(r.skills || {}).toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || email.includes(query) || profession.includes(query) || skills.includes(query);
  });

  // Calculate high-level stats
  const totalSubmissions = resumes.length;
  const uniqueEmails = new Set(resumes.map(r => r.personalInformation?.email).filter(Boolean)).size;
  
  const dailyBreakdown = resumes.reduce((acc: Record<string, number>, r) => {
    const dateStr = new Date(r.updatedAt || r.createdAt || Date.now()).toLocaleDateString();
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

  if (!isAuthenticated) {
    return (
      <div className={`max-w-md mx-auto p-8 rounded-2xl border shadow-2xl transition duration-300 ${
        isBloom ? 'bg-white border-rose-100 text-slate-800' : 'bg-slate-950 border-slate-800 text-white'
      }`}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto text-indigo-400">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">Admin Business Portal</h3>
            <p className="text-slate-400 text-xs mt-1">
              Protected secure dashboard to view live customer resume logs, stats, and business lead data.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-left">
                Administrator Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-indigo-500 transition text-center font-mono bg-slate-900 border-slate-800 text-white placeholder-slate-700"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 transition"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition"
              >
                Access Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto p-4 lg:p-6 rounded-2xl border shadow-xl space-y-6 ${
      isBloom ? 'bg-white border-rose-100 text-slate-800' : 'bg-slate-950 border-slate-800 text-white'
    }`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-xs font-semibold mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Lock Admin Session
          </button>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight">Lead Capture & Business Logs 📊</h2>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] uppercase font-bold tracking-wider">
              Secure Live Database
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Silently logging visitor resumes, professions, and emails in real-time. Protects download rights & analyzes user counts.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300 transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Leads
          </button>
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5"
          >
            Back to Resume Editor
          </button>
        </div>
      </div>

      {selectedResume ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedResume(null)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to lead listings
            </button>
            <span className="text-[10px] text-slate-500 font-mono">ID: {selectedResume.id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 p-5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                Candidate Profile Info
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wide">Full Name</span>
                  <span className="font-semibold text-white">
                    {selectedResume.personalInformation?.fullName || `${selectedResume.personalInformation?.firstName || ''} ${selectedResume.personalInformation?.lastName || ''}`}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wide">Email Address</span>
                  <span className="font-semibold text-indigo-400">{selectedResume.personalInformation?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wide">Phone Number</span>
                  <span className="font-semibold text-slate-200">{selectedResume.personalInformation?.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wide">Location</span>
                  <span className="font-semibold text-slate-200">
                    {selectedResume.personalInformation?.city || ''}, {selectedResume.personalInformation?.country || ''}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wide">Last Sync Timestamp</span>
                  <span className="font-mono text-xs text-slate-400">
                    {selectedResume.updatedAt ? new Date(selectedResume.updatedAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 p-5 rounded-xl bg-slate-900/40 border border-slate-800/40 space-y-4 h-[500px] overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                Resume Content Document
              </h4>
              <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                <div>
                  <h5 className="font-bold text-white mb-1 uppercase tracking-wide text-[10px] text-indigo-400">Professional Summary</h5>
                  <p className="bg-slate-950 p-3 rounded-lg border border-slate-850">{selectedResume.professionalSummary || 'No summary provided.'}</p>
                </div>

                <div>
                  <h5 className="font-bold text-white mb-1 uppercase tracking-wide text-[10px] text-indigo-400">Technical Skills</h5>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-wrap gap-1.5">
                    {Object.entries(selectedResume.skills || {}).map(([key, value]: [string, any]) => (
                      Array.isArray(value) && value.length > 0 && (
                        <div key={key} className="w-full border-b border-slate-900 pb-1.5 last:border-0 last:pb-0">
                          <span className="text-[10px] font-bold text-slate-500 uppercase mr-2">{key}:</span>
                          {value.map((skill, sIdx) => (
                            <span key={sIdx} className="inline-block px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 mr-1.5 mb-1">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-white mb-1.5 uppercase tracking-wide text-[10px] text-indigo-400">Work Experience</h5>
                  <div className="space-y-3">
                    {selectedResume.experience?.map((exp: any, index: number) => (
                      <div key={index} className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                        <div className="flex justify-between font-semibold text-white">
                          <span>{exp.designation} at <span className="text-indigo-400">{exp.company}</span></span>
                          <span className="text-slate-500">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{exp.location}</p>
                        <ul className="list-disc pl-4 mt-2 space-y-1 text-[11px] text-slate-300">
                          {exp.responsibilities?.map((resp: string, rIdx: number) => (
                            <li key={rIdx}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Dashboard Stats Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Total Captures</span>
                <span className="text-lg font-bold text-white">{totalSubmissions} Resumes</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Unique Users (Emails)</span>
                <span className="text-lg font-bold text-white">{uniqueEmails}</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Days Logging Active</span>
                <span className="text-lg font-bold text-white">{Object.keys(dailyBreakdown).length} Days</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-indigo-900/15 border border-indigo-500/20 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-indigo-300 uppercase font-semibold">Capture Success Rate</span>
                <span className="text-lg font-bold text-white">100% Automatic</span>
              </div>
            </div>
          </div>

          {/* Search bar and Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lead database (by name, email, skills, or job)..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border bg-slate-900 border-slate-800 focus:outline-none focus:border-indigo-500 text-white placeholder-slate-600 text-left"
                />
              </div>

              <span className="text-xs text-slate-400 font-medium">
                Showing {filteredResumes.length} of {totalSubmissions} synchronized resume profiles
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800/80">
              {loading ? (
                <div className="p-12 text-center space-y-2">
                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
                  <p className="text-slate-400 text-xs">Querying Firebase Firestore Database...</p>
                </div>
              ) : filteredResumes.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-slate-400 text-xs">No resume data records found matching your filters.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold">
                    <tr>
                      <th className="p-4 uppercase tracking-wider text-[10px]">Candidate Details</th>
                      <th className="p-4 uppercase tracking-wider text-[10px]">Target Profession</th>
                      <th className="p-4 uppercase tracking-wider text-[10px]">Top Highlight Skills</th>
                      <th className="p-4 uppercase tracking-wider text-[10px]">Logged Date</th>
                      <th className="p-4 uppercase tracking-wider text-[10px] text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {filteredResumes.map((resume, idx) => {
                      const info = resume.personalInformation || {};
                      const name = info.fullName || `${info.firstName || ''} ${info.lastName || ''}` || 'Anonymous User';
                      const email = info.email || 'No email shared';
                      const summary = resume.professionalSummary || 'No summary text';
                      
                      // Gather a few skills
                      const skillsList: string[] = [];
                      if (resume.skills) {
                        Object.values(resume.skills).forEach((arr: any) => {
                          if (Array.isArray(arr)) {
                            skillsList.push(...arr);
                          }
                        });
                      }
                      const displayedSkills = skillsList.slice(0, 4).join(', ');

                      return (
                        <tr key={resume.id || idx} className="hover:bg-slate-900/40 transition">
                          <td className="p-4">
                            <div className="font-semibold text-white">{name}</div>
                            <div className="text-[10px] text-slate-500">{email}</div>
                          </td>
                          <td className="p-4 max-w-xs truncate font-medium text-slate-300" title={summary}>
                            {summary.length > 80 ? `${summary.slice(0, 80)}...` : summary}
                          </td>
                          <td className="p-4 text-indigo-300 font-mono text-[10px]">
                            {displayedSkills || 'No listed skills'}
                          </td>
                          <td className="p-4 text-slate-400 font-mono">
                            {new Date(resume.updatedAt || resume.createdAt || Date.now()).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedResume(resume)}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold transition flex items-center gap-1 mx-auto"
                            >
                              <Eye className="w-3.5 h-3.5" /> Inspect File
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
