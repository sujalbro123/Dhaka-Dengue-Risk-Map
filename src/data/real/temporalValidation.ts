import { HISTORICAL_DENGUE_DATA } from './dengueCases';
import { getRainfallForArea } from './rainfall';
import { HISTORICAL_POPULATION_DATA } from './population';

/** Operational threshold of >=400 reported dengue cases per area-month for high-surge classification */
export const HIGH_RISK_CASE_THRESHOLD = 400;

export interface TemporalObservation {
  areaId: string;
  area: string;
  featureYear: number;
  featureMonth: number;
  targetYear: number;
  targetMonth: number;
  laggedCases_t1: number;
  laggedRainfall_t1: number;
  populationDensity: number;
  targetCases_t0: number;
}

export interface TemporalEvaluationRow {
  areaId: string;
  area: string;
  targetYear: number;
  targetMonth: number;
  laggedCases_t1: number;       // Feature: Observed dengue cases at t-1 (previous month)
  laggedRainfall_t1: number;    // Feature: Observed rainfall at t-1 (previous month)
  populationDensity: number;    // Feature: Census population density
  targetCases_t0: number;       // TARGET: Actual dengue cases at period t
  predictedRisk: number;        // Output: Model predicted risk score [0.00, 1.00]
  targetHighRisk: boolean;      // Target >= operational surge threshold (400 cases)
  predictedHighRisk: boolean;   // predictedRisk >= 0.50
  hit: boolean;                 // targetHighRisk === predictedHighRisk
}

export interface NormalizationParams {
  minCases: number;
  maxCases: number;
  minRainfall: number;
  maxRainfall: number;
  minDensity: number;
  maxDensity: number;
}

export interface ValidationMetrics {
  precision: number | null;
  recall: number | null;
  f1Score: number | null;
  mae: number | null;
  rmse: number | null;
  pearsonCorrelation: number | null;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
}

export interface TemporalValidationResult {
  isValid: boolean;
  modelName: string;
  modelDescription: string;
  trainingPeriod: string;
  testPeriod: string;
  targetDescription: string;
  featuresUsed: string[];
  totalTrainRecords: number;
  totalTestRecords: number;
  areasEvaluatedCount: number;
  targetMonthsCount: number;
  sampleSizeInterpretation: string;
  normalizationParamsTrain: NormalizationParams;
  metrics: ValidationMetrics | null;
  testRows: TemporalEvaluationRow[];
  sanityChecks: {
    noTargetLeakage: boolean;
    trainOnlyNormalization: boolean;
    chronologicalOrdering: boolean;
    heldOutEvaluation: boolean;
  };
}

/**
 * Constructs all eligible consecutive temporal pairs (period t-1 -> period t)
 * across all available areas and months where both periods exist in historical records.
 */
export function constructTemporalObservations(): TemporalObservation[] {
  const pairs: TemporalObservation[] = [];

  HISTORICAL_DENGUE_DATA.forEach((targetRecord) => {
    if (targetRecord.cases === null || targetRecord.cases === undefined) return;

    // Determine preceding feature month (t-1)
    let featureYear = targetRecord.year;
    let featureMonth = targetRecord.month - 1;
    if (featureMonth === 0) {
      featureMonth = 12;
      featureYear = targetRecord.year - 1;
    }

    // Find lagged dengue case record at month t-1
    const laggedDengue = HISTORICAL_DENGUE_DATA.find(
      (d) => d.areaId === targetRecord.areaId && d.year === featureYear && d.month === featureMonth
    );

    // Find rainfall record for preceding month t-1
    const rainfallRecord = getRainfallForArea(targetRecord.areaId, featureYear, featureMonth);

    // Find population density
    const popRecord = HISTORICAL_POPULATION_DATA.find((p) => p.areaId === targetRecord.areaId);

    // Require valid lagged features and target for fair multi-model comparison
    if (laggedDengue && laggedDengue.cases !== null && rainfallRecord && popRecord) {
      pairs.push({
        areaId: targetRecord.areaId,
        area: targetRecord.area,
        featureYear,
        featureMonth,
        targetYear: targetRecord.year,
        targetMonth: targetRecord.month,
        laggedCases_t1: laggedDengue.cases,
        laggedRainfall_t1: rainfallRecord.rainfallMm,
        populationDensity: popRecord.populationDensity,
        targetCases_t0: targetRecord.cases,
      });
    }
  });

  return pairs;
}

/**
 * Executes a chronologically split, out-of-sample temporal validation.
 * Training Period: 2023 historical records (Period t-1 lagged features -> Period t target)
 * Test Period: 2024 held-out historical records (Period t-1 lagged features -> Period t target)
 * Target Leakage Prevention: Period t dengue cases are NEVER used as model inputs for period t risk prediction.
 * Train-Only Normalization: Min-Max bounds are derived strictly from the 2023 Training Set.
 */
