# DDRM — Dhaka Dengue Risk Map
An early-warning epidemic intelligence system predicting dengue outbreak risk by administrative area in Dhaka, Bangladesh. Research-ready prototype supporting historical datasets with documented source attribution and partial source verification, alongside synthetic scenario stress-testing.

## Problem Statement
Dhaka faces recurring, severe dengue fever outbreaks intensified by monsoon precipitation, dense urban environments, and delayed early-warning mechanisms. Traditional surveillance relies heavily on retrospective hospital admission data, leading to delayed vector control interventions and localized hospital bed shortages. The Dhaka Dengue Risk Map (DDRM) addresses this critical gap by integrating multi-factor spatial risk modeling, interactive precipitation simulation, hospital capacity tracking, and empirical model validation against official health statistics.

## Core Features
1. **Interactive Risk Map**: Spatial vector visualization of Dhaka City Corporation thanas featuring choropleth overlay modes (Risk Level, Dengue Cases, Rainfall, Population Density) and detail inspection.
2. **Research vs Demo Mode Switcher**: Application-wide data mode switch allowing researchers to toggle seamlessly between real historical datasets (DGHS/BMD/BBS) and synthetic stress-testing scenarios.
3. **Data Quality & Completeness Panel**: Real-time completeness metrics tracking record coverage, missingness indicators, data provenance, and partial verification status for all aligned area-month records.
4. **Alert Simulation**: Early-warning notification mechanism triggering automated SMS alert previews for local health authorities and emergency responders upon critical risk threshold breaches.
5. **Hospital Capacity Overlay**: Resource allocation monitoring system tracking bed occupancy ratios, capacity gaps, and status classifications (Adequate, Strained, Overcapacity) per thana.
6. **Crowdsourced Reports**: Community-driven surveillance integration allowing local residents and clinics to report suspected cases and standing water breeding sites.
7. **Empirical Model Validation & Benchmarking**: Dedicated statistical validation suite evaluating risk model performance dynamically across multi-period historical records and benchmarking against single/two-factor baselines.
8. **Rainfall What-If Slider**: Interactive meteorological scenario simulator allowing users to modify rainfall parameters (0–200 mm) to project vector breeding expansion.

## Data Architecture & Real Dataset Integration
The application uses a strict modular data layer separating real historical research data from synthetic demo datasets:

```
src/
├── data/
│   ├── real/                       # Real Research Data Layer
│   │   ├── dengueCases.ts          # DGHS Historical Dengue Records (2023–2024)
│   │   ├── rainfall.ts             # BMD Meteorological Rainfall Records with Lag Fields
│   │   ├── population.ts           # BBS Demographic & Census Statistics (2024)
│   │   ├── dataSources.ts          # Transparent Metadata & Data Lineage Attributes
│   │   ├── dataAlignment.ts        # Relational Data Alignment & Validation Engine
│   │   └── temporalValidation.ts   # Data-Driven Temporal Out-of-Sample Validation Engine
│   └── demo/                       # Demo / Synthetic Layer
│       └── demoDhakaData.ts        # Synthetic Scenario Dataset (for offline/stress tests)
```

### 1. Relational Data Alignment
To model spatial risk accurately without index-matching assumptions, real datasets are relationally joined on composite primary keys: `(areaId, year, month)`.
* **Dengue Case Data**: Sourced from official DGHS Health Emergency Operations Center & Control Room reports (Partially verified).
* **Rainfall Data**: Sourced from Agargaon BMD central station (Station ID: 41923), used as a central Dhaka rainfall proxy and mapped to study areas.
* **Demographic Data**: Sourced from BBS 2022 Population & Housing Census and DGHS EPI Digital Microplanning (2024).

### 2. Temporal Lag Analysis
Precipitation does not trigger dengue transmission immediately; mosquito breeding requires 7–10 days for egg-to-adult development plus 4–10 days intrinsic viral incubation. The rainfall dataset explicitly incorporates temporal lag fields:
* `rainfallMm_lag1m`: Monthly lagged rainfall (30 days prior).
* `rainfallMm_lag2w`: 2-week lagged precipitation.
* `rainfallMm_lag3w`: 3-week lagged precipitation.

