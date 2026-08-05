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
  Calendar,
} from 'lucide-react';

interface AreaDetailPanelProps {
  area: ComputedAreaRisk | null;
  onOpenSmsAlert?: (areaId: string) => void;
  onOpenReportCase?: (areaId: string) => void;
}

export const AreaDetailPanel: React.FC<AreaDetailPanelProps> = React.memo(({
  area,
  onOpenSmsAlert,
  onOpenReportCase,
}) => {
  if (!area) {
    return (
      <div className="bg-slate-900 border border-[#E3E1DA]/20 rounded-sm p-6 text-center text-slate-400 flex flex-col items-center justify-center h-full min-h-[450px]">
        <ShieldAlert className="w-10 h-10 text-slate-600 mb-3" />
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
      ? { label: 'Overcapacity', bg: 'bg-red-500/20 text-red-300 border-red-500/40' }
      : area.capacityStatus === 'strained'
      ? { label: 'Strained capacity (≥80% full)', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' }
      : { label: 'Adequate capacity (<80% occupied)', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };

  return (
    <div className="bg-slate-900 border border-[#E3E1DA]/20 rounded-sm p-4 sm:p-5 space-y-5 overflow-y-auto max-h-[800px]">
      {/* Area Header Banner */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {area.name}
            </h2>
            <span className="text-base font-medium text-slate-400">({area.bnName})</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
            <span className="px-2 py-0.5 bg-slate-800 rounded-sm font-semibold text-slate-300 border border-slate-700 font-sans">
              {area.corporation}
            </span>
            <span>• {area.zoneNumber}</span>
            <span>• {area.wards}</span>
          </div>
        </div>

        {/* Risk Score Highlight Badge & Trend Arrow */}
        <div className={`p-3.5 rounded-sm border ${badge.bg} ${badge.border} text-right min-w-[150px] flex flex-col justify-between`}>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Current risk score
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${badge.text} flex items-center justify-end gap-1.5`}>
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
            <span className="text-slate-400 font-medium">Weekly trend:</span>
            <span
              className={`font-bold font-mono ${
                area.trend === 'rising'
                  ? 'text-red-400'
                  : area.trend === 'falling'
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              {area.trend === 'rising'
                ? `+${area.trendDelta} pts (rising)`
                : area.trend === 'falling'
                ? `${area.trendDelta} pts (falling)`
                : 'Stable'}
            </span>
          </div>
        </div>
      </div>

      {/* Year-over-Year Comparison Banner (Requirement E) */}
      <div className="bg-slate-950 border border-[#E3E1DA] rounded-sm p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            Year-over-year comparison (2026 vs 2025)
          </span>
          <span
            className={`text-xs font-bold font-mono ${
              area.yearOverYearChangePercent > 0
                ? 'text-red-400'
                : area.yearOverYearChangePercent < 0
                ? 'text-emerald-400'
                : 'text-slate-400'
            }`}
          >
            {area.yearOverYearChangePercent > 0 ? `+${area.yearOverYearChangePercent}% YoY` : `${area.yearOverYearChangePercent}% YoY`}
          </span>
        </div>

        {/* Concrete Summary Line */}
        <p className="text-xs text-slate-200 font-medium leading-relaxed bg-slate-900 p-2.5 rounded-sm border border-[#E3E1DA]/30">
          <strong className="text-amber-300">{area.yearOverYearText}</strong>
        </p>

        {/* Comparison Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center text-xs pt-1">
          <div className="p-2 bg-slate-900 rounded-sm border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-sans">2026 (current period)</span>
            <span className="text-sm font-bold text-white font-mono">{area.recentCases30d} cases</span>
            <span className="text-[10px] text-amber-400 block mt-0.5 font-mono">Risk score: {area.riskScore100}/100</span>
          </div>

          <div className="p-2 bg-slate-900 rounded-sm border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-sans">2025 (prior year)</span>
            <span className="text-sm font-bold text-slate-300 font-mono">{area.priorYearCases30d} cases</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">Risk score: {area.priorYearRiskScore}/100</span>
          </div>
        </div>
      </div>

      {/* Quick Action Bar for Area */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {onOpenSmsAlert && (
          <button
            onClick={() => onOpenSmsAlert(area.id)}
            className="flex-1 py-2 px-3 bg-[#1F3A5F] hover:bg-[#1a3050] text-white border border-[#E3E1DA]/30 rounded-sm text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
            <span>Simulate SMS alert</span>
          </button>
        )}
        {onOpenReportCase && (
          <button
            onClick={() => onOpenReportCase(area.id)}
            className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-sm text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-slate-300" />
            <span>Report case here</span>
          </button>
        )}
      </div>

      {/* Hospital Capacity Overlay (Resource Allocation Angle) */}
      <div className="bg-slate-950 border border-slate-800 rounded-sm p-3 sm:p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Hospital className="w-4 h-4 text-slate-300" />
            Hospital bed capacity vs patient load
          </h3>
          <span className={`px-2.5 py-0.5 rounded-sm text-[11px] font-bold border ${capacityStatusBadge.bg}`}>
            {capacityStatusBadge.label}
          </span>
        </div>

        {/* Visual Callout Bar */}
        <div className="bg-slate-900 p-3 rounded-sm border border-slate-800 text-xs space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-slate-950 rounded-sm border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-sans">Dengue patients</span>
              <span className="text-base font-extrabold text-red-400 font-mono">{area.currentPatients.toLocaleString()}</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-sm border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-sans">Hospital beds</span>
              <span className="text-base font-extrabold text-blue-400 font-mono">{area.hospitalBeds.toLocaleString()}</span>
            </div>
            <div className={`p-2 rounded-sm border ${area.capacityGap > 0 ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'}`}>
              <span className="text-[10px] block uppercase font-sans">Capacity gap</span>
              <span className="text-base font-extrabold font-mono">
                {area.capacityGap > 0 ? `+${area.capacityGap} shortage` : `${Math.abs(area.capacityGap)} available`}
              </span>
            </div>
          </div>

          {/* Progress bar comparison */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Occupancy ratio: {((area.currentPatients / area.hospitalBeds) * 100).toFixed(0)}%</span>
              <span className="font-mono">{area.currentPatients} / {area.hospitalBeds} beds</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-sm overflow-hidden relative">
              <div
                className={`h-full rounded-sm transition-all duration-300 ${
                  area.capacityStatus === 'overcapacity'
                    ? 'bg-red-600'
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-slate-950 border border-blue-500/30 p-3 rounded-sm">
          <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Official DGHS data</span>
            <span className="text-[9px] bg-blue-500/20 px-1.5 py-0.5 rounded-sm text-blue-300">Verified</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{area.recentCases30d} <span className="text-xs text-slate-400 font-normal font-sans">cases (30d)</span></div>
          <p className="text-[10px] text-slate-500 mt-0.5">Clinical laboratory & hospital admissions</p>
        </div>

        <div className="bg-slate-950 border border-purple-500/30 p-3 rounded-sm">
          <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Community reported</span>
            <span className="text-[9px] bg-purple-500/20 px-1.5 py-0.5 rounded-sm text-purple-300">Unverified</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{area.crowdsourcedReports} <span className="text-xs text-slate-400 font-normal font-sans">reports</span></div>
          <p className="text-[10px] text-slate-500 mt-0.5">Public self-reports & neighborhood signals</p>
        </div>
      </div>

      {/* Factor Breakdown (Formula Components) */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-slate-300" />
          Weighted risk factor breakdown
        </h3>

        <div className="space-y-3 bg-slate-950 border border-slate-800 rounded-sm p-3.5">
          {/* Factor 1: Historical Cases (50%) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                Historical cases (50% weight)
              </span>
              <span className="font-mono text-slate-300">
                {area.recentCases30d} cases →{' '}
                <strong className="text-blue-400">+{area.weightedCasesContribution} pts</strong>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-sm overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-sm transition-all duration-300"
                style={{ width: `${area.normalized.normCases * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between font-mono">
              <span>Normalized score: {(area.normalized.normCases * 100).toFixed(1)}%</span>
              <span>Max weight contribution: 50 pts</span>
            </div>
          </div>

          {/* Factor 2: Recent Rainfall (30%) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                Recent rainfall (30% weight)
              </span>
              <span className="font-mono text-slate-300">
                {area.recentRainfallMm} mm →{' '}
                <strong className="text-cyan-400">+{area.weightedRainfallContribution} pts</strong>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-sm overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-sm transition-all duration-300"
                style={{ width: `${area.normalized.normRainfall * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between font-mono">
              <span>Normalized score: {(area.normalized.normRainfall * 100).toFixed(1)}%</span>
              <span>Max weight contribution: 30 pts</span>
            </div>
          </div>

          {/* Factor 3: Population Density (20%) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                Population density (20% weight)
              </span>
              <span className="font-mono text-slate-300">
                {area.populationDensity.toLocaleString()} /km² →{' '}
                <strong className="text-purple-400">+{area.weightedDensityContribution} pts</strong>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-sm overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-sm transition-all duration-300"
                style={{ width: `${area.normalized.normDensity * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between font-mono">
              <span>Normalized score: {(area.normalized.normDensity * 100).toFixed(1)}%</span>
              <span>Max weight contribution: 20 pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Trend Chart (Recharts Line & Bar) */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
          6-month case progression and rainfall
        </h3>

        {!area.monthlyHistory || area.monthlyHistory.length === 0 ? (
          <div className="bg-slate-950 border border-slate-800 rounded-sm p-6 text-center text-slate-400 flex flex-col items-center justify-center h-52">
            <Calendar className="w-8 h-8 text-slate-600 mb-2" />
            <span className="text-xs font-bold text-slate-200">No data available for this period</span>
            <span className="text-[11px] text-slate-500 mt-1">Historical monthly surveillance records are missing for this zone.</span>
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-sm p-3 h-52">
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
                    borderRadius: '2px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Bar yAxisId="right" dataKey="rainfallMm" name="Rainfall (mm)" fill="#0284c7" opacity={0.4} barSize={20} />
                <Line yAxisId="left" type="monotone" dataKey="cases" name="Dengue Cases" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Key Vulnerabilities & Risk Factors */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Area risk vulnerabilities
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-300 bg-slate-950 p-3 rounded-sm border border-[#E3E1DA]">
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
          Recommended vector control protocol
        </h3>
        <div className="space-y-2">
          {area.preventionTips.map((tip, idx) => (
            <div
              key={idx}
              className="p-2.5 bg-slate-950 border border-[#E3E1DA] rounded-sm text-xs text-slate-200 flex items-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Demographics & Primary Hospitals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
        <div className="bg-slate-950 p-3 rounded-sm border border-slate-800">
          <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            Demographic context
          </div>
          <div className="space-y-1 text-slate-400">
            <div>Population: <strong className="text-slate-200 font-mono">{area.population.toLocaleString()}</strong></div>
            <div>Area size: <strong className="text-slate-200 font-mono">{area.areaSqKm} sq km</strong></div>
            <div>Aedes Breteau index: <strong className="text-amber-400 font-mono">{area.breteauIndex}</strong></div>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-sm border border-slate-800">
          <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <Hospital className="w-3.5 h-3.5 text-slate-400" />
            Hospitals in zone
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
});

