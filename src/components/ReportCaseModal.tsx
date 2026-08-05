import React, { useState } from 'react';
import { ComputedAreaRisk, CommunityReport } from '../types';
import { UserPlus, Check, AlertCircle, X, ShieldCheck, MapPin, Calendar, HeartPulse } from 'lucide-react';

interface ReportCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  areas: ComputedAreaRisk[];
  onSubmitReport: (report: CommunityReport) => void;
  initialAreaId?: string;
}

const AVAILABLE_SYMPTOMS = [
  'High Fever (>102°F)',
  'Retro-orbital Pain (pain behind eyes)',
  'Severe Joint & Muscle Pain ("Breakbone")',
  'Skin Rash / Red Spots',
  'Nausea & Persistent Vomiting',
  'Bleeding Gums or Nose',
  'Extreme Fatigue & Chills',
];

export const ReportCaseModal: React.FC<ReportCaseModalProps> = ({
  isOpen,
  onClose,
  areas,
  onSubmitReport,
  initialAreaId,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>(
    initialAreaId || areas[0]?.id || ''
  );
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [patientType, setPatientType] = useState<string>('Self');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'High Fever (>102°F)',
    'Retro-orbital Pain (pain behind eyes)',
  ]);
  const [landmark, setLandmark] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const area = areas.find((a) => a.id === selectedAreaId);
    if (!area) return;

    const newReport: CommunityReport = {
      id: `rep-${Date.now()}`,
      areaId: area.id,
      areaName: area.name,
      date,
      patientType,
      symptoms: selectedSymptoms,
      landmark: landmark.trim() || undefined,
      comments: comments.trim() || undefined,
      timestamp: 'Just now',
    };

    onSubmitReport(newReport);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#0f1218] border border-[#E3E1DA]/20 rounded-sm max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-800 text-slate-300 rounded-sm border border-slate-700">
              <UserPlus className="w-4 h-4 text-slate-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Report Suspected Dengue Case</h3>
              <p className="text-xs text-slate-400">Crowdsourced Community Health Early Warning Signal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-start gap-2 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Important Credibility Notice:</strong> Community reports are clearly logged as{' '}
            <span className="underline font-semibold">Unverified Crowdsourced Data</span> to complement official DGHS hospital reporting.
          </div>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-sm flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Community Report Submitted!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Thank you for contributing to Dhaka Dengue Risk Intelligence. The community counter for this zone has been updated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Zone Select */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Select Affected Area / Thana
              </label>
              <select
                value={selectedAreaId}
                onChange={(e) => setSelectedAreaId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-500"
              >
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.corporation}) — Official: {a.recentCases30d} cases | Community: {a.crowdsourcedReports}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Patient Relation */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Onset Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Affected Person
                </label>
                <select
                  value={patientType}
                  onChange={(e) => setPatientType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-500"
                >
                  <option value="Self">Self</option>
                  <option value="Family member">Family Member</option>
                  <option value="Neighbor">Neighbor / Resident</option>
                  <option value="Colleague">Colleague / Coworker</option>
                </select>
              </div>
            </div>

            {/* Symptoms Checklist */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5 text-slate-400" />
                Symptom Checklist
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {AVAILABLE_SYMPTOMS.map((sym) => {
                  const checked = selectedSymptoms.includes(sym);
                  return (
                    <div
                      key={sym}
                      onClick={() => toggleSymptom(sym)}
                      className={`p-2 rounded-sm border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                        checked
                          ? 'bg-slate-800 border-slate-600 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{sym}</span>
                      <div
                        className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                          checked
                            ? 'bg-slate-700 border-slate-500 text-white'
                            : 'border-slate-700 bg-slate-950'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Landmark & Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Landmark / Sector (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Near Geneva Camp, Tajmahal Road Block C"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Additional Comments / Clinical Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Platelet count dropped to 85,000. Admitted at local hospital."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-slate-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-xs font-semibold border border-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1F3A5F] hover:bg-[#1a3050] text-white font-bold rounded-sm text-xs border border-[#E3E1DA]/30 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Submit Community Case
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
