import { DhakaArea, ComputedAreaRisk, ModelWeights, SimulationModifiers, RiskLevel } from '../types';

export const DEFAULT_WEIGHTS: ModelWeights = {
  casesWeight: 0.5,
  rainfallWeight: 0.3,
  densityWeight: 0.2,
};

export const DEFAULT_MODIFIERS: SimulationModifiers = {
  rainfallMultiplier: 1.0,
  caseMultiplier: 1.0,
  densityModifier: 1.0,
};

export function calculateAreaRisks(
  areas: DhakaArea[],
  weights: ModelWeights = DEFAULT_WEIGHTS,
  modifiers: SimulationModifiers = DEFAULT_MODIFIERS
): ComputedAreaRisk[] {
  if (areas.length === 0) return [];

  // Calculate adjusted raw values based on simulation modifiers
  const adjustedData = areas.map((area) => {
    const cases = Math.round(area.recentCases30d * modifiers.caseMultiplier);
    const rainfall = Math.round(area.recentRainfallMm * modifiers.rainfallMultiplier);
    const density = Math.round(area.populationDensity * modifiers.densityModifier);
    return { id: area.id, cases, rainfall, density };
  });

  // Find min and max for normalization (0 to 1)
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

    // Total risk score (0.0 to 1.0)
    const totalWeight = weights.casesWeight + weights.rainfallWeight + weights.densityWeight || 1.0;
    const rawRiskScore = (weightedCases + weightedRainfall + weightedDensity) / totalWeight;
    const riskScore100 = Math.round(rawRiskScore * 100);

    let riskLevel: RiskLevel = 'low';
    if (rawRiskScore >= 0.80) {
      riskLevel = 'critical';
    } else if (rawRiskScore >= 0.60) {
      riskLevel = 'high';
    } else if (rawRiskScore >= 0.35) {
      riskLevel = 'moderate';
    } else {
      riskLevel = 'low';
    }

    return {
      ...area,
      recentCases30d: adj.cases,
      recentRainfallMm: adj.rainfall,
      populationDensity: adj.density,
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
        glow: 'shadow-[0_0_20px_rgba(220,38,38,0.7)]',
        label: 'Critical Threat (>0.80)',
      };
    case 'high':
      return {
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        fill: '#f43f5e',
        glow: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]',
        label: 'High Risk (60-79)',
      };
    case 'moderate':
      return {
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        fill: '#f59e0b',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
        label: 'Moderate Risk (35-59)',
      };
    case 'low':
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        fill: '#10b981',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
        label: 'Low Risk (<35)',
      };
  }
}

export function parseCSVData(csvText: string): Partial<DhakaArea>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase().split(',').map((h) => h.trim());
  const nameIdx = header.findIndex((h) => h.includes('area') || h.includes('name'));
  const casesIdx = header.findIndex((h) => h.includes('case'));
  const rainIdx = header.findIndex((h) => h.includes('rain'));
  const densityIdx = header.findIndex((h) => h.includes('density') || h.includes('pop'));

  const results: Partial<DhakaArea>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim());
    if (cols.length < 2) continue;

    const name = nameIdx !== -1 ? cols[nameIdx] : `Area ${i}`;
    const cases = casesIdx !== -1 ? parseInt(cols[casesIdx], 10) || 0 : 0;
    const rain = rainIdx !== -1 ? parseFloat(cols[rainIdx]) || 0 : 0;
    const density = densityIdx !== -1 ? parseInt(cols[densityIdx], 10) || 0 : 0;

    results.push({
      name,
      recentCases30d: cases,
      recentRainfallMm: rain,
      populationDensity: density,
    });
  }

  return results;
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
