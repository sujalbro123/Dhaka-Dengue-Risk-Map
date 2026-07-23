import React from 'react';
import { ModelWeights, SimulationModifiers } from '../types';
import { SlidersHorizontal, RotateCcw, CloudRain, Activity, Users, Flame, Info } from 'lucide-react';

interface SimulationControlsProps {
  weights: ModelWeights;
  onChangeWeights: (weights: ModelWeights) => void;
  modifiers: SimulationModifiers;
  onChangeModifiers: (modifiers: SimulationModifiers) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  weights,
  onChangeWeights,
  modifiers,
  onChangeModifiers,
  onReset,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl mb-4 text-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              Interactive Model Simulator & Stress Tester
            </h3>
            <p className="text-xs text-slate-400">
              Adjust environmental drivers or change formula weights to present sensitivity analysis
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Environmental Drivers Sliders */}
        <div className="space-y-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            Environmental & Surge Modifiers
          </div>

          {/* Rainfall Multiplier Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                Rainfall Intensity Multiplier:
              </span>
              <span className="font-mono font-bold text-cyan-400">
                {modifiers.rainfallMultiplier.toFixed(2)}x ({Math.round((modifiers.rainfallMultiplier - 1) * 100)}%)
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2.5"
              step="0.1"
              value={modifiers.rainfallMultiplier}
              onChange={(e) =>
                onChangeModifiers({
                  ...modifiers,
                  rainfallMultiplier: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Dry Drought (0.3x)</span>
              <span>Baseline (1.0x)</span>
              <span>Monsoon Deluge (2.5x)</span>
            </div>
          </div>

          {/* Historical Case Surge Multiplier */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-red-400" />
                Recent Infection Surge Factor:
              </span>
              <span className="font-mono font-bold text-red-400">
                {modifiers.caseMultiplier.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2.5"
              step="0.1"
              value={modifiers.caseMultiplier}
              onChange={(e) =>
                onChangeModifiers({
                  ...modifiers,
                  caseMultiplier: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Low Transmission (0.3x)</span>
              <span>Normal (1.0x)</span>
              <span>Epidemic Spike (2.5x)</span>
            </div>
          </div>
        </div>

        {/* Mathematical Formula Weights */}
        <div className="space-y-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-400" />
            Formula Weight Coefficients (Sum = 1.0)
          </div>

          {/* Cases Weight */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-semibold">Cases Weight (Default 0.50):</span>
              <span className="font-mono font-bold text-blue-400">{weights.casesWeight.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={weights.casesWeight}
              onChange={(e) =>
                onChangeWeights({
                  ...weights,
                  casesWeight: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Rainfall Weight */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-semibold">Rainfall Weight (Default 0.30):</span>
              <span className="font-mono font-bold text-cyan-400">{weights.rainfallWeight.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={weights.rainfallWeight}
              onChange={(e) =>
                onChangeWeights({
                  ...weights,
                  rainfallWeight: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Density Weight */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-semibold">Density Weight (Default 0.20):</span>
              <span className="font-mono font-bold text-purple-400">{weights.densityWeight.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={weights.densityWeight}
              onChange={(e) =>
                onChangeWeights({
                  ...weights,
                  densityWeight: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
