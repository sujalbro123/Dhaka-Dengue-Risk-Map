import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CloudRain, RotateCcw } from 'lucide-react';
import { MODEL_CONFIG } from '../config/appConfig';

interface WhatIfRainfallSliderProps {
  whatIfRainfallMm: number | null | undefined;
  onChangeWhatIfRainfall: (value: number | null) => void;
  avgActualRainfallMm: number;
}

export const WhatIfRainfallSlider: React.FC<WhatIfRainfallSliderProps> = React.memo(({
  whatIfRainfallMm,
  onChangeWhatIfRainfall,
  avgActualRainfallMm,
}) => {
  const isOverridden = whatIfRainfallMm !== null && whatIfRainfallMm !== undefined;
  const currentVal = isOverridden ? whatIfRainfallMm : avgActualRainfallMm;

  // Local state for smooth immediate UI updates during drag
  const [sliderValue, setSliderValue] = useState<number>(currentVal);

  // Sync local slider position when prop changes externally (e.g. scenario reset)
  useEffect(() => {
    setSliderValue(currentVal);
  }, [currentVal]);

  const lastCallTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Throttled parent callback (runs at most once every 50ms during continuous drag)
  const throttledUpdateParent = useCallback(
    (value: number) => {
      const now = Date.now();
      const elapsed = now - lastCallTimeRef.current;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (elapsed >= 50) {
        lastCallTimeRef.current = now;
        onChangeWhatIfRainfall(value);
      } else {
        timeoutRef.current = setTimeout(() => {
          lastCallTimeRef.current = Date.now();
          onChangeWhatIfRainfall(value);
          timeoutRef.current = null;
        }, 50 - elapsed);
      }
    },
    [onChangeWhatIfRainfall]
  );

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    setSliderValue(newVal);
    throttledUpdateParent(newVal);
  };

  const handleReset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onChangeWhatIfRainfall(null);
  };

  return (
    <div className="bg-slate-900 border border-[#E3E1DA]/20 rounded-sm p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-slate-100">
      {/* Label & Value */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="p-2 bg-slate-800 text-slate-300 rounded-sm border border-slate-700">
          <CloudRain className="w-4 h-4 text-slate-300" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
              "What-If" Rainfall Simulator
            </span>
            {isOverridden && (
              <span className="px-1.5 py-0.5 bg-cyan-950/80 text-cyan-300 rounded-sm text-[10px] font-semibold border border-cyan-500/40">
                Active Override
              </span>
            )}
          </div>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <span>Simulated rainfall:</span>
            <span className="font-mono text-cyan-400 text-base">{Math.round(sliderValue)} mm</span>
            {!isOverridden && (
              <span className="text-[11px] font-normal text-slate-400">(Actual Avg: {Math.round(avgActualRainfallMm)}mm)</span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Range Slider with 50ms Throttled Updates */}
      <div className="flex-1 max-w-md mx-0 sm:mx-2 flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
          <span>0 mm (Drought)</span>
          <span>150 mm (Moderate)</span>
          <span>300 mm (Heavy Monsoon)</span>
        </div>
        <input
          type="range"
          min={MODEL_CONFIG.rainfallBounds.minMm}
          max={MODEL_CONFIG.rainfallBounds.maxMm}
          step="5"
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-800 rounded-sm appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      {/* Reset Button */}
      {isOverridden && (
        <button
          onClick={handleReset}
          className="shrink-0 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-sm text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
          <span>Reset to actual data</span>
        </button>
      )}
    </div>
  );
});

