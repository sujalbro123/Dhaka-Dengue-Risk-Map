import { DhakaArea, ComputedAreaRisk, ModelWeights, SimulationModifiers, RiskLevel } from '../types';
import { MODEL_CONFIG } from '../config/appConfig';

export const DEFAULT_WEIGHTS: ModelWeights = MODEL_CONFIG.defaultWeights;
export const DEFAULT_MODIFIERS: SimulationModifiers = MODEL_CONFIG.defaultModifiers;

/**
 * Computes normalized risk score (0.0 to 1.0) from individual 0-1 normalized factors.
 * Each input (normCases, normRainfall, normDensity) MUST be independently min-max normalized
 * to [0, 1] BEFORE calling this function or applying weights (0.5 / 0.3 / 0.2).
 */
export function calculateRiskScore(
  normCases: number,
  normRainfall: number,
  normDensity: number,
  weights: ModelWeights = DEFAULT_WEIGHTS
): number {
  const totalWeight = weights.casesWeight + weights.rainfallWeight + weights.densityWeight || 1.0;
  const weightedCases = normCases * weights.casesWeight;
  const weightedRainfall = normRainfall * weights.rainfallWeight;
  const weightedDensity = normDensity * weights.densityWeight;
  return (weightedCases + weightedRainfall + weightedDensity) / totalWeight;
}

