import React, { useState, useMemo } from 'react';
import { ComputedAreaRisk, RiskLevel } from '../types';
import { getRiskBadgeColor } from '../utils/riskCalculator';
import { Activity, CloudRain, Users, Search, ArrowUpDown, ChevronRight, AlertCircle } from 'lucide-react';

interface AreaListViewProps {
  areas: ComputedAreaRisk[];
  selectedAreaId: string | null;
  onSelectArea: (area: ComputedAreaRisk) => void;
  viewMode: 'grid' | 'table';
}

export const AreaListView: React.FC<AreaListViewProps> = React.memo(({
  areas,
  selectedAreaId,
  onSelectArea,
  viewMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'cases' | 'rain' | 'density'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort logic with memoization
  const filteredAreas = useMemo(() => {
    return areas
      .filter((a) => {
        const matchesSearch =
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.bnName.includes(searchQuery) ||
          a.corporation.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterRisk === 'all' || a.riskLevel === filterRisk;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortBy === 'risk') {
          valA = a.riskScore100;
          valB = b.riskScore100;
        } else if (sortBy === 'cases') {
          valA = a.recentCases30d;
          valB = b.recentCases30d;
        } else if (sortBy === 'rain') {
          valA = a.recentRainfallMm;
          valB = b.recentRainfallMm;
        } else if (sortBy === 'density') {
          valA = a.populationDensity;
          valB = b.populationDensity;
        }
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [areas, searchQuery, filterRisk, sortBy, sortOrder]);

  const toggleSort = (type: 'risk' | 'cases' | 'rain' | 'density') => {
    if (sortBy === type) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  return (
    <div className="flex-1 flex flex-col mt-3">
      {/* Search and Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search thana or ward..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-sm text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600"
          />
        </div>

        {/* Risk Level Filter Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterRisk('all')}
            className={`px-2.5 py-1 rounded-sm text-xs font-semibold transition-colors ${
              filterRisk === 'all'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({areas.length})
          </button>
          <button
            onClick={() => setFilterRisk('high')}
            className={`px-2.5 py-1 rounded-sm text-xs font-semibold transition-colors ${
              filterRisk === 'high'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-red-400'
            }`}
          >
            High ({areas.filter((a) => a.riskLevel === 'high').length})
          </button>
          <button
            onClick={() => setFilterRisk('moderate')}
            className={`px-2.5 py-1 rounded-sm text-xs font-semibold transition-colors ${
              filterRisk === 'moderate'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-amber-400'
            }`}
          >
            Moderate ({areas.filter((a) => a.riskLevel === 'moderate').length})
          </button>
          <button
            onClick={() => setFilterRisk('low')}
            className={`px-2.5 py-1 rounded-sm text-xs font-semibold transition-colors ${
              filterRisk === 'low'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-emerald-400'
            }`}
          >
            Low ({areas.filter((a) => a.riskLevel === 'low').length})
          </button>
        </div>
      </div>

      {/* Empty Filter State */}
      {filteredAreas.length === 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-sm p-8 text-center text-slate-400 my-4 flex flex-col items-center justify-center">
          <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
          <div className="text-sm font-bold text-slate-300">No data available for this query or period</div>
          <div className="text-xs text-slate-500 mt-1 max-w-xs">
            No Dhaka thanas match your search query or selected risk level filter. Try clearing your search input.
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterRisk('all');
            }}
            className="mt-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-sm text-xs font-semibold"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Grid View Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[500px] pr-1">
          {filteredAreas.map((area) => {
            const isSelected = selectedAreaId === area.id;
            const badge = getRiskBadgeColor(area.riskLevel);

            return (
              <div
                key={area.id}
                onClick={() => onSelectArea(area)}
                className={`p-3.5 rounded-sm border transition-colors cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-800 border-white'
                    : 'bg-slate-950 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                {/* Risk Level Accent Stripe */}
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ backgroundColor: badge.fill }}
                />

                <div className="pl-1.5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                        {area.name}
                        <span className="text-xs font-normal text-slate-400">({area.bnName})</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {area.corporation} • {area.zoneNumber}
                      </p>
                    </div>

                    <div
                      className={`px-2 py-0.5 rounded-sm text-[11px] font-bold border flex items-center gap-1 font-mono ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      <span>{area.riskScore100} / 100</span>
                      {/* Trend Arrow (Requirement D) */}
                      <span
                        title={`Last week: ${area.lastWeekRiskScore}`}
                        className={`font-black text-xs ${
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

                  {/* Year-over-Year comparison pill */}
                  <div className="text-[10px] text-slate-300 font-medium bg-slate-900 px-2 py-1 rounded-sm border border-slate-800 flex items-center justify-between mt-1">
                    <span className="text-slate-400 font-sans">vs 2025:</span>
                    <span
                      className={`font-bold font-mono ${
                        area.yearOverYearChangePercent > 0
                          ? 'text-red-400'
                          : area.yearOverYearChangePercent < 0
                          ? 'text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {area.yearOverYearChangePercent > 0
                        ? `+${area.yearOverYearChangePercent}% YoY`
                        : `${area.yearOverYearChangePercent}% YoY`}
                    </span>
                  </div>

                  {/* Factors quick breakdown */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Cases</div>
                      <div className="text-xs font-bold text-slate-200 mt-0.5 font-mono">{area.recentCases30d}</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Rainfall</div>
                      <div className="text-xs font-bold text-cyan-400 mt-0.5 font-mono">{area.recentRainfallMm} mm</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Density</div>
                      <div className="text-xs font-bold text-slate-300 mt-0.5 font-mono">
                        {Math.round(area.populationDensity / 1000)}k/km²
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end items-center mt-2 text-[11px] font-semibold text-slate-300">
                    <span>Inspect details</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View Mode */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] border border-slate-800 rounded-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3">Thana / area</th>
                <th className="p-3">Corp</th>
                <th className="p-3 cursor-pointer hover:text-white" onClick={() => toggleSort('risk')}>
                  <div className="flex items-center gap-1">
                    <span>Risk score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3">Trend</th>
                <th className="p-3">vs prior year (YoY)</th>
                <th className="p-3 cursor-pointer hover:text-white" onClick={() => toggleSort('cases')}>
                  <div className="flex items-center gap-1">
                    <span>30-day cases (50%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:text-white" onClick={() => toggleSort('rain')}>
                  <div className="flex items-center gap-1">
                    <span>Rainfall (30%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:text-white" onClick={() => toggleSort('density')}>
                  <div className="flex items-center gap-1">
                    <span>Density (20%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3">Breteau index</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
              {filteredAreas.map((area) => {
                const isSelected = selectedAreaId === area.id;
                const badge = getRiskBadgeColor(area.riskLevel);

                return (
                  <tr
                    key={area.id}
                    onClick={() => onSelectArea(area)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-800' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3 font-bold text-white">
                      <div>{area.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{area.bnName}</div>
                    </td>
                    <td className="p-3 text-slate-300 font-medium">{area.corporation}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-sm font-bold text-xs font-mono ${badge.bg} ${badge.text}`}
                      >
                        {area.riskScore100} / 100 ({area.riskLevel.toUpperCase()})
                      </span>
                    </td>
                    <td className="p-3 font-bold text-sm font-mono">
                      <span
                        className={
                          area.trend === 'rising'
                            ? 'text-red-400'
                            : area.trend === 'falling'
                            ? 'text-emerald-400'
                            : 'text-slate-400'
                        }
                      >
                        {area.trend === 'rising' ? '↑ Rising' : area.trend === 'falling' ? '↓ Falling' : '→ Stable'}
                      </span>
                    </td>
                    <td className="p-3 font-semibold font-mono">
                      <span
                        className={
                          area.yearOverYearChangePercent > 0
                            ? 'text-red-400'
                            : area.yearOverYearChangePercent < 0
                            ? 'text-emerald-400'
                            : 'text-slate-400'
                        }
                      >
                        {area.yearOverYearChangePercent > 0
                          ? `+${area.yearOverYearChangePercent}%`
                          : `${area.yearOverYearChangePercent}%`}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-sans">(2025: {area.priorYearRiskScore})</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-200 font-mono">{area.recentCases30d}</td>
                    <td className="p-3 font-semibold text-cyan-400 font-mono">{area.recentRainfallMm} mm</td>
                    <td className="p-3 text-slate-300 font-mono">{area.populationDensity.toLocaleString()} /km²</td>
                    <td className="p-3 font-mono font-bold text-amber-400">{area.breteauIndex}</td>
                    <td className="p-3 text-right">
                      <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-[11px] font-semibold border border-slate-700">
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

