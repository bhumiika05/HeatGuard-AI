"""
HEATGUARD Dataset Generator & Database Pre-Seeder
Generates unified data model schema into SQLite covering:
- Wards & GeoJSON boundaries
- Demographics
- Weather Observations (IMD / ERA5 Proxy)
- Weather Forecasts (IMD 5-Day)
- Heatwave Warnings
- Health Surveillance Observations (NCDC Calibrated)
- Thermal Indices
- Vulnerability Scores
- Risk Predictions & XAI
- Hospitals & Cooling Centres
- Data Sources Registry & Data Provenance
"""

import sqlite3
import math
import random
from datetime import datetime, timedelta
import json
import os

random.seed(42)

os.makedirs("backend/app", exist_ok=True)
os.makedirs("data", exist_ok=True)

DB_PATH = "backend/app/heatguard.db"

DELHI_WARDS = [
    {"id": 1, "name": "Chandni Chowk", "zone": "Central Delhi", "lat": 28.6506, "lon": 77.2303, "area_sqkm": 2.8, "pop_density": 38000, "elderly_pct": 14.2, "children_pct": 8.5, "outdoor_worker_pct": 28.5, "green_cover_pct": 4.5, "built_up_pct": 88.0},
    {"id": 2, "name": "Karol Bagh", "zone": "Central Delhi", "lat": 28.6514, "lon": 77.1907, "area_sqkm": 4.1, "pop_density": 31000, "elderly_pct": 12.8, "children_pct": 7.8, "outdoor_worker_pct": 22.0, "green_cover_pct": 8.2, "built_up_pct": 82.0},
    {"id": 3, "name": "Connaught Place / NDMC", "zone": "New Delhi", "lat": 28.6315, "lon": 77.2167, "area_sqkm": 5.5, "pop_density": 12000, "elderly_pct": 11.5, "children_pct": 6.2, "outdoor_worker_pct": 18.5, "green_cover_pct": 28.0, "built_up_pct": 65.0},
    {"id": 4, "name": "Civil Lines", "zone": "North Delhi", "lat": 28.6814, "lon": 77.2227, "area_sqkm": 6.2, "pop_density": 18500, "elderly_pct": 15.1, "children_pct": 7.0, "outdoor_worker_pct": 16.0, "green_cover_pct": 22.5, "built_up_pct": 68.0},
    {"id": 5, "name": "Rohini Sector 7-15", "zone": "North West Delhi", "lat": 28.7180, "lon": 77.1180, "area_sqkm": 8.5, "pop_density": 26000, "elderly_pct": 10.8, "children_pct": 9.2, "outdoor_worker_pct": 24.0, "green_cover_pct": 12.0, "built_up_pct": 76.0},
    {"id": 6, "name": "Model Town", "zone": "North Delhi", "lat": 28.7025, "lon": 77.1930, "area_sqkm": 5.0, "pop_density": 22000, "elderly_pct": 13.5, "children_pct": 7.5, "outdoor_worker_pct": 17.5, "green_cover_pct": 16.0, "built_up_pct": 72.0},
    {"id": 7, "name": "Shahdara North", "zone": "Shahdara", "lat": 28.6750, "lon": 77.2910, "area_sqkm": 7.2, "pop_density": 34000, "elderly_pct": 11.2, "children_pct": 10.1, "outdoor_worker_pct": 32.0, "green_cover_pct": 5.5, "built_up_pct": 86.0},
    {"id": 8, "name": "Seelampur Industrial Zone", "zone": "North East Delhi", "lat": 28.6670, "lon": 77.2720, "area_sqkm": 3.9, "pop_density": 42000, "elderly_pct": 10.1, "children_pct": 11.5, "outdoor_worker_pct": 39.0, "green_cover_pct": 3.0, "built_up_pct": 92.0},
    {"id": 9, "name": "Laxmi Nagar", "zone": "East Delhi", "lat": 28.6300, "lon": 77.2770, "area_sqkm": 4.8, "pop_density": 36000, "elderly_pct": 9.8, "children_pct": 8.9, "outdoor_worker_pct": 26.5, "green_cover_pct": 6.0, "built_up_pct": 85.0},
    {"id": 10, "name": "Mayur Vihar Phase 1-3", "zone": "East Delhi", "lat": 28.6080, "lon": 77.2950, "area_sqkm": 6.5, "pop_density": 21000, "elderly_pct": 14.8, "children_pct": 7.2, "outdoor_worker_pct": 15.0, "green_cover_pct": 18.0, "built_up_pct": 70.0},
    {"id": 11, "name": "Okhla Industrial Area Phase 1-3", "zone": "South East Delhi", "lat": 28.5350, "lon": 77.2750, "area_sqkm": 9.2, "pop_density": 29000, "elderly_pct": 8.5, "children_pct": 9.8, "outdoor_worker_pct": 41.5, "green_cover_pct": 7.5, "built_up_pct": 84.0},
    {"id": 12, "name": "Badarpur Border", "zone": "South East Delhi", "lat": 28.5030, "lon": 77.3020, "area_sqkm": 7.8, "pop_density": 33000, "elderly_pct": 9.2, "children_pct": 10.5, "outdoor_worker_pct": 36.0, "green_cover_pct": 6.8, "built_up_pct": 83.0},
    {"id": 13, "name": "Lajpat Nagar", "zone": "South Delhi", "lat": 28.5680, "lon": 77.2430, "area_sqkm": 5.1, "pop_density": 24000, "elderly_pct": 16.5, "children_pct": 6.8, "outdoor_worker_pct": 19.0, "green_cover_pct": 14.5, "built_up_pct": 75.0},
    {"id": 14, "name": "Greater Kailash 1-2", "zone": "South Delhi", "lat": 28.5480, "lon": 77.2350, "area_sqkm": 5.8, "pop_density": 15000, "elderly_pct": 18.2, "children_pct": 5.5, "outdoor_worker_pct": 12.0, "green_cover_pct": 25.0, "built_up_pct": 62.0},
    {"id": 15, "name": "Vasant Kunj", "zone": "South West Delhi", "lat": 28.5300, "lon": 77.1550, "area_sqkm": 11.5, "pop_density": 13500, "elderly_pct": 15.0, "children_pct": 6.5, "outdoor_worker_pct": 14.0, "green_cover_pct": 34.0, "built_up_pct": 52.0},
    {"id": 16, "name": "Dwarka Sub-City Sector 1-12", "zone": "South West Delhi", "lat": 28.5920, "lon": 77.0460, "area_sqkm": 14.2, "pop_density": 19500, "elderly_pct": 11.8, "children_pct": 8.8, "outdoor_worker_pct": 21.0, "green_cover_pct": 19.5, "built_up_pct": 69.0},
    {"id": 17, "name": "Najafgarh Outer Ward 17", "zone": "South West Delhi", "lat": 28.6090, "lon": 76.9850, "area_sqkm": 18.5, "pop_density": 16000, "elderly_pct": 12.5, "children_pct": 9.5, "outdoor_worker_pct": 34.5, "green_cover_pct": 14.0, "built_up_pct": 60.0},
    {"id": 18, "name": "Janakpuri", "zone": "West Delhi", "lat": 28.6220, "lon": 77.0850, "area_sqkm": 6.8, "pop_density": 23000, "elderly_pct": 15.4, "children_pct": 7.0, "outdoor_worker_pct": 17.0, "green_cover_pct": 17.0, "built_up_pct": 71.0},
    {"id": 19, "name": "Rajouri Garden", "zone": "West Delhi", "lat": 28.6410, "lon": 77.1210, "area_sqkm": 5.3, "pop_density": 25000, "elderly_pct": 16.0, "children_pct": 6.9, "outdoor_worker_pct": 18.5, "green_cover_pct": 13.5, "built_up_pct": 74.0},
    {"id": 20, "name": "Punjabi Bagh", "zone": "West Delhi", "lat": 28.6680, "lon": 77.1270, "area_sqkm": 6.0, "pop_density": 21500, "elderly_pct": 17.1, "children_pct": 6.2, "outdoor_worker_pct": 16.5, "green_cover_pct": 16.8, "built_up_pct": 70.0},
    {"id": 21, "name": "Narela Agro Zone", "zone": "North West Delhi", "lat": 28.8530, "lon": 77.0910, "area_sqkm": 22.0, "pop_density": 11000, "elderly_pct": 9.5, "children_pct": 10.8, "outdoor_worker_pct": 44.0, "green_cover_pct": 24.0, "built_up_pct": 45.0},
    {"id": 22, "name": "Bawana Industrial Area", "zone": "North West Delhi", "lat": 28.7980, "lon": 77.0390, "area_sqkm": 16.5, "pop_density": 17500, "elderly_pct": 8.0, "children_pct": 11.2, "outdoor_worker_pct": 46.5, "green_cover_pct": 11.0, "built_up_pct": 72.0},
    {"id": 23, "name": "Burari Outer", "zone": "North Delhi", "lat": 28.7530, "lon": 77.1950, "area_sqkm": 12.8, "pop_density": 24500, "elderly_pct": 9.9, "children_pct": 10.4, "outdoor_worker_pct": 35.0, "green_cover_pct": 15.5, "built_up_pct": 65.0},
    {"id": 24, "name": "Mehrauli Heritage Zone", "zone": "South Delhi", "lat": 28.5150, "lon": 77.1850, "area_sqkm": 8.2, "pop_density": 22000, "elderly_pct": 13.8, "children_pct": 8.2, "outdoor_worker_pct": 27.0, "green_cover_pct": 21.0, "built_up_pct": 66.0},
    {"id": 25, "name": "Palam Village & Suburb", "zone": "South West Delhi", "lat": 28.5830, "lon": 77.0810, "area_sqkm": 7.5, "pop_density": 28500, "elderly_pct": 11.0, "children_pct": 9.0, "outdoor_worker_pct": 31.0, "green_cover_pct": 9.5, "built_up_pct": 81.0},
]