export function calculateAreaRisks(
  areas: DhakaArea[],
  weights: ModelWeights = DEFAULT_WEIGHTS,
  modifiers: SimulationModifiers = DEFAULT_MODIFIERS
): ComputedAreaRisk[] {

  if (areas.length === 0) return [];

  // Calculate adjusted current raw values based on simulation modifiers or what-if rainfall
  const adjustedData = areas.map((area) => {
    const cases = Math.round(area.recentCases30d * modifiers.caseMultiplier);
    const rainfall =
      modifiers.whatIfRainfallMm != null
        ? Math.round(modifiers.whatIfRainfallMm)
        : Math.round(area.recentRainfallMm * modifiers.rainfallMultiplier);
    const density = Math.round(area.populationDensity * modifiers.densityModifier);

    // Prior week estimated values (if not provided, default to realistic historical ratio)
    const lastWeekCases = area.lastWeekCases30d ?? Math.round(cases * 0.90);
    const lastWeekRain = area.lastWeekRainfallMm ?? Math.round(rainfall * 0.92);

    // Prior year estimated values (if not provided, default to realistic prior year ratio)
    const priorYearCases = area.priorYearCases30d ?? Math.round(cases * 0.76);
    const priorYearRain = area.priorYearRainfallMm ?? Math.round(rainfall * 0.90);

    return {
      id: area.id,
      cases,
      rainfall,
      density,
      lastWeekCases,
      lastWeekRain,
      priorYearCases,
      priorYearRain,
    };
  });

  // Find min and max for normalization (0 to 1) across current datasets
  let minCases = Infinity, maxCases = -Infinity;
  let minRain = Infinity, maxRain = -Infinity;
  let minDensity = Infinity, maxDensity = -Infinity;

  adjustedData.forEach((item) => {
    if (item.cases < minCases) minCases = item.cases;
    if (item.cases > maxCases) maxCases = item.cases;

    if (item.rainfall < minRain) minRain = item.rainfall;
    if (item.rainfall > maxRain) maxRain = item.rainfall;

    if (item.density < minDensity) minDensity = item.density;
    if (item.density > maxDensity) maxDensity = item.density;
  });

  // Guard against divide by zero if max === min
  const caseRange = maxCases - minCases || 1;
  const rainRange = maxRain - minRain || 1;
  const densityRange = maxDensity - minDensity || 1;

  const totalWeight = weights.casesWeight + weights.rainfallWeight + weights.densityWeight || 1.0;

  // Compute normalized scores and weighted sum
  return areas.map((area, index) => {
    const adj = adjustedData[index];

    // Normalized 0 to 1
    const normCases = Math.max(0, Math.min(1, (adj.cases - minCases) / caseRange));
    const normRainfall = Math.max(0, Math.min(1, (adj.rainfall - minRain) / rainRange));
    const normDensity = Math.max(0, Math.min(1, (adj.density - minDensity) / densityRange));

    // Weighted components
    const weightedCases = normCases * weights.casesWeight;
    const weightedRainfall = normRainfall * weights.rainfallWeight;
    const weightedDensity = normDensity * weights.densityWeight;

    // Total current risk score (0.0 to 1.0)
    const rawRiskScore = calculateRiskScore(normCases, normRainfall, normDensity, weights);
    const riskScore100 = Math.round(rawRiskScore * 100);

    // Last Week Risk Score Calculation
    const lwNormCases = Math.max(0, Math.min(1, (adj.lastWeekCases - minCases) / caseRange));
    const lwNormRainfall = Math.max(0, Math.min(1, (adj.lastWeekRain - minRain) / rainRange));
    const lwRawScore = calculateRiskScore(lwNormCases, lwNormRainfall, normDensity, weights);
    const lastWeekRiskScore = Math.round(lwRawScore * 100);

    // Trend determination
    const trendDelta = riskScore100 - lastWeekRiskScore;
    let trend: 'rising' | 'falling' | 'stable' = 'stable';
    if (trendDelta >= 2) {
      trend = 'rising';
    } else if (trendDelta <= -2) {
      trend = 'falling';
    } else {
      trend = 'stable';
    }

    // Prior Year Risk Score Calculation
    const pyNormCases = Math.max(0, Math.min(1, (adj.priorYearCases - minCases) / caseRange));
    const pyNormRainfall = Math.max(0, Math.min(1, (adj.priorYearRain - minRain) / rainRange));
    const pyRawScore = calculateRiskScore(pyNormCases, pyNormRainfall, normDensity, weights);
    const priorYearRiskScore = Math.round(pyRawScore * 100);

    // Year over year comparison percentage
    const diffScore = riskScore100 - priorYearRiskScore;
    const yearOverYearChangePercent = priorYearRiskScore > 0
      ? Math.round((diffScore / priorYearRiskScore) * 100)
      : Math.round(((adj.cases - adj.priorYearCases) / (adj.priorYearCases || 1)) * 100);

    const yearOverYearText =
      yearOverYearChangePercent > 0
        ? `${area.name} risk score is ${yearOverYearChangePercent}% higher than the same period last year`
        : yearOverYearChangePercent < 0
        ? `${area.name} risk score is ${Math.abs(yearOverYearChangePercent)}% lower than the same period last year`
        : `${area.name} risk score is equal to the same period last year`;

    let riskLevel: RiskLevel = 'low';
    if (rawRiskScore >= MODEL_CONFIG.thresholds.criticalRisk) {
      riskLevel = 'critical';
    } else if (rawRiskScore >= MODEL_CONFIG.thresholds.highRisk) {
      riskLevel = 'high';
    } else if (rawRiskScore >= MODEL_CONFIG.thresholds.moderateRisk) {
      riskLevel = 'moderate';
    } else {
      riskLevel = 'low';
    }

    // Capacity status
    const hospitalBeds = area.hospitalBeds || 100;
    const currentPatients = Math.round((area.currentPatients || adj.cases) * modifiers.caseMultiplier);
    const capacityGap = currentPatients - hospitalBeds;
    const occupancyRatio = currentPatients / hospitalBeds;
    let capacityStatus: 'adequate' | 'strained' | 'overcapacity' = 'adequate';
    if (occupancyRatio > MODEL_CONFIG.thresholds.overcapacityRatio) {
      capacityStatus = 'overcapacity';
    } else if (occupancyRatio >= MODEL_CONFIG.thresholds.strainedCapacityRatio) {
      capacityStatus = 'strained';
    } else {
      capacityStatus = 'adequate';
    }

    return {
      ...area,
      recentCases30d: adj.cases,
      recentRainfallMm: adj.rainfall,
      populationDensity: adj.density,
      hospitalBeds,
      currentPatients,
      crowdsourcedReports: area.crowdsourcedReports || 0,
      capacityGap,
      capacityStatus,
      trend,
      trendDelta,
      lastWeekRiskScore,
      priorYearCases30d: adj.priorYearCases,
      priorYearRiskScore,
      yearOverYearChangePercent,
      yearOverYearText,
      normalized: {
        normCases,
        normRainfall,
        normDensity,
      },
      rawRiskScore,
      riskScore100,
      riskLevel,
      weightedCasesContribution: Math.round(weightedCases * 100),
      weightedRainfallContribution: Math.round(weightedRainfall * 100),
      weightedDensityContribution: Math.round(weightedDensity * 100),
    };
  });
}

export function getRiskBadgeColor(level: RiskLevel) {
  switch (level) {
    case 'critical':
      return {
        bg: 'bg-red-950/70',
        text: 'text-red-400 font-extrabold',
        border: 'border-red-500/80',
        fill: '#dc2626',
        glow: '',
        label: 'Critical Threat (>0.80)',
      };
    case 'high':
      return {
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        fill: '#f43f5e',
        glow: '',
        label: 'High Risk (60-79)',
      };
    case 'moderate':
      return {
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        fill: '#f59e0b',
        glow: '',
        label: 'Moderate Risk (35-59)',
      };
    case 'low':
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        fill: '#10b981',
        glow: '',
        label: 'Low Risk (<35)',
      };
  }
}

