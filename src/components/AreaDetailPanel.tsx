import React from 'react';
import { ComputedAreaRisk } from '../types';
import { getRiskBadgeColor } from '../utils/riskCalculator';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  ShieldAlert,
  Hospital,
  Droplets,
  Users,
  CheckCircle2,
  AlertTriangle,
  Building2,
  TrendingUp,
  Award,
} from 'lucide-react';

interface AreaDetailPanelProps {
  area: ComputedAreaRisk | null;
}

export const AreaDetailPanel: React.FC<AreaDetailPanelProps> = ({ area }) => {
  if (!area) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 flex flex-col items-center justify-center h-full min-h-[450px]">
        <ShieldAlert className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
        <h3 className="text-base font-bold text-slate-300">No Dhaka Area Selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Click any Thana on the interactive SVG map or list view to inspect its dengue outbreak risk breakdown.
        </p>
      </div>
    );
  }

  const badge = getRiskBadgeColor(area.riskLevel);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-5 overflow-y-auto max-h-[800px]">
      {/* Area Header Banner */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {area.name}
            </h2>
            <span className="text-base font-medium text-slate-400">({area.bnName})</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
            <span className="px-2 py-0.5 bg-slate-800 rounded font-semibold text-slate-300 border border-slate-700">
              {area.corporation}
            </span>
            <span>• {area.zoneNumber}</span>
            <span>• {area.wards}</span>
          </div>
        </div>

        {/* Risk Score Highlight Badge */}
        <div className={`p-3 rounded-2xl border ${badge.bg} ${badge.border} text-right min-w-[140px]`}>
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Risk Score
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold ${badge.text}`}>
            {area.riskScore100}{' '}
            <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className={`text-xs font-bold mt-0.5 ${badge.text}`}>
            {area.riskLevel.toUpperCase()} RISK
          </div>
        </div>
      </div>

      {/* Factor Breakdown (Formula Components) */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" />
          Weighted Risk Factor Breakdown
        </h3>

        <div className="space-y-3 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
          {/* Factor 1: Historical Cases (50%) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                Historical Cases (50% Weight)
              </span>
              <span className="font-mono text-slate-300">
                {area.recentCases30d} cases →{' '}
                <strong className="text-blue-400">+{area.weightedCasesContribution} pts</strong>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${area.normalized.normCases * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
              <span>Normalized score: {(area.normalized.normCases * 100).toFixed(1)}%</span>
              <span>Max weight contribution: 50 pts</span>
            </div>
          </div>

          {/* Factor 2: Recent Rainfall (30%) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                Recent Rainfall (30% Weight)
              </span>
              <span className="font-mono text-slate-300">
                {area.recentRainfallMm} mm →{' '}
                <strong className="text-cyan-400">+{area.weightedRainfallContribution} pts</strong>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${area.normalized.normRainfall * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
              <span>Normalized score: {(area.normalized.normRainfall * 100).toFixed(1)}%</span>
              <span>Max weight contribution: 30 pts</span>
            </div>
          </div>

          {/* Factor 3: Population Density (20%) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                Population Density (20% Weight)
              </span>
              <span className="font-mono text-slate-300">
                {area.populationDensity.toLocaleString()} /km² →{' '}
                <strong className="text-purple-400">+{area.weightedDensityContribution} pts</strong>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${area.normalized.normDensity * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
              <span>Normalized score: {(area.normalized.normDensity * 100).toFixed(1)}%</span>
              <span>Max weight contribution: 20 pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Trend Chart (Recharts Line & Bar) */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
          6-Month Epidemic Progression vs Rainfall
        </h3>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={area.monthlyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="left" stroke="#3b82f6" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
              <Bar yAxisId="right" dataKey="rainfallMm" name="Rainfall (mm)" fill="#0284c7" opacity={0.4} barSize={20} />
              <Line yAxisId="left" type="monotone" dataKey="cases" name="Dengue Cases" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Vulnerabilities & Risk Factors */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Area Risk Vulnerabilities
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
          {area.keyRiskFactors.map((factor, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Target Prevention Protocol */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Recommended Vector Control Protocol
        </h3>
        <div className="space-y-2">
          {area.preventionTips.map((tip, idx) => (
            <div
              key={idx}
              className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-200 flex items-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Demographics & Primary Hospitals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
          <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            Demographic Context
          </div>
          <div className="space-y-1 text-slate-400">
            <div>Population: <strong className="text-slate-200">{area.population.toLocaleString()}</strong></div>
            <div>Area Size: <strong className="text-slate-200">{area.areaSqKm} sq km</strong></div>
            <div>Aedes Breteau Index: <strong className="text-amber-400 font-mono">{area.breteauIndex}</strong></div>
          </div>
        </div>

        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
          <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <Hospital className="w-3.5 h-3.5 text-red-400" />
            Key Hospitals in Zone
          </div>
          <ul className="space-y-1 text-slate-300">
            {area.primaryHospitals.map((hosp, i) => (
              <li key={i} className="truncate">• {hosp}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
