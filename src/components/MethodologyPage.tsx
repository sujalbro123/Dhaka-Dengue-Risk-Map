import React from 'react';
import {
  BookOpen,
  Calculator,
  Database,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Droplets,
  Users,
  ShieldAlert,
  HelpCircle,
  Building2,
  CloudRain,
  Activity,
  Layers,
  FileCheck2,
  Target,
  Sparkles,
} from 'lucide-react';

interface MethodologyPageProps {
  onBackToDashboard: () => void;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({ onBackToDashboard }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* Top Banner & Navigation Header */}
      <div className="bg-slate-900 border border-[#E3E1DA]/20 rounded-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Academic Methodology & Model Specification</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Methodology & Data Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Mathematical formulation, min-max normalization, factor weighting rationale, data provenance breakdown, and methodological limitations of the Dhaka Dengue Risk Map (DDRM).
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-4 py-2 bg-[#1F3A5F] hover:bg-[#152843] text-white border border-[#E3E1DA]/30 rounded-sm text-xs font-bold transition-colors shrink-0 self-start md:self-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to risk map</span>
        </button>
      </div>

      {/* Section 1: Mathematical Formula & Parameter Weighting */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <div className="p-1.5 bg-blue-500/10 border border-blue-500/30 rounded text-blue-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              1. Multi-Factor Dengue Risk Model & Weighting Rationale
            </h2>
            <p className="text-xs text-slate-400">
              Multi-factor linear index normalized on a standardized scale
            </p>
          </div>
        </div>

        {/* Math Display Box */}
        <div className="bg-slate-950 p-4 sm:p-5 rounded-sm border border-slate-800 text-center font-mono space-y-3">
          <div className="text-slate-400 text-xs uppercase tracking-wider font-sans font-bold">
            Primary Relative Risk Score Equation
          </div>
          <div className="text-amber-400 font-bold text-base sm:text-lg tracking-tight overflow-x-auto py-1">
            Risk Score = 100 × (0.50 × C<sub>norm</sub> + 0.30 × R<sub>norm</sub> + 0.20 × D<sub>norm</sub>)
          </div>
          <div className="text-xs text-slate-400 font-sans max-w-2xl mx-auto leading-relaxed">
            Where <strong className="text-slate-200">C<sub>norm</sub></strong> represents min-max normalized recent dengue cases, <strong className="text-slate-200">R<sub>norm</sub></strong> represents min-max normalized recent rainfall, and <strong className="text-slate-200">D<sub>norm</sub></strong> represents min-max normalized population density.
          </div>
          <div className="text-[11px] text-amber-300/90 bg-amber-950/40 p-2 rounded border border-amber-500/30 font-sans max-w-2xl mx-auto">
            <strong>Parameter Declaration:</strong> The 50/30/20 weights are <em>expert-defined prototype parameters</em> designed to reflect epidemiological risk priorities. They are not machine-learned or statistically calibrated.
          </div>
        </div>

        {/* Feature Normalization Details */}
        <div className="bg-slate-950/60 p-4 rounded-sm border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            Min-Max Feature Normalization Specification
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To combine metrics across disparate measurement units (case counts, rainfall depth in mm, and population density per km²), each raw variable <i>X</i> is scaled onto a standardized continuous range from 0.0 to 1.0 using min-max normalization prior to weighting:
          </p>
          <div className="bg-slate-950 p-2.5 rounded-sm border border-slate-800 text-center font-mono text-emerald-400 text-xs">
            X<sub>norm</sub> = (X − X<sub>min</sub>) / (X<sub>max</sub> − X<sub>min</sub>)
          </div>
          <p className="text-[11px] text-slate-400">
            Minima and maxima are calculated dynamically across all monitored study areas for the active dataset to maintain relative spatial sensitivity.
          </p>
        </div>

        {/* Relative Risk Index Disclosure & Classification Thresholds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 space-y-2 text-xs">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Relative Risk Index Disclosure
            </h3>
            <p className="text-slate-300 leading-relaxed">
              The output score (0–100) represents a <strong>relative spatial risk index</strong> comparing infection vulnerability across city thanas. It does <em>not</em> represent a direct mathematical probability of viral infection or an absolute case forecast.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 space-y-2 text-xs">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-400" />
              Risk Classification Thresholds
            </h3>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="bg-slate-900 p-1.5 rounded border border-emerald-500/40 text-emerald-300">
                0 – 34: <strong>LOW RISK</strong>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-yellow-500/40 text-yellow-300">
                35 – 59: <strong>MODERATE RISK</strong>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-amber-500/40 text-amber-300">
                60 – 79: <strong>HIGH RISK</strong>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-rose-500/40 text-rose-300">
                80 – 100: <strong>CRITICAL THREAT</strong>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Note: The 400 reported cases/area-month threshold used in the Validation view is a separate operational cutoff for high-surge classification, distinct from the 0–100 risk score.
            </p>
          </div>
        </div>

        {/* Factor Weighting Rationale */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Factor Weighting Explanations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Historical Cases Card */}
            <div className="bg-slate-950 p-4 rounded-sm border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  Historical Dengue Cases
                </span>
                <span className="text-xs font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-sm">
                  50% Weight
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-slate-100">Epidemiological basis:</strong> Quantifies the active human viral reservoir (DENV-1 through DENV-4 serotypes) and existing transmission loops.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Rationale:</strong> Where active dengue cases are already present, vector mosquitoes are far more likely to pick up the virus and infect nearby residents. Existing case load is the strongest single predictor of short-term outbreak continuation.
              </p>
            </div>

            {/* Rainfall Card */}
            <div className="bg-slate-950 p-4 rounded-sm border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4" />
                  Recent Rainfall
                </span>
                <span className="text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-sm">
                  30% Weight
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-slate-100">Epidemiological basis:</strong> Key environmental driver providing aquatic breeding habitats for <i>Aedes aegypti</i> and <i>Aedes albopictus</i> oviposition.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Rationale:</strong> Stagnant rainwater in unsealed outdoor containers, plastic debris, and blocked drains accelerates egg hatching. Peak vector biting density typically follows 7 to 14 days after heavy precipitation.
              </p>
            </div>

            {/* Population Density Card */}
            <div className="bg-slate-950 p-4 rounded-sm border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Population Density
                </span>
                <span className="text-xs font-mono font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-sm">
                  20% Weight
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-slate-100">Epidemiological basis:</strong> Determines human host availability per unit area (people/km²), directly impacting contact rate and transmission potential.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Rationale:</strong> Female <i>Aedes</i> mosquitoes have short flight ranges (often under 100 meters). Densely populated urban neighborhoods allow mosquitoes to bite multiple hosts in close proximity, accelerating viral spread.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Distinguishing Two System Parts */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              2. Distinction Between System Functions
            </h2>
            <p className="text-xs text-slate-400">
              Clear separation between the primary interactive map and the chronological validation framework
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-500/40 rounded font-mono font-bold text-[10px] uppercase">
              System Part A: Interactive Risk Map
            </span>
            <h3 className="font-bold text-white text-sm">Current Multi-Factor Risk Assessment</h3>
            <p className="text-slate-300 leading-relaxed">
              Provides real-time spatial visualization of relative dengue risk across Dhaka thanas using current or recent dengue surveillance, station rainfall, and population density inputs.
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Purpose:</strong> Operational situational awareness and resource prioritization for municipal health officers.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded font-mono font-bold text-[10px] uppercase">
              System Part B: Chronological Backtesting
            </span>
            <h3 className="font-bold text-white text-sm">Temporal Early-Warning Evaluation</h3>
            <p className="text-slate-300 leading-relaxed">
              Evaluates model early-warning accuracy by testing whether historical inputs at period <i>t-1</i> predict observed dengue outbreaks at period <i>t</i> on held-out test data.
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Purpose:</strong> Rigorous out-of-sample scientific validation while strictly preventing target data leakage.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Data Sources & Provenance */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              3. Attributed Data Sources & Provenance (Research vs. Demo Mode)
            </h2>
            <p className="text-xs text-slate-400">
              Transparent lineage for official health surveillance, meteorological records, census figures, and synthetic scenario data
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Data Category / Institution</th>
                <th className="p-3">Attributed Source & Details</th>
                <th className="p-3">Verification Status</th>
                <th className="p-3">Role & Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr className="bg-slate-900/40 hover:bg-slate-800/30">
                <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                  DGHS Surveillance Data
                </td>
                <td className="p-3 text-slate-300">
                  Directorate General of Health Services press bulletins & EPI microplanning documents (2023–2024).
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-sm font-semibold text-[10px]">
                    Partially Verified
                  </span>
                </td>
                <td className="p-3 text-slate-400">
                  Provides observed hospital admission records per thana for research-mode risk mapping and temporal validation.
                </td>
              </tr>

              <tr className="bg-slate-900/40 hover:bg-slate-800/30">
                <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-cyan-400 shrink-0" />
                  BMD Rainfall Records
                </td>
                <td className="p-3 text-slate-300">
                  Bangladesh Meteorological Department, Agargaon Station (Station ID: 41923).
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-sm font-semibold text-[10px]">
                    Partially Verified (Station Proxy)
                  </span>
                </td>
                <td className="p-3 text-slate-400">
                  Serves as a regional surface precipitation proxy mapped across study thanas. Sub-thana microclimatic rain varies.
                </td>
              </tr>

              <tr className="bg-slate-900/40 hover:bg-slate-800/30">
                <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  BBS Population Census
                </td>
                <td className="p-3 text-slate-300">
                  Bangladesh Bureau of Statistics (BBS) 2022 Census & 2024 Microplanning estimates.
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-sm font-semibold text-[10px]">
                    Partially Verified
                  </span>
                </td>
                <td className="p-3 text-slate-400">
                  Official population counts and land area (km²) used to compute population density per thana.
                </td>
              </tr>

              <tr className="bg-slate-900/40 hover:bg-slate-800/30">
                <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-400 shrink-0" />
                  Demo / Synthetic Dataset
                </td>
                <td className="p-3 text-slate-300">
                  Interactive scenario values & what-if parameter modifiers.
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-sm font-semibold text-[10px]">
                    Simulated / Scenario Data
                  </span>
                </td>
                <td className="p-3 text-slate-400">
                  Used exclusively in Demo Mode for UI stress-testing, custom what-if rainfall simulations, and offline previewing.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Limitations & Future Work */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              4. Methodological Limitations & Future Scope
            </h2>
            <p className="text-xs text-slate-400">
              Factual assessment of boundaries and roadmap for operational deployment
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          {/* Limitations Box */}
          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 space-y-2">
            <h3 className="font-bold text-amber-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              Current Research Limitations
            </h3>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside leading-relaxed">
              <li>
                <strong>Limited Verified Sample Size:</strong> Current historical validation is based on available 2023–2024 records, representing a pilot evaluation.
              </li>
              <li>
                <strong>Regional Rainfall Proxy:</strong> BMD precipitation from Agargaon Station 41923 is applied city-wide; sub-thana microclimatic rain is not gauged.
              </li>
              <li>
                <strong>Uncalibrated Expert Weights:</strong> The 50/30/20 model parameters reflect expert consensus rather than statistical optimization.
              </li>
              <li>
                <strong>Unobserved Vector Metrics:</strong> Real-time House Index (HI), Container Index (CI), and Breteau Index (BI) larval surveys are not yet digitized per thana.
              </li>
            </ul>
          </div>

          {/* Future Scope Box */}
          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 space-y-2">
            <h3 className="font-bold text-emerald-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Future Roadmap & Technical Improvements
            </h3>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside leading-relaxed">
              <li>
                <strong>Multi-Year Dataset Expansion:</strong> Ingesting additional digitized multi-year DGHS historical records for expanded statistical validation.
              </li>
              <li>
                <strong>Meteorological Expansion:</strong> Integrating ambient temperature, relative humidity, and micro-elevation features.
              </li>
              <li>
                <strong>Empirical Weight Optimization:</strong> Applying regression or machine-learning calibration to optimize factor weights dynamically.
              </li>
              <li>
                <strong>Ward-Level Spatial Resolution:</strong> Transitioning from thana-level to ward-level spatial granularity as digitized municipal data becomes available.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Academic Citation Footer Note */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Dhaka Dengue Risk Map (DDRM) • Research-ready prototype for city vector management support.
          </span>
        </div>
        <button
          onClick={onBackToDashboard}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline shrink-0"
        >
          Return to interactive risk map →
        </button>
      </div>
    </div>
  );
};

