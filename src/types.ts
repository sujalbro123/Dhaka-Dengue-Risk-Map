export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface MonthlyRecord {
  month: string;
  cases: number;
  rainfallMm: number;
}

export type CapacityStatus = 'adequate' | 'strained' | 'overcapacity';

export interface DhakaArea {
  id: string;
  name: string;
  bnName: string;
  corporation: 'DNCC' | 'DSCC'; // Dhaka North or Dhaka South
  zoneNumber: string;
  wards: string;
  population: number;
  areaSqKm: number;
  populationDensity: number; // persons / sq km
  recentCases30d: number; // Historical cases in last 30 days
  recentRainfallMm: number; // Rainfall in last 14-30 days
  lastWeekCases30d?: number; // Previous week case count for trend
  lastWeekRainfallMm?: number; // Previous week rainfall for trend
  priorYearCases30d?: number; // Prior year same period cases
  priorYearRainfallMm?: number; // Prior year same period rainfall
  breteauIndex: number; // Aedes larvae index (Breteau Index / 100 houses)
  monthlyHistory: MonthlyRecord[]; // Last 6 months
  preventionTips: string[];
  keyRiskFactors: string[];
  primaryHospitals: string[];
  hospitalBeds: number; // Dedicated dengue beds in zone
  currentPatients: number; // Current admitted dengue patients
  crowdsourcedReports: number; // Community unverified case count
  coordinates: { x: number; y: number }; // Center coordinate on custom SVG map
  svgPath: string; // Vector polygon path for map
  windDirectionDegrees?: number; // e.g. 210 (SSW)
  windDirectionCardinal?: string; // e.g. 'SSW'
  windSpeedKmH?: number; // e.g. 18 km/h
  temperatureC?: number; // e.g. 32.5°C
}

export interface NormalizedFactors {
  normCases: number;
  normRainfall: number;
  normDensity: number;
}

export interface ComputedAreaRisk extends DhakaArea {
  normalized: NormalizedFactors;
  rawRiskScore: number; // 0.0 to 1.0
  riskScore100: number; // 0 to 100
  riskLevel: RiskLevel;
  trend: 'rising' | 'falling' | 'stable';
  trendDelta: number; // difference vs last week (e.g. +6 or -3)
  lastWeekRiskScore: number;
  priorYearCases30d: number;
  priorYearRiskScore: number;
  yearOverYearChangePercent: number; // e.g. +28% or -15%
  yearOverYearText: string; // e.g. "Risk is 28% higher than same period last year"
  weightedCasesContribution: number; // 0.5 * normCases
  weightedRainfallContribution: number; // 0.3 * normRainfall
  weightedDensityContribution: number; // 0.2 * normDensity
  capacityGap: number; // currentPatients - hospitalBeds (positive = shortage, negative = available)
  capacityStatus: CapacityStatus;
}

export interface CommunityReport {
  id: string;
  areaId: string;
  areaName: string;
  date: string;
  patientType: string;
  symptoms: string[];
  landmark?: string;
  comments?: string;
  timestamp: string;
}

export interface SentAlertLog {
  id: string;
  areaId: string;
  areaName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  channel: 'SMS' | 'Emergency Push' | 'Public Broadcast';
  message: string;
  recipientCount: number;
  timestamp: string;
}

export interface ModelWeights {
  casesWeight: number; // default 0.5
  rainfallWeight: number; // default 0.3
  densityWeight: number; // default 0.2
}

export interface SimulationModifiers {
  rainfallMultiplier: number; // e.g. 1.0 = normal, 1.5 = +50% monsoon rain
  caseMultiplier: number; // e.g. 1.0 = normal, 1.2 = surge
  densityModifier: number; // e.g. 1.0
  whatIfRainfallMm?: number | null; // What-if override value (e.g. 0 - 300 mm)
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  modifiers: SimulationModifiers;
}

// ==========================================
// RESEARCH & HISTORICAL DATA LAYER TYPES
// ==========================================

export type DataMode = 'research' | 'demo';

export interface HistoricalDengueRecord {
  areaId: string;
  area: string;
  year: number;
  month: number; // 1 - 12
  date: string; // YYYY-MM-DD
  cases: number;
  source: string;
}

export interface HistoricalRainfallRecord {
  stationId: string;
  station: string;
  year: number;
  month: number; // 1 - 12
  rainfallMm: number;
  rainfallMm_lag1m?: number;
  rainfallMm_lag2w?: number;
  rainfallMm_lag3w?: number;
  source: string;
}

export interface HistoricalPopulationRecord {
  areaId: string;
  area: string;
  corporation: 'DNCC' | 'DSCC';
  population: number;
  areaSqKm: number;
  populationDensity: number; // population / areaSqKm
  year: number;
  source: string;
}

export interface DataSourceMeta {
  id: string;
  name: string;
  organization: string;
  period: string;
  geographicCoverage: string;
  type: 'observed' | 'derived' | 'imported' | 'synthetic';
  sourceUrl?: string;
  lastUpdated: string;
  notes: string;
}

export type DataQualityStatus = 'complete' | 'partially_complete' | 'missing' | 'interpolated';

export interface AlignedAreaRecord {
  areaId: string;
  area: string;
  corporation: 'DNCC' | 'DSCC';
  year: number;
  month: number;
  dengueCases: number | null;
  rainfallMm: number | null;
  rainfallLag1m?: number | null;
  rainfallLag2w?: number | null;
  rainfallLag3w?: number | null;
  population: number | null;
  areaSqKm: number | null;
  populationDensity: number | null;
  dataQuality: DataQualityStatus;
  missingFields: string[];
  sources: {
    dengue?: string;
    rainfall?: string;
    population?: string;
  };
}

export interface DataQualitySummary {
  totalRecords: number;
  completeRecords: number;
  partiallyCompleteRecords: number;
  missingRecords: number;
  coveragePeriod: string;
  uniqueAreasCount: number;
  rainfallStationsCount: number;
  lastUpdated: string;
  sources: DataSourceMeta[];
}

export type ModelArchitectureId = 'baseline' | 'cases_only' | 'cases_rain' | 'cases_rain_density';

export interface ModelArchitectureConfig {
  id: ModelArchitectureId;
  name: string;
  description: string;
  variables: string[];
  weights: ModelWeights;
  rainfallLagSetting?: 'current' | 'lag1m' | 'lag2w' | 'lag3w';
}

export interface ValidationMetricResult {
  modelId: ModelArchitectureId;
  modelName: string;
  variables: string;
  precision: number | null;
  recall: number | null;
  f1Score: number | null;
  mae: number | null;
  rmse: number | null;
  correlation: number | null;
  sampleCount: number;
  status: 'valid' | 'insufficient_data';
  note?: string;
}

