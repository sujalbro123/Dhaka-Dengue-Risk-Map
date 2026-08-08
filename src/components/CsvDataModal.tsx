import React, { useState } from 'react';
import { ComputedAreaRisk } from '../types';
import { validateAndParseCsv, exportRiskReportCSV, CsvValidationResult } from '../utils/riskCalculator';
import { FileSpreadsheet, Download, Upload, Check, AlertCircle, X, FileText, AlertTriangle } from 'lucide-react';

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
  const [validationResult, setValidationResult] = useState<CsvValidationResult | null>(null);
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
        const result = validateAndParseCsv(content);
        setValidationResult(result);

        if (result.isValid && result.recordsParsed > 0) {
          const mappedRows: Partial<ComputedAreaRisk>[] = result.data.map((item) => ({
            name: item.area || item.station || item.areaId || item.name,
            recentCases30d: item.cases ?? item.recentCases30d ?? 0,
            recentRainfallMm: item.rainfallMm ?? item.recentRainfallMm ?? 0,
            populationDensity: item.populationDensity ?? 0,
          }));
          setPreviewRows(mappedRows);
          setStatusMsg({
            type: 'success',
            text: `Successfully validated & parsed ${result.recordsParsed} records (${result.type.toUpperCase()} Schema).`,
          });
        } else {
          setPreviewRows([]);
          setStatusMsg({
            type: 'error',
            text: result.errors[0] || 'CSV validation failed. Please review errors below.',
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
      text: 'Loaded verified CSV data into the risk model.',
    });
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const downloadSampleCsv = (schema: 'dengue' | 'rainfall' | 'population' | 'combined') => {
    let headers = '';
    let rows: string[] = [];
    let fileName = '';

    if (schema === 'dengue') {
      headers = 'areaId,area,year,month,cases\n';
      rows = [
        'mirpur,Mirpur,2024,7,685',
        'uttara,Uttara,2024,7,310',
        'gulshan-banani,Gulshan & Banani,2024,7,195',
        'dhanmondi,Dhanmondi,2024,7,540',
        'mohammadpur,Mohammadpur,2024,7,610',
        'old-dhaka,Old Dhaka,2024,7,790',
      ];
      fileName = 'DGHS_Dengue_Cases_Template.csv';
    } else if (schema === 'rainfall') {
      headers = 'stationId,station,year,month,rainfallMm\n';
      rows = [
        'dhaka_bmd,Dhaka BMD Central,2024,5,215',
        'dhaka_bmd,Dhaka BMD Central,2024,6,340',
        'dhaka_bmd,Dhaka BMD Central,2024,7,385',
        'dhaka_bmd,Dhaka BMD Central,2024,8,310',
      ];
      fileName = 'BMD_Rainfall_Data_Template.csv';
    } else if (schema === 'population') {
      headers = 'areaId,area,year,population,areaSqKm\n';
      rows = [
        'mirpur,Mirpur,2024,1150000,24.1',
        'uttara,Uttara,2024,580000,26.5',
        'dhanmondi,Dhanmondi,2024,280000,4.3',
        'old-dhaka,Old Dhaka,2024,620000,7.8',
      ];
      fileName = 'BBS_Population_Data_Template.csv';
    } else {
      headers = 'area_name,month,case_count,rainfall_mm,population_density\n';
      rows = [
        'Mirpur,July,685,345,47717',
        'Uttara,July,310,380,21886',
        'Gulshan,July,220,360,17582',
        'Dhanmondi,July,490,330,67441',
      ];
      fileName = 'DGHS_Combined_Risk_Template.csv';
    }

    const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
      <div className="bg-slate-900 border border-[#E3E1DA]/20 rounded-sm max-w-3xl w-full p-5 sm:p-6 text-slate-100 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-slate-800 text-slate-300 rounded-sm border border-slate-700">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Research Data Import & Schema Validator</h2>
              <p className="text-xs text-slate-400">
                Import verified Dengue, Rainfall, or Population CSVs with strict schema validation
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
          {/* Supported Schema Specifications */}
          <div className="bg-slate-950 p-3.5 rounded-sm border border-slate-800 space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" />
              Supported Modular CSV Formats:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <div className="bg-slate-900 p-2 rounded-sm border border-slate-800">
                <span className="text-emerald-400 font-bold block font-sans text-[10px]">1. Dengue CSV</span>
                <code className="text-slate-300">areaId,area,year,month,cases</code>
              </div>
              <div className="bg-slate-900 p-2 rounded-sm border border-slate-800">
                <span className="text-cyan-400 font-bold block font-sans text-[10px]">2. Rainfall CSV</span>
                <code className="text-slate-300">stationId,station,year,month,rainfallMm</code>
              </div>
              <div className="bg-slate-900 p-2 rounded-sm border border-slate-800">
                <span className="text-amber-400 font-bold block font-sans text-[10px]">3. Population CSV</span>
                <code className="text-slate-300">areaId,area,year,population,areaSqKm</code>
              </div>
            </div>
            <p className="text-slate-400 text-xs">
              Automatic validation catches missing columns, non-numeric values, invalid months (1-12), and unknown area IDs.
            </p>
          </div>

          {/* Template Download Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Download Template:</span>
            <button
              onClick={() => downloadSampleCsv('dengue')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-sm text-xs font-mono transition-colors"
            >
              Dengue CSV
            </button>
            <button
              onClick={() => downloadSampleCsv('rainfall')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-sm text-xs font-mono transition-colors"
            >
              Rainfall CSV
            </button>
            <button
              onClick={() => downloadSampleCsv('population')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-sm text-xs font-mono transition-colors"
            >
              Population CSV
            </button>
            <button
              onClick={() => exportRiskReportCSV(computedAreas)}
              className="ml-auto px-3 py-1 bg-[#1F3A5F] hover:bg-[#1a3050] text-white border border-[#E3E1DA]/30 rounded-sm text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-300" />
              Export Calculated Risk CSV
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
              <Upload className="w-6 h-6 text-blue-400" />
              <span className="font-semibold text-xs sm:text-sm">
                Click to browse or drop a research .csv file here
              </span>
              <span className="text-[11px] text-slate-500">
                Validates headers, numbers, and geographic area IDs automatically
              </span>
            </label>
          </div>

          {/* Validation Feedback Messages */}
          {validationResult && (
            <div className="space-y-2">
              {validationResult.errors.length > 0 && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-sm text-xs text-red-300 space-y-1 font-mono">
                  <div className="flex items-center gap-1.5 font-bold text-red-400 font-sans">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Schema Validation Errors ({validationResult.errors.length}):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1 max-h-24 overflow-y-auto">
                    {validationResult.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult.warnings.length > 0 && (
                <div className="p-3 bg-amber-950/60 border border-amber-500/50 rounded-sm text-xs text-amber-300 space-y-1 font-mono">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 font-sans">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Data Quality Warnings ({validationResult.warnings.length}):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1 max-h-24 overflow-y-auto">
                    {validationResult.warnings.map((warn, idx) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* General Status Message */}
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
              <div className="font-semibold text-slate-300 text-xs flex items-center justify-between">
                <span>Validated Data Preview ({previewRows.length} records):</span>
                <span className="text-emerald-400 font-mono text-[11px]">Ready for Risk Model Integration</span>
              </div>
              <div className="max-h-40 overflow-y-auto border border-slate-800 rounded-sm">
                <table className="w-full text-left text-xs bg-slate-950 font-mono">
                  <thead className="border-b border-slate-800 text-slate-400 sticky top-0 bg-slate-900 font-sans">
                    <tr>
                      <th className="p-2">Entity Name</th>
                      <th className="p-2">Cases</th>
                      <th className="p-2">Rainfall (mm)</th>
                      <th className="p-2">Density (/km²)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {previewRows.map((row, i) => (
                      <tr key={i} className="text-slate-300">
                        <td className="p-2 font-bold text-white font-sans">{row.name}</td>
                        <td className="p-2 text-blue-400 font-semibold">{row.recentCases30d ?? 'N/A'}</td>
                        <td className="p-2 text-cyan-400">{row.recentRainfallMm ?? 'N/A'}</td>
                        <td className="p-2">{row.populationDensity ? row.populationDensity.toLocaleString() : 'N/A'}</td>
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
          {previewRows.length > 0 && validationResult?.isValid && (
            <button
              onClick={handleApplyCustomData}
              className="px-4 py-2 bg-[#1F3A5F] hover:bg-[#1a3050] text-white rounded-sm text-xs font-bold border border-[#E3E1DA]/30 transition-colors"
            >
              Apply Validated Dataset to Risk Model
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

