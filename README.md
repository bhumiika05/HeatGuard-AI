# HEATGUARD — AI-Powered Hyperlocal Heat-Health Early Warning & Action System

> Shifting heatwave forecasting from *"WHAT WILL THE WEATHER BE?"* to *"WHAT WILL THE WEATHER DO TO PEOPLE?"*

HEATGUARD is a production-grade, AI-powered hyperlocal heat-health decision-support platform built for Indian municipalities and healthcare authorities (demonstrated on the municipal wards of Delhi/NCR). By combining micro-meteorological variables, established human thermal stress indices (Heat Index, WBGT, UTCI), demographic vulnerability factors (elderly %, outdoor workers %, pop density, UHI built-up index), and ML-based health risk prediction models, HEATGUARD provides 3–5 day hyperlocal heat-health risk warnings and automated intervention recommendations.

---

## Key Features & Highlights

1. **Hyperlocal GIS Risk Map**: Interactive Leaflet GIS map displaying Delhi ward boundaries with dynamic color coding (`GREEN`, `YELLOW`, `ORANGE`, `RED`, `PURPLE`), hover tooltips, date forecasting, CARTO Voyager basemap, and switchable risk layers.
2. **Scientifically Validated Thermal Engines**:
   - **Heat Index (HI)**: Rothfusz regression equation with range adjustments.
   - **WBGT (Wet-Bulb Globe Temperature)**: Outdoor direct solar radiation ($0.7 T_{nw} + 0.2 T_g + 0.1 T_d$) and indoor shade ($0.7 T_{nw} + 0.3 T_g$) models based on Liljegren & BOM algorithms.
   - **UTCI (Universal Thermal Climate Index)**: 6-variable operational polynomial procedure approximation.
   - **Human Thermal Stress Score (HTSS)**: Clearly labeled derived composite metric ($0-100$ scale) combining HI, WBGT, UTCI, duration, and UHI intensity.
3. **Data Provenance & Transparency**: Every metric across the application displays a Data Provenance tag (`REAL`, `DERIVED`, `ESTIMATED`).
4. **Explainable AI (XAI)**: "Why is this area high risk?" natural language feature attribution breakdown explaining exact factors for every ward.
5. **Decision Support & Action Engines**:
   - **Cooling Centre Optimizer**: Spatial algorithm scoring grid points to recommend optimal new cooling shelter locations based on heat risk, vulnerable population, pop density, and distance matrix to existing facilities.
   - **Outdoor Work Scheduler**: Dynamic safe, caution, and restricted work time slots (e.g., safe 6-10 AM, 5-8 PM; restricted 12-4 PM).
   - **Hospital Surge Preparedness**: Hospital bed & ICU capacity tracking, regional ward exposure mapping, and surge pressure forecasting.
   - **Multi-Channel Alert System**: SMS, WhatsApp, Email, and Dashboard alert simulation with full lifecycle tracking (`BROADCASTED`, `ACKNOWLEDGED`, `RESOLVED`).
6. **Multi-Role Command Portals**:
   - **Authority Dashboard**: Command-center KPI summary, high-risk ward list, forecast timeline, active interventions.
   - **Citizen Dashboard**: Simplified public view, danger hour advisory, cooling center finder with distance calculation, and SMS alert signup.
   - **Healthcare Dashboard**: Hospital surge pressure, emergency bed capacity, triage readiness checklists.
   - **Admin & ML Monitoring**: Model evaluation comparison (Random Forest, Gradient Boosting, XGBoost, Logistic Regression), Accuracy, Precision, Recall, F1, ROC-AUC, Feature Importances, retrain trigger.
   - **Historical Analytics**: Multi-year heatwave frequency (2023-2026), peak thermal indices trends.
   - **Forecast vs Actual Tracking**: Model accuracy validation comparing predicted risk vs actual observed HTSS.
7. **Interactive Weather Scenario Testing**: Interactive scenario switcher in header bar (`Normal Weather`, `High Heatwave`, `Severe Heatwave`) with real-time recalculations across all wards.

---

## Deploying to Production (Vercel / Render / Netlify)

### Deploying to Vercel (Frontend Web App)
1. Push your repository to GitHub.
2. In Vercel, click **Add New Project** and select the `frontend` folder (or set Root Directory to `frontend`).
3. Vercel automatically detects Vite framework settings (`vercel.json` included in repository).
4. Set environment variable `VITE_CARTO_API_KEY` to `cb1_3zxc_1_9e8d60c4904c7e6ede185ebb`.

### Deploying to Render
This repository includes a `render.yaml` configuration file for dual service deployment:
- **Backend Service**: Python web service (`rootDir: backend`, build: `pip install -r requirements.txt`, start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`).
- **Frontend Service**: Static site (`rootDir: frontend`, build: `npm ci && npm run build`, publish: `./dist`).

---

## Interactive Weather Scenario Instructions

To test HEATGUARD's end-to-end real-time response:

1. Open `http://localhost:3000`.
2. Locate the **TEST HEAT SCENARIOS** switcher bar at the top right of the header.
3. Toggle between:
   - **`Normal Weather`**: Temperatures ~33-34°C, low risk levels across wards.
   - **`High Heatwave`**: Temperatures ~41-42°C, WBGT ~32°C, high risk wards highlighted in orange/red.
   - **`Severe Heatwave`**: Temperatures spike to 46.2°C+, humidity surge, WBGT >35°C, HTSS score >88/100, purple/red high threat wards, automatic alert triggers, updated hospital surge pressure, and cooling center recommendations.

---

## Data Provenance Policy

| Metric | Source | Provenance Level |
|---|---|---|
| Temperature & Humidity | IMD / ERA5 Reanalysis Proxy | `REAL` |
| Population & Demographics | Census of India / Projections | `REAL` |
| Heat Index (HI) | NWS Rothfusz Formula | `DERIVED` |
| Outdoor WBGT & UTCI | Liljegren / BOM / Polynomial Models | `ESTIMATED` |
| Human Thermal Stress (HTSS) | HEATGUARD Composite Risk Score | `DERIVED` |
| Health Surge & Hospital Spikes | Epidemiological Response Calibration | `DERIVED` |
