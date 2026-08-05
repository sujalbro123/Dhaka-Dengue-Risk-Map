import React, { useState } from 'react';
import {
  ShieldAlert,
  BookOpen,
  MapPin,
  FileSpreadsheet,
  SlidersHorizontal,
  BellRing,
  UserPlus,
  Menu,
  X,
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/dhakaData';
import { APP_METADATA } from '../config/appConfig';

interface HeaderProps {
  activeTab: 'dashboard' | 'methodology';
  onSelectTab: (tab: 'dashboard' | 'methodology') => void;
  selectedScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  onOpenCsvModal: () => void;
  onToggleSimControls: () => void;
  isSimControlsOpen: boolean;
  onOpenSmsAlert: () => void;
  onOpenReportCase: () => void;
  sentAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  selectedScenarioId,
  onSelectScenario,
  onOpenCsvModal,
  onToggleSimControls,
  isSimControlsOpen,
  onOpenSmsAlert,
  onOpenReportCase,
  sentAlertsCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-[#E3E1DA]/20 text-slate-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="p-2 bg-red-950/40 border border-red-500/40 rounded text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  {APP_METADATA.name}
                </h1>
                <span className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider hidden sm:inline">
                  {APP_METADATA.tagline}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {APP_METADATA.subtitle}
              </p>
            </div>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-2 rounded-sm bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop Navigation Tabs & Actions (Visible on lg screens and up) */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {/* Top Navigation Tabs */}
            <nav className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-sm">
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-[#1F3A5F] text-white border border-[#E3E1DA]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Risk map & dashboard</span>
              </button>
              <button
                onClick={() => onSelectTab('methodology')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors ${
                  activeTab === 'methodology'
                    ? 'bg-[#1F3A5F] text-white border border-[#E3E1DA]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Methodology & data sources</span>
              </button>
            </nav>

            {/* Action Bar & Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Simulate SMS Alert Button */}
              <button
                onClick={onOpenSmsAlert}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F3A5F] hover:bg-[#152843] text-white border border-[#E3E1DA]/30 rounded-sm text-xs font-semibold transition-colors"
              >
                <BellRing className="w-4 h-4 text-white" />
                <span>Simulate SMS alert</span>
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
                <span>Report case</span>
              </button>

              {/* Scenario Selector */}
              <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-sm px-2.5 py-1 text-xs text-slate-300">
                <span className="text-slate-400 mr-2 font-medium">Scenario:</span>
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
                <span>CSV data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Mobile Menu Drawer (Visible when toggled on mobile / tablet < lg) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 space-y-3">
            {/* Navigation Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 border border-slate-800 rounded-sm">
              <button
                onClick={() => {
                  onSelectTab('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm text-xs font-semibold transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-[#1F3A5F] text-white border border-[#E3E1DA]/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('methodology');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm text-xs font-semibold transition-colors ${
                  activeTab === 'methodology'
                    ? 'bg-[#1F3A5F] text-white border border-[#E3E1DA]/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Methodology</span>
              </button>
            </div>

            {/* Scenario Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Epidemic Scenario
              </label>
              <select
                value={selectedScenarioId}
                onChange={(e) => {
                  onSelectScenario(e.target.value);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-sm px-3 py-2 text-xs font-semibold focus:outline-none"
              >
                {PRESET_SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-800 text-slate-100">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenSmsAlert();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1F3A5F] hover:bg-[#152843] text-white border border-[#E3E1DA]/30 rounded-sm text-xs font-semibold"
              >
                <BellRing className="w-4 h-4 text-white" />
                <span>SMS Alert</span>
                {sentAlertsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-red-600 text-white rounded-sm text-[10px]">
                    {sentAlertsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  onOpenReportCase();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1F3A5F] hover:bg-[#152843] text-white border border-[#E3E1DA]/30 rounded-sm text-xs font-semibold"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span>Report Case</span>
              </button>

              <button
                onClick={() => {
                  onToggleSimControls();
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm text-xs font-semibold border ${
                  isSimControlsOpen
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-200" />
                <span>Simulate</span>
              </button>

              <button
                onClick={() => {
                  onOpenCsvModal();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-sm text-xs font-semibold"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-300" />
                <span>CSV Data</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