## Risk Formula & Normalization
The Dhaka Dengue Risk Model computes a normalized risk score between 0 and 1 for each thana using an expert-weighted multi-factor formula (Note: Weights are expert-defined, not AI or ML trained):

$$\text{Risk Score} = 0.50 \cdot C_{\text{norm}} + 0.30 \cdot R_{\text{norm}} + 0.20 \cdot D_{\text{norm}}$$

### Critical Normalization Sequence
To prevent scale distortion where variables with large raw magnitudes (e.g., population density = 50,000) overwhelm variables with smaller magnitudes (e.g., rainfall = 300 mm), **each factor is independently min-max normalized to a [0, 1] scale BEFORE applying weights**:

$$C_{\text{norm}} = \frac{C - C_{\min}}{C_{\max} - C_{\min}}, \quad R_{\text{norm}} = \frac{R - R_{\min}}{R_{\max} - R_{\min}}, \quad D_{\text{norm}} = \frac{D - D_{\min}}{D_{\max} - D_{\min}}$$

*Risk Classifications*: Low Risk (<0.35), Moderate Risk (0.35–0.59), High Risk (0.60–0.79), Critical Threat (≥0.80).

## Current Validation Status

Performance metrics are generated dynamically from the chronological held-out evaluation pipeline. Because the currently available verified historical area-month dataset is limited, results should be interpreted as a pilot evaluation rather than definitive epidemiological validation.

### Evaluation Methodology
* **Chronological Out-of-Sample Split**: Training on earlier historical periods (2023) and evaluating on held-out future periods (2024).
* **Target Definition**: Observed Dengue Cases at Period $t$ ($C_t$).
* **Lagged Features**: Features from Period $t-1$ ($C_{t-1}, R_{t-1}$) and census population density ($D$). Period $t$ dengue cases are strictly excluded from inputs to eliminate target leakage.
* **Train-Only Normalization**: Normalization min-max bounds are fitted strictly on the training set.
* **Operational Threshold**: A pre-defined operational threshold of $\ge 400$ reported dengue cases per area-month is used for pilot high-surge classification (`HIGH_RISK_CASE_THRESHOLD = 400`).

### Model Comparisons Evaluated on Test Set
1. **Model A (Historical Cases Baseline)**: Risk derived solely from lagged cases ($1.0 \cdot C_{t-1}$).
2. **Model B (Cases + Rainfall Baseline)**: Risk derived from lagged cases and lagged rainfall ($0.65 \cdot C_{t-1} + 0.35 \cdot R_{t-1}$).
3. **Proposed Expert-Weighted Model**: Expert multi-factor risk model ($0.50 \cdot C_{t-1} + 0.30 \cdot R_{t-1} + 0.20 \cdot D$).

All three models are evaluated dynamically on the exact same held-out test observations in the application's **Validation** view.

## Research Limitations
1. **Limited Historical Observations**: The currently available verified area-month records restrict the sample size of the test evaluation. Results represent a pilot evaluation pending broader multi-year surveillance digitization.
2. **Rainfall Proxy Mapping**: Precipitation is recorded at the Agargaon BMD central station and mapped to study thanas as a regional proxy. Sub-thana microclimatic rain variation is not independently gauged.
3. **Partial Source Verification**: Dengue case data reflects aggregated public DGHS bulletins and microplanning summaries (Partially verified).
4. **Unobserved Entomological Vector Indices**: Official surveillance currently lacks real-time House Index (HI), Container Index (CI), and Breteau Index (BI) larval survey data per thana.

## Tech Stack
* **Frontend Core**: React 19, TypeScript, Vite 6
* **Backend Server**: Express 4, Node.js (`tsx` for dev runtime, `esbuild` for production compilation)
* **Styling & Icons**: Tailwind CSS v4, Lucide React
* **Data Visualization**: Recharts, D3 (scale mapping and normalization utilities)
* **Animation & UI Support**: Motion (`motion/react`), Error Boundaries

## How to Run

### Prerequisites
* Node.js v18.0.0 or higher
* npm v9.0.0 or higher

### Installation & Execution

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Start the production server**:
   ```bash
   npm run start
   ```