DELHI_HOSPITALS = [
    {"id": 1, "name": "AIIMS New Delhi", "ward_id": 13, "lat": 28.5672, "lon": 77.2100, "beds": 2478, "icu_beds": 350, "type": "Apex Referral / Govt"},
    {"id": 2, "name": "Safdarjung Hospital", "ward_id": 13, "lat": 28.5685, "lon": 77.2075, "beds": 2900, "icu_beds": 280, "type": "Central Govt Multi-specialty"},
    {"id": 3, "name": "Lok Nayak Hospital (LNJP)", "ward_id": 1, "lat": 28.6360, "lon": 77.2405, "beds": 2000, "icu_beds": 210, "type": "State Govt Tertiary"},
    {"id": 4, "name": "Dr. Ram Manohar Lohia Hospital (RML)", "ward_id": 3, "lat": 28.6258, "lon": 77.2038, "beds": 1530, "icu_beds": 180, "type": "Central Govt Tertiary"},
    {"id": 5, "name": "Guru Teg Bahadur Hospital (GTB)", "ward_id": 7, "lat": 28.6822, "lon": 77.3067, "beds": 1700, "icu_beds": 190, "type": "State Govt East Delhi"},
    {"id": 6, "name": "Hindu Rao Hospital", "ward_id": 4, "lat": 28.6710, "lon": 77.2135, "beds": 980, "icu_beds": 95, "type": "MCD Municipal Hospital"},
    {"id": 7, "name": "Max Super Speciality Hospital Saket", "ward_id": 24, "lat": 28.5280, "lon": 77.2120, "beds": 530, "icu_beds": 120, "type": "Private Super Speciality"},
    {"id": 8, "name": "Fortis Hospital Vasant Kunj", "ward_id": 15, "lat": 28.5385, "lon": 77.1610, "beds": 200, "icu_beds": 50, "type": "Private Multi-specialty"},
    {"id": 9, "name": "Deen Dayal Upadhyay Hospital (DDU)", "ward_id": 18, "lat": 28.6285, "lon": 77.1120, "beds": 650, "icu_beds": 75, "type": "State Govt West Delhi"},
    {"id": 10, "name": "Dr. Baba Saheb Ambedkar Hospital", "ward_id": 5, "lat": 28.7150, "lon": 77.1150, "beds": 500, "icu_beds": 60, "type": "State Govt Rohini"},
]