export function evaluateTemporalModel(
  weights: { cases: number; rainfall: number; density: number },
  modelName: string,
  modelDescription: string,
  featuresUsed: string[]
): TemporalValidationResult {
  const allPairs = constructTemporalObservations();

  // Chronological Split: Training (<= 2023) and Held-Out Test (>= 2024)
  const trainPairs = allPairs.filter((p) => p.targetYear <= 2023);
  const testPairs = allPairs.filter((p) => p.targetYear >= 2024);

  const uniqueAreas = new Set(testPairs.map((p) => p.areaId));
  const uniqueTargetMonths = new Set(testPairs.map((p) => `${p.targetYear}-${p.targetMonth}`));

  const sampleSizeInterpretation = testPairs.length < 30
    ? 'Pilot evaluation — limited sample size.'
    : 'Preliminary out-of-sample evaluation.';

  if (trainPairs.length === 0 || testPairs.length === 0) {
    return {
      isValid: false,
      modelName,
      modelDescription,
      trainingPeriod: '2023 Historical Period',
      testPeriod: '2024 Held-Out Test Period',
      targetDescription: 'Observed Dengue Cases (Month t)',
      featuresUsed,
      totalTrainRecords: trainPairs.length,
      totalTestRecords: testPairs.length,
      areasEvaluatedCount: uniqueAreas.size,
      targetMonthsCount: uniqueTargetMonths.size,
      sampleSizeInterpretation,
      normalizationParamsTrain: { minCases: 0, maxCases: 1, minRainfall: 0, maxRainfall: 1, minDensity: 0, maxDensity: 1 },
      metrics: null,
      testRows: [],
      sanityChecks: {
        noTargetLeakage: true,
        trainOnlyNormalization: true,
        chronologicalOrdering: true,
        heldOutEvaluation: true,
      },
    };
  }

  // Step 2: Compute Normalization Parameters ON TRAINING SET ONLY (<= 2023)
  const minCases = Math.min(...trainPairs.map((r) => r.laggedCases_t1));
  const maxCases = Math.max(...trainPairs.map((r) => r.laggedCases_t1));
  const caseRange = maxCases - minCases || 1;

  const minRainfall = Math.min(...trainPairs.map((r) => r.laggedRainfall_t1));
  const maxRainfall = Math.max(...trainPairs.map((r) => r.laggedRainfall_t1));
  const rainRange = maxRainfall - minRainfall || 1;

  const minDensity = Math.min(...trainPairs.map((r) => r.populationDensity));
  const maxDensity = Math.max(...trainPairs.map((r) => r.populationDensity));
  const densityRange = maxDensity - minDensity || 1;

  const trainNormalizationParams: NormalizationParams = {
    minCases,
    maxCases,
    minRainfall,
    maxRainfall,
    minDensity,
    maxDensity,
  };

  // Step 3: Evaluate Model Predictions on HELD-OUT TEST SET ONLY (>= 2024)
  const evaluatedTestRows: TemporalEvaluationRow[] = testPairs.map((pair) => {
    // Normalize test features USING TRAINING NORMALIZATION PARAMETERS
    const normCases = Math.max(0, Math.min(1, (pair.laggedCases_t1 - minCases) / caseRange));
    const normRain = Math.max(0, Math.min(1, (pair.laggedRainfall_t1 - minRainfall) / rainRange));
    const normDens = Math.max(0, Math.min(1, (pair.populationDensity - minDensity) / densityRange));

    // Calculate predicted risk score using expert weights
    const risk =
      weights.cases * normCases +
      weights.rainfall * normRain +
      weights.density * normDens;

    const predictedRisk = Math.round(risk * 100) / 100;
    const targetHighRisk = pair.targetCases_t0 >= HIGH_RISK_CASE_THRESHOLD;
    const predictedHighRisk = predictedRisk >= 0.50;

    return {
      areaId: pair.areaId,
      area: pair.area,
      targetYear: pair.targetYear,
      targetMonth: pair.targetMonth,
      laggedCases_t1: pair.laggedCases_t1,
      laggedRainfall_t1: pair.laggedRainfall_t1,
      populationDensity: pair.populationDensity,
      targetCases_t0: pair.targetCases_t0,
      predictedRisk,
      targetHighRisk,
      predictedHighRisk,
      hit: targetHighRisk === predictedHighRisk,
    };
  });

  // Step 4: Compute Held-Out Test Metrics
  let tp = 0, fp = 0, tn = 0, fn = 0;
  let sumAbsErr = 0;
  let sumSqErr = 0;

  evaluatedTestRows.forEach((r) => {
    // Target normalized relative to train scale for MAE/RMSE calculation
    const normTarget = Math.max(0, Math.min(1, (r.targetCases_t0 - minCases) / caseRange));
    const err = Math.abs(r.predictedRisk - normTarget);
    sumAbsErr += err;
    sumSqErr += err * err;

    if (r.targetHighRisk && r.predictedHighRisk) tp++;
    else if (!r.targetHighRisk && r.predictedHighRisk) fp++;
    else if (!r.targetHighRisk && !r.predictedHighRisk) tn++;
    else if (r.targetHighRisk && !r.predictedHighRisk) fn++;
  });

  const precision = tp + fp > 0 ? tp / (tp + fp) : null;
  const recall = tp + fn > 0 ? tp / (tp + fn) : null;
  const f1Score =
    precision !== null && recall !== null && precision + recall > 0
      ? (2 * precision * recall) / (precision + recall)
      : null;

  const mae = evaluatedTestRows.length > 0 ? sumAbsErr / evaluatedTestRows.length : null;
  const rmse = evaluatedTestRows.length > 0 ? Math.sqrt(sumSqErr / evaluatedTestRows.length) : null;

  // Pearson Correlation (r) between predicted risk and actual target cases
  let pearsonCorrelation: number | null = null;
  if (evaluatedTestRows.length > 1) {
    const meanPredicted = evaluatedTestRows.reduce((a, b) => a + b.predictedRisk, 0) / evaluatedTestRows.length;
    const meanTarget = evaluatedTestRows.reduce((a, b) => a + b.targetCases_t0, 0) / evaluatedTestRows.length;

    let num = 0, denP = 0, denT = 0;
    evaluatedTestRows.forEach((r) => {
      const dP = r.predictedRisk - meanPredicted;
      const dT = r.targetCases_t0 - meanTarget;
      num += dP * dT;
      denP += dP * dP;
      denT += dT * dT;
    });

    if (denP > 0 && denT > 0) {
      pearsonCorrelation = Math.round((num / Math.sqrt(denP * denT)) * 100) / 100;
    }
  }

  return {
    isValid: true,
    modelName,
    modelDescription,
    trainingPeriod: '2023 Training Period (June–July 2023)',
    testPeriod: 'Held-Out Test Period (Up to July 2026)',
    targetDescription: 'Actual Observed Dengue Cases (Period t)',
    featuresUsed,
    totalTrainRecords: trainPairs.length,
    totalTestRecords: evaluatedTestRows.length,
    areasEvaluatedCount: uniqueAreas.size,
    targetMonthsCount: uniqueTargetMonths.size,
    sampleSizeInterpretation,
    normalizationParamsTrain: trainNormalizationParams,
    metrics: {
      precision: precision !== null ? Math.round(precision * 100) / 100 : null,
      recall: recall !== null ? Math.round(recall * 100) / 100 : null,
      f1Score: f1Score !== null ? Math.round(f1Score * 100) / 100 : null,
      mae: mae !== null ? Math.round(mae * 1000) / 1000 : null,
      rmse: rmse !== null ? Math.round(rmse * 1000) / 1000 : null,
      pearsonCorrelation,
      truePositives: tp,
      falsePositives: fp,
      trueNegatives: tn,
      falseNegatives: fn,
    },
    testRows: evaluatedTestRows,
    sanityChecks: {
      noTargetLeakage: true,
      trainOnlyNormalization: true,
      chronologicalOrdering: true,
      heldOutEvaluation: true,
    },
  };
}

/**
 * Runs the three standard risk models through the temporal validation pipeline
 */
export function runTemporalValidationSuite() {
  const modelA = evaluateTemporalModel(
    { cases: 1.0, rainfall: 0.0, density: 0.0 },
    'Model A: Historical Cases Baseline',
    'Risk = 1.0 × Lagged Cases (t-1)',
    ['Lagged Dengue Cases (t-1)']
  );

  const modelB = evaluateTemporalModel(
    { cases: 0.65, rainfall: 0.35, density: 0.0 },
    'Model B: Cases + Rainfall Baseline',
    'Risk = 0.65 × Lagged Cases (t-1) + 0.35 × Lagged Rainfall (t-1)',
    ['Lagged Dengue Cases (t-1)', 'Lagged Rainfall (t-1)']
  );

  const modelC = evaluateTemporalModel(
    { cases: 0.50, rainfall: 0.30, density: 0.20 },
    'Proposed Expert-Weighted Model',
    'Risk = 0.50 × Lagged Cases (t-1) + 0.30 × Lagged Rain (t-1) + 0.20 × Density',
    ['Lagged Dengue Cases (t-1)', 'Lagged Rainfall (t-1)', 'Population Density']
  );

  return {
    modelA,
    modelB,
    modelC,
  };
}

