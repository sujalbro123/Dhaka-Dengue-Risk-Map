// Application Configuration & Environment Settings
// Centralizes all system thresholds, feature flags, API endpoints, and model constants.

export const APP_METADATA = {
  name: 'DDRM — Dhaka Dengue Risk Map',
  shortName: 'DDRM',
  version: '1.2',
  subtitle: 'Epidemic intelligence & risk prediction dashboard • Dhaka City Corporations',
  tagline: 'Research prototype',
  dataSources: 'DGHS surveillance, Bangladesh Meteorological Department (BMD), BBS census',
};

export const FEATURE_FLAGS = {
  enableSmsAlerts: true,
  enableCommunityReports: true,
  enableWhatIfRainfall: true,
  enableCompareMode: true,
  enableCsvImportExport: true,
};

export const API_CONFIG = {
  surveillanceFeed: import.meta.env.VITE_SURVEILLANCE_API || '/api/v1/surveillance',
  weatherFeed: import.meta.env.VITE_WEATHER_API || '/api/v1/weather',
  smsGateway: import.meta.env.VITE_SMS_GATEWAY_API || '/api/v1/sms/send',
  communityReports: import.meta.env.VITE_REPORTS_API || '/api/v1/reports',
};

export const MODEL_CONFIG = {
  defaultWeights: {
    casesWeight: 0.5,
    rainfallWeight: 0.3,
    densityWeight: 0.2,
  },
  defaultModifiers: {
    rainfallMultiplier: 1.0,
    caseMultiplier: 1.0,
    densityModifier: 1.0,
  },
  thresholds: {
    criticalRisk: 0.80,
    highRisk: 0.60,
    moderateRisk: 0.35,
    strainedCapacityRatio: 0.80,
    overcapacityRatio: 1.0,
  },
  rainfallBounds: {
    minMm: 0,
    maxMm: 600,
  },
  simulationDelayMs: 300,
};