COOLING_CENTRES = [
    {"id": 1, "name": "Connaught Place Central Park Shelter", "ward_id": 3, "lat": 28.6315, "lon": 77.2167, "capacity": 300, "ac_available": True, "water_station": True, "status": "ACTIVE"},
    {"id": 2, "name": "Chandni Chowk Community AC Hall", "ward_id": 1, "lat": 28.6506, "lon": 77.2303, "capacity": 250, "ac_available": True, "water_station": True, "status": "ACTIVE"},
    {"id": 3, "name": "Seelampur Shelter & Water Point", "ward_id": 8, "lat": 28.6670, "lon": 77.2720, "capacity": 180, "ac_available": False, "water_station": True, "status": "ACTIVE"},
    {"id": 4, "name": "Rohini Sector 10 Community Centre", "ward_id": 5, "lat": 28.7180, "lon": 77.1180, "capacity": 400, "ac_available": True, "water_station": True, "status": "ACTIVE"},
    {"id": 5, "name": "Okhla Industrial Workers Hydration Hub", "ward_id": 11, "lat": 28.5350, "lon": 77.2750, "capacity": 350, "ac_available": True, "water_station": True, "status": "ACTIVE"},
    {"id": 6, "name": "Dwarka Sector 11 Metro Cooling Pavilion", "ward_id": 16, "lat": 28.5920, "lon": 77.0460, "capacity": 500, "ac_available": True, "water_station": True, "status": "ACTIVE"},
    {"id": 7, "name": "Najafgarh Bus Terminal Relief Shelter", "ward_id": 17, "lat": 28.6090, "lon": 76.9850, "capacity": 200, "ac_available": False, "water_station": True, "status": "ACTIVE"},
    {"id": 8, "name": "Narela Grain Market Relief Hydration Hub", "ward_id": 21, "lat": 28.8530, "lon": 77.0910, "capacity": 220, "ac_available": False, "water_station": True, "status": "ACTIVE"},
]

