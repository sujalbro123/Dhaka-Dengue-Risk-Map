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
            <span>Academic Documentation & Model Specification</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Methodology & Data Sources
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Mathematical formulation, factor weighting rationale, data lineage breakdown, and methodological limitations of the Dhaka Dengue Risk Intelligence Model (v1.2).
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
              1. Epidemiological Risk Model & Weighting Rationale
            </h2>
            <p className="text-xs text-slate-400">
              Multi-factor linear index normalized on a standardized scale
            </p>
          </div>
        </div>

        {/* Math Display Box */}
        <div className="bg-slate-950 p-4 sm:p-5 rounded-sm border border-slate-800 text-center font-mono space-y-3">
          <div className="text-slate-400 text-xs uppercase tracking-wider font-sans">
            Primary Area Risk Index Equation
          </div>
          <div className="text-amber-400 font-bold text-base sm:text-lg tracking-tight overflow-x-auto py-1">
            Risk Score = (0.50 × C<sub>norm</sub>) + (0.30 × R<sub>norm</sub>) + (0.20 × D<sub>norm</sub>)
          </div>
          <div className="text-xs text-slate-400 font-sans max-w-2xl mx-auto leading-relaxed">
            Where <strong className="text-slate-200">C<sub>norm</sub></strong> represents 30-day historical cases, <strong className="text-slate-200">R<sub>norm</sub></strong> represents recent cumulative rainfall, and <strong className="text-slate-200">D<sub>norm</sub></strong> represents population density.
          </div>
        </div>

        {/* Feature Normalization Details */}
        <div className="bg-slate-950/60 p-4 rounded-sm border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            Min-Max Feature Normalization Specification
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To combine metrics across disparate measurement units (case tallies, precipitation depth in millimeters, and population density per square kilometer), each raw metric <i>X</i> is scaled onto a standardized continuous range from 0.0 to 1.0 using min-max normalization:
          </p>
          <div className="bg-slate-950 p-2.5 rounded-sm border border-slate-800 text-center font-mono text-emerald-400 text-xs">
            X<sub>norm</sub> = (X − X<sub>min</sub>) / (X<sub>max</sub> − X<sub>min</sub>)
          </div>
          <p className="text-[11px] text-slate-400">
            Minima and maxima are calculated dynamically across all 12 monitored Dhaka City Corporation thanas to ensure relative spatial sensitivity.
          </p>
        </div>

        {/* Plain Language & Academic Weight Rationale */}
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
                  Historical Cases
                </span>
                <span className="text-xs font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-sm">
                  50% Weight
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-slate-100">Epidemiological basis:</strong> Quantifies the active human viral reservoir (DENV-1 through DENV-4 serotypes) and existing transmission loops.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Plain-language reasoning:</strong> Where active dengue cases are already present, mosquitoes are far more likely to pick up the virus and infect nearby residents. Existing case load is the strongest single predictor of short-term outbreak continuation.
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
                <strong className="text-slate-100">Epidemiological basis:</strong> Serves as the key environmental driver providing aquatic breeding habitats for <i>Aedes aegypti</i> and <i>Aedes albopictus</i> oviposition.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Plain-language reasoning:</strong> Stagnant rainwater in unsealed outdoor containers, plastic debris, and blocked drains accelerates mosquito egg hatching. Peak biting density typically follows 7 to 10 days after heavy precipitation.
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
                <strong className="text-slate-100">Epidemiological basis:</strong> Determines human host availability per unit area (people/km²), directly impacting the basic reproduction number (R₀) and contact rate.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Plain-language reasoning:</strong> Female <i>Aedes</i> mosquitoes have short flight ranges (often under 100 meters). Densely populated urban neighborhoods allow mosquitoes to bite multiple people in close proximity, speeding up virus spread.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Data Sources & Provenance */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              2. Data Sources & Provenance (Authentic vs. Prototype Mock Data)
            </h2>
            <p className="text-xs text-slate-400">
              Clear distinction between institutional real data structures and prototype simulated datasets
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Data Category / Institution</th>
                <th className="p-3">Real Institutional Structure</th>
                <th className="p-3">Prototype Data Status</th>
                <th className="p-3">Data Characteristics & Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr className="bg-slate-900/40 hover:bg-slate-800/30">
                <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                  DGHS (Directorate General of Health Services)
                </td>
                <td className="p-3 text-slate-300">
                  Official 12 Dhaka thana administrative zones, hospital surveillance metrics, Breteau Index categories.
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-sm font-semibold text-[10px]">
                    Calibrated Mock Data
                  </span>
                </td>
                <td className="p-3 text-slate-400">
                  Case numbers, Breteau Indices, and hospital bed counts reflect realistic monsoonal outbreak distributions for research demonstration.
                </td>
              </tr>

              <tr className="bg-slate-900/40 hover:bg-slate-800/30">
                <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-cyan-400 shrink-0" />
                  BMD (Bangladesh Meteorological Dept)
                </td>
                <td className="p-3 text-slate-300">
                  Monthly rainfall accumulation (mm), surface temperatures (°C), wind vectors.
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-sm font-semibold text-[10px]">
                    Simulated Weather Profiles
                  </span>
                </td>
                <td className="p-3 text-slate-400">
                  Rainfall figures align with Dhaka's monsoon climatology (July averages), simulated per thana for sensitivity testing.
                </td>
              </tr>

              <tr className="bg-slate-900/40 hover:bg-slate-800/30">
                <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  BBS (Bangladesh Bureau of Statistics)
                </td>
                <td className="p-3 text-slate-300">
                  Thana geographic boundaries, land area (km²), and census population counts.
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-sm font-semibold text-[10px]">
                    Authentic Census Data
                  </span>
                </td>
                <td className="p-3 text-slate-400">
                  Population densities and spatial area values represent real BBS census figures for DNCC and DSCC thanas.
                </td>
              </tr>

              <tr className="bg-slate-900/40 hover:bg-slate-800/30">
                <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-400 shrink-0" />
                  Crowdsourced Community Health
                </td>
                <td className="p-3 text-slate-300">
                  User-reported fever cases, symptom checklists, and local breeding site reports.
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-sm font-semibold text-[10px]">
                    Interactive User Submissions
                  </span>
                </td>
                <td className="p-3 text-slate-400">
                  Unverified crowdsourced signals designed to simulate early community notification prior to hospital admission logging.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Limitations & Operational Constraints */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              3. Model Limitations & Methodological Constraints
            </h2>
            <p className="text-xs text-slate-400">
              Factual evaluation of spatial, temporal, and biological boundaries of this prototype
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              Spatial Granularity Constraints (Thana vs. Ward Level)
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Data aggregation currently occurs at the sub-district (thana) level. This spatial scale averages out micro-environment variations within individual city wards, such as localized construction sites, specific water storage tanks, or micro-drainage blockages.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              Static Batch Data Updates (No Automated Real-time Feed)
            </h3>
            <p className="text-slate-400 leading-relaxed">
              The model relies on batch-loaded operational datasets and manual scenario triggers rather than live REST API integrations with DGHS hospital surveillance databases or automated rain gauge telemetry network feeds.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              Unmodeled Biological & Immunological Factors
            </h3>
            <p className="text-slate-400 leading-relaxed">
              The model assumes homogenous vector competence and does not explicitly calculate serotype-specific population immunity (cross-protective immunity vs. antibody-dependent enhancement), vector insecticide resistance, or micro-temperature effects on the extrinsic incubation period (EIP).
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              Indirect Proxying of Water Storage & Infrastructure
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Indoor water storage practices resulting from intermittent municipal water supply are indirectly proxied through population density and case history rather than direct household survey measurement.
            </p>
          </div>
        </div>
      </div>

      {/* Academic Citation Footer Note */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Model architecture designed for academic poster demonstration and city vector management support.
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
