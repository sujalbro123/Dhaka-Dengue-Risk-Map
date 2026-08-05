# DDRM - Dhaka Dengue Risk Map
An early-warning epidemic intelligence dashboard predicting dengue outbreak risk by area in Dhaka, Bangladesh for university research and poster competition.

## Problem Statement
Dhaka faces recurring, severe dengue fever outbreaks intensified by monsoon precipitation, dense urban environments, and delayed early-warning mechanisms. Traditional surveillance relies heavily on retrospective hospital admission data, leading to delayed vector control interventions and localized hospital bed shortages. The Dhaka Dengue Risk Map (DDRM) addresses this critical gap by integrating multi-factor spatial risk modeling, interactive precipitation simulation, and hospital capacity tracking to enable proactive public health decision-making.

## Features
1. **Interactive Risk Map**: Vector spatial visualization of Dhaka City Corporation thanas featuring choropleth overlay modes (Risk Level, Dengue Cases, Rainfall, Population Density) and detail inspection.
2. **Alert Simulation**: Early-warning notification mechanism triggering automated SMS alert previews for local health authorities and emergency responders upon critical risk threshold breaches.
3. **Hospital Capacity Overlay**: Resource allocation monitoring system tracking bed occupancy ratios, capacity gaps, and status classifications (Adequate, Strained, Overcapacity) per thana.
4. **Crowdsourced Reports**: Community-driven surveillance integration allowing local residents and community clinics to report suspected cases and standing water breeding sites.
5. **Risk Trend Arrows**: Dynamic directional indicators comparing current 30-day risk scores against prior-week values to categorize outbreak momentum (Rising, Falling, Stable).
6. **Year-over-Year Comparison**: Comparative analytics framework evaluating current 2026 epidemiological metrics against equivalent 2025 baseline figures.
7. **Rainfall What-If Slider**: Interactive meteorological scenario simulator allowing users to modify rainfall parameters (0–200 mm) to project vector breeding expansion.

## Risk Formula
The Dhaka Dengue Risk Model computes a normalized risk score between 0 and 100 for each thana using the following weighted multi-criteria formula:

$$\text{Risk Score} = 100 \times \left( \frac{w_{\text{cases}} \cdot C_{\text{norm}} + w_{\text{rain}} \cdot R_{\text{norm}} + w_{\text{density}} \cdot D_{\text{norm}}}{w_{\text{cases}} + w_{\text{rain}} + w_{\text{density}}} \right)$$

### Factor Explanations
* **Recent 30-Day Cases ($C_{\text{norm}}$, Default Weight: 0.50 / 50%)**: Min-max normalized 30-day cumulative clinical dengue case count. Measures existing viral reservoir strength and localized transmission intensity.
* **Recent Rainfall ($R_{\text{norm}}$, Default Weight: 0.30 / 30%)**: Min-max normalized cumulative rainfall in millimeters. Represents larval habitat availability and *Aedes aegypti* breeding site proliferation.
* **Population Density ($D_{\text{norm}}$, Default Weight: 0.20 / 20%)**: Min-max normalized population density per square kilometer. Reflects human-vector contact frequency in high-density urban environments.

*Risk Classifications*: Low Risk (<35), Moderate Risk (35–59), High Risk (60–79), Critical Threat (≥80).

## Data Sources
* **DGHS / BMD Structured Baseline (Real Structure)**: Administrative boundaries for Dhaka North and South City Corporation thanas, historical population density data, and reporting standards based on the Directorate General of Health Services (DGHS) and Bangladesh Meteorological Department (BMD).
* **Simulated Prototype Data (Mock/Synthetic)**: 30-day recent case counts, 14-day rainfall measurements, hospital bed availability counts, prior-week/prior-year historical baselines, and crowdsourced community reports populated for demonstration, research testing, and scenario analysis.

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
