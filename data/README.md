# HEATGUARD — Data Provenance & Dataset Specification

## Overview

This directory contains dataset specifications, metadata, data provenance documentation, and reproducible dataset generation pipelines for **HEATGUARD** — AI-Powered Hyperlocal Heat-Health Early Warning & Action System.

---

## Data Provenance Classification System

To maintain scientific integrity and prevent false claims of medical precision, HEATGUARD explicitly categorizes every data variable into one of four **Data Provenance Levels**:

1. **`REAL`**: Micro-meteorological observations, satellite proxies, and official Census demographic statistics obtained from public government databases (IMD, Census of India 2011/2021 projections).
2. **`DERIVED`**: Scientifically validated physical thermal stress indices calculated directly from meteorology using established formulas (Heat Index, WBGT, UTCI, HTSS).
3. **`ESTIMATED`**: Proxies or spatial approximations where direct sensors are missing (e.g. globe temperature $T_g$ estimation from solar radiation and wind speed).
4. **`SYNTHETIC/DEMO`**: Health outcomes, hospital admission spikes, and mortality risk indicators calibrated against Indian epidemiological heat-health literature (e.g., WHO/IMD heatwave exposure-response curves). **Clearly labeled for demonstration/simulation purposes.**

---

## Geographic Coverage & Structure

- **Target Location**: National Capital Territory (NCT) of Delhi & NCR.
- **Hierarchy**: City (Delhi) $\rightarrow$ Zone (11 Administrative Districts) $\rightarrow$ Ward (25 Key Representative Municipal Wards/Zones).
- **Coordinate Reference System**: WGS 84 (EPSG:4326).

---

## Dataset Schema & Variable Definitions

### 1. Environmental & Micro-Weather Variables (`REAL` / `DERIVED`)
- `timestamp`: ISO 8601 Date and time.
- `ward_id`: Unique ward identifier (1–25).
- `temperature_c`: Ambient air temperature ($^\circ\text{C}$) [Range: $22.0 - 49.5^\circ\text{C}$]. Source: IMD / ERA5 proxy.
- `relative_humidity_pct`: Relative humidity (%) [Range: $15 - 95\%$]. Source: IMD / ERA5.
- `wind_speed_kmh`: Surface wind speed at 10m height ($\text{km/h}$). Source: ERA5.
- `solar_radiation_wm2`: Downward shortwave radiation ($\text{W/m}^2$). Source: NASA POWER / ERA5.
- `cloud_cover_pct`: Cloud cover fraction (%).

### 2. Demographic & Environmental Vulnerability (`REAL` / `ESTIMATED`)
- `population_density`: Population density (people per $\text{km}^2$). Source: Census of India.
- `elderly_pct`: Percentage of population aged $60+$ years (%).
- `children_pct`: Percentage of population aged $0-6$ years (%).
- `outdoor_worker_pct`: Estimated percentage of informal/construction/street vendor workforce (%).
- `green_cover_pct`: Vegetation cover percentage / NDVI proxy (%).
- `built_up_density_pct`: Concrete & built environment density (Urban Heat Island factor) (%).

### 3. Derived Thermal Indices (`DERIVED` / `ESTIMATED`)
- `heat_index_c`: NWS / Rothfusz Heat Index ($^\circ\text{C}$).
- `wbgt_outdoor_c`: Outdoor direct solar Wet-Bulb Globe Temperature ($^\circ\text{C}$).
- `utci_c`: Universal Thermal Climate Index ($^\circ\text{C}$).
- `htss`: Human Thermal Stress Score ($0-100$ scale).

### 4. Health & Hospital Surge Outcomes (`SYNTHETIC/DEMO`)
- `hospitalization_surge_risk`: Categorical risk of heat-related hospital surge (`LOW`, `MODERATE`, `HIGH`, `VERY_HIGH`).
- `health_mortality_risk`: Categorical health emergency risk (`LOW`, `MODERATE`, `HIGH`, `VERY_HIGH`, `EXTREME`).

---

## Reproducible Pipeline Instructions

To regenerate the pre-populated database and raw CSV files:

```bash
python data/generate_delhi_dataset.py
```

This creates:
- `backend/app/heatguard.db` (Pre-seeded SQLite database)
- `data/delhi_wards.csv`
- `data/delhi_weather_history.csv`
- `data/delhi_demographics.csv`
