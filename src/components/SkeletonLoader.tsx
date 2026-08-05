import React from 'react';

export const SummaryStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-slate-900 border border-[#E3E1DA]/20 rounded-sm p-3.5 space-y-2 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-3 w-20 bg-slate-800 rounded-sm" />
            <div className="h-4 w-4 bg-slate-800 rounded-sm" />
          </div>
          <div className="h-6 w-28 bg-slate-800 rounded-sm" />
          <div className="h-2.5 w-36 bg-slate-800/80 rounded-sm" />
        </div>
      ))}
    </div>
  );
};

export const MapSkeleton: React.FC = () => {
  return (
    <div className="bg-[#0f1218] border border-[#E3E1DA]/20 rounded-sm p-4 h-[520px] flex flex-col justify-between animate-pulse">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="h-5 w-48 bg-slate-800 rounded-sm" />
          <div className="h-3 w-64 bg-slate-800/80 rounded-sm" />
        </div>
        <div className="h-7 w-24 bg-slate-800 rounded-sm" />
      </div>

      <div className="my-auto flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-dashed border-slate-800 rounded-sm flex items-center justify-center p-6 text-center space-y-2">
          <div className="space-y-2 w-full">
            <div className="h-4 bg-slate-800 rounded-sm w-3/4 mx-auto" />
            <div className="h-3 bg-slate-800/80 rounded-sm w-1/2 mx-auto" />
            <div className="h-10 bg-slate-800/50 rounded-sm w-full mt-4" />
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
        <div className="h-3 w-32 bg-slate-800 rounded-sm" />
        <div className="h-3 w-40 bg-slate-800 rounded-sm" />
      </div>
    </div>
  );
};

export const DetailPanelSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-[#E3E1DA]/20 rounded-sm p-5 space-y-5 animate-pulse min-h-[520px]">
      <div className="flex justify-between items-start pb-4 border-b border-slate-800">
        <div className="space-y-2">
          <div className="h-6 w-36 bg-slate-800 rounded-sm" />
          <div className="h-3 w-28 bg-slate-800/80 rounded-sm" />
        </div>
        <div className="h-12 w-28 bg-slate-800 rounded-sm" />
      </div>

      <div className="h-20 bg-slate-950 border border-slate-800 rounded-sm p-3 space-y-2">
        <div className="h-3 w-40 bg-slate-800 rounded-sm" />
        <div className="h-4 w-full bg-slate-800/80 rounded-sm" />
      </div>

      <div className="space-y-2">
        <div className="h-3 w-32 bg-slate-800 rounded-sm" />
        <div className="h-16 bg-slate-950 border border-slate-800 rounded-sm" />
      </div>

      <div className="space-y-2">
        <div className="h-3 w-44 bg-slate-800 rounded-sm" />
        <div className="h-32 bg-slate-950 border border-slate-800 rounded-sm" />
      </div>
    </div>
  );
};
