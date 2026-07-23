import React from 'react';
import {
  ShieldAlert,
  Info,
  FileSpreadsheet,
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/dhakaData';

interface HeaderProps {
  selectedScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  onOpenHowItWorks: () => void;
  onOpenCsvModal: () => void;
  onToggleSimControls: () => void;
  isSimControlsOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedScenarioId,
  onSelectScenario,
  onOpenHowItWorks,
  onOpenCsvModal,
  onToggleSimControls,
  isSimControlsOpen,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Dhaka Dengue Risk Map
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <GraduationCap className="w-3.5 h-3.5 mr-1" />
                  Research Poster Demo
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Epidemic Intelligence & Outbreak Risk Prediction Dashboard • Dhaka City Corporations
              </p>
            </div>
          </div>

          {/* Action Bar & Controls */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
            {/* Scenario Selector */}
            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-300">
              <span className="text-slate-400 mr-2 font-medium hidden sm:inline">Scenario:</span>
              <select
                value={selectedScenarioId}
                onChange={(e) => onSelectScenario(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-4"
              >
                {PRESET_SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-800 text-slate-100">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Simulation Slider Toggle */}
            <button
              onClick={onToggleSimControls}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSimControlsOpen
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Simulate</span>
            </button>

            {/* CSV Data Import / Export */}
            <button
              onClick={onOpenCsvModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
              <span>CSV Data</span>
            </button>

            {/* How Formula Works Modal */}
            <button
              onClick={onOpenHowItWorks}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-lg text-xs font-semibold transition-all"
            >
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>How This Works</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
