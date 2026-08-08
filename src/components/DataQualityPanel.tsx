import React from 'react';
import { Database, CheckCircle2, AlertTriangle, FileX, Calendar, MapPin, CloudRain, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import { DataQualitySummary, AlignedAreaRecord } from '../types';
import { computeDataQualitySummary } from '../data/real/dataAlignment';

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
    coveragePeriod: '2023 – 2024',
    uniqueAreasCount: 10,
    rainfallStationsCount: 1,
    lastUpdated: '2024-11-09',
    sources: [],
  });

  if (dataMode === 'demo') {
    return (
      <div className="bg-amber-950/40 border border-amber-500/40 rounded-sm p-4 text-xs text-amber-200 space-y-2 flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Demo / Synthetic Mode Active</span>
          </div>
          <p className="text-amber-300/90 leading-relaxed font-sans">
            You are currently viewing <strong>Demo / Synthetic Data</strong>. Numbers and scenarios in this mode are engineered for interactive scenario modeling, UI prototyping, and sensitivity stress testing.
          </p>
        </div>
        {onToggleDataMode && (
          <button
            onClick={() => onToggleDataMode('research')}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-sm text-xs transition-colors shrink-0"
          >
            <ToggleRight className="w-4 h-4" />
            <span>Switch to Research Data</span>
          </button>
        )}
      </div>
    );
  }

  const completionRate = summary.totalRecords > 0
    ? Math.round((summary.completeRecords / summary.totalRecords) * 100)
    : 0;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-sm p-4 space-y-4 text-slate-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-100">
            Real Dataset Quality & Completeness Audit
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-400">Completeness:</span>
          <span className="px-2 py-0.5 bg-blue-900/60 border border-blue-500/40 text-blue-300 font-bold rounded-sm">
            {completionRate}% ({summary.completeRecords}/{summary.totalRecords})
          </span>
        </div>
      </div>

      {/* Grid KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-900 p-2.5 rounded-sm border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase font-sans">Total Aligned Records</span>
          <span className="text-base font-bold text-white font-mono">{summary.totalRecords}</span>
        </div>
        <div className="bg-slate-900 p-2.5 rounded-sm border border-slate-800">
          <span className="text-[10px] text-emerald-400 block uppercase font-sans flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Complete
          </span>
          <span className="text-base font-bold text-emerald-400 font-mono">{summary.completeRecords}</span>
        </div>
        <div className="bg-slate-900 p-2.5 rounded-sm border border-slate-800">
          <span className="text-[10px] text-amber-400 block uppercase font-sans flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Partial
          </span>
          <span className="text-base font-bold text-amber-400 font-mono">{summary.partiallyCompleteRecords}</span>
        </div>
        <div className="bg-slate-900 p-2.5 rounded-sm border border-slate-800">
          <span className="text-[10px] text-rose-400 block uppercase font-sans flex items-center justify-center gap-1">
            <FileX className="w-3 h-3" /> Missing
          </span>
          <span className="text-base font-bold text-rose-400 font-mono">{summary.missingRecords}</span>
        </div>
      </div>

      {/* Metadata Detail Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 text-slate-300 font-mono">
        <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-sm border border-slate-800/80">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-sans">Coverage Period</span>
            <span>{summary.coveragePeriod}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-sm border border-slate-800/80">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-sans">Geographic Thanas</span>
            <span>{summary.uniqueAreasCount} Thanas (DNCC/DSCC)</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-sm border border-slate-800/80">
          <CloudRain className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-sans">Rainfall Stations</span>
            <span>{summary.rainfallStationsCount} BMD Station(s)</span>
          </div>
        </div>
      </div>

      {/* Primary Data Sources List */}
      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2.5 font-sans">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <span className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">
            Attributed Data Sources, Provenance & Verification Status:
          </span>
          <span className="text-[10px] text-amber-400 font-mono">
            Overall Verification: Partially Verified (Attributed reports cited; micro-data extracted)
          </span>
        </div>

        {/* 3-Dimensional Quality Audit Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
          <div>
            <span className="text-slate-400 block uppercase font-sans font-semibold">1. Data Completeness</span>
            <span className="text-emerald-400 font-bold">{completionRate}% Present ({summary.completeRecords}/{summary.totalRecords} Aligned)</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-sans font-semibold">2. Source Provenance</span>
            <span className="text-blue-300 font-bold">DGHS, BMD & BBS Official Records</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-sans font-semibold">3. Verification Status</span>
            <span className="text-amber-300 font-bold">Partially Verified (Cited)</span>
          </div>
        </div>

        {/* Rainfall Proxy Disclosure */}
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800/80 text-[10px] text-slate-400 flex items-start gap-1.5 font-mono">
          <CloudRain className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>Rainfall Proxy Disclosure:</strong> Agargaon BMD station (Station ID 41923) precipitation is used as a central Dhaka rainfall proxy and mapped across study areas. Sub-thana microclimatic rain variation is not independently gauged per thana.
          </span>
        </div>

        <ul className="space-y-1.5 divide-y divide-slate-900">
          {summary.sources.map((src) => (
            <li key={src.id} className="pt-1.5 first:pt-0 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <strong className="text-slate-200">{src.name}</strong> ({src.organization}) — <em className="text-slate-400">{src.period}</em>
                {src.sourceUrl && (
                  <a
                    href={src.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-blue-400 hover:underline text-[10px]"
                  >
                    [Source Link]
                  </a>
                )}
              </div>
              <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-amber-300 rounded text-[9px] font-mono shrink-0 self-start sm:self-center">
                {src.verificationStatus === 'partially_verified'
                  ? 'Partially Verified'
                  : src.verificationStatus === 'verified'
                  ? 'Verified'
                  : src.verificationStatus === 'synthetic'
                  ? 'Synthetic'
                  : 'Unverified'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
