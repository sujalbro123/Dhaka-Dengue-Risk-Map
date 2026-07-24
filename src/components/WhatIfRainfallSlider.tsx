import React from 'react';
import { CloudRain, RotateCcw, Sparkles } from 'lucide-react';

interface WhatIfRainfallSliderProps {
  whatIfRainfallMm: number | null | undefined;
  onChangeWhatIfRainfall: (value: number | null) => void;
  avgActualRainfallMm: number;
}

export const WhatIfRainfallSlider: React.FC<WhatIfRainfallSliderProps> = ({
  whatIfRainfallMm,
  onChangeWhatIfRainfall,
  avgActualRainfallMm,
}) => {
  const isOverridden = whatIfRainfallMm !== null && whatIfRainfallMm !== undefined;
  const currentVal = isOverridden ? whatIfRainfallMm : avgActualRainfallMm;

  return (
    <div className="bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-slate-100">
      {/* Label & Value */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/40">
          <CloudRain className="w-5 h-5 animate-bounce-short" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
              "What-If" Rainfall Simulator
            </span>
            {isOverridden && (
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full text-[10px] font-bold border border-cyan-500/40 animate-pulse">
                Active Override
              </span>
            )}
          </div>
          <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <span>Simulated rainfall:</span>
            <span className="font-mono text-cyan-400 text-base">{Math.round(currentVal)} mm</span>
            {!isOverridden && (
              <span className="text-[11px] font-normal text-slate-400">(Actual Avg: {Math.round(avgActualRainfallMm)}mm)</span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Range Slider */}
      <div className="flex-1 max-w-md mx-0 sm:mx-2 flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
          <span>0 mm (Drought)</span>
          <span>150 mm (Moderate)</span>
          <span>300 mm (Heavy Monsoon)</span>
        </div>
        <input
          type="range"
          min="0"
          max="300"
          step="5"
          value={currentVal}
          onChange={(e) => onChangeWhatIfRainfall(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      {/* Reset Button */}
      {isOverridden && (
        <button
          onClick={() => onChangeWhatIfRainfall(null)}
          className="shrink-0 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset to actual data</span>
        </button>
      )}
    </div>
  );
};
