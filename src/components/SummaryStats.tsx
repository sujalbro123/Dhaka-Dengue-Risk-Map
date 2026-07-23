import React from 'react';
import { ComputedAreaRisk } from '../types';
import { AlertTriangle, Activity, CloudRain, Users, ShieldCheck } from 'lucide-react';

interface SummaryStatsProps {
  computedAreas: ComputedAreaRisk[];
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ computedAreas }) => {
  if (computedAreas.length === 0) return null;

  const totalCases30d = computedAreas.reduce((acc, a) => acc + a.recentCases30d, 0);
  const totalPopulation = computedAreas.reduce((acc, a) => acc + a.population, 0);

  const highRiskAreas = computedAreas.filter((a) => a.riskLevel === 'high');
  const moderateRiskAreas = computedAreas.filter((a) => a.riskLevel === 'moderate');
  const lowRiskAreas = computedAreas.filter((a) => a.riskLevel === 'low');

  const highRiskPopulation = highRiskAreas.reduce((acc, a) => acc + a.population, 0);

  const avgRiskScore = Math.round(
    computedAreas.reduce((acc, a) => acc + a.riskScore100, 0) / computedAreas.length
  );

  const highestRiskArea = [...computedAreas].sort((a, b) => b.riskScore100 - a.riskScore100)[0];
  const maxRainfallArea = [...computedAreas].sort((a, b) => b.recentRainfallMm - a.recentRainfallMm)[0];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
      {/* Total 30-Day Cases */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Total Dhaka Cases (30d)</span>
          <Activity className="w-4 h-4 text-blue-400" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {totalCases30d.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">Across 12 Thanas</span>
        </div>
      </div>

      {/* High Risk Alert Zones */}
      <div className="bg-slate-800/80 border border-red-500/30 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-red-300">High Risk Zones</span>
          <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl sm:text-2xl font-bold text-red-400 tracking-tight">
            {highRiskAreas.length}{' '}
            <span className="text-xs font-normal text-slate-400">/ {computedAreas.length}</span>
          </span>
          <span className="text-[11px] text-red-300 font-medium">
            {((highRiskPopulation / totalPopulation) * 100).toFixed(0)}% Pop. Exposed
          </span>
        </div>
      </div>

      {/* Average Dhaka City Risk Index */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Avg City Risk Index</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl sm:text-2xl font-bold text-amber-400 tracking-tight">
            {avgRiskScore}
            <span className="text-xs font-normal text-slate-400"> / 100</span>
          </span>
          <span className="text-xs text-slate-400">Moderate Threat</span>
        </div>
      </div>

      {/* Highest Epidemic Hotspot */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Peak Outbreak Hotspot</span>
          <Users className="w-4 h-4 text-purple-400" />
        </div>
        <div className="mt-2">
          <div className="text-sm font-bold text-white truncate">{highestRiskArea?.name}</div>
          <div className="flex justify-between items-center text-xs text-red-400 font-semibold mt-0.5">
            <span>Score: {highestRiskArea?.riskScore100}/100</span>
            <span className="text-slate-400 font-normal">{highestRiskArea?.recentCases30d} cases</span>
          </div>
        </div>
      </div>

      {/* Peak Precipitation Area */}
      <div className="col-span-2 sm:col-span-2 lg:col-span-1 bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Peak Rainfall Zone</span>
          <CloudRain className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-2">
          <div className="text-sm font-bold text-white truncate">{maxRainfallArea?.name}</div>
          <div className="flex justify-between items-center text-xs text-cyan-300 font-medium mt-0.5">
            <span>{maxRainfallArea?.recentRainfallMm} mm rainfall</span>
            <span className="text-slate-400 font-normal">Aedes vector boost</span>
          </div>
        </div>
      </div>
    </div>
  );
};
