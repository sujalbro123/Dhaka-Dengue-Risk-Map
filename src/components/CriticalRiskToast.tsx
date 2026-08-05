import React, { useState, useEffect } from 'react';
import { ComputedAreaRisk } from '../types';
import { AlertTriangle, X, ShieldAlert, ChevronRight, Siren, Volume2, VolumeX } from 'lucide-react';

interface CriticalRiskToastProps {
  criticalAreas: ComputedAreaRisk[];
  isVisible: boolean;
  onDismiss: () => void;
  onSelectArea: (areaId: string) => void;
}

export const CriticalRiskToast: React.FC<CriticalRiskToastProps> = ({
  criticalAreas,
  isVisible,
  onDismiss,
  onSelectArea,
}) => {
  const [isMuted, setIsMuted] = useState(false);

  // Play audio alarm beep when critical toast appears if not muted
  useEffect(() => {
    if (isVisible && criticalAreas.length > 0 && !isMuted) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 pitch
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch {
        // Ignore audio errors if blocked by browser policy
      }
    }
  }, [isVisible, criticalAreas, isMuted]);

  if (!isVisible || criticalAreas.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 sm:px-0">
      <div className="bg-[#0f1218] border border-red-700 rounded-sm overflow-hidden">
        {/* Top Emergency Header */}
        <div className="bg-red-900/90 border-b border-red-700 p-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-black/40 rounded-sm">
              <Siren className="w-4 h-4 text-red-200" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-200">
                Simulation Alert
              </div>
              <h4 className="text-xs sm:text-sm font-black tracking-tight flex items-center gap-1.5">
                CRITICAL DENGUE THREAT DETECTED
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute Audio Warning' : 'Mute Audio Warning'}
              className="p-1 hover:bg-black/20 rounded-sm transition-colors text-red-100"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onDismiss}
              title="Dismiss Alert"
              className="p-1 hover:bg-black/20 rounded-sm transition-colors text-red-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Banner Content Body */}
        <div className="p-4 bg-[#0f1218] text-slate-100 space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            Simulation adjustments escalated risk score above <strong className="text-red-400">80/100 (0.80 Critical Threshold)</strong> in{' '}
            <strong className="text-white">{criticalAreas.length} Thana{criticalAreas.length > 1 ? 's' : ''}</strong>:
          </p>

          {/* List of Critical Areas */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {criticalAreas.map((area) => (
              <div
                key={area.id}
                onClick={() => {
                  onSelectArea(area.id);
                }}
                className="p-2.5 bg-[#1a1f26] border border-red-500/40 hover:border-red-400 rounded-sm flex items-center justify-between gap-2 cursor-pointer transition-colors hover:bg-slate-800/80 group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-sm bg-red-500 shrink-0" />
                  <div className="truncate">
                    <div className="font-bold text-xs text-white group-hover:text-red-300 transition-colors">
                      {area.name} <span className="text-[11px] text-slate-400 font-normal">({area.corporation})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {area.recentCases30d} cases • {area.recentRainfallMm}mm rain
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 font-extrabold font-mono text-xs rounded-sm border border-red-500/40">
                    {area.riskScore100} / 100
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>

          {/* Actions Bar */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              Immediate Vector Control Recommended
            </span>
            <button
              onClick={onDismiss}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-sm text-xs transition-colors border border-slate-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
