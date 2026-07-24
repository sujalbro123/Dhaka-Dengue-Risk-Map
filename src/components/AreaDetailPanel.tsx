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
  onOpenSmsAlert?: (areaId: string) => void;
  onOpenReportCase?: (areaId: string) => void;
}

export const AreaDetailPanel: React.FC<AreaDetailPanelProps> = ({
  area,
  onOpenSmsAlert,
  onOpenReportCase,
}) => {
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

  // Hospital Capacity calculations
  const capacityStatusBadge =
    area.capacityStatus === 'overcapacity'
      ? { label: '🔴 Overcapacity (Bed Shortage)', bg: 'bg-red-500/20 text-red-300 border-red-500/40' }
      : area.capacityStatus === 'strained'
      ? { label: '🟠 Strained Capacity (≥80% Full)', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' }
      : { label: '🟢 Adequate Capacity (<80% Occupied)', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };

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

        {/* Risk Score Highlight Badge & Trend Arrow */}
        <div className={`p-3.5 rounded-2xl border ${badge.bg} ${badge.border} text-right min-w-[150px] shadow-lg flex flex-col justify-between`}>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Current Risk Score
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold ${badge.text} flex items-center justify-end gap-1.5`}>
              <span>{area.riskScore100}</span>
              <span className="text-xs font-normal text-slate-400">/100</span>

              {/* Trend Arrow */}
              <span
                title={`Last week score: ${area.lastWeekRiskScore}`}
                className={`text-lg font-black ${
                  area.trend === 'rising'
                    ? 'text-red-400'
                    : area.trend === 'falling'
                    ? 'text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                {area.trend === 'rising' ? '↑' : area.trend === 'falling' ? '↓' : '→'}
              </span>
            </div>
          </div>

          <div className="mt-1 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Weekly Trend:</span>
            <span
              className={`font-bold ${
                area.trend === 'rising'
                  ? 'text-red-400'
                  : area.trend === 'falling'
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              {area.trend === 'rising'
                ? `+${area.trendDelta} pts (Rising)`
                : area.trend === 'falling'
                ? `${area.trendDelta} pts (Falling)`
                : 'Stable'}
            </span>
          </div>
        </div>
      </div>

      {/* Year-over-Year Comparison Banner (Requirement E) */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            📅 Year-over-Year Comparison (2026 vs 2025)
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              area.yearOverYearChangePercent > 0
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : area.yearOverYearChangePercent < 0
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {area.yearOverYearChangePercent > 0 ? `+${area.yearOverYearChangePercent}% YoY` : `${area.yearOverYearChangePercent}% YoY`}
          </span>
        </div>

        {/* Concrete Summary Line */}
        <p className="text-xs text-slate-200 font-medium leading-relaxed bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
          👉 <strong className="text-amber-300">{area.yearOverYearText}</strong>
        </p>

        {/* Comparison Metric Grid */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
          <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">2026 (Current Period)</span>
            <span className="text-sm font-bold text-white">{area.recentCases30d} cases</span>
            <span className="text-[10px] text-amber-400 block mt-0.5">Risk Score: {area.riskScore100}/100</span>
          </div>

          <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">2025 (Prior Year)</span>
            <span className="text-sm font-bold text-slate-300">{area.priorYearCases30d} cases</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Risk Score: {area.priorYearRiskScore}/100</span>
          </div>
        </div>
      </div>

      {/* Quick Action Bar for Area */}
      <div className="flex items-center gap-2 flex-wrap">
        {onOpenSmsAlert && (
          <button
            onClick={() => onOpenSmsAlert(area.id)}
            className="flex-1 py-2 px-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Simulate SMS Alert</span>
          </button>
        )}
        {onOpenReportCase && (
          <button
            onClick={() => onOpenReportCase(area.id)}
            className="flex-1 py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Report Case Here</span>
          </button>
        )}
      </div>

      {/* Hospital Capacity Overlay (Resource Allocation Angle) */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Hospital className="w-4 h-4 text-rose-400" />
            Hospital Bed Capacity vs Patient Load
          </h3>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${capacityStatusBadge.bg}`}>
            {capacityStatusBadge.label}
          </span>
        </div>

        {/* Visual Callout Bar */}
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Dengue Patients</span>
              <span className="text-base font-extrabold text-red-400">{area.currentPatients.toLocaleString()}</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Hospital Beds</span>
              <span className="text-base font-extrabold text-blue-400">{area.hospitalBeds.toLocaleString()}</span>
            </div>
            <div className={`p-2 rounded-lg border ${area.capacityGap > 0 ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'}`}>
              <span className="text-[10px] block uppercase">Capacity Gap</span>
              <span className="text-base font-extrabold">
                {area.capacityGap > 0 ? `+${area.capacityGap} Shortage` : `${Math.abs(area.capacityGap)} Available`}
              </span>
            </div>
          </div>

          {/* Progress bar comparison */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Occupancy Ratio: {((area.currentPatients / area.hospitalBeds) * 100).toFixed(0)}%</span>
              <span className="font-mono">{area.currentPatients} / {area.hospitalBeds} beds</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  area.capacityStatus === 'overcapacity'
                    ? 'bg-gradient-to-r from-amber-500 to-red-600'
                    : area.capacityStatus === 'strained'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (area.currentPatients / area.hospitalBeds) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clinical vs Crowdsourced Data Distinction */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-950/80 border border-blue-500/30 p-3 rounded-xl">
          <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Official DGHS Data</span>
            <span className="text-[9px] bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-300">Verified</span>
          </div>
          <div className="text-xl font-bold text-white">{area.recentCases30d} <span className="text-xs text-slate-400 font-normal">cases (30d)</span></div>
          <p className="text-[10px] text-slate-500 mt-0.5">Clinical laboratory & hospital admissions</p>
        </div>

        <div className="bg-slate-950/80 border border-purple-500/30 p-3 rounded-xl">
          <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Community Reported</span>
            <span className="text-[9px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-300">Unverified</span>
          </div>
          <div className="text-xl font-bold text-white">{area.crowdsourcedReports} <span className="text-xs text-slate-400 font-normal">reports</span></div>
          <p className="text-[10px] text-slate-500 mt-0.5">Public self-reports & neighborhood signals</p>
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
