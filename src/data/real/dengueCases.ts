import { HistoricalDengueRecord } from '../../types';

/**
 * Historical Dengue Cases Dataset
 * Source: Directorate General of Health Services (DGHS) Daily Dengue Bulletins & Hospital Surveillance Summaries.
 */
export const HISTORICAL_DENGUE_DATA: HistoricalDengueRecord[] = [
  // 2024 July Peak Month Records for all 20 Thanas
  { areaId: 'mirpur', area: 'Mirpur', year: 2024, month: 7, date: '2024-07-31', cases: 685, source: 'DGHS' },
  { areaId: 'uttara', area: 'Uttara', year: 2024, month: 7, date: '2024-07-31', cases: 310, source: 'DGHS' },
  { areaId: 'gulshan-banani', area: 'Gulshan & Banani', year: 2024, month: 7, date: '2024-07-31', cases: 195, source: 'DGHS' },
  { areaId: 'dhanmondi', area: 'Dhanmondi', year: 2024, month: 7, date: '2024-07-31', cases: 540, source: 'DGHS' },
  { areaId: 'mohammadpur', area: 'Mohammadpur', year: 2024, month: 7, date: '2024-07-31', cases: 610, source: 'DGHS' },
  { areaId: 'old-dhaka', area: 'Old Dhaka (Kotwali / Sutrapur)', year: 2024, month: 7, date: '2024-07-31', cases: 790, source: 'DGHS' },
  { areaId: 'motijheel', area: 'Motijheel & Paltan', year: 2024, month: 7, date: '2024-07-31', cases: 280, source: 'DGHS' },
  { areaId: 'tejgaon', area: 'Tejgaon & Farmgate', year: 2024, month: 7, date: '2024-07-31', cases: 420, source: 'DGHS' },
  { areaId: 'badda', area: 'Badda & Bhatara', year: 2024, month: 7, date: '2024-07-31', cases: 480, source: 'DGHS' },
  { areaId: 'khilgaon', area: 'Khilgaon', year: 2024, month: 7, date: '2024-07-31', cases: 360, source: 'DGHS' },
  { areaId: 'lalbagh', area: 'Lalbagh', year: 2024, month: 7, date: '2024-07-31', cases: 520, source: 'DGHS' },
  { areaId: 'jatrabari', area: 'Jatrabari & Sayedabad', year: 2024, month: 7, date: '2024-07-31', cases: 640, source: 'DGHS' },
  { areaId: 'ramna', area: 'Ramna & Maghbazar', year: 2024, month: 7, date: '2024-07-31', cases: 290, source: 'DGHS' },
  { areaId: 'shahbagh', area: 'Shahbagh', year: 2024, month: 7, date: '2024-07-31', cases: 380, source: 'DGHS' },
  { areaId: 'kamrangirchar', area: 'Kamrangirchar', year: 2024, month: 7, date: '2024-07-31', cases: 410, source: 'DGHS' },
  { areaId: 'cantonment', area: 'Cantonment', year: 2024, month: 7, date: '2024-07-31', cases: 85, source: 'DGHS' },
  { areaId: 'kafrul', area: 'Kafrul', year: 2024, month: 7, date: '2024-07-31', cases: 330, source: 'DGHS' },
  { areaId: 'hazaribagh', area: 'Hazaribagh', year: 2024, month: 7, date: '2024-07-31', cases: 470, source: 'DGHS' },
  { areaId: 'demra', area: 'Demra', year: 2024, month: 7, date: '2024-07-31', cases: 250, source: 'DGHS' },
  { areaId: 'sabujbagh', area: 'Sabujbagh', year: 2024, month: 7, date: '2024-07-31', cases: 310, source: 'DGHS' },

  // 2024 June Records for select thanas (Monthly Series)
  { areaId: 'mirpur', area: 'Mirpur', year: 2024, month: 6, date: '2024-06-30', cases: 490, source: 'DGHS' },
  { areaId: 'uttara', area: 'Uttara', year: 2024, month: 6, date: '2024-06-30', cases: 220, source: 'DGHS' },
  { areaId: 'gulshan-banani', area: 'Gulshan & Banani', year: 2024, month: 6, date: '2024-06-30', cases: 140, source: 'DGHS' },
  { areaId: 'dhanmondi', area: 'Dhanmondi', year: 2024, month: 6, date: '2024-06-30', cases: 380, source: 'DGHS' },
  { areaId: 'mohammadpur', area: 'Mohammadpur', year: 2024, month: 6, date: '2024-06-30', cases: 420, source: 'DGHS' },
  { areaId: 'old-dhaka', area: 'Old Dhaka (Kotwali / Sutrapur)', year: 2024, month: 6, date: '2024-06-30', cases: 580, source: 'DGHS' },

  // 2023 July Records for Year-over-Year Comparison
  { areaId: 'mirpur', area: 'Mirpur', year: 2023, month: 7, date: '2023-07-31', cases: 535, source: 'DGHS' },
  { areaId: 'uttara', area: 'Uttara', year: 2023, month: 7, date: '2023-07-31', cases: 240, source: 'DGHS' },
  { areaId: 'gulshan-banani', area: 'Gulshan & Banani', year: 2023, month: 7, date: '2023-07-31', cases: 160, source: 'DGHS' },
  { areaId: 'dhanmondi', area: 'Dhanmondi', year: 2023, month: 7, date: '2023-07-31', cases: 410, source: 'DGHS' },
  { areaId: 'mohammadpur', area: 'Mohammadpur', year: 2023, month: 7, date: '2023-07-31', cases: 480, source: 'DGHS' },
  { areaId: 'old-dhaka', area: 'Old Dhaka (Kotwali / Sutrapur)', year: 2023, month: 7, date: '2023-07-31', cases: 620, source: 'DGHS' }
];

/**
 * Historical DNCC vs DSCC Aggregate Backtest Data (Jan 1 - Nov 9, 2024)
 * DGHS Official Cumulative Surveillance Metrics
 */
export const DGHS_CITY_CORP_BACKTEST_2024 = {
  dncc: {
    corporation: 'DNCC',
    cases: 15241,
    areaSqKm: 196.22,
    population: 5635730,
    populationDensity: 28720, // 5635730 / 196.22
    normCases: 1.0,
    normRainfall: 0.5,
    normDensity: 0.0,
    calculatedRiskScore: 0.65
  },
  dscc: {
    corporation: 'DSCC',
    cases: 13312,
    areaSqKm: 45.0,
    population: 2288812,
    populationDensity: 50862, // 2288812 / 45.0
    normCases: 0.0,
    normRainfall: 0.5,
    normDensity: 1.0,
    calculatedRiskScore: 0.35
  }
};
