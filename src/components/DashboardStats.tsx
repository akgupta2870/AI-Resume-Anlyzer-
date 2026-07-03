import React from 'react';
import { 
  BarChart3, 
  FileCheck, 
  CloudDownload, 
  Sparkles, 
  Clock, 
  FileDown, 
  Wand2, 
  TrendingUp, 
  UserCheck 
} from 'lucide-react';
import { DashboardStats as StatsType } from '../types.ts';
import { motion } from 'motion/react';

interface DashboardStatsProps {
  stats: StatsType | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function DashboardStats({ stats, loading, onRefresh }: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-mono text-sm">Loading admin dashboard statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4 text-center">
        <p className="text-rose-400 font-semibold mb-2">Failed to load statistics.</p>
        <button onClick={onRefresh} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
          Try Again
        </button>
      </div>
    );
  }

  // Helper to format timestamps nicely
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <div id="admin-dashboard-container" className="max-w-6xl mx-auto py-10 px-4">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-white tracking-tight">
            System Admin <span className="text-indigo-400">Dashboard</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time analytics monitor for AI resume uploads, parsing, downloads, and credit usage.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-semibold rounded-lg border border-slate-800 hover:border-slate-750 transition self-start md:self-auto"
        >
          Refresh Live Logs
        </button>
      </div>

      {/* Grid of Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* KPI 1: Active Users */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03]">
            <UserCheck className="w-32 h-32 text-indigo-400" />
          </div>
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Active Workspace Users</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-display text-3xl font-bold">1</span>
            <span className="text-emerald-500 text-xs font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              100% Active
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-1">Akgupta2870@gmail.com</p>
        </div>

        {/* KPI 2: Total Resumes Created */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03]">
            <FileCheck className="w-32 h-32 text-emerald-400" />
          </div>
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Saved Resumes</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-display text-3xl font-bold">{stats.totalResumes}</span>
            <span className="text-slate-500 text-xs">documents</span>
          </div>
          <p className="text-slate-500 text-xs mt-1">Persistent SQL/file structure</p>
        </div>

        {/* KPI 3: AI Parsed Runs */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03]">
            <Sparkles className="w-32 h-32 text-purple-400" />
          </div>
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">AI Parsing Runs</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-display text-3xl font-bold">{stats.totalParsed}</span>
            <span className="text-purple-400 text-xs font-semibold">Gemini 3.5 Flash</span>
          </div>
          <p className="text-slate-500 text-xs mt-1">Structured JSON schema output</p>
        </div>

        {/* KPI 4: Total Exports */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03]">
            <CloudDownload className="w-32 h-32 text-pink-400" />
          </div>
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <CloudDownload className="w-5 h-5 text-pink-400" />
            </div>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Downloads Tracked</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-display text-3xl font-bold">{stats.totalDownloads}</span>
            <span className="text-pink-400 text-xs">PDF / DOCX</span>
          </div>
          <p className="text-slate-500 text-xs mt-1">Full-resolution formatted file downloads</p>
        </div>
      </div>

      {/* Main Split: Left AI usage graph/bars, Right Realtime Timeline logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: AI Feature breakdown */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-white font-semibold text-base">Gemini API Usage by Feature</h3>
          </div>

          <div className="space-y-5">
            {Object.keys(stats.aiFeatureUsage).length === 0 ? (
              <p className="text-slate-500 text-sm italic py-6">No AI operations logged yet.</p>
            ) : (
              Object.entries(stats.aiFeatureUsage).map(([feature, count]) => {
                // Determine color
                let colorClass = "bg-indigo-500";
                if (feature.includes("summary")) colorClass = "bg-emerald-500";
                if (feature.includes("experience")) colorClass = "bg-purple-500";
                if (feature.includes("ats")) colorClass = "bg-pink-500";
                if (feature.includes("match")) colorClass = "bg-amber-500";

                return (
                  <div key={feature} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-mono font-medium capitalize">
                        {feature.replace("-", " ")}
                      </span>
                      <span className="text-slate-400 font-mono">{count} execution{count > 1 ? 's' : ''}</span>
                    </div>
                    {/* Visual Bar representation */}
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                      <div 
                        className={`h-full ${colorClass}`}
                        style={{ width: `${Math.min(100, (count / Math.max(1, stats.totalParsed)) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sponsoring credit info */}
          <div className="mt-8 p-4 bg-slate-950 border border-slate-850 rounded-lg flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-300 text-xs font-semibold">Gemini 3.5 Flash Model</p>
              <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                Uses the latest low-latency, 1-million-token context window for full resume audits and exact structured JSON generation.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Log timeline */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <h3 className="text-white font-semibold text-base">Real-Time Operational Activity Logs</h3>
            </div>
            <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono rounded-full uppercase">
              Live
            </span>
          </div>

          {/* Activity Timeline List */}
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {stats.recentActivity.length === 0 ? (
              <p className="text-slate-500 text-sm italic py-10 text-center">No activity logged.</p>
            ) : (
              stats.recentActivity.map((act) => {
                let badgeColor = "border-slate-800 text-slate-400 bg-slate-900/40";
                let icon = <Clock className="w-3.5 h-3.5" />;

                if (act.type === 'upload') {
                  badgeColor = "border-emerald-900/50 text-emerald-400 bg-emerald-950/20";
                  icon = <Wand2 className="w-3.5 h-3.5" />;
                } else if (act.type === 'parse') {
                  badgeColor = "border-indigo-900/50 text-indigo-400 bg-indigo-950/20";
                  icon = <Sparkles className="w-3.5 h-3.5" />;
                } else if (act.type === 'improve') {
                  badgeColor = "border-purple-900/50 text-purple-400 bg-purple-950/20";
                  icon = <Wand2 className="w-3.5 h-3.5" />;
                } else if (act.type === 'download') {
                  badgeColor = "border-pink-900/50 text-pink-400 bg-pink-950/20";
                  icon = <FileDown className="w-3.5 h-3.5" />;
                }

                return (
                  <div key={act.id} className="flex items-start gap-3.5 p-3.5 bg-slate-950/40 border border-slate-900 rounded-lg hover:border-slate-800 transition">
                    <div className={`w-7 h-7 rounded-md border flex items-center justify-center shrink-0 ${badgeColor}`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-slate-200 text-xs font-medium truncate">{act.description}</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        {formatTime(act.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
