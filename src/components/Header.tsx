import React from 'react';
import {
  ShieldAlert,
  Info,
  FileSpreadsheet,
  SlidersHorizontal,
  GraduationCap,
  BellRing,
  UserPlus,
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/dhakaData';

interface HeaderProps {
  selectedScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  onOpenHowItWorks: () => void;
  onOpenCsvModal: () => void;
  onToggleSimControls: () => void;
  isSimControlsOpen: boolean;
  onOpenSmsAlert: () => void;
  onOpenReportCase: () => void;
  sentAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedScenarioId,
  onSelectScenario,
  onOpenHowItWorks,
  onOpenCsvModal,
  onToggleSimControls,
  isSimControlsOpen,
  onOpenSmsAlert,
  onOpenReportCase,
  sentAlertsCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-[#E3E1DA]/20 text-slate-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Brand Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-950/40 border border-red-500/40 rounded text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  DDRM — Dhaka Dengue Risk Map
                </h1>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Research Poster Demo
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Epidemic Intelligence & Outbreak Risk Prediction Dashboard • Dhaka City Corporations
              </p>
            </div>
          </div>

          {/* Action Bar & Controls */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Simulate SMS Alert Button */}
            <button
              onClick={onOpenSmsAlert}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F3A5F] hover:bg-[#152843] text-white border border-[#E3E1DA]/30 rounded-sm text-xs font-semibold transition-colors"
            >
              <BellRing className="w-4 h-4 text-white" />
              <span>Simulate SMS Alert</span>
              {sentAlertsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-red-600 text-white rounded-sm text-[10px]">
                  {sentAlertsCount}
                </span>
              )}
            </button>

            {/* Report Suspected Case Button */}
            <button
              onClick={onOpenReportCase}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F3A5F] hover:bg-[#152843] text-white border border-[#E3E1DA]/30 rounded-sm text-xs font-semibold transition-colors"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>Report Case</span>
            </button>

            {/* Scenario Selector */}
            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-sm px-2.5 py-1 text-xs text-slate-300">
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                isSimControlsOpen
                  ? 'bg-amber-600 text-white font-semibold border border-amber-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-200" />
              <span>Simulate</span>
            </button>

            {/* CSV Data Import / Export */}
            <button
              onClick={onOpenCsvModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-sm text-xs font-medium transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-300" />
              <span>CSV Data</span>
            </button>

            {/* How Formula Works Modal */}
            <button
              onClick={onOpenHowItWorks}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-sm text-xs font-semibold transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-slate-300" />
              <span>How This Works</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