export interface CsvValidationResult {
  isValid: boolean;
  type: 'dengue' | 'rainfall' | 'population' | 'combined' | 'unknown';
  recordsParsed: number;
  errors: string[];
  warnings: string[];
  data: any[];
}

export const KNOWN_AREA_IDS = [
  'mirpur', 'uttara', 'gulshan-banani', 'dhanmondi', 'mohammadpur',
  'old-dhaka', 'motijheel', 'tejgaon', 'badda', 'khilgaon',
  'lalbagh', 'jatrabari', 'ramna', 'shahbagh', 'kamrangirchar',
  'cantonment', 'kafrul', 'hazaribagh', 'demra', 'sabujbagh'
];

export function validateAndParseCsv(csvText: string): CsvValidationResult {
  const lines = csvText.trim().split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length < 2) {
    return {
      isValid: false,
      type: 'unknown',
      recordsParsed: 0,
      errors: ['CSV file is empty or missing data rows.'],
      warnings: [],
      data: [],
    };
  }

  const headerCols = lines[0].toLowerCase().split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const errors: string[] = [];
  const warnings: string[] = [];
  const parsedData: any[] = [];
  const seenKeys = new Set<string>();

  // Detect Schema Type
  let schemaType: 'dengue' | 'rainfall' | 'population' | 'combined' | 'unknown' = 'unknown';

  if (headerCols.includes('areaid') && headerCols.includes('cases')) {
    schemaType = 'dengue';
  } else if (headerCols.includes('stationid') && headerCols.includes('rainfallmm')) {
    schemaType = 'rainfall';
  } else if (headerCols.includes('areaid') && headerCols.includes('areasqkm')) {
    schemaType = 'population';
  } else if (headerCols.some((h) => h.includes('area')) && (headerCols.some((h) => h.includes('case')) || headerCols.some((h) => h.includes('rain')))) {
    schemaType = 'combined';
  }

  if (schemaType === 'unknown') {
    errors.push('Unrecognized CSV format. Headers must match one of: (areaId,area,year,month,cases), (stationId,station,year,month,rainfallMm), (areaId,area,year,population,areaSqKm), or (area_name,month,case_count,rainfall_mm,population_density).');
    return { isValid: false, type: 'unknown', recordsParsed: 0, errors, warnings, data: [] };
  }

  // Row by row validation
  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1;
    const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));

    if (cols.length < headerCols.length) {
      warnings.push(`Row ${rowNum}: Fewer columns than expected headers.`);
    }

    if (schemaType === 'dengue') {
      const areaIdIdx = headerCols.indexOf('areaid');
      const areaIdx = headerCols.indexOf('area');
      const yearIdx = headerCols.indexOf('year');
      const monthIdx = headerCols.indexOf('month');
      const casesIdx = headerCols.indexOf('cases');

      const areaId = cols[areaIdIdx]?.toLowerCase() || '';
      const area = cols[areaIdx] || areaId;
      const year = parseInt(cols[yearIdx], 10);
      const month = parseInt(cols[monthIdx], 10);
      const cases = parseInt(cols[casesIdx], 10);

      if (!areaId) errors.push(`Row ${rowNum}: Missing 'areaId'.`);
      else if (!KNOWN_AREA_IDS.includes(areaId)) warnings.push(`Row ${rowNum}: Unknown areaId '${areaId}'.`);

      if (isNaN(year) || year < 2000 || year > 2030) errors.push(`Row ${rowNum}: Invalid year value '${cols[yearIdx]}'.`);
      if (isNaN(month) || month < 1 || month > 12) errors.push(`Row ${rowNum}: Invalid month value '${cols[monthIdx]}' (must be 1-12).`);
      if (isNaN(cases) || cases < 0) errors.push(`Row ${rowNum}: Invalid non-numeric cases value '${cols[casesIdx]}'.`);

      const dedupeKey = `${areaId}-${year}-${month}`;
      if (seenKeys.has(dedupeKey)) {
        warnings.push(`Row ${rowNum}: Duplicate record for area '${areaId}' period ${year}-${month}.`);
      }
      seenKeys.add(dedupeKey);

      parsedData.push({ areaId, area, year, month, cases, source: 'User CSV Import' });
    } else if (schemaType === 'rainfall') {
      const stationIdIdx = headerCols.indexOf('stationid');
      const stationIdx = headerCols.indexOf('station');
      const yearIdx = headerCols.indexOf('year');
      const monthIdx = headerCols.indexOf('month');
      const rainIdx = headerCols.indexOf('rainfallmm');

      const stationId = cols[stationIdIdx] || 'custom_station';
      const station = cols[stationIdx] || stationId;
      const year = parseInt(cols[yearIdx], 10);
      const month = parseInt(cols[monthIdx], 10);
      const rainfallMm = parseFloat(cols[rainIdx]);

      if (isNaN(year) || year < 2000 || year > 2030) errors.push(`Row ${rowNum}: Invalid year '${cols[yearIdx]}'.`);
      if (isNaN(month) || month < 1 || month > 12) errors.push(`Row ${rowNum}: Invalid month '${cols[monthIdx]}' (must be 1-12).`);
      if (isNaN(rainfallMm) || rainfallMm < 0) errors.push(`Row ${rowNum}: Invalid rainfall value '${cols[rainIdx]}'.`);

      parsedData.push({ stationId, station, year, month, rainfallMm, source: 'User CSV Import' });
    } else if (schemaType === 'population') {
      const areaIdIdx = headerCols.indexOf('areaid');
      const areaIdx = headerCols.indexOf('area');
      const yearIdx = headerCols.indexOf('year');
      const popIdx = headerCols.indexOf('population');
      const sqkmIdx = headerCols.indexOf('areasqkm');

      const areaId = cols[areaIdIdx]?.toLowerCase() || '';
      const area = cols[areaIdx] || areaId;
      const year = parseInt(cols[yearIdx], 10) || 2024;
      const population = parseInt(cols[popIdx], 10);
      const areaSqKm = parseFloat(cols[sqkmIdx]);

      if (!areaId) errors.push(`Row ${rowNum}: Missing 'areaId'.`);
      if (isNaN(population) || population <= 0) errors.push(`Row ${rowNum}: Invalid population count '${cols[popIdx]}'.`);
      if (isNaN(areaSqKm) || areaSqKm <= 0) errors.push(`Row ${rowNum}: Invalid areaSqKm value '${cols[sqkmIdx]}'.`);

      const populationDensity = (!isNaN(population) && !isNaN(areaSqKm) && areaSqKm > 0)
        ? Math.round(population / areaSqKm)
        : 0;

      parsedData.push({ areaId, area, year, population, areaSqKm, populationDensity, source: 'User CSV Import' });
    } else if (schemaType === 'combined') {
      const nameIdx = headerCols.findIndex((h) => h.includes('area') || h.includes('name'));
      const casesIdx = headerCols.findIndex((h) => h.includes('case'));
      const rainIdx = headerCols.findIndex((h) => h.includes('rain'));
      const densityIdx = headerCols.findIndex((h) => h.includes('density') || h.includes('pop'));

      const name = nameIdx !== -1 ? cols[nameIdx] : `Area ${i}`;
      const cases = casesIdx !== -1 ? parseInt(cols[casesIdx], 10) || 0 : 0;
      const rain = rainIdx !== -1 ? parseFloat(cols[rainIdx]) || 0 : 0;
      const density = densityIdx !== -1 ? parseInt(cols[densityIdx], 10) || 0 : 0;

      parsedData.push({
        name,
        recentCases30d: cases,
        recentRainfallMm: rain,
        populationDensity: density,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    type: schemaType,
    recordsParsed: parsedData.length,
    errors,
    warnings,
    data: parsedData,
  };
}

export function parseCSVData(csvText: string): Partial<DhakaArea>[] {
  const result = validateAndParseCsv(csvText);
  if (result.type === 'combined') return result.data;
  return result.data.map((item) => ({
    name: item.area || item.station || item.areaId,
    recentCases30d: item.cases ?? item.recentCases30d ?? 0,
    recentRainfallMm: item.rainfallMm ?? item.recentRainfallMm ?? 0,
    populationDensity: item.populationDensity ?? 0,
  }));
}


export function exportRiskReportCSV(computedAreas: ComputedAreaRisk[]) {
  const headers = [
    'Area Name',
    'Corporation',
    'Risk Score (0-100)',
    'Risk Level',
    '30-Day Dengue Cases',
    'Recent Rainfall (mm)',
    'Pop Density (per sq km)',
    'Norm Cases (50% wt)',
    'Norm Rainfall (30% wt)',
    'Norm Density (20% wt)',
  ];

  const rows = computedAreas.map((a) => [
    `"${a.name}"`,
    a.corporation,
    a.riskScore100,
    a.riskLevel.toUpperCase(),
    a.recentCases30d,
    a.recentRainfallMm,
    a.populationDensity,
    a.normalized.normCases.toFixed(3),
    a.normalized.normRainfall.toFixed(3),
    a.normalized.normDensity.toFixed(3),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Dhaka_Dengue_Risk_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
