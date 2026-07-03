import React, { useState } from 'react';
import { History, Undo2, Redo2, Plus, Bookmark, RotateCcw } from 'lucide-react';
import { ResumeData } from '../types.ts';

interface VersionSnapshot {
  id: string;
  name: string;
  timestamp: string;
  data: ResumeData;
}

interface VersionHistoryProps {
  currentData: ResumeData;
  historyStack: ResumeData[];
  historyIndex: number;
  onUndo: () => void;
  onRedo: () => void;
  onRestore: (data: ResumeData) => void;
  appTheme?: 'dark' | 'bloom';
}

export default function VersionHistory({
  currentData,
  historyStack,
  historyIndex,
  onUndo,
  onRedo,
  onRestore,
  appTheme = 'dark'
}: VersionHistoryProps) {
  const [snapshots, setSnapshots] = useState<VersionSnapshot[]>([
    {
      id: 'v-original',
      name: 'Original Parse Extraction',
      timestamp: new Date().toISOString(),
      data: { ...currentData }
    }
  ]);
  const [newSnapshotName, setNewSnapshotName] = useState('');

  const handleSaveSnapshot = () => {
    if (!newSnapshotName.trim()) return;
    const newSnap: VersionSnapshot = {
      id: `snap-${Date.now()}`,
      name: newSnapshotName.trim(),
      timestamp: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(currentData)) // deep clone
    };
    setSnapshots(prev => [newSnap, ...prev]);
    setNewSnapshotName('');
  };

  const handleRestoreSnapshot = (snap: VersionSnapshot) => {
    onRestore(snap.data);
  };

  const isBloom = appTheme === 'bloom';

  return (
    <div id="version-control-panel" className={`rounded-xl p-5 border transition-all duration-300 text-left space-y-4 ${
      isBloom
        ? 'bg-white/90 border-rose-100 shadow-md shadow-rose-100/10'
        : 'bg-slate-900/40 border border-slate-800'
    }`}>
      
      {/* Header and Undo/Redo stack counters */}
      <div className={`flex items-center justify-between border-b pb-3 ${
        isBloom ? 'border-rose-100/60' : 'border-slate-850'
      }`}>
        <div className="flex items-center gap-2">
          <History className={`w-4 h-4 ${isBloom ? 'text-rose-500' : 'text-indigo-400'}`} />
          <h4 className={`text-sm font-semibold ${isBloom ? 'text-slate-800' : 'text-white'}`}>Change Stack & Version Snapshots</h4>
        </div>

        {/* Undo / Redo controls */}
        <div className={`flex items-center gap-1.5 p-1 rounded-md border ${
          isBloom ? 'bg-rose-50/50 border-rose-100' : 'bg-slate-950 border-slate-850'
        }`}>
          <button
            onClick={onUndo}
            disabled={historyIndex <= 0}
            className={`p-1 disabled:opacity-30 transition rounded ${
              isBloom ? 'text-slate-600 hover:text-slate-900 hover:bg-rose-100/40' : 'text-slate-400 hover:text-white'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <span className={`text-[10px] font-mono font-bold px-1 select-none ${
            isBloom ? 'text-rose-600' : 'text-slate-500'
          }`}>
            {historyIndex + 1}/{historyStack.length}
          </span>
          <button
            onClick={onRedo}
            disabled={historyIndex >= historyStack.length - 1}
            className={`p-1 disabled:opacity-30 transition rounded ${
              isBloom ? 'text-slate-600 hover:text-slate-900 hover:bg-rose-100/40' : 'text-slate-400 hover:text-white'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Snapshots Timeline container */}
      <div className="space-y-4">
        {/* Create Snapshot inline input */}
        <div className="space-y-2">
          <label className={`block text-xs font-semibold uppercase ${
            isBloom ? 'text-slate-500' : 'text-slate-400'
          }`}>Save Current Version</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSnapshotName}
              onChange={(e) => setNewSnapshotName(e.target.value)}
              placeholder="e.g. Optimized for Stripe Role"
              className={`flex-1 border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 transition-all ${
                isBloom
                  ? 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-rose-400 focus:ring-rose-400'
                  : 'bg-slate-950 border-slate-850 text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            <button
              onClick={handleSaveSnapshot}
              disabled={!newSnapshotName.trim()}
              className={`px-3 py-1.5 disabled:opacity-40 text-white font-semibold text-xs rounded-lg transition-all ${
                isBloom
                  ? 'bg-rose-500 hover:bg-rose-600'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              Save
            </button>
          </div>
        </div>

        {/* Snapshots timeline stack list */}
        <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
          {snapshots.map((snap) => (
            <div
              key={snap.id}
              className={`flex items-center justify-between p-2 border rounded-lg transition-all ${
                isBloom
                  ? 'bg-white border-slate-100 hover:border-rose-100 hover:bg-rose-50/20'
                  : 'bg-slate-950/60 border border-slate-900 hover:border-slate-850 hover:bg-slate-950'
              }`}
            >
              <div className="min-w-0">
                <span className={`text-xs font-semibold block truncate leading-tight ${
                  isBloom ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  {snap.name}
                </span>
                <span className={`text-[9px] font-mono ${
                  isBloom ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              
              <button
                onClick={() => handleRestoreSnapshot(snap)}
                className={`flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-md transition border ${
                  isBloom
                    ? 'bg-rose-50 hover:bg-rose-100 border-rose-100/50 text-rose-600'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-indigo-400'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restore</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
