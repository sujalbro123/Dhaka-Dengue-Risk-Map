import React, { useState } from 'react';
import { ComputedAreaRisk } from '../types';
import { parseCSVData, exportRiskReportCSV } from '../utils/riskCalculator';
import { FileSpreadsheet, Download, Upload, Check, AlertCircle, X, FileText } from 'lucide-react';

interface CsvDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  computedAreas: ComputedAreaRisk[];
  onImportCustomData: (imported: Partial<ComputedAreaRisk>[]) => void;
}

export const CsvDataModal: React.FC<CsvDataModalProps> = ({
  isOpen,
  onClose,
  computedAreas,
  onImportCustomData,
}) => {
  const [csvText, setCsvText] = useState('');
  const [previewRows, setPreviewRows] = useState<Partial<ComputedAreaRisk>[]>([]);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCsvText(content);
        const parsed = parseCSVData(content);
        setPreviewRows(parsed);
        if (parsed.length > 0) {
          setStatusMsg({
            type: 'success',
            text: `Successfully parsed ${parsed.length} area records!`,
          });
        } else {
          setStatusMsg({
            type: 'error',
            text: 'Could not parse valid records. Check CSV headers.',
          });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleApplyCustomData = () => {
    if (previewRows.length === 0) return;
    onImportCustomData(previewRows);
    setStatusMsg({
      type: 'success',
      text: 'Custom DGHS / Rainfall data successfully loaded into risk map model!',
    });
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const downloadTemplateCSV = () => {
    const sampleHeaders = 'area_name,month,case_count,rainfall_mm,population_density\n';
    const sampleRows = [
      'Mirpur,July,685,345,47717',
      'Uttara,July,310,380,21886',
      'Gulshan,July,220,360,17582',
      'Dhanmondi,July,490,330,67441',
      'Mohammadpur,July,780,350,73553',
      'Old Dhaka,July,940,370,91216',
      'Badda,July,540,390,43636',
      'Motijheel,July,410,310,79166',
      'Jatrabari,July,810,365,69696',
      'Khilgaon,July,460,355,43262',
      'Tejgaon,July,510,330,41836',
      'Cantonment,July,110,320,21794',
    ].join('\n');

    const blob = new Blob([sampleHeaders + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'DGHS_Dhaka_Dengue_Data_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
      <div className="bg-slate-900 border border-[#E3E1DA]/20 rounded-sm max-w-2xl w-full p-5 sm:p-6 text-slate-100 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-slate-800 text-slate-300 rounded-sm border border-slate-700">
              <FileSpreadsheet className="w-4 h-4 text-slate-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Custom Data Import & CSV Exporter</h2>
              <p className="text-xs text-slate-400">
                Upload real DGHS Dengue cases and rainfall CSV data or export calculated risk reports
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
          {/* Format Specification Banner */}
          <div className="bg-slate-950 p-3.5 rounded-sm border border-slate-800">
            <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              Required CSV Schema Format:
            </div>
            <code className="block bg-slate-900 p-2 rounded-sm text-[11px] font-mono text-cyan-300 mt-1 overflow-x-auto">
              area_name, month, case_count, rainfall_mm, population_density
            </code>
            <p className="text-slate-400 text-xs mt-2">
              Columns can be in any order. Header names are auto-matched (e.g. <i>area</i>, <i>cases</i>, <i>rainfall</i>, <i>density</i>).
            </p>
          </div>

          {/* Action Buttons: Download Template vs Export Report */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={downloadTemplateCSV}
              className="flex items-center justify-center gap-2 p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-sm font-semibold text-xs transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download CSV Template</span>
            </button>

            <button
              onClick={() => exportRiskReportCSV(computedAreas)}
              className="flex items-center justify-center gap-2 p-2.5 bg-[#1F3A5F] hover:bg-[#1a3050] text-white border border-[#E3E1DA]/30 rounded-sm font-semibold text-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-300" />
              <span>Export Risk Report CSV</span>
            </button>
          </div>

          {/* Upload Box */}
          <div className="border border-dashed border-slate-700 hover:border-slate-500 rounded-sm p-5 text-center bg-slate-950 transition-colors">
            <input
              type="file"
              accept=".csv"
              id="csv-upload"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer flex flex-col items-center justify-center gap-2 text-slate-300"
            >
              <Upload className="w-6 h-6 text-slate-400" />
              <span className="font-semibold text-xs sm:text-sm">
                Click to browse or drop your DGHS .csv file here
              </span>
              <span className="text-[11px] text-slate-500">
                Accepts comma-separated values (.csv)
              </span>
            </label>
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div
              className={`p-3 rounded-sm text-xs flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {previewRows.length > 0 && (
            <div className="space-y-2">
              <div className="font-semibold text-slate-300 text-xs">
                Parsed Data Preview ({previewRows.length} Areas):
              </div>
              <div className="max-h-40 overflow-y-auto border border-slate-800 rounded-sm">
                <table className="w-full text-left text-xs bg-slate-950 font-mono">
                  <thead className="border-b border-slate-800 text-slate-400 sticky top-0 bg-slate-900 font-sans">
                    <tr>
                      <th className="p-2">Area Name</th>
                      <th className="p-2">30d Cases</th>
                      <th className="p-2">Rainfall (mm)</th>
                      <th className="p-2">Density (/km²)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {previewRows.map((row, i) => (
                      <tr key={i} className="text-slate-300">
                        <td className="p-2 font-bold text-white font-sans">{row.name}</td>
                        <td className="p-2 text-blue-400 font-semibold">{row.recentCases30d}</td>
                        <td className="p-2 text-cyan-400">{row.recentRainfallMm}</td>
                        <td className="p-2">{row.populationDensity?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-xs font-semibold border border-slate-700"
          >
            Cancel
          </button>
          {previewRows.length > 0 && (
            <button
              onClick={handleApplyCustomData}
              className="px-4 py-2 bg-[#1F3A5F] hover:bg-[#1a3050] text-white rounded-sm text-xs font-bold border border-[#E3E1DA]/30 transition-colors"
            >
              Apply to Risk Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
