import React, { useState } from 'react';
import { ComputedAreaRisk } from '../types';
import { getRiskBadgeColor } from '../utils/riskCalculator';
import { ZoomIn, ZoomOut, RotateCcw, Map as MapIcon, Grid, TableProperties, Sparkles, Navigation } from 'lucide-react';

interface DhakaMapProps {
  areas: ComputedAreaRisk[];
  selectedAreaId: string | null;
  onSelectArea: (area: ComputedAreaRisk) => void;
  viewMode: 'map' | 'grid' | 'table';
  onChangeViewMode: (mode: 'map' | 'grid' | 'table') => void;
}

export const DhakaMap: React.FC<DhakaMapProps> = ({
  areas,
  selectedAreaId,
  onSelectArea,
  viewMode,
  onChangeViewMode,
}) => {
  const [zoom, setZoom] = useState(1);
  const [hoveredArea, setHoveredArea] = useState<ComputedAreaRisk | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoom(1);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-full min-h-[520px]">
      {/* Map Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-emerald-400" />
            Interactive Dhaka Thana Risk Map
          </h2>
          <p className="text-xs text-slate-400">
            Click any zone to inspect epidemiology & risk breakdown
          </p>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => onChangeViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'map'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>SVG Map</span>
          </button>

          <button
            onClick={() => onChangeViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => onChangeViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Main Vector Map Canvas */}
      {viewMode === 'map' && (
        <div className="relative flex-1 bg-slate-950/90 rounded-xl mt-3 overflow-hidden border border-slate-800/80 flex items-center justify-center min-h-[420px]">
          {/* Zoom Controls Overlay */}
          <div className="absolute top-3 right-3 z-10 flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-md gap-1">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Compass & Scale */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg text-[11px] text-slate-400">
            <Navigation className="w-3.5 h-3.5 text-emerald-400 rotate-0" />
            <span>Dhaka Metropolitan Area</span>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl p-2.5 text-xs shadow-md">
            <div className="font-semibold text-slate-300 mb-1.5 text-[11px] uppercase tracking-wider">
              Risk Level Legend
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                <span className="text-slate-200">High Risk (Score ≥ 65)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-slate-200">Moderate Risk (40 - 64)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-200">Low Risk (&lt; 40)</span>
              </div>
            </div>
          </div>

          {/* SVG Map Container */}
          <div
            className="w-full h-full flex items-center justify-center p-4 transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            <svg
              viewBox="0 0 600 550"
              className="w-full max-h-[480px] drop-shadow-2xl cursor-pointer select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredArea(null)}
            >
              <defs>
                {/* Custom Gradients for Risk Levels */}
                <linearGradient id="grad-high" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#991b1b" stopOpacity="0.95" />
                </linearGradient>

                <linearGradient id="grad-moderate" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
                </linearGradient>

                <linearGradient id="grad-low" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.95" />
                </linearGradient>

                {/* Pattern for Rivers */}
                <pattern id="river-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 0 5 Q 2.5 0, 5 5 T 10 5" fill="none" stroke="#0284c7" strokeWidth="1" opacity="0.4" />
                </pattern>
              </defs>

              {/* Background Geographic Boundaries Grid */}
              <rect width="600" height="550" fill="#020617" rx="12" />

              {/* Rivers (Turag, Buriganga, Balu) */}
              {/* Buriganga River (South) */}
              <path
                d="M 120,530 C 200,510 320,530 400,520 C 480,510 550,540 580,550"
                fill="none"
                stroke="#0284c7"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.6"
              />
              <text x="250" y="535" fill="#38bdf8" fontSize="10" fontWeight="bold" opacity="0.8">
                Buriganga River
              </text>

              {/* Turag River (West) */}
              <path
                d="M 100,20 C 130,120 120,250 110,380 C 100,450 150,500 190,520"
                fill="none"
                stroke="#0284c7"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.5"
              />
              <text x="50" y="240" fill="#38bdf8" fontSize="10" fontWeight="bold" opacity="0.7" transform="rotate(-90 50,240)">
                Turag River
              </text>

              {/* Balu River (East) */}
              <path
                d="M 470,20 C 510,150 500,280 530,420"
                fill="none"
                stroke="#0284c7"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.5"
              />
              <text x="535" y="220" fill="#38bdf8" fontSize="10" fontWeight="bold" opacity="0.7" transform="rotate(90 535,220)">
                Balu River
              </text>

              {/* DNCC vs DSCC Boundary Indication Line */}
              <path
                d="M 140,230 L 480,220"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                opacity="0.5"
              />
              <text x="490" y="215" fill="#94a3b8" fontSize="9" fontWeight="bold">
                DNCC / DSCC Boundary
              </text>

              {/* Area Polygons */}
              {areas.map((area) => {
                const isSelected = selectedAreaId === area.id;
                const isHovered = hoveredArea?.id === area.id;
                const badgeColor = getRiskBadgeColor(area.riskLevel);

                let fillGradient = 'url(#grad-low)';
                if (area.riskLevel === 'high') fillGradient = 'url(#grad-high)';
                if (area.riskLevel === 'moderate') fillGradient = 'url(#grad-moderate)';

                return (
                  <g key={area.id} className="transition-all duration-200">
                    <path
                      d={area.svgPath}
                      fill={fillGradient}
                      stroke={isSelected ? '#ffffff' : isHovered ? '#f8fafc' : '#334155'}
                      strokeWidth={isSelected ? '3' : isHovered ? '2' : '1.2'}
                      strokeLinejoin="round"
                      className="cursor-pointer transition-all duration-200 hover:opacity-100"
                      opacity={isSelected ? 1 : isHovered ? 0.95 : 0.85}
                      onClick={() => onSelectArea(area)}
                      onMouseEnter={() => setHoveredArea(area)}
                    />

                    {/* Area Center Marker & Label */}
                    <g
                      className="pointer-events-none"
                      transform={`translate(${area.coordinates.x}, ${area.coordinates.y})`}
                    >
                      {/* Pulse Circle for High Risk Areas */}
                      {area.riskLevel === 'high' && (
                        <circle
                          r="10"
                          fill="#ef4444"
                          opacity="0.4"
                          className="animate-ping"
                        />
                      )}

                      {/* Center Pin */}
                      <circle
                        r={isSelected ? '7' : '5'}
                        fill={badgeColor.fill}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />

                      {/* Area Short Label */}
                      <text
                        y="18"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={isSelected ? '11' : '10'}
                        fontWeight={isSelected ? 'bold' : '600'}
                        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                      >
                        {area.name}
                      </text>

                      {/* Risk Score Pill */}
                      <rect
                        x="-14"
                        y="-22"
                        width="28"
                        height="14"
                        rx="7"
                        fill="#0f172a"
                        stroke={badgeColor.fill}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="-12"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {area.riskScore100}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredArea && (
              <div
                className="absolute pointer-events-none z-30 bg-slate-900/95 border border-slate-700/90 rounded-xl p-3 shadow-2xl backdrop-blur text-xs w-52"
                style={{
                  left: Math.min(mousePos.x + 15, 360),
                  top: Math.max(mousePos.y - 40, 10),
                }}
              >
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
                  <span className="font-bold text-white text-sm">{hoveredArea.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      getRiskBadgeColor(hoveredArea.riskLevel).bg
                    } ${getRiskBadgeColor(hoveredArea.riskLevel).text}`}
                  >
                    {hoveredArea.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Score:</span>
                    <span className="font-bold text-amber-400">{hoveredArea.riskScore100} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">30d Cases:</span>
                    <span className="font-semibold text-white">{hoveredArea.recentCases30d}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rainfall:</span>
                    <span className="font-semibold text-cyan-400">{hoveredArea.recentRainfallMm} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Density:</span>
                    <span className="font-semibold text-slate-300">
                      {hoveredArea.populationDensity.toLocaleString()} /km²
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
