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
  'High fever (>102°F)',
  'Retro-orbital pain (behind eyes)',
  'Severe joint & muscle pain',
  'Skin rash / red spots',
  'Nausea & persistent vomiting',
  'Bleeding gums or nose',
  'Extreme fatigue & chills',
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

  // Field inline validation errors
  const [errors, setErrors] = useState<{
    areaId?: string;
    date?: string;
    symptoms?: string;
    patientType?: string;
  }>({});

  if (!isOpen) return null;

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) => {
      const next = prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym];
      if (next.length > 0) {
        setErrors((err) => ({ ...err, symptoms: undefined }));
      }
      return next;
    });
  };

  // Sanitization helper to escape HTML tags/characters and prevent script injection
  const sanitizeInput = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>?/gm, '') // Strip HTML tags
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!selectedAreaId || selectedAreaId.trim() === '') {
      newErrors.areaId = 'Please select an affected area or thana.';
    }

    if (!date || date.trim() === '') {
      newErrors.date = 'Please enter an onset date.';
    } else {
      const parsedDate = Date.parse(date);
      if (isNaN(parsedDate)) {
        newErrors.date = 'Please enter a valid date.';
      } else {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (selectedDate > today) {
          newErrors.date = 'Onset date cannot be in the future.';
        }
      }
    }

    if (!patientType || patientType.trim() === '') {
      newErrors.patientType = 'Please select who is affected.';
    }

    if (selectedSymptoms.length === 0) {
      newErrors.symptoms = 'Please select at least one symptom experienced by the patient.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const area = areas.find((a) => a.id === selectedAreaId);
    if (!area) return;

    // Sanitize user inputs before creating report
    const sanitizedLandmark = sanitizeInput(landmark);
    const sanitizedComments = sanitizeInput(comments);

    const newReport: CommunityReport = {
      id: `rep-${Date.now()}`,
      areaId: area.id,
      areaName: area.name,
      date,
      patientType: sanitizeInput(patientType),
      symptoms: selectedSymptoms.map(sanitizeInput),
      landmark: sanitizedLandmark || undefined,
      comments: sanitizedComments || undefined,
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
              <h3 className="text-base font-bold text-white">Report suspected dengue case</h3>
              <p className="text-xs text-slate-400">Community early warning reporting</p>
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
            <strong>Notice:</strong> Community reports are recorded as{' '}
            <span className="underline font-semibold">unverified data</span> to complement official DGHS hospital reporting.
          </div>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-sm flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Report submitted</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Thank you for contributing data. The community count for this zone has been updated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Zone Select */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Select affected area / thana
              </label>
              <select
                value={selectedAreaId}
                onChange={(e) => {
                  setSelectedAreaId(e.target.value);
                  setErrors((prev) => ({ ...prev, areaId: undefined }));
                }}
                className={`w-full bg-slate-900 border rounded-sm px-3 py-2 text-xs text-white focus:outline-none ${
                  errors.areaId ? 'border-red-500' : 'border-slate-700 focus:border-slate-500'
                }`}
              >
                <option value="">-- Select a thana --</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.corporation}) — Official: {a.recentCases30d} cases | Community: {a.crowdsourcedReports}
                  </option>
                ))}
              </select>
              {errors.areaId && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                  <span>{errors.areaId}</span>
                </p>
              )}
            </div>

            {/* Date & Patient Relation */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Onset date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setErrors((prev) => ({ ...prev, date: undefined }));
                  }}
                  className={`w-full bg-slate-900 border rounded-sm px-3 py-2 text-xs text-white focus:outline-none ${
                    errors.date ? 'border-red-500' : 'border-slate-700 focus:border-slate-500'
                  }`}
                />
                {errors.date && (
                  <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                    <span>{errors.date}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Affected person
                </label>
                <select
                  value={patientType}
                  onChange={(e) => {
                    setPatientType(e.target.value);
                    setErrors((prev) => ({ ...prev, patientType: undefined }));
                  }}
                  className={`w-full bg-slate-900 border rounded-sm px-3 py-2 text-xs text-white focus:outline-none ${
                    errors.patientType ? 'border-red-500' : 'border-slate-700 focus:border-slate-500'
                  }`}
                >
                  <option value="">-- Select person --</option>
                  <option value="Self">Self</option>
                  <option value="Family member">Family member</option>
                  <option value="Neighbor">Neighbor / resident</option>
                  <option value="Colleague">Colleague / coworker</option>
                </select>
                {errors.patientType && (
                  <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                    <span>{errors.patientType}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Symptoms Checklist */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5 text-slate-400" />
                Symptom checklist
              </label>
              <div
                className={`space-y-1.5 max-h-40 overflow-y-auto pr-1 border p-1 rounded-sm ${
                  errors.symptoms ? 'border-red-500/60 bg-red-950/10' : 'border-transparent'
                }`}
              >
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
              {errors.symptoms && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                  <span>{errors.symptoms}</span>
                </p>
              )}
            </div>

            {/* Landmark & Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Landmark / sector (optional)
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
                Additional comments or clinical notes
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
                Submit report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
