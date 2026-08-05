import React from 'react';
import { X, Award, CheckCircle2, BookOpen, Calculator, Sparkles, GraduationCap } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
      <div className="bg-slate-900 border border-[#E3E1DA]/20 rounded-sm max-w-2xl w-full p-5 sm:p-6 text-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-slate-800 text-slate-300 rounded-sm border border-slate-700">
              <Calculator className="w-4 h-4 text-slate-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Mathematical Model & Methodology</h2>
              <p className="text-xs text-slate-400">
                Epidemiological risk calculation framework explained for competition judges
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-sm transition-colors border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 mt-4 text-xs sm:text-sm">
          {/* Formula Display Box */}
          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 text-center font-mono">
            <div className="text-slate-400 text-xs mb-1 font-sans">Primary Risk Score Equation</div>
            <div className="text-amber-400 font-bold text-sm sm:text-base tracking-tight">
              Risk Score = (0.50 × C<sub>norm</sub>) + (0.30 × R<sub>norm</sub>) + (0.20 × D<sub>norm</sub>)
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-sans">
              All three variable metrics normalized on a <strong>0.0 to 1.0 min-max scale</strong> before weighting.
            </div>
          </div>

          {/* Normalization Math */}
          <div className="bg-slate-800/50 p-3.5 rounded-sm border border-slate-700/60">
            <h3 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-400" />
              Min-Max Feature Normalization
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              To ensure fair weighting across disparate units (case counts vs rainfall in mm vs density per km²), each raw metric X is scaled proportionally across all 12 Dhaka Thanas using:
            </p>
            <div className="mt-2 text-center font-mono bg-slate-950 p-2 rounded-sm text-xs text-emerald-400">
              X<sub>norm</sub> = (X − X<sub>min</sub>) / (X<sub>max</sub> − X<sub>min</sub>)
            </div>
          </div>

          {/* Epidemiological Rationale */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider text-slate-300">
              Epidemiological Justification for Weights
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-sm">
                <div className="font-bold text-blue-400 mb-1">1. Historical Cases (50%)</div>
                <p className="text-slate-400 text-[11px]">
                  Serves as the direct proxy for human viral reservoir (DENV serotypes 1-4) and current local transmission chains.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-sm">
                <div className="font-bold text-cyan-400 mb-1">2. Recent Rainfall (30%)</div>
                <p className="text-slate-400 text-[11px]">
                  Fills outdoor artificial containers, enabling <i>Aedes aegypti</i> mosquito egg hatching within a 7-10 day cycle.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-sm">
                <div className="font-bold text-purple-400 mb-1">3. Pop. Density (20%)</div>
                <p className="text-slate-400 text-[11px]">
                  Higher host density accelerates the basic reproduction number (R₀) and human-vector contact frequency.
                </p>
              </div>
            </div>
          </div>

          {/* Judge Poster Presentation Cheat Sheet */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-sm text-xs text-amber-200">
            <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Quick 30-Second Pitch for Poster Competition Judges:
            </div>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>
                <strong>The Problem:</strong> Traditional city-wide alerts treat all of Dhaka as a single risk zone, missing localized micro-outbreaks.
              </li>
              <li>
                <strong>Our Innovation:</strong> A lightweight, explainable spatial model combining DGHS case surveillance, meteorological rainfall, and BBS demographic density into zone-specific early warnings.
              </li>
              <li>
                <strong>Actionability:</strong> Allows City Corporation vector squads to target high-risk zones (e.g., Old Dhaka, Jatrabari) before cases overflow hospital ICUs.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1F3A5F] hover:bg-[#1a3050] text-white rounded-sm text-xs font-bold border border-[#E3E1DA]/30 transition-colors"
          >
            Got it, return to dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