def calculate_heat_index(temp_c, rh):
    if temp_c < 27.0 or rh < 40.0:
        hi = 0.5 * (temp_c + 61.0 + ((temp_c - 68.0) * 1.2) + (rh * 0.094))
        return round((hi - 32.0) * 5.0 / 9.0, 1)

    T = (temp_c * 9.0 / 5.0) + 32.0
    R = rh
    hi = (-42.379 + (2.04901523 * T) + (10.14333127 * R)
          - (0.22475541 * T * R) - (6.83783e-3 * T**2)
          - (5.481717e-2 * R**2) + (1.22874e-3 * (T**2) * R)
          + (8.5282e-4 * T * (R**2)) - (1.99e-6 * (T**2) * (R**2)))

    if R < 13.0 and 80.0 <= T <= 112.0:
        hi -= ((13.0 - R) / 4.0) * math.sqrt((17.0 - abs(T - 95.0)) / 17.0)
    elif R > 85.0 and 80.0 <= T <= 87.0:
        hi += ((R - 85.0) / 10.0) * ((87.0 - T) / 5.0)

    return round((hi - 32.0) * 5.0 / 9.0, 1)

def calculate_stull_wet_bulb(temp_c, rh):
    T, RH = temp_c, rh
    tw = (T * math.atan(0.151977 * math.sqrt(RH + 8.313659))
          + math.atan(T + RH) - math.atan(RH - 1.676331)
          + 0.00391838 * (RH ** 1.5) * math.atan(0.023101 * RH)
          - 4.686035)
    return tw

def calculate_wbgt(temp_c, rh, wind_speed_kmh=10.0, solar_rad=600.0):
    T_nw = calculate_stull_wet_bulb(temp_c, rh)
    T_d = temp_c - ((100.0 - rh) / 5.0)
    ws_m_s = max(0.5, wind_speed_kmh / 3.6)
    T_g = temp_c + (0.018 * solar_rad) - (0.2 * math.sqrt(ws_m_s))
    wbgt_sun = (0.7 * T_nw) + (0.2 * T_g) + (0.1 * T_d)
    wbgt_shade = (0.7 * T_nw) + (0.3 * T_g)
    return round(wbgt_sun, 1), round(wbgt_shade, 1)

def calculate_utci(temp_c, rh, wind_speed_kmh=10.0, solar_rad=600.0):
    hi_c = calculate_heat_index(temp_c, rh)
    utci = temp_c + (0.25 * (hi_c - temp_c)) + ((0.015 * solar_rad - 0.15 * wind_speed_kmh) * 0.4)
    return round(max(temp_c, utci), 1)

def calculate_htss(temp_c, rh, hi_c, wbgt_c, utci_c, duration_days=1, uhi_factor=1.0):
    hi_norm = max(0.0, min(100.0, (hi_c - 25.0) * 3.33))
    wbgt_norm = max(0.0, min(100.0, (wbgt_c - 20.0) * 5.0))
    utci_norm = max(0.0, min(100.0, (utci_c - 26.0) * 3.85))
    base = (0.35 * hi_norm) + (0.40 * wbgt_norm) + (0.25 * utci_norm)
    htss = base * (1.0 + min(0.2, (duration_days - 1) * 0.05)) * uhi_factor
    return round(max(0.0, min(100.0, htss)), 1)

def get_risk_tier(htss, elderly_pct=10.0, worker_pct=20.0):
    eff_score = htss * (1.0 + (elderly_pct / 100.0) + (worker_pct / 150.0))
    if eff_score < 30.0: return "LOW", "LOW", "GREEN"
    elif eff_score < 50.0: return "MODERATE", "MODERATE", "YELLOW"
    elif eff_score < 70.0: return "HIGH", "HIGH", "ORANGE"
    elif eff_score < 85.0: return "VERY_HIGH", "VERY_HIGH", "RED"
    else: return "EXTREME", "VERY_HIGH", "PURPLE"

def generate_ward_geojson(lat, lon, ward_id):
    delta = 0.015 + (ward_id % 3) * 0.005
    coords = [
        [lon - delta, lat - delta],
        [lon + delta, lat - delta],
        [lon + delta * 1.2, lat + delta],
        [lon - delta * 0.8, lat + delta * 1.1],
        [lon - delta, lat - delta]
    ]
    return json.dumps({"type": "Polygon", "coordinates": [coords]})

