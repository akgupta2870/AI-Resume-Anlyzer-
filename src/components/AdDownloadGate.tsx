import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, Play, AlertCircle, X, ShieldAlert, Sparkles, Award } from 'lucide-react';

interface AdDownloadGateProps {
  onAdCompleted: () => void;
  onCancel: () => void;
  appTheme?: 'dark' | 'bloom';
}

export default function AdDownloadGate({ onAdCompleted, onCancel, appTheme = 'dark' }: AdDownloadGateProps) {
  const [timeLeft, setTimeLeft] = useState(5);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const isBloom = appTheme === 'bloom';

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }
    const timer = setInterval(() => {
      if (isPlaying) {
        setTimeLeft(prev => prev - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPlaying]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md no-print animate-fadeIn">
      <div className={`relative max-w-lg w-full rounded-2xl overflow-hidden border shadow-2xl transition duration-300 ${
        isBloom ? 'bg-white border-rose-100 text-slate-800' : 'bg-slate-950 border-slate-850 text-white'
      }`}>
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold text-[9px] uppercase tracking-wider border border-indigo-500/15">
              Sponsored Ad
            </span>
            <span className="text-xs font-semibold text-slate-400">Premium Download Unlocker</span>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-300 text-xs transition"
          >
            Cancel & Exit ✕
          </button>
        </div>

        {/* Video Area (Simulated Video Ad) */}
        <div className="relative bg-black aspect-video flex flex-col items-center justify-center overflow-hidden group">
          
          {/* Ad Content Graphics (Dynamic job promotion) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/80 via-slate-900 to-indigo-900/40 flex flex-col items-center justify-center p-6 text-center space-y-4">
            
            {/* Pulsing visual */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-indigo-500 blur-md opacity-30 animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-slate-900/90 border border-indigo-500/30 flex items-center justify-center text-indigo-400 relative">
                <Sparkles className="w-8 h-8 animate-bounce text-yellow-400" />
              </div>
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
                Naukri Premium Job Finder
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Connect directly with 250,000+ elite tech recruiters today and boost your callback rate by <span className="text-emerald-400 font-bold">4.8x</span>!
              </p>
            </div>

            {/* Simulated CTA link */}
            <div className="px-5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] cursor-pointer transition shadow-lg">
              Unlock Career Placements Now
            </div>
          </div>

          {/* Ad Progress and Timers */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition"
              >
                {isPlaying ? <span className="text-[10px] font-bold px-1">Pause</span> : <Play className="w-3 h-3" />}
              </button>
            </div>

            {timeLeft > 0 ? (
              <span className="px-3 py-1.5 rounded-lg bg-slate-900/95 border border-slate-800/80 text-white font-bold text-[11px] tracking-wide shadow-md">
                Unlocking in {timeLeft}s
              </span>
            ) : (
              <button
                onClick={onAdCompleted}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] tracking-wide flex items-center gap-1 shadow-md animate-pulse"
              >
                Skip Ad & Download PDF <SkipForward className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Footer info explaining download model */}
        <div className="p-4 bg-slate-900/30 border-t border-slate-800/40 text-center space-y-2.5">
          <p className="text-[10px] text-slate-400 leading-relaxed">
            By sponsoring this partner ad, we can keep this professional AI resume builder completely <span className="font-bold text-white">free</span> for everyone. Thank you for your support!
          </p>
          {timeLeft > 0 && (
            <button
              onClick={onCancel}
              className="text-[10px] text-slate-500 hover:text-slate-300 underline font-semibold"
            >
              No thanks, go back to editor
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
