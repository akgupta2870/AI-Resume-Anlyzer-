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
}

export default function VersionHistory({
  currentData,
  historyStack,
  historyIndex,
  onUndo,
  onRedo,
  onRestore
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

  return (
    <div id="version-control-panel" className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 backdrop-blur-md text-left space-y-4">
      
      {/* Header and Undo/Redo stack counters */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <h4 className="text-white text-sm font-semibold">Change Stack & Version Snapshots</h4>
        </div>

        {/* Undo / Redo controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-md border border-slate-850">
          <button
            onClick={onUndo}
            disabled={historyIndex <= 0}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition rounded"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-500 font-mono font-bold px-1 select-none">
            {historyIndex + 1}/{historyStack.length}
          </span>
          <button
            onClick={onRedo}
            disabled={historyIndex >= historyStack.length - 1}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition rounded"
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
          <label className="block text-slate-400 text-xs font-semibold uppercase">Save Current Version</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSnapshotName}
              onChange={(e) => setNewSnapshotName(e.target.value)}
              placeholder="e.g. Optimized for Stripe Role"
              className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSaveSnapshot}
              disabled={!newSnapshotName.trim()}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium text-xs rounded-lg transition"
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
              className="flex items-center justify-between p-2 bg-slate-950/60 border border-slate-900 rounded-lg hover:border-slate-850 hover:bg-slate-950 transition"
            >
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-200 block truncate leading-tight">
                  {snap.name}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              
              <button
                onClick={() => handleRestoreSnapshot(snap)}
                className="flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-indigo-400 text-[10px] font-semibold rounded-md transition"
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
