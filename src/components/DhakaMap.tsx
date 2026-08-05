import React, { useState } from 'react';
import { ComputedAreaRisk } from '../types';
import { getRiskBadgeColor } from '../utils/riskCalculator';
import { ZoomIn, ZoomOut, RotateCcw, Map as MapIcon, Grid, TableProperties, Navigation, Hospital, ShieldAlert, GitCompare, Wind, Thermometer } from 'lucide-react';

interface DhakaMapProps {
  areas: ComputedAreaRisk[];
  selectedAreaId: string | null;
  onSelectArea: (area: ComputedAreaRisk) => void;
  viewMode: 'map' | 'grid' | 'table';
  onChangeViewMode: (mode: 'map' | 'grid' | 'table') => void;
  onOpenSmsAlert?: (areaId: string) => void;
  isCompareMode?: boolean;
  onToggleCompareMode?: () => void;
}

export const DhakaMap: React.FC<DhakaMapProps> = ({
  areas,
  selectedAreaId,
  onSelectArea,
  viewMode,
  onChangeViewMode,
  onOpenSmsAlert,
  isCompareMode = false,
  onToggleCompareMode,
}) => {
  const [zoom, setZoom] = useState(1);
  const [hoveredArea, setHoveredArea] = useState<ComputedAreaRisk | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mapOverlay, setMapOverlay] = useState<'risk' | 'hospital' | 'env'>('risk');
  const [showWindVectors, setShowWindVectors] = useState<boolean>(true);

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
        <div className="relative flex-1 bg-slate-950 rounded-sm mt-3 overflow-hidden border border-[#E3E1DA]/20 flex items-center justify-center min-h-[420px]">
          {/* Zoom Controls Overlay */}
          <div className="absolute top-3 right-3 z-10 flex flex-col bg-slate-900 border border-slate-700 rounded-sm p-1 gap-1">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-sm transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-sm transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Compass, Scale & Layer Switcher */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-sm text-[11px] text-slate-300">
              <Navigation className="w-3.5 h-3.5 text-slate-300" />
              <span>Dhaka City Corporation</span>
            </div>

            {/* Layer Toggle & Comparison Mode Pill */}
            <div className="flex items-center bg-slate-900 p-1 rounded-sm border border-slate-700 gap-1">
              <button
                onClick={() => setMapOverlay('risk')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-sm transition-colors flex items-center gap-1 ${
                  mapOverlay === 'risk'
                    ? 'bg-[#1F3A5F] text-white border border-[#E3E1DA]/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Risk Heatmap
              </button>
              <button
                onClick={() => setMapOverlay('hospital')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-sm transition-colors flex items-center gap-1 ${
                  mapOverlay === 'hospital'
                    ? 'bg-[#1F3A5F] text-white border border-[#E3E1DA]/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Hospital className="w-3.5 h-3.5" />
                Capacity
              </button>
              <button
                onClick={() => setMapOverlay('env')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-sm transition-colors flex items-center gap-1 ${
                  mapOverlay === 'env'
                    ? 'bg-[#1F3A5F] text-white border border-[#E3E1DA]/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="View Urban Heat Island Microclimates"
              >
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Env Temp
              </button>

              {/* Wind Vectors Overlay Toggle Button */}
              <button
                onClick={() => setShowWindVectors((prev) => !prev)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-sm transition-colors flex items-center gap-1 border ${
                  showWindVectors
                    ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/60'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="Toggle Wind Vector Arrows & Temperature Badges Overlay"
              >
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Wind Vectors {showWindVectors ? 'ON' : 'OFF'}</span>
              </button>

              {/* Requirement E: Comparison Mode Toggle */}
              {onToggleCompareMode && (
                <button
                  onClick={onToggleCompareMode}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-sm transition-colors flex items-center gap-1 border ${
                    isCompareMode
                      ? 'bg-amber-600 text-white border-amber-500 font-bold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                  title="Toggle Year-over-Year Comparison Mode (2026 vs 2025)"
                >
                  <GitCompare className="w-3.5 h-3.5 text-white" />
                  <span>{isCompareMode ? 'Comparing 2026 vs 2025' : 'Compare Last Year'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 z-10 bg-slate-900 border border-slate-700 rounded-sm p-2.5 text-xs max-w-[210px]">
            <div className="font-bold text-slate-300 mb-1.5 text-[10px] uppercase tracking-wider">
              {mapOverlay === 'risk'
                ? 'Epidemiology Risk Legend'
                : mapOverlay === 'hospital'
                ? 'Hospital Bed Capacity Status'
                : 'Microclimate Urban Heat Island'}
            </div>
            {mapOverlay === 'risk' ? (
              <div className="flex flex-col gap-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-600 inline-block"></span>
                  <span className="text-slate-200">High Risk (Score ≥ 65)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span>
                  <span className="text-slate-200">Moderate Risk (40 - 64)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
                  <span className="text-slate-200">Low Risk (&lt; 40)</span>
                </div>
              </div>
            ) : mapOverlay === 'hospital' ? (
              <div className="flex flex-col gap-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-600 inline-block"></span>
                  <span className="text-slate-200">Overcapacity (Bed Shortage)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span>
                  <span className="text-slate-200">Strained (≥80% Full)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
                  <span className="text-slate-200">Adequate (&lt;80% Full)</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-800 inline-block"></span>
                  <span className="text-slate-200">Urban Heat Island (≥33.5°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-700 inline-block"></span>
                  <span className="text-slate-200">Moderate Heat (32.0 - 33.4°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-800 inline-block"></span>
                  <span className="text-slate-200">Cooler Peri-Urban (&lt;32°C)</span>
                </div>
              </div>
            )}

            {showWindVectors && (
              <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-cyan-300 font-mono flex items-center gap-1.5">
                <Wind className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Arrows: Wind Vector Flow</span>
              </div>
            )}
          </div>

          {/* SVG Map Container */}
          <div
            className="w-full h-full flex items-center justify-center p-4 transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            <svg
              viewBox="0 0 600 550"
              className="w-full max-h-[480px] cursor-pointer select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredArea(null)}
            >
              {/* Background Geographic Boundaries Grid */}
              <rect width="600" height="550" fill="#020617" rx="2" />

              {/* Rivers (Turag, Buriganga, Balu) */}
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

                let solidFill = '#064e3b';
                if (mapOverlay === 'risk') {
                  if (area.riskLevel === 'critical' || area.riskLevel === 'high') solidFill = '#991b1b';
                  else if (area.riskLevel === 'moderate') solidFill = '#92400e';
                  else solidFill = '#064e3b';
                } else if (mapOverlay === 'hospital') {
                  if (area.capacityStatus === 'overcapacity') solidFill = '#991b1b';
                  else if (area.capacityStatus === 'strained') solidFill = '#92400e';
                  else solidFill = '#064e3b';
                } else {
                  // Environmental Microclimate Urban Heat
                  const temp = area.temperatureC ?? 32.0;
                  if (temp >= 33.5) solidFill = '#7f1d1d';
                  else if (temp >= 32.0) solidFill = '#9a3412';
                  else solidFill = '#115e59';
                }

                const windDeg = area.windDirectionDegrees ?? 210;
                const windCardinal = area.windDirectionCardinal ?? 'SSW';
                const windSpeed = area.windSpeedKmH ?? 16;
                const tempC = area.temperatureC ?? 32.0;

                return (
                  <g key={area.id} className="transition-all duration-150">
                    <path
                      d={area.svgPath}
                      fill={solidFill}
                      stroke={isSelected ? '#ffffff' : isHovered ? '#f8fafc' : '#334155'}
                      strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1.2'}
                      strokeLinejoin="round"
                      className="cursor-pointer hover:opacity-100"
                      opacity={isSelected ? 1 : isHovered ? 0.95 : 0.85}
                      onClick={() => onSelectArea(area)}
                      onMouseEnter={() => setHoveredArea(area)}
                    />

                    {/* Wind Vector Direction Arrows & Temperature Badge */}
                    {showWindVectors && (
                      <g
                        className="pointer-events-none"
                        transform={`translate(${area.coordinates.x}, ${area.coordinates.y})`}
                      >
                        {/* Wind Direction Arrow (Rotated to direction wind is blowing towards) */}
                        <g transform={`rotate(${windDeg - 180})`}>
                          <line
                            x1="0"
                            y1="13"
                            x2="0"
                            y2="-13"
                            stroke="#38bdf8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            opacity="0.95"
                          />
                          <polygon points="-4,-5 0,-15 4,-5" fill="#38bdf8" opacity="0.95" />
                        </g>

                        {/* Temp & Wind Speed Badge */}
                        <g transform="translate(16, -16)">
                          <rect
                            x="0"
                            y="-11"
                            width="58"
                            height="14"
                            rx="2"
                            fill="#030712"
                            stroke="#0284c7"
                            strokeWidth="0.8"
                            opacity="0.92"
                          />
                          <text
                            x="29"
                            y="-1"
                            textAnchor="middle"
                            fill="#38bdf8"
                            fontSize="8"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {tempC}°C • {windSpeed}k
                          </text>
                        </g>
                      </g>
                    )}

                    {/* Area Center Static Marker & Label */}
                    <g
                      className="pointer-events-none"
                      transform={`translate(${area.coordinates.x}, ${area.coordinates.y})`}
                    >
                      {/* Static Center Dot (no pulse/glow animation) */}
                      <circle
                        r="4"
                        fill={
                          mapOverlay === 'hospital'
                            ? area.capacityStatus === 'overcapacity'
                              ? '#ef4444'
                              : area.capacityStatus === 'strained'
                              ? '#f59e0b'
                              : '#10b981'
                            : badgeColor.fill
                        }
                        stroke="#ffffff"
                        strokeWidth="1"
                      />

                      {/* Area Name Label */}
                      <text
                        y="16"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={isSelected ? '11' : '10'}
                        fontWeight={isSelected ? 'bold' : '600'}
                      >
                        {area.name}
                      </text>

                      {/* Score or Bed Box styled in mono font */}
                      <rect
                        x={isCompareMode ? "-28" : "-22"}
                        y="-20"
                        width={isCompareMode ? "56" : "44"}
                        height="14"
                        rx="2"
                        fill="#0f172a"
                        stroke={
                          mapOverlay === 'hospital'
                            ? area.capacityGap > 0
                              ? '#ef4444'
                              : '#38bdf8'
                            : badgeColor.fill
                        }
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="-10"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {mapOverlay === 'hospital' ? (
                          area.capacityGap > 0 ? `+${area.capacityGap}` : `${area.currentPatients}`
                        ) : isCompareMode ? (
                          `'26:${area.riskScore100} v '25:${area.priorYearRiskScore}`
                        ) : (
                          `${area.riskScore100} ${
                            area.trend === 'rising' ? '↑' : area.trend === 'falling' ? '↓' : '→'
                          }`
                        )}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredArea && (
              <div
                className="absolute pointer-events-none z-30 bg-slate-900 border border-[#E3E1DA]/30 rounded-sm p-3 text-xs w-64"
                style={{
                  left: Math.min(mousePos.x + 15, 330),
                  top: Math.max(mousePos.y - 40, 10),
                }}
              >
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
                  <span className="font-bold text-white text-sm">{hoveredArea.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                      getRiskBadgeColor(hoveredArea.riskLevel).bg
                    } ${getRiskBadgeColor(hoveredArea.riskLevel).text}`}
                  >
                    {hoveredArea.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Risk Score:</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1 font-mono">
                      <span>{hoveredArea.riskScore100} / 100</span>
                      {/* Trend Arrow */}
                      <span
                        className={`font-black text-xs ${
                          hoveredArea.trend === 'rising'
                            ? 'text-red-400'
                            : hoveredArea.trend === 'falling'
                            ? 'text-emerald-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {hoveredArea.trend === 'rising'
                          ? '↑ Rising'
                          : hoveredArea.trend === 'falling'
                          ? '↓ Falling'
                          : '→ Stable'}
                      </span>
                    </span>
                  </div>

                  {/* Wind & Temperature Environmental Microclimate Row */}
                  <div className="p-1.5 bg-slate-950 border border-slate-800 rounded-sm text-[10px] space-y-1">
                    <div className="flex justify-between items-center font-mono">
                      <span className="text-slate-400 font-sans flex items-center gap-1">
                        <Wind className="w-3 h-3 text-cyan-400" /> Wind Vector:
                      </span>
                      <span className="font-bold text-cyan-300">
                        {hoveredArea.windSpeedKmH ?? 16} km/h {hoveredArea.windDirectionCardinal ?? 'SSW'} ({hoveredArea.windDirectionDegrees ?? 210}°)
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-mono">
                      <span className="text-slate-400 font-sans flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-amber-400" /> Surface Temp:
                      </span>
                      <span className="font-bold text-amber-300">
                        {hoveredArea.temperatureC ?? 32.0}°C {hoveredArea.temperatureC && hoveredArea.temperatureC >= 33.5 ? '(Heat Island)' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Year over Year Comparison line */}
                  <div className="p-1.5 bg-slate-800 border border-slate-700 rounded-sm text-[10px] text-slate-200">
                    <div className="font-semibold">{hoveredArea.yearOverYearText}</div>
                    <div className="flex justify-between text-slate-400 mt-0.5 font-mono">
                      <span>2026: {hoveredArea.riskScore100} pts</span>
                      <span>2025: {hoveredArea.priorYearRiskScore} pts</span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-800 space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400 font-sans">Dengue Patients:</span>
                      <span className="font-semibold text-red-400">{hoveredArea.currentPatients}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400 font-sans">Hospital Beds:</span>
                      <span className="font-semibold text-blue-400">{hoveredArea.hospitalBeds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bed Capacity Status:</span>
                      <span className={`font-bold ${
                        hoveredArea.capacityStatus === 'overcapacity' ? 'text-red-400' :
                        hoveredArea.capacityStatus === 'strained' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {hoveredArea.capacityStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-800 flex justify-between text-[11px]">
                    <span className="text-slate-400">Community Reports:</span>
                    <span className="font-semibold text-purple-300 font-mono">{hoveredArea.crowdsourcedReports} reports</span>
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