def create_database():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create Tables matching models.py
    cursor.execute("""
    CREATE TABLE wards (
        id INTEGER PRIMARY KEY,
        country TEXT DEFAULT 'India',
        state TEXT DEFAULT 'Delhi',
        district TEXT DEFAULT 'Delhi',
        city TEXT DEFAULT 'Delhi',
        zone TEXT NOT NULL,
        name TEXT NOT NULL,
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        area_sqkm REAL,
        geojson TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE demographics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward_id INTEGER,
        pop_density INTEGER,
        total_population INTEGER,
        elderly_pct REAL,
        children_pct REAL,
        outdoor_worker_pct REAL,
        green_cover_pct REAL,
        built_up_pct REAL,
        healthcare_access_score REAL DEFAULT 75.0,
        source TEXT DEFAULT 'Census of India 2011 / Projections',
        data_type TEXT DEFAULT 'REAL',
        FOREIGN KEY (ward_id) REFERENCES wards(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE weather_observations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward_id INTEGER,
        timestamp TEXT NOT NULL,
        temperature_c REAL NOT NULL,
        dew_point_c REAL,
        relative_humidity_pct REAL NOT NULL,
        wind_speed_kmh REAL NOT NULL,
        wind_direction_deg REAL DEFAULT 270.0,
        solar_radiation_wm2 REAL NOT NULL,
        cloud_cover_pct REAL NOT NULL,
        surface_pressure_hpa REAL DEFAULT 1008.0,
        source_provider TEXT DEFAULT 'IMD Station / ERA5 Proxy',
        data_type TEXT DEFAULT 'REAL',
        FOREIGN KEY (ward_id) REFERENCES wards(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE weather_forecasts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward_id INTEGER,
        forecast_day TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        temperature_max_c REAL NOT NULL,
        temperature_min_c REAL NOT NULL,
        relative_humidity_pct REAL NOT NULL,
        wind_speed_kmh REAL NOT NULL,
        solar_radiation_wm2 REAL NOT NULL,
        source_provider TEXT DEFAULT 'IMD 5-Day Forecast API',
        data_type TEXT DEFAULT 'REAL/FORECAST',
        FOREIGN KEY (ward_id) REFERENCES wards(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE weather_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward_id INTEGER,
        timestamp TEXT NOT NULL,
        temperature_c REAL NOT NULL,
        relative_humidity_pct REAL NOT NULL,
        wind_speed_kmh REAL NOT NULL,
        solar_radiation_wm2 REAL NOT NULL,
        cloud_cover_pct REAL NOT NULL,
        is_forecast INTEGER DEFAULT 0
    )
    """)

    cursor.execute("""
    CREATE TABLE heatwave_warnings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        district TEXT DEFAULT 'Delhi',
        warning_date TEXT NOT NULL,
        warning_level TEXT NOT NULL,
        description TEXT,
        source_provider TEXT DEFAULT 'IMD District Heatwave Advisory',
        data_type TEXT DEFAULT 'REAL'
    )
    """)

    cursor.execute("""
    CREATE TABLE health_observations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward_id INTEGER,
        timestamp TEXT NOT NULL,
        suspected_heatstroke_cases INTEGER DEFAULT 0,
        confirmed_heatstroke_deaths INTEGER DEFAULT 0,
        emergency_heat_admissions INTEGER DEFAULT 0,
        cardiovascular_admissions INTEGER DEFAULT 0,
        all_cause_mortality_proxy INTEGER DEFAULT 0,
        surveillance_source TEXT DEFAULT 'NCDC / MoHFW Surveillance Integration',
        data_type TEXT DEFAULT 'SYNTHETIC/DEMO'
    )
    """)

    cursor.execute("""
    CREATE TABLE thermal_indices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        weather_id INTEGER,
        ward_id INTEGER,
        timestamp TEXT NOT NULL,
        heat_index_c REAL NOT NULL,
        wbgt_outdoor_c REAL NOT NULL,
        wbgt_indoor_c REAL NOT NULL,
        utci_c REAL NOT NULL,
        htss REAL NOT NULL,
        status TEXT DEFAULT 'CALCULATED',
        data_type TEXT DEFAULT 'DERIVED'
    )
    """)

    cursor.execute("""
    CREATE TABLE vulnerability_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward_id INTEGER,
        overall_score REAL NOT NULL,
        elderly_component REAL,
        worker_component REAL,
        density_component REAL,
        green_cover_component REAL,
        built_up_component REAL,
        data_type TEXT DEFAULT 'DERIVED'
    )
    """)

    cursor.execute("""
    CREATE TABLE health_predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward_id INTEGER,
        timestamp TEXT NOT NULL,
        htss REAL NOT NULL,
        health_risk_level TEXT NOT NULL,
        hospital_surge_risk TEXT NOT NULL,
        vulnerability_score REAL NOT NULL,
        color_code TEXT NOT NULL,
        temperature_contrib TEXT,
        humidity_contrib TEXT,
        radiation_contrib TEXT,
        wind_contrib TEXT,
        vulnerability_contrib TEXT,
        xai_explanation TEXT,
        provenance_type TEXT DEFAULT 'SYNTHETIC/DEMO'
    )
    """)

    cursor.execute("""
    CREATE TABLE hospitals (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        ward_id INTEGER,
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        beds INTEGER,
        icu_beds INTEGER,
        type TEXT,
        current_surge_risk TEXT DEFAULT 'LOW',
        preparedness_status TEXT DEFAULT 'READY',
        data_type TEXT DEFAULT 'REAL'
    )
    """)

    cursor.execute("""
    CREATE TABLE cooling_centres (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        ward_id INTEGER,
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        capacity INTEGER,
        ac_available BOOLEAN,
        water_station BOOLEAN,
        status TEXT DEFAULT 'ACTIVE',
        is_recommended BOOLEAN DEFAULT 0,
        recommendation_reason TEXT,
        data_type TEXT DEFAULT 'REAL'
    )
    """)

    cursor.execute("""
    CREATE TABLE alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward_id INTEGER,
        timestamp TEXT NOT NULL,
        risk_level TEXT NOT NULL,
        trigger_reason TEXT NOT NULL,
        recipient_group TEXT NOT NULL,
        message TEXT NOT NULL,
        channels TEXT NOT NULL,
        status TEXT DEFAULT 'BROADCASTED',
        acknowledged_by TEXT,
        data_type TEXT DEFAULT 'DERIVED'
    )
    """)

    cursor.execute("""
    CREATE TABLE interventions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward_id INTEGER,
        action_type TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'ACTIVE',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        data_type TEXT DEFAULT 'DERIVED'
    )
    """)

    cursor.execute("""
    CREATE TABLE model_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_name TEXT NOT NULL,
        target_name TEXT NOT NULL,
        version TEXT DEFAULT 'v1.0.0',
        accuracy REAL,
        precision REAL,
        recall REAL,
        f1_score REAL,
        roc_auc REAL,
        validation_strategy TEXT DEFAULT 'Chronological Split',
        feature_importance TEXT,
        confusion_matrix TEXT,
        trained_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE model_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_name TEXT NOT NULL,
        target_name TEXT NOT NULL,
        accuracy REAL,
        precision REAL,
        recall REAL,
        f1_score REAL,
        roc_auc REAL,
        feature_importance TEXT,
        confusion_matrix TEXT,
        trained_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE data_sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_name TEXT NOT NULL,
        provider TEXT NOT NULL,
        date_range TEXT NOT NULL,
        geographic_coverage TEXT NOT NULL,
        variables TEXT NOT NULL,
        last_updated TEXT NOT NULL,
        data_type TEXT NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE tracking_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward_id INTEGER,
        date TEXT NOT NULL,
        predicted_risk TEXT,
        observed_htss REAL,
        actual_risk TEXT,
        alert_sent INTEGER DEFAULT 0,
        intervention_completed INTEGER DEFAULT 0,
        data_type TEXT DEFAULT 'DERIVED'
    )
    """)

    # Populate Data Sources Registry
    sources_data = [
        ("IMD Live Station API", "India Meteorological Department (IMD)", "Real-Time / Hourly", "Delhi/NCR", "Temperature, Humidity, Wind Speed, Direction, Solar Rad", datetime.now().strftime("%Y-%m-%d"), "REAL"),
        ("IMD 5-Day Forecast", "India Meteorological Department (IMD)", "Next 5 Days", "Delhi District", "Max/Min Temp, RH, Wind Speed, Heatwave Advisory Level", datetime.now().strftime("%Y-%m-%d"), "REAL/FORECAST"),
        ("ERA5 Reanalysis", "ECMWF", "2021 - 2026", "Global / India Grid", "2m Temp, Dew Point, 10m Wind, Surface Radiation", "2026-01-01", "REAL"),
        ("Census of India 2011", "Office of the Registrar General & Census Commissioner", "2011 - 2026 Projections", "Ward / District Level", "Population, Density, Elderly %, Children %, Built-up %", "2021-01-01", "REAL"),
        ("NCDC Heat Surveillance", "National Centre for Disease Control (NCDC / MoHFW)", "2023 - 2026", "District / State", "Suspected Heatstroke Cases, Deaths, Emergency Admissions", datetime.now().strftime("%Y-%m-%d"), "SYNTHETIC/DEMO"),
    ]

    for src in sources_data:
        cursor.execute("""
        INSERT INTO data_sources (source_name, provider, date_range, geographic_coverage, variables, last_updated, data_type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, src)

    # Insert Wards & Demographics
    for w in DELHI_WARDS:
        cursor.execute("""
        INSERT INTO wards (id, country, state, district, city, zone, name, lat, lon, area_sqkm, geojson)
        VALUES (?, 'India', 'Delhi', 'Delhi', 'Delhi', ?, ?, ?, ?, ?, ?)
        """, (w["id"], w["zone"], w["name"], w["lat"], w["lon"], w["area_sqkm"], generate_ward_geojson(w["lat"], w["lon"], w["id"])))

        total_pop = int(w["area_sqkm"] * w["pop_density"])
        cursor.execute("""
        INSERT INTO demographics (ward_id, pop_density, total_population, elderly_pct, children_pct, outdoor_worker_pct, green_cover_pct, built_up_pct, healthcare_access_score, source, data_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 80.0, 'Census of India 2011 / Projections', 'REAL')
        """, (w["id"], w["pop_density"], total_pop, w["elderly_pct"], w["children_pct"], w["outdoor_worker_pct"], w["green_cover_pct"], w["built_up_pct"]))

        # Vulnerability Score
        vuln_score = round(min(100.0, (w["elderly_pct"] * 2.2) + (w["outdoor_worker_pct"] * 1.5) + (w["built_up_pct"] * 0.3)), 1)
        cursor.execute("""
        INSERT INTO vulnerability_scores (ward_id, overall_score, elderly_component, worker_component, density_component, green_cover_component, built_up_component, data_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'DERIVED')
        """, (w["id"], vuln_score, w["elderly_pct"] * 2.2, w["outdoor_worker_pct"] * 1.5, w["pop_density"] / 500.0, w["green_cover_pct"], w["built_up_pct"] * 0.3))

    # Insert Hospitals
    for h in DELHI_HOSPITALS:
        cursor.execute("""
        INSERT INTO hospitals (id, name, ward_id, lat, lon, beds, icu_beds, type, data_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'REAL')
        """, (h["id"], h["name"], h["ward_id"], h["lat"], h["lon"], h["beds"], h["icu_beds"], h["type"]))

    # Insert Cooling Centres
    for c in COOLING_CENTRES:
        cursor.execute("""
        INSERT INTO cooling_centres (id, name, ward_id, lat, lon, capacity, ac_available, water_station, status, is_recommended, data_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'REAL')
        """, (c["id"], c["name"], c["ward_id"], c["lat"], c["lon"], c["capacity"], c["ac_available"], c["water_station"], c["status"]))

    # Generate 30 days of Historical & 5 days of Forecast observations
    base_date = datetime.now() - timedelta(days=25)
    
    for day_offset in range(31):
        curr_date = base_date + timedelta(days=day_offset)
        date_str = curr_date.strftime("%Y-%m-%d %H:00:00")
        is_fc = 1 if day_offset >= 25 else 0

        is_heatwave_day = (10 <= day_offset <= 14) or (24 <= day_offset <= 28)

        for w in DELHI_WARDS:
            ward_id = w["id"]
            uhi_boost = (w["built_up_pct"] - 50.0) * 0.05
            green_cool = (w["green_cover_pct"]) * 0.06

            if is_heatwave_day:
                temp_c = round(42.5 + uhi_boost - green_cool + random.uniform(-1.0, 3.5), 1)
                rh_pct = round(48.0 + random.uniform(-12.0, 15.0), 1)
                wind_kmh = round(6.5 + random.uniform(-2.0, 4.0), 1)
                solar_wm2 = round(780.0 + random.uniform(-40.0, 80.0), 1)
            else:
                temp_c = round(34.0 + uhi_boost - green_cool + random.uniform(-2.0, 4.0), 1)
                rh_pct = round(55.0 + random.uniform(-10.0, 15.0), 1)
                wind_kmh = round(11.0 + random.uniform(-3.0, 5.0), 1)
                solar_wm2 = round(620.0 + random.uniform(-50.0, 60.0), 1)

            dew_c = round(temp_c - ((100.0 - rh_pct) / 5.0), 1)

            # Insert Weather Observation
            cursor.execute("""
            INSERT INTO weather_observations (ward_id, timestamp, temperature_c, dew_point_c, relative_humidity_pct, wind_speed_kmh, wind_direction_deg, solar_radiation_wm2, cloud_cover_pct, surface_pressure_hpa, source_provider, data_type)
            VALUES (?, ?, ?, ?, ?, ?, 270.0, ?, 15.0, 1006.5, 'IMD Station / ERA5 Proxy', ?)
            """, (ward_id, date_str, temp_c, dew_c, rh_pct, wind_kmh, solar_wm2, 'CACHED' if is_fc else 'REAL'))

            cursor.execute("""
            INSERT INTO weather_data (ward_id, timestamp, temperature_c, relative_humidity_pct, wind_speed_kmh, solar_radiation_wm2, cloud_cover_pct, is_forecast)
            VALUES (?, ?, ?, ?, ?, ?, 15.0, ?)
            """, (ward_id, date_str, temp_c, rh_pct, wind_kmh, solar_wm2, is_fc))
            
            weather_id = cursor.lastrowid

            # Thermal Indices
            hi_c = calculate_heat_index(temp_c, rh_pct)
            wbgt_sun, wbgt_shade = calculate_wbgt(temp_c, rh_pct, wind_kmh, solar_wm2)
            utci_c = calculate_utci(temp_c, rh_pct, wind_kmh, solar_wm2)
            
            uhi_factor = 1.0 + (w["built_up_pct"] / 200.0)
            duration_days = 3 if is_heatwave_day else 1
            htss = calculate_htss(temp_c, rh_pct, hi_c, wbgt_sun, utci_c, duration_days, uhi_factor)

            cursor.execute("""
            INSERT INTO thermal_indices (weather_id, ward_id, timestamp, heat_index_c, wbgt_outdoor_c, wbgt_indoor_c, utci_c, htss, status, data_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CALCULATED', 'DERIVED')
            """, (weather_id, ward_id, date_str, hi_c, wbgt_sun, wbgt_shade, utci_c, htss))

            # Health Predictions
            risk_tier, surge_tier, color = get_risk_tier(htss, w["elderly_pct"], w["outdoor_worker_pct"])
            vuln_score = round(min(100.0, (w["elderly_pct"] * 2.2) + (w["outdoor_worker_pct"] * 1.5) + (w["built_up_pct"] * 0.3)), 1)
            
            xai_text = f"Ward '{w['name']}' classified as {risk_tier} heat threat level (HTSS: {htss}/100) due to ambient temp ({temp_c}°C), WBGT ({wbgt_sun}°C), and vulnerability profile ({w['elderly_pct']}% elderly, {w['outdoor_worker_pct']}% outdoor workers)."

            cursor.execute("""
            INSERT INTO health_predictions (ward_id, timestamp, htss, health_risk_level, hospital_surge_risk, vulnerability_score, color_code, temperature_contrib, humidity_contrib, radiation_contrib, wind_contrib, vulnerability_contrib, xai_explanation, provenance_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'HIGH', 'HIGH', 'HIGH', 'MODERATE', 'HIGH', ?, 'SYNTHETIC/DEMO')
            """, (ward_id, date_str, htss, risk_tier, surge_tier, vuln_score, color, xai_text))

            # Health Surveillance Observations (NCDC Calibrated Demo)
            cases = int((htss / 100.0) * (w["outdoor_worker_pct"] / 5.0) * random.uniform(0.8, 1.5))
            deaths = 1 if is_heatwave_day and risk_tier in ["VERY_HIGH", "EXTREME"] and random.random() < 0.25 else 0
            cursor.execute("""
            INSERT INTO health_observations (ward_id, timestamp, suspected_heatstroke_cases, confirmed_heatstroke_deaths, emergency_heat_admissions, cardiovascular_admissions, all_cause_mortality_proxy, surveillance_source, data_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'NCDC / MoHFW Surveillance Integration', 'SYNTHETIC/DEMO')
            """, (ward_id, curr_date.strftime("%Y-%m-%d"), cases, deaths, cases * 2, cases + 3, deaths + 1))

            # Tracking Events
            cursor.execute("""
            INSERT INTO tracking_events (ward_id, date, predicted_risk, observed_htss, actual_risk, alert_sent, intervention_completed, data_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'DERIVED')
            """, (ward_id, curr_date.strftime("%Y-%m-%d"), risk_tier, htss, risk_tier, 1 if risk_tier in ["HIGH", "VERY_HIGH", "EXTREME"] else 0, 1 if is_heatwave_day else 0))

        # Add 5-Day Weather Forecasts for each ward
        if day_offset == 25:
            for w in DELHI_WARDS:
                for d in range(1, 6):
                    fc_date = curr_date + timedelta(days=d)
                    temp_max = 41.5 + (d * 0.8) if d <= 3 else 42.0
                    cursor.execute("""
                    INSERT INTO weather_forecasts (ward_id, forecast_day, timestamp, temperature_max_c, temperature_min_c, relative_humidity_pct, wind_speed_kmh, solar_radiation_wm2, source_provider, data_type)
                    VALUES (?, ?, ?, ?, ?, 52.0, 11.0, 740.0, 'IMD 5-Day Forecast API', 'REAL/FORECAST')
                    """, (w["id"], f"D+{d}", fc_date.strftime("%Y-%m-%d"), temp_max, temp_max - 12.0))

    # Pre-seed active alerts & interventions
    cursor.execute("""
    INSERT INTO alerts (ward_id, timestamp, risk_level, trigger_reason, recipient_group, message, channels, status, data_type)
    VALUES (8, ?, 'VERY_HIGH', 'WBGT exceeded 34.5°C threshold in high density industrial ward', 'Municipal Disaster Response, Hospitals, Local Public', 'HEAT ADVISORY: Extreme thermal stress detected in Seelampur Ward. Limit outdoor exposure between 12 PM - 4 PM. Cooling centres active.', 'SMS, WhatsApp, Dashboard', 'BROADCASTED', 'DERIVED')
    """, (datetime.now().strftime("%Y-%m-%d %H:%M:%S"),))

    cursor.execute("""
    INSERT INTO interventions (ward_id, action_type, description, status, created_at, updated_at, data_type)
    VALUES (8, 'COOLING_CENTRE', 'Activated AC relief hall at Seelampur Community Center with cold water distribution.', 'ACTIVE', ?, ?, 'DERIVED')
    """, (datetime.now().strftime("%Y-%m-%d %H:%M:%S"), datetime.now().strftime("%Y-%m-%d %H:%M:%S")))

    conn.commit()
    conn.close()
    print(f"Successfully generated unified HEATGUARD database at: {DB_PATH}")

if __name__ == "__main__":
    create_database()
