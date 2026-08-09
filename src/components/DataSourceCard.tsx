import React from 'react';
import { ExternalLink, Building2, CloudRain, Users, FlaskConical, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { DataSourceMeta } from '../types';

interface DataSourceCardProps {
  source: DataSourceMeta;
  isDemo?: boolean;
}

export const DataSourceCard: React.FC<DataSourceCardProps> = ({ source, isDemo = false }) => {
  // Determine appropriate icon based on source id / organization
  const getIcon = () => {
    if (source.id.includes('dghs_cases')) {
      return <Building2 className="w-4 h-4 text-blue-400 shrink-0" />;
    }
    if (source.id.includes('bmd_rainfall')) {
      return <CloudRain className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
    if (source.id.includes('demographics') || source.id.includes('bbs')) {
      return <Users className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    return <FlaskConical className="w-4 h-4 text-purple-400 shrink-0" />;
  };

  // Determine status badge style
  const getStatusBadge = () => {
    if (isDemo || source.type === 'synthetic' || source.verificationStatus === 'synthetic') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-950/80 text-purple-300 border border-purple-800/80 rounded-sm font-mono text-[10px] font-semibold">
          <FlaskConical className="w-3 h-3 text-purple-400" />
          SIMULATED / DEMO
        </span>
      );
    }
    if (source.verificationStatus === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 rounded-sm font-mono text-[10px] font-semibold">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          SOURCE VERIFIED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-800/80 rounded-sm font-mono text-[10px] font-semibold">
        <AlertTriangle className="w-3 h-3 text-amber-400" />
        PARTIALLY VERIFIED
      </span>
    );
  };

  return (
    <div className={`p-3.5 rounded-sm border flex flex-col justify-between transition-colors ${
      isDemo
        ? 'bg-purple-950/20 border-purple-900/60 hover:border-purple-800'
        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
    }`}>
      <div className="space-y-2.5">
        {/* Header Row: Icon + Short Title + Status Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-sm border ${
              isDemo ? 'bg-purple-900/40 border-purple-700/50' : 'bg-slate-800 border-slate-700/80'
            }`}>
              {getIcon()}
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                {source.organization.split(',')[0]}
              </div>
              <h4 className="text-xs font-bold text-slate-100 leading-snug">
                {source.name}
              </h4>
            </div>
          </div>
          <div className="shrink-0">
            {getStatusBadge()}
          </div>
        </div>

        {/* Full Organization Name */}
        <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
          {source.organization}
        </p>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950/80 p-2 rounded-sm border border-slate-800/80 text-slate-300">
          <div>
            <span className="text-slate-500 block uppercase font-sans font-semibold text-[9px]">Coverage Period</span>
            <span className="text-slate-200 font-semibold">{source.period}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-sans font-semibold text-[9px]">Geographic Scope</span>
            <span className="text-slate-200 font-semibold truncate block" title={source.geographicCoverage}>
              {source.geographicCoverage}
            </span>
          </div>
        </div>

        {/* Notes / Purpose */}
        {source.notes && (
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            {source.notes}
          </p>
        )}
      </div>

      {/* Footer: Official Source Button / Link */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
        <span className="text-[10px] text-slate-500 font-mono">
          Last Verified: {source.lastUpdated || '2024-11-09'}
        </span>

        {source.sourceUrl ? (
          <a
            href={source.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open official ${source.organization} source`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-blue-200 border border-blue-500/40 hover:border-blue-400 rounded-sm font-semibold text-[11px] transition-all cursor-pointer"
          >
            <span>Official Source</span>
            <ExternalLink className="w-3 h-3 text-blue-400" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-950 text-slate-500 border border-slate-800/80 rounded-sm text-[10px] font-mono">
            Source Link Unavailable
          </span>
        )}
      </div>
    </div>
  );
};
