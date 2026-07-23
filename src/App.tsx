import React, { useState, useMemo } from 'react';
import { DhakaArea, ModelWeights, SimulationModifiers, ComputedAreaRisk } from './types';
import { INITIAL_DHAKA_AREAS, PRESET_SCENARIOS } from './data/dhakaData';
import { calculateAreaRisks, DEFAULT_WEIGHTS, DEFAULT_MODIFIERS } from './utils/riskCalculator';

import { Header } from './components/Header';
import { SummaryStats } from './components/SummaryStats';
import { DhakaMap } from './components/DhakaMap';
import { AreaListView } from './components/AreaListView';
import { AreaDetailPanel } from './components/AreaDetailPanel';
import { SimulationControls } from './components/SimulationControls';
import { HowItWorksModal } from './components/HowItWorksModal';
import { CsvDataModal } from './components/CsvDataModal';

export default function App() {
  const [areasData, setAreasData] = useState<DhakaArea[]>(INITIAL_DHAKA_AREAS);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('current-jul');
  const [weights, setWeights] = useState<ModelWeights>(DEFAULT_WEIGHTS);
  const [modifiers, setModifiers] = useState<SimulationModifiers>(DEFAULT_MODIFIERS);

  const [selectedAreaId, setSelectedAreaId] = useState<string | null>('old-dhaka');
  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'table'>('map');

  const [isSimControlsOpen, setIsSimControlsOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);

  // Compute live risk scores for all areas whenever dataset, weights, or modifiers change
  const computedAreas = useMemo(() => {
    return calculateAreaRisks(areasData, weights, modifiers);
  }, [areasData, weights, modifiers]);

  // Selected area object
  const selectedArea = useMemo(() => {
    if (!selectedAreaId) return computedAreas[0] || null;
    return computedAreas.find((a) => a.id === selectedAreaId) || computedAreas[0] || null;
  }, [computedAreas, selectedAreaId]);

  // Handle Preset Scenario change
  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    const scenario = PRESET_SCENARIOS.find((s) => s.id === scenarioId);
    if (scenario) {
      setModifiers(scenario.modifiers);
    }
  };

  // Reset Simulation Modifiers & Weights
  const handleResetSimulation = () => {
    setWeights(DEFAULT_WEIGHTS);
    setModifiers(DEFAULT_MODIFIERS);
    setSelectedScenarioId('current-jul');
  };

  // Import custom CSV data
  const handleImportCustomData = (importedRows: Partial<DhakaArea>[]) => {
    if (importedRows.length === 0) return;

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
    if (updatedAreas.length > 0) {
      setSelectedAreaId(updatedAreas[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* App Header */}
      <Header
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={handleSelectScenario}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onToggleSimControls={() => setIsSimControlsOpen((prev) => !prev)}
        isSimControlsOpen={isSimControlsOpen}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col">
        {/* City Summary Stats KPI Bar */}
        <SummaryStats computedAreas={computedAreas} />

        {/* Interactive Model Simulation Sliders (Collapsible) */}
        <SimulationControls
          weights={weights}
          onChangeWeights={setWeights}
          modifiers={modifiers}
          onChangeModifiers={setModifiers}
          onReset={handleResetSimulation}
          isOpen={isSimControlsOpen}
          onClose={() => setIsSimControlsOpen(false)}
        />

        {/* Main Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start flex-1">
          {/* Left Column: Interactive Map / Card Grid / Ranked Table */}
          <div className="lg:col-span-7 xl:col-span-7 h-full flex flex-col">
            {viewMode === 'map' ? (
              <DhakaMap
                areas={computedAreas}
                selectedAreaId={selectedAreaId}
                onSelectArea={(area) => setSelectedAreaId(area.id)}
                viewMode={viewMode}
                onChangeViewMode={setViewMode}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex-1 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white">
                    Dhaka Thana Outbreak Directory
                  </h2>
                  <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
                    <button
                      onClick={() => setViewMode('map')}
                      className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white"
                    >
                      Map View
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
          </div>

          {/* Right Column: Selected Area Intelligence Panel */}
          <div className="lg:col-span-5 xl:col-span-5 h-full">
            <AreaDetailPanel area={selectedArea} />
          </div>
        </div>
      </main>

      {/* Footer / Academic Citation */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 mt-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Dhaka Dengue Early Warning Intelligence Model v1.2 • University Poster Competition Prototype
          </div>
          <div className="text-slate-400">
            Data Sources: DGHS Surveillance, Bangladesh Meteorological Department (BMD), BBS Census
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <CsvDataModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        computedAreas={computedAreas}
        onImportCustomData={handleImportCustomData}
      />
    </div>
  );
}
