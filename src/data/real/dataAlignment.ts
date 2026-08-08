import {
  AlignedAreaRecord,
  DataQualitySummary,
  DhakaArea,
  HistoricalDengueRecord,
  HistoricalPopulationRecord,
  HistoricalRainfallRecord,
} from '../../types';
import { HISTORICAL_DENGUE_DATA } from './dengueCases';
import { getRainfallForArea, HISTORICAL_RAINFALL_DATA } from './rainfall';
import { HISTORICAL_POPULATION_DATA } from './population';
import { REAL_DATA_SOURCES } from './dataSources';

/**
 * Data Alignment Engine
 * Performs relational joining across Dengue, Rainfall, and Demographic datasets on key: (areaId, year, month).
 */
export function alignRealDatasets(
  dengueRecords: HistoricalDengueRecord[] = HISTORICAL_DENGUE_DATA,
  rainfallRecords: HistoricalRainfallRecord[] = HISTORICAL_RAINFALL_DATA,
  populationRecords: HistoricalPopulationRecord[] = HISTORICAL_POPULATION_DATA,
  selectedYear: number = 2024,
  selectedMonth: number = 7
): AlignedAreaRecord[] {
  return populationRecords.map((popRecord) => {
    // 1. Join Dengue Cases on (areaId, year, month)
    const dengueMatch = dengueRecords.find(
      (d) => d.areaId === popRecord.areaId && d.year === selectedYear && d.month === selectedMonth
    );

    // 2. Join Rainfall on Station mapping for (areaId, year, month)
    const rainMatch = getRainfallForArea(popRecord.areaId, selectedYear, selectedMonth);

    const dengueCases = dengueMatch ? dengueMatch.cases : null;
    const rainfallMm = rainMatch ? rainMatch.rainfallMm : null;
    const rainfallLag1m = rainMatch?.rainfallMm_lag1m ?? null;
    const rainfallLag2w = rainMatch?.rainfallMm_lag2w ?? null;
    const rainfallLag3w = rainMatch?.rainfallMm_lag3w ?? null;

    const population = popRecord.population;
    const areaSqKm = popRecord.areaSqKm;
    const populationDensity = popRecord.populationDensity;

    // 3. Evaluate Data Quality & Missingness
    const missingFields: string[] = [];
    if (dengueCases === null) missingFields.push('dengueCases');
    if (rainfallMm === null) missingFields.push('rainfallMm');
    if (population === null) missingFields.push('population');

    let dataQuality: 'complete' | 'partially_complete' | 'missing' | 'interpolated' = 'complete';
    if (missingFields.length === 3) {
      dataQuality = 'missing';
    } else if (missingFields.length > 0) {
      dataQuality = 'partially_complete';
    }

    return {
      areaId: popRecord.areaId,
      area: popRecord.area,
      corporation: popRecord.corporation,
      year: selectedYear,
      month: selectedMonth,
      dengueCases,
      rainfallMm,
      rainfallLag1m,
      rainfallLag2w,
      rainfallLag3w,
      population,
      areaSqKm,
      populationDensity,
      dataQuality,
      missingFields,
      sources: {
        dengue: dengueMatch?.source || undefined,
        rainfall: rainMatch?.source || undefined,
        population: popRecord.source || undefined,
      },
    };
  });
}

/**
 * Calculates dynamic Data Quality Dashboard Statistics
 */
export function computeDataQualitySummary(
  alignedRecords: AlignedAreaRecord[]
): DataQualitySummary {
  const totalRecords = alignedRecords.length;
  const completeRecords = alignedRecords.filter((r) => r.dataQuality === 'complete').length;
  const partiallyCompleteRecords = alignedRecords.filter((r) => r.dataQuality === 'partially_complete').length;
  const missingRecords = alignedRecords.filter((r) => r.dataQuality === 'missing').length;

  const uniqueAreas = new Set(alignedRecords.map((r) => r.areaId));
  const uniqueStations = new Set(HISTORICAL_RAINFALL_DATA.map((r) => r.stationId));

  return {
    totalRecords,
    completeRecords,
    partiallyCompleteRecords,
    missingRecords,
    coveragePeriod: '2023 – 2024 (Monthly Historical Series)',
    uniqueAreasCount: uniqueAreas.size,
    rainfallStationsCount: uniqueStations.size,
    lastUpdated: '2024-11-09',
    sources: REAL_DATA_SOURCES,
  };
}

/**
 * Evaluates historical validation metrics across multi-period records
 * Compares observed cases with model risk scores and outputs Precision, Recall, F1, MAE, RMSE, Pearson r.
 */
