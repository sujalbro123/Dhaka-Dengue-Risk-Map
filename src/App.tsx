import React, { useState, useMemo, useEffect } from 'react';
import { DhakaArea, ModelWeights, SimulationModifiers, ComputedAreaRisk, SentAlertLog, CommunityReport } from './types';
import { INITIAL_DHAKA_AREAS, PRESET_SCENARIOS, INITIAL_SENT_ALERTS, INITIAL_COMMUNITY_REPORTS } from './data/dhakaData';
import { calculateAreaRisks, DEFAULT_WEIGHTS, DEFAULT_MODIFIERS } from './utils/riskCalculator';
import { MODEL_CONFIG } from './config/appConfig';

import { Header } from './components/Header';
import { SummaryStats } from './components/SummaryStats';
import { DhakaMap } from './components/DhakaMap';
import { AreaListView } from './components/AreaListView';
import { AreaDetailPanel } from './components/AreaDetailPanel';
import { SimulationControls } from './components/SimulationControls';
import { MethodologyPage } from './components/MethodologyPage';
import { ValidationPage } from './components/ValidationPage';
import { CsvDataModal } from './components/CsvDataModal';
import { CriticalRiskToast } from './components/CriticalRiskToast';
import { SmsAlertModal } from './components/SmsAlertModal';
import { ReportCaseModal } from './components/ReportCaseModal';
import { WhatIfRainfallSlider } from './components/WhatIfRainfallSlider';
import { SummaryStatsSkeleton, MapSkeleton, DetailPanelSkeleton } from './components/SkeletonLoader';
import { SectionErrorBoundary } from './components/SectionErrorBoundary';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'methodology' | 'validation'>('dashboard');
  const [areasData, setAreasData] = useState<DhakaArea[]>(INITIAL_DHAKA_AREAS);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('current-jul');
  const [weights, setWeights] = useState<ModelWeights>(DEFAULT_WEIGHTS);
  const [modifiers, setModifiers] = useState<SimulationModifiers>(DEFAULT_MODIFIERS);

  // Loading state when preparing data or switching scenarios
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Requirement E: Year-over-Year Compare Mode state
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);

  // Requirement F: What-if rainfall state
  const [whatIfRainfallMm, setWhatIfRainfallMm] = useState<number | null>(null);

  const [selectedAreaId, setSelectedAreaId] = useState<string | null>('old-dhaka');
  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'table'>('map');

  const [isSimControlsOpen, setIsSimControlsOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);

  // SMS Alert Simulation State
  const [isSmsModalOpen, setIsSmsModalOpen] = useState<boolean>(false);
  const [smsTargetAreaId, setSmsTargetAreaId] = useState<string | undefined>(undefined);
  const [sentAlerts, setSentAlerts] = useState<SentAlertLog[]>(INITIAL_SENT_ALERTS);

  // Community Case Reporting State
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportTargetAreaId, setReportTargetAreaId] = useState<string | undefined>(undefined);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(INITIAL_COMMUNITY_REPORTS);

  // Critical notification toast dismissal state
  const [isCriticalToastDismissed, setIsCriticalToastDismissed] = useState<boolean>(false);

  // Compute average actual rainfall across areas for slider baseline
  const avgActualRainfallMm = useMemo(() => {
    if (areasData.length === 0) return 120;
    const sum = areasData.reduce((acc, a) => acc + a.recentRainfallMm, 0);
    return Math.round(sum / areasData.length);
  }, [areasData]);

  // Combined modifiers including what-if override
  const activeModifiers = useMemo(() => {
    return {
      ...modifiers,
      whatIfRainfallMm,
    };
  }, [modifiers, whatIfRainfallMm]);

  // Compute live risk scores for all areas whenever dataset, weights, or modifiers change
  const computedAreas = useMemo(() => {
    return calculateAreaRisks(areasData, weights, activeModifiers);
  }, [areasData, weights, activeModifiers]);

  // Handle adding new sent alert
  const handleSendAlert = (newAlert: SentAlertLog) => {
    setSentAlerts((prev) => [newAlert, ...prev]);
  };

  // Handle submitting community report
  const handleSubmitCommunityReport = (newReport: CommunityReport) => {
    setCommunityReports((prev) => [newReport, ...prev]);
    // Increment crowdsourced reports in state for this area
    setAreasData((prevAreas) =>
      prevAreas.map((area) =>
        area.id === newReport.areaId
          ? { ...area, crowdsourcedReports: (area.crowdsourcedReports || 0) + 1 }
          : area
      )
    );
  };

  const handleOpenSmsModal = (areaId?: string) => {
    setSmsTargetAreaId(areaId || selectedAreaId || undefined);
    setIsSmsModalOpen(true);
  };

  const handleOpenReportModal = (areaId?: string) => {
    setReportTargetAreaId(areaId || selectedAreaId || undefined);
    setIsReportModalOpen(true);
  };

  // Identify areas that hit or exceed critical risk threshold (score >= 80 or raw >= 0.80)
  const criticalAreas = useMemo(() => {
    return computedAreas.filter((a) => a.rawRiskScore >= 0.80 || a.riskScore100 >= 80 || a.riskLevel === 'critical');
  }, [computedAreas]);

  // Reset toast dismissal whenever simulation parameters or scenarios change
  useEffect(() => {
    if (criticalAreas.length > 0) {
      setIsCriticalToastDismissed(false);
    }
  }, [weights, modifiers, selectedScenarioId, areasData]);

  // Selected area object
  const selectedArea = useMemo(() => {
    if (!selectedAreaId) return computedAreas[0] || null;
    return computedAreas.find((a) => a.id === selectedAreaId) || computedAreas[0] || null;
  }, [computedAreas, selectedAreaId]);

  // Handle Preset Scenario change
  const handleSelectScenario = (scenarioId: string) => {
    setIsLoading(true);
    setSelectedScenarioId(scenarioId);
    const scenario = PRESET_SCENARIOS.find((s) => s.id === scenarioId);
    if (scenario) {
      setModifiers(scenario.modifiers);
    }
    setIsCriticalToastDismissed(false);
    setTimeout(() => setIsLoading(false), MODEL_CONFIG.simulationDelayMs);
  };

  // Reset Simulation Modifiers & Weights
  const handleResetSimulation = () => {
    setIsLoading(true);
    setWeights(DEFAULT_WEIGHTS);
    setModifiers(DEFAULT_MODIFIERS);
    setSelectedScenarioId('current-jul');
    setIsCriticalToastDismissed(false);
    setTimeout(() => setIsLoading(false), MODEL_CONFIG.simulationDelayMs);
  };

  // Import custom CSV data
  const handleImportCustomData = (importedRows: Partial<DhakaArea>[]) => {
    if (importedRows.length === 0) return;
    setIsLoading(true);

    // Map imported rows into DhakaArea structure
    const updatedAreas: DhakaArea[] = importedRows.map((row, idx) => {
      const existing = INITIAL_DHAKA_AREAS[idx % INITIAL_DHAKA_AREAS.length];
      return {
        ...existing,
        id: row.name ? row.name.toLowerCase().replace(/\s+/g, '-') : existing.id,
        name: row.name || existing.name,
        recentCases30d: row.recentCases30d ?? existing.recentCases30d,
        recentRainfallMm: row.recentRainfallMm ?? existing.recentRainfallMm,
        populationDensity: row.populationDensity ?? existing.populationDensity,
      };
    });

    setAreasData(updatedAreas);
    setIsCriticalToastDismissed(false);
    if (updatedAreas.length > 0) {
      setSelectedAreaId(updatedAreas[0].id);
    }
    setTimeout(() => setIsLoading(false), MODEL_CONFIG.simulationDelayMs);
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* App Header */}
      <SectionErrorBoundary title="Header Navigation Error">
        <Header
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          selectedScenarioId={selectedScenarioId}
          onSelectScenario={handleSelectScenario}
          onOpenCsvModal={() => setIsCsvModalOpen(true)}
          onToggleSimControls={() => setIsSimControlsOpen((prev) => !prev)}
          isSimControlsOpen={isSimControlsOpen}
          onOpenSmsAlert={() => handleOpenSmsModal()}
          onOpenReportCase={() => handleOpenReportModal()}
          sentAlertsCount={sentAlerts.length}
        />
      </SectionErrorBoundary>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col">
        {activeTab === 'methodology' ? (
          <SectionErrorBoundary title="Methodology Section Error">
            <MethodologyPage onBackToDashboard={() => setActiveTab('dashboard')} />
          </SectionErrorBoundary>
        ) : activeTab === 'validation' ? (
          <SectionErrorBoundary title="Formula Validation Section Error">
            <ValidationPage onBackToDashboard={() => setActiveTab('dashboard')} />
          </SectionErrorBoundary>
        ) : (
          <>
            {/* City Summary Stats KPI Bar */}
            <SectionErrorBoundary title="Summary Statistics Error">
              {isLoading ? <SummaryStatsSkeleton /> : <SummaryStats computedAreas={computedAreas} />}
            </SectionErrorBoundary>

            {/* What-If Rainfall Slider (Requirement F) */}
            <div className="mb-4">
              <SectionErrorBoundary title="Rainfall Simulator Error">
                <WhatIfRainfallSlider
                  whatIfRainfallMm={whatIfRainfallMm}
                  onChangeWhatIfRainfall={setWhatIfRainfallMm}
                  avgActualRainfallMm={avgActualRainfallMm}
                />
              </SectionErrorBoundary>
            </div>

            {/* Interactive Model Simulation Sliders (Collapsible) */}
            <SectionErrorBoundary title="Simulation Controls Error">
              <SimulationControls
                weights={weights}
                onChangeWeights={(w) => {
                  setWeights(w);
                  setIsCriticalToastDismissed(false);
                }}
                modifiers={modifiers}
                onChangeModifiers={(m) => {
                  setModifiers(m);
                  setIsCriticalToastDismissed(false);
                }}
                onReset={handleResetSimulation}
                isOpen={isSimControlsOpen}
                onClose={() => setIsSimControlsOpen(false)}
              />
            </SectionErrorBoundary>

            {/* Main Content Split Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start flex-1">
                <div className="lg:col-span-7 xl:col-span-7 h-full flex flex-col">
                  <MapSkeleton />
                </div>
                <div className="lg:col-span-5 xl:col-span-5 h-full">
                  <DetailPanelSkeleton />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start flex-1">
                {/* Left Column: Interactive Map / Card Grid / Ranked Table */}
                <div className="lg:col-span-7 xl:col-span-7 h-full flex flex-col">
                  <SectionErrorBoundary title="Map & Directory View Error">
                    {viewMode === 'map' ? (
                      <DhakaMap
                        areas={computedAreas}
                        selectedAreaId={selectedAreaId}
                        onSelectArea={(area) => setSelectedAreaId(area.id)}
                        viewMode={viewMode}
                        onChangeViewMode={setViewMode}
                        onOpenSmsAlert={(id) => handleOpenSmsModal(id)}
                        isCompareMode={isCompareMode}
                        onToggleCompareMode={() => setIsCompareMode((prev) => !prev)}
                      />
                    ) : (
                      <div className="bg-[#0f1218] border border-slate-800 rounded-2xl p-4 shadow-xl flex-1 flex flex-col">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <h2 className="text-base font-bold text-white">
                            Dhaka thana outbreak directory
                          </h2>
                          <div className="flex items-center bg-[#1a1f26] p-1 rounded-xl border border-slate-700">
                            <button
                              onClick={() => setViewMode('map')}
                              className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white"
                            >
                              Map view
                            </button>
                            <button
                              onClick={() => setViewMode('grid')}
                              className={`px-3 py-1 text-xs font-bold rounded-lg ${
                                viewMode === 'grid' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
                              }`}
                            >
                              Cards
                            </button>
                            <button
                              onClick={() => setViewMode('table')}
                              className={`px-3 py-1 text-xs font-bold rounded-lg ${
                                viewMode === 'table' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
                              }`}
                            >
                              Table
                            </button>
                          </div>
                        </div>

                        <AreaListView
                          areas={computedAreas}
                          selectedAreaId={selectedAreaId}
                          onSelectArea={(area) => setSelectedAreaId(area.id)}
                          viewMode={viewMode}
                        />
                      </div>
                    )}
                  </SectionErrorBoundary>
                </div>

                {/* Right Column: Selected Area Intelligence Panel */}
                <div className="lg:col-span-5 xl:col-span-5 h-full">
                  <SectionErrorBoundary title="Area Intelligence Panel Error">
                    <AreaDetailPanel
                      area={selectedArea}
                      onOpenSmsAlert={(id) => handleOpenSmsModal(id)}
                      onOpenReportCase={(id) => handleOpenReportModal(id)}
                    />
                  </SectionErrorBoundary>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Critical Threat Visual Notification Toast */}
      <CriticalRiskToast
        criticalAreas={criticalAreas}
        isVisible={!isCriticalToastDismissed && criticalAreas.length > 0}
        onDismiss={() => setIsCriticalToastDismissed(true)}
        onSelectArea={(areaId) => {
          setActiveTab('dashboard');
          setSelectedAreaId(areaId);
        }}
      />

      {/* Footer / Academic Citation */}
      <footer className="border-t border-slate-800/80 bg-[#0f1218]/80 py-4 mt-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Dhaka dengue early warning model v1.2 • Research prototype
          </div>
          <div className="text-slate-400">
            Data sources: DGHS surveillance, Bangladesh Meteorological Department (BMD), BBS census
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CsvDataModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        computedAreas={computedAreas}
        onImportCustomData={handleImportCustomData}
      />

      <SmsAlertModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        areas={computedAreas}
        initialAreaId={smsTargetAreaId}
        onSendAlert={handleSendAlert}
        sentAlerts={sentAlerts}
      />

      <ReportCaseModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        areas={computedAreas}
        initialAreaId={reportTargetAreaId}
        onSubmitReport={handleSubmitCommunityReport}
      />
    </div>
  );
}
