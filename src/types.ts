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