export function evaluateHistoricalValidation(
  modelWeights: { cases: number; rainfall: number; density: number } = { cases: 0.5, rainfall: 0.3, density: 0.2 }
) {
  // Extract historical dataset rows for alignment
  const evaluationRows: {
    areaId: string;
    area: string;
    year: number;
    month: number;
    observedCases: number;
    rainfallMm: number;
    density: number;
    predictedRisk: number;
    observedHighRisk: boolean;
    predictedHighRisk: boolean;
  }[] = [];

  HISTORICAL_DENGUE_DATA.forEach((dengue) => {
    const rain = getRainfallForArea(dengue.areaId, dengue.year, dengue.month);
    const pop = HISTORICAL_POPULATION_DATA.find((p) => p.areaId === dengue.areaId);

    if (dengue.cases !== null && rain && pop) {
      evaluationRows.push({
        areaId: dengue.areaId,
        area: dengue.area,
        year: dengue.year,
        month: dengue.month,
        observedCases: dengue.cases,
        rainfallMm: rain.rainfallMm,
        density: pop.populationDensity,
        predictedRisk: 0, // calculated below after normalization
        observedHighRisk: dengue.cases >= 400, // Threshold for high case surge
        predictedHighRisk: false,
      });
    }
  });

  if (evaluationRows.length === 0) {
    return {
      isValid: false,
      message: 'Insufficient historical records for statistical validation.',
      metrics: null,
      rows: [],
    };
  }

  // Calculate Min-Max bounds for normalization across the evaluation set
  const maxCases = Math.max(...evaluationRows.map((r) => r.observedCases)) || 1;
  const minCases = Math.min(...evaluationRows.map((r) => r.observedCases));
  const caseRange = maxCases - minCases || 1;

  const maxRain = Math.max(...evaluationRows.map((r) => r.rainfallMm)) || 1;
  const minRain = Math.min(...evaluationRows.map((r) => r.rainfallMm));
  const rainRange = maxRain - minRain || 1;

  const maxDens = Math.max(...evaluationRows.map((r) => r.density)) || 1;
  const minDens = Math.min(...evaluationRows.map((r) => r.density));
  const densRange = maxDens - minDens || 1;

  // Compute Risk Scores per row
  evaluationRows.forEach((row) => {
    const normCases = (row.observedCases - minCases) / caseRange;
    const normRain = (row.rainfallMm - minRain) / rainRange;
    const normDens = (row.density - minDens) / densRange;

    const risk =
      modelWeights.cases * normCases +
      modelWeights.rainfall * normRain +
      modelWeights.density * normDens;

    row.predictedRisk = Math.round(risk * 100) / 100;
    row.predictedHighRisk = row.predictedRisk >= 0.50;
  });

  // Calculate Classification Metrics (TP, FP, TN, FN)
  let tp = 0, fp = 0, tn = 0, fn = 0;
  let sumAbsErr = 0;
  let sumSqErr = 0;

  evaluationRows.forEach((r) => {
    const normActualRisk = (r.observedCases - minCases) / caseRange;
    const err = Math.abs(r.predictedRisk - normActualRisk);
    sumAbsErr += err;
    sumSqErr += err * err;

    if (r.observedHighRisk && r.predictedHighRisk) tp++;
    else if (!r.observedHighRisk && r.predictedHighRisk) fp++;
    else if (!r.observedHighRisk && !r.predictedHighRisk) tn++;
    else if (r.observedHighRisk && !r.predictedHighRisk) fn++;
  });

  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const mae = sumAbsErr / evaluationRows.length;
  const rmse = Math.sqrt(sumSqErr / evaluationRows.length);

  // Pearson Correlation (r) between predicted risk and actual cases
  const meanPredicted = evaluationRows.reduce((a, b) => a + b.predictedRisk, 0) / evaluationRows.length;
  const meanObserved = evaluationRows.reduce((a, b) => a + b.observedCases, 0) / evaluationRows.length;

  let num = 0, denP = 0, denO = 0;
  evaluationRows.forEach((r) => {
    const dP = r.predictedRisk - meanPredicted;
    const dO = r.observedCases - meanObserved;
    num += dP * dO;
    denP += dP * dP;
    denO += dO * dO;
  });

  const pearsonCorrelation = denP > 0 && denO > 0 ? num / Math.sqrt(denP * denO) : 0;

  return {
    isValid: true,
    totalRecordsEvaluated: evaluationRows.length,
    metrics: {
      precision: Math.round(precision * 100) / 100,
      recall: Math.round(recall * 100) / 100,
      f1Score: Math.round(f1Score * 100) / 100,
      mae: Math.round(mae * 1000) / 1000,
      rmse: Math.round(rmse * 1000) / 1000,
      pearsonCorrelation: Math.round(pearsonCorrelation * 100) / 100,
      truePositives: tp,
      falsePositives: fp,
      trueNegatives: tn,
      falseNegatives: fn,
    },
    rows: evaluationRows,
  };
}

/**
 * Maps aligned real research records to DhakaArea objects for map rendering
 */
export function mapAlignedRecordsToDhakaAreas(
  alignedRecords: AlignedAreaRecord[],
  defaultAreas: DhakaArea[]
): DhakaArea[] {
  // Use the most recent month's aligned records (e.g., 2024 November/October)
  const currentRecordsMap = new Map<string, AlignedAreaRecord>();
  alignedRecords.forEach((rec) => {
    // Keep most recent record per areaId
    const existing = currentRecordsMap.get(rec.areaId);
    if (!existing || (rec.year >= existing.year && rec.month > existing.month)) {
      currentRecordsMap.set(rec.areaId, rec);
    }
  });

  return defaultAreas.map((area) => {
    const realRecord = currentRecordsMap.get(area.id);
    if (!realRecord) return area;

    return {
      ...area,
      recentCases30d: realRecord.dengueCases ?? area.recentCases30d,
      recentRainfallMm: realRecord.rainfallMm ?? area.recentRainfallMm,
      populationDensity: realRecord.populationDensity ?? area.populationDensity,
      isRealData: true,
      lastUpdated: '2024-11-09',
    };
  });
}




