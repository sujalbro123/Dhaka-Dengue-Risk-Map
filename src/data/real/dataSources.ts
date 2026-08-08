import { DataSourceMeta } from '../../types';

export const REAL_DATA_SOURCES: DataSourceMeta[] = [
  {
    id: 'dghs_cases_2024',
    name: 'Official Dengue Epidemiological Surveillance',
    organization: 'Directorate General of Health Services (DGHS), Ministry of Health & Family Welfare',
    period: '2023 – 2024 (Monthly & Annual Summaries)',
    geographicCoverage: 'Dhaka North City Corporation (DNCC) & Dhaka South City Corporation (DSCC)',
    type: 'observed',
    verificationStatus: 'partially_verified',
    sourceUrl: 'https://old.dghs.gov.bd/index.php/bd/dengue',
    lastUpdated: '2024-11-09',
    notes: 'Aggregated clinical dengue hospital admission records sourced from DGHS Daily Press Bulletins and EPI microplanning documents.'
  },
  {
    id: 'bmd_rainfall_dhaka',
    name: 'Dhaka Regional Surface Precipitation Station',
    organization: 'Bangladesh Meteorological Department (BMD)',
    period: '2023 – 2024 (Monthly precipitation & 14-day cumulative)',
    geographicCoverage: 'Dhaka Meteorological Station (Agargaon, Station ID: 41923)',
    type: 'observed',
    verificationStatus: 'partially_verified',
    sourceUrl: 'http://live.bmd.gov.bd/',
    lastUpdated: '2024-11-01',
    notes: 'Centralized rainfall recorded at Agargaon station (41923) mapped across study thanas. Sub-thana microclimatic rain varies.'
  },
  {
    id: 'dghs_bbs_demographics',
    name: 'City Corporation Administrative & Population Microplanning',
    organization: 'DGHS EPI Digital Microplanning & Bangladesh Bureau of Statistics (BBS)',
    period: '2024 Baseline',
    geographicCoverage: '20 Dhaka City Corporation Thanas (DNCC & DSCC)',
    type: 'observed',
    verificationStatus: 'partially_verified',
    sourceUrl: 'http://www.bbs.gov.bd/',
    lastUpdated: '2024-01-15',
    notes: 'Official census population and land area (sq km) records used to calculate exact population densities.'
  }
];

export const DEMO_DATA_SOURCE: DataSourceMeta = {
  id: 'synthetic_demo_2026',
  name: 'Synthetic Scenario Demonstration Dataset',
  organization: 'DDRM Research Simulation Framework',
  period: '2026 Interactive Scenario',
  geographicCoverage: 'Dhaka Metropolitan Area (20 Thanas)',
  type: 'synthetic',
  verificationStatus: 'synthetic',
  sourceUrl: '',
  lastUpdated: '2026-08-01',
  notes: 'Synthetic data engineered for interactive scenario modeling, UI prototyping, and sensitivity stress-testing. NOT for clinical or official epidemiological interpretation.'
};
