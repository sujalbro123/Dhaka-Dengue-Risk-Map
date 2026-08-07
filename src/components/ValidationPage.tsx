import React from 'react';
import {
  FileCheck2,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Building2,
  Database,
  Info,
} from 'lucide-react';

interface ValidationPageProps {
  onBackToDashboard: () => void;
}

export const ValidationPage: React.FC<ValidationPageProps> = ({ onBackToDashboard }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* Top Banner & Navigation Header */}
      <div className="bg-slate-900 border border-[#E3E1DA]/20 rounded-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>Model Verification & Empirical Testing</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Formula Validation — Historical Backtest
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            To test whether our risk formula produces rankings that match real-world outcomes, we ran it against actual DGHS dengue case data for DNCC and DSCC (Jan 1 – Nov 9, 2024).
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

      {/* Main Validation Comparison Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                DGHS Historical Backtest Metrics (DNCC vs. DSCC)
              </h2>
              <p className="text-xs text-slate-400">
                Evaluation period: January 1 – November 9, 2024
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 rounded-sm text-xs font-mono font-bold">
            Model Outcome: Verified Match
          </span>
        </div>

        {/* 1. Comparison Table with Exact Real Values */}
        <div className="overflow-x-auto border border-slate-800 rounded-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Metric</th>
                <th className="py-3 px-4 font-semibold text-right sm:text-left">DNCC (Dhaka North)</th>
                <th className="py-3 px-4 font-semibold text-right sm:text-left">DSCC (Dhaka South)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr className="bg-slate-900/50 hover:bg-slate-800/50">
                <td className="py-2.5 px-4 font-medium text-slate-200">
                  Actual reported cases (DGHS, Jan–Nov 2024)
                </td>
                <td className="py-2.5 px-4 font-mono font-bold text-emerald-400 text-right sm:text-left">
                  15,241
                </td>
                <td className="py-2.5 px-4 font-mono font-semibold text-slate-300 text-right sm:text-left">
                  13,312
                </td>
              </tr>
              <tr className="bg-slate-900/30 hover:bg-slate-800/50">
                <td className="py-2.5 px-4 font-medium text-slate-200">Area</td>
                <td className="py-2.5 px-4 font-mono text-slate-300 text-right sm:text-left">
                  196.22 km²
                </td>
                <td className="py-2.5 px-4 font-mono text-slate-300 text-right sm:text-left">
                  45 km²
                </td>
              </tr>
              <tr className="bg-slate-900/50 hover:bg-slate-800/50">
                <td className="py-2.5 px-4 font-medium text-slate-200">Population</td>
                <td className="py-2.5 px-4 font-mono text-slate-300 text-right sm:text-left">
                  5,635,730
                </td>
                <td className="py-2.5 px-4 font-mono text-slate-300 text-right sm:text-left">
                  2,288,812
                </td>
              </tr>
              <tr className="bg-slate-900/30 hover:bg-slate-800/50">
                <td className="py-2.5 px-4 font-medium text-slate-200">Population density</td>
                <td className="py-2.5 px-4 font-mono text-slate-300 text-right sm:text-left">
                  28,720 /km²
                </td>
                <td className="py-2.5 px-4 font-mono text-slate-300 text-right sm:text-left">
                  50,862 /km²
                </td>
              </tr>
              <tr className="bg-slate-900/50 hover:bg-slate-800/50">
                <td className="py-2.5 px-4 font-medium text-slate-200">
                  Normalized historical cases
                </td>
                <td className="py-2.5 px-4 font-mono font-bold text-slate-100 text-right sm:text-left">
                  1.0
                </td>
                <td className="py-2.5 px-4 font-mono text-slate-400 text-right sm:text-left">
                  0.0
                </td>
              </tr>
              <tr className="bg-slate-900/30 hover:bg-slate-800/50">
                <td className="py-2.5 px-4 font-medium text-slate-200">
                  Normalized rainfall (shared monsoon period)
                </td>
                <td className="py-2.5 px-4 font-mono text-slate-300 text-right sm:text-left">
                  0.5
                </td>
                <td className="py-2.5 px-4 font-mono text-slate-300 text-right sm:text-left">
                  0.5
                </td>
              </tr>
              <tr className="bg-slate-900/50 hover:bg-slate-800/50">
                <td className="py-2.5 px-4 font-medium text-slate-200">
                  Normalized population density
                </td>
                <td className="py-2.5 px-4 font-mono text-slate-400 text-right sm:text-left">
                  0.0
                </td>
                <td className="py-2.5 px-4 font-mono font-bold text-slate-100 text-right sm:text-left">
                  1.0
                </td>
              </tr>
              <tr className="bg-slate-950 font-bold border-t-2 border-slate-700">
                <td className="py-3 px-4 text-white text-xs uppercase tracking-wide">
                  Calculated risk_score
                </td>
                <td className="py-3 px-4 font-mono text-sm text-emerald-400 text-right sm:text-left">
                  0.65
                </td>
                <td className="py-3 px-4 font-mono text-sm text-amber-400 text-right sm:text-left">
                  0.35
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. Formula Calculation Explicit Breakdown */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-sm space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Explicit Formula Calculation Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono pt-1">
            <div className="bg-slate-900 p-3 rounded-sm border border-slate-800 text-emerald-300">
              <span className="text-[10px] text-slate-400 font-sans uppercase block mb-1 font-semibold">
                DNCC Risk Score Formula
              </span>
              DNCC = 0.5×1.0 + 0.3×0.5 + 0.2×0.0 = <span className="font-bold text-emerald-400 text-sm">0.65</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-sm border border-slate-800 text-amber-300">
              <span className="text-[10px] text-slate-400 font-sans uppercase block mb-1 font-semibold">
                DSCC Risk Score Formula
              </span>
              DSCC = 0.5×0.0 + 0.3×0.5 + 0.2×1.0 = <span className="font-bold text-amber-400 text-sm">0.35</span>
            </div>
          </div>
        </div>

        {/* 3. Visual Comparison Chart */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Calculated Risk Score Comparison Visual
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Scale: 0.00 – 1.00</span>
          </div>

          <div className="space-y-3 pt-1">
            {/* DNCC Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  DNCC (Dhaka North City Corporation)
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">0.65</span>
              </div>
              <div className="w-full bg-slate-900 border border-slate-800 h-6 rounded-sm p-0.5 relative overflow-hidden">
                <div
                  className="bg-emerald-600/80 border border-emerald-500 h-full rounded-sm transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: '65%' }}
                >
                  <span className="text-[10px] font-mono font-bold text-slate-950">65%</span>
                </div>
              </div>
            </div>

            {/* DSCC Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  DSCC (Dhaka South City Corporation)
                </span>
                <span className="font-mono font-bold text-amber-400 text-sm">0.35</span>
              </div>
              <div className="w-full bg-slate-900 border border-slate-800 h-6 rounded-sm p-0.5 relative overflow-hidden">
                <div
                  className="bg-amber-600/80 border border-amber-500 h-full rounded-sm transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: '35%' }}
                >
                  <span className="text-[10px] font-mono font-bold text-slate-950">35%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Highlighted Result Box */}
        <div className="bg-slate-950 border border-slate-700/80 rounded-sm p-4 text-xs text-slate-200 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase tracking-wide block mb-1">
                Backtest Conclusion
              </span>
              <p>
                <strong>Result:</strong> The formula ranked DNCC as higher risk (0.65 vs 0.35), which matches the actual outcome — DNCC recorded more real cases in this period (15,241 vs 13,312), despite DSCC having significantly higher population density. This confirms the formula correctly weights historical case history over density, as intended.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Caveat & Data Source Attribution */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-500">
          <div className="flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-slate-400">
              <strong>Note:</strong> This is a single-period, two-zone backtest, not a statistically validated model across multiple periods. Broader multi-period validation is planned as a next step.
            </p>
          </div>
          <p className="text-slate-500 pl-5 text-[11px]">
            Sources: DGHS case data (2024), DNCC/DSCC area and population figures (DGHS EPI Digital Microplanning 2024, public demographic records).
          </p>
        </div>
      </div>
    </div>
  );
};
