import React from 'react';
import { Database, CheckCircle2, AlertTriangle, FileX, Calendar, MapPin, CloudRain, ToggleRight, Info, ShieldCheck, HelpCircle } from 'lucide-react';
import { DataQualitySummary, AlignedAreaRecord } from '../types';
import { computeDataQualitySummary } from '../data/real/dataAlignment';
import { REAL_DATA_SOURCES, DEMO_DATA_SOURCE } from '../data/real/dataSources';
import { DataSourceCard } from './DataSourceCard';

interface DataQualityPanelProps {
  alignedRecords?: AlignedAreaRecord[];
  summary?: DataQualitySummary;
  dataMode: 'research' | 'demo';
  onToggleDataMode?: (mode: 'research' | 'demo') => void;
}

export const DataQualityPanel: React.FC<DataQualityPanelProps> = ({
  alignedRecords,
  summary: propSummary,
  dataMode,
  onToggleDataMode,
}) => {
  const summary: DataQualitySummary = propSummary || (alignedRecords ? computeDataQualitySummary(alignedRecords) : {
    totalRecords: 0,
    completeRecords: 0,
    partiallyCompleteRecords: 0,
    missingRecords: 0,
    coveragePeriod: 'January 2023 to July 2026',
    uniqueAreasCount: 10,
    rainfallStationsCount: 1,
    lastUpdated: '2024-11-09',
    sources: REAL_DATA_SOURCES,
  });

  if (dataMode === 'demo') {
    return (
      <div className="bg-slate-950 border border-purple-900/60 rounded-sm p-4 space-y-4 text-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/50 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-purple-400" />
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-purple-200">
                Demo / Synthetic Data Provenance
              </h3>
              <p className="text-[11px] text-purple-300/80">
                Interactive simulation mode active for scenario stress-testing
              </p>
            </div>
          </div>

          {onToggleDataMode && (
            <button
              onClick={() => onToggleDataMode('research')}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-sm text-xs transition-colors shrink-0 cursor-pointer"
            >
              <ToggleRight className="w-4 h-4" />
              <span>Switch to Research Data</span>
            </button>
          )}
        </div>

        {/* Demo Source Card */}
        <DataSourceCard source={DEMO_DATA_SOURCE} isDemo={true} />

        <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
          <span>*Synthetic values engineered for interface prototyping. NOT for clinical or official epidemiological interpretation.</span>
          <span className="font-mono text-purple-400 font-semibold">Mode: Demo Simulation</span>
        </div>
      </div>
    );
  }

  const completionRate = summary.totalRecords > 0
    ? Math.round((summary.completeRecords / summary.totalRecords) * 100)
    : 0;

  const displaySources = summary.sources && summary.sources.length > 0 ? summary.sources : REAL_DATA_SOURCES;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-sm p-4 space-y-5 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-100">
              DATA SOURCES & PROVENANCE AUDIT
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 pt-0.5">
            Transparent lineage for health surveillance, meteorological measurements, and census records
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 bg-blue-950 border border-blue-800 text-blue-300 font-bold rounded-sm flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            {completionRate}% Completeness ({summary.completeRecords}/{summary.totalRecords})
          </span>
        </div>
      </div>

      {/* Grid KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-900/90 p-2.5 rounded-sm border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase font-sans">Total Aligned Records</span>
          <span className="text-base font-bold text-white font-mono">{summary.totalRecords}</span>
        </div>
        <div className="bg-slate-900/90 p-2.5 rounded-sm border border-slate-800">
          <span className="text-[10px] text-emerald-400 block uppercase font-sans flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Complete
          </span>
          <span className="text-base font-bold text-emerald-400 font-mono">{summary.completeRecords}</span>
        </div>
        <div className="bg-slate-900/90 p-2.5 rounded-sm border border-slate-800">
          <span className="text-[10px] text-amber-400 block uppercase font-sans flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Partial
          </span>
          <span className="text-base font-bold text-amber-400 font-mono">{summary.partiallyCompleteRecords}</span>
        </div>
        <div className="bg-slate-900/90 p-2.5 rounded-sm border border-slate-800">
          <span className="text-[10px] text-rose-400 block uppercase font-sans flex items-center justify-center gap-1">
            <FileX className="w-3 h-3" /> Missing
          </span>
          <span className="text-base font-bold text-rose-400 font-mono">{summary.missingRecords}</span>
        </div>
      </div>

      {/* Metadata Detail Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 font-mono">
        <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-sm border border-slate-800/80">
          <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-sans font-semibold">Coverage Period</span>
            <span>{summary.coveragePeriod}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-sm border border-slate-800/80">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-sans font-semibold">Geographic Thanas</span>
            <span>{summary.uniqueAreasCount} Thanas (DNCC / DSCC)</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-sm border border-slate-800/80">
          <CloudRain className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-sans font-semibold">Rainfall Stations</span>
            <span>{summary.rainfallStationsCount} BMD Station (Agargaon 41923)</span>
          </div>
        </div>
      </div>

      {/* Structured Source Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] font-sans flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            Attributed Primary Data Sources
          </span>
          <span className="text-[10px] text-amber-400 font-mono">
            Overall Verification: Partially Verified (Attributed reports cited)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {displaySources.map((src) => (
            <DataSourceCard key={src.id} source={src} isDemo={false} />
          ))}
        </div>
      </div>

      {/* Why These Sources? Explanatory Block */}
      <div className="bg-slate-900/80 p-3 rounded-sm border border-slate-800 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-200 text-[11px] uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Why These Sources?</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-300 leading-relaxed font-sans">
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
            <strong className="text-blue-300 block font-mono text-[10px] uppercase">DGHS (Health Services)</strong>
            Provides official epidemiological surveillance and hospital admission records per thana for research risk calculations.
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
            <strong className="text-cyan-300 block font-mono text-[10px] uppercase">BMD (Meteorology)</strong>
            Provides central station precipitation measurements used as an environmental vector breeding proxy.
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
            <strong className="text-emerald-300 block font-mono text-[10px] uppercase">BBS (Statistics)</strong>
            Provides demographic census figures and administrative boundary areas to derive population density.
          </div>
        </div>
      </div>

      {/* Data Provenance Footnote */}
      <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono flex items-center justify-between flex-wrap gap-2">
        <p>
          Source information is provided for transparency and reproducibility. Verification status reflects current project metadata.
        </p>
        <div className="text-slate-500 italic">
          DDRM Research Data Registry v1.2
        </div>
      </div>
    </div>
  );
};
