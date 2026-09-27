"""
HEATGUARD Simulation Scenario Engine
Allows instant scenario shifts (NORMAL, HEATWAVE, EXTREME_HEATWAVE) for Hackathon demo mode.
Recalculates micro-weather, thermal stress indices, ML predictions, alerts, and recommended interventions.
"""

import sqlite3
from datetime import datetime
from typing import Dict, Any
import os

from .thermal import (
    calculate_heat_index,
    calculate_wbgt,
    calculate_utci,
    calculate_htss,
    generate_xai_explanation
)

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "heatguard.db")

def apply_simulation_scenario(scenario_type: str) -> Dict[str, Any]:
    """
    Modifies weather parameters across all 25 Delhi wards to simulate specific heatwave intensity scenarios.
    """
    scenario_type = scenario_type.upper()
    if scenario_type not in ["NORMAL", "HEATWAVE", "EXTREME_HEATWAVE"]:
        scenario_type = "HEATWAVE"

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Get all wards
    cursor.execute("SELECT id, name, zone, elderly_pct, outdoor_worker_pct, built_up_pct, green_cover_pct FROM wards")
    wards = cursor.fetchall()

    today_str = datetime.now().strftime("%Y-%m-%d %H:00:00")

    high_risk_count = 0
    extreme_risk_count = 0

    for w in wards:
        ward_id, ward_name, zone, elderly_pct, worker_pct, built_up_pct, green_cover_pct = w

        uhi_boost = (built_up_pct - 50.0) * 0.05
        green_cool = green_cover_pct * 0.06

        if scenario_type == "NORMAL":
            temp_c = round(33.5 + uhi_boost - green_cool, 1)
            rh_pct = round(52.0, 1)
            wind_kmh = round(12.0, 1)
            solar_wm2 = round(580.0, 1)
            duration = 1
        elif scenario_type == "HEATWAVE":
            temp_c = round(41.0 + uhi_boost - green_cool, 1)
            rh_pct = round(56.0, 1)
            wind_kmh = round(8.0, 1)
            solar_wm2 = round(740.0, 1)
            duration = 2
        else:  # EXTREME_HEATWAVE
            temp_c = round(46.2 + uhi_boost - green_cool, 1)
            rh_pct = round(64.0, 1)
            wind_kmh = round(5.5, 1)  # Low wind trapping heat
            solar_wm2 = round(860.0, 1)
            duration = 4

        # Calculate thermal indices
        hi_c, _ = calculate_heat_index(temp_c, rh_pct)
        wbgt_sun, wbgt_shade, _ = calculate_wbgt(temp_c, rh_pct, wind_kmh, solar_wm2)
        utci_c, _ = calculate_utci(temp_c, rh_pct, wind_kmh, solar_wm2)
        
        uhi_factor = 1.0 + (built_up_pct / 200.0)
        htss = calculate_htss(temp_c, rh_pct, hi_c, wbgt_sun, utci_c, duration, uhi_factor)

        # Risk Classification
        vuln_mult = 1.0 + (elderly_pct / 100.0) + (worker_pct / 150.0)
        eff_score = htss * vuln_mult

        if eff_score < 30.0:
            risk_tier = "LOW"
            surge_tier = "LOW"
            color = "GREEN"
        elif eff_score < 50.0:
            risk_tier = "MODERATE"
            surge_tier = "MODERATE"
            color = "YELLOW"
        elif eff_score < 70.0:
            risk_tier = "HIGH"
            surge_tier = "HIGH"
            color = "ORANGE"
            high_risk_count += 1
        elif eff_score < 85.0:
            risk_tier = "VERY_HIGH"
            surge_tier = "VERY_HIGH"
            color = "RED"
            high_risk_count += 1
        else:
            risk_tier = "EXTREME"
            surge_tier = "VERY_HIGH"
            color = "PURPLE"
            extreme_risk_count += 1

        vuln_score = round(min(100.0, (elderly_pct * 2.2) + (worker_pct * 1.5) + (built_up_pct * 0.3)), 1)
        xai_res = generate_xai_explanation(ward_name, temp_c, rh_pct, wbgt_sun, solar_wm2, wind_kmh, elderly_pct, worker_pct, htss, risk_tier)

        # Update Weather for latest forecast entry
        cursor.execute("""
        UPDATE weather_data 
        SET temperature_c = ?, relative_humidity_pct = ?, wind_speed_kmh = ?, solar_radiation_wm2 = ?
        WHERE ward_id = ? AND is_forecast = 0
        """, (temp_c, rh_pct, wind_kmh, solar_wm2, ward_id))

        # Update Thermal Indices
        cursor.execute("""
        UPDATE thermal_indices
        SET heat_index_c = ?, wbgt_outdoor_c = ?, wbgt_indoor_c = ?, utci_c = ?, htss = ?
        WHERE ward_id = ?
        """, (hi_c, wbgt_sun, wbgt_shade, utci_c, htss, ward_id))

        # Update Health Predictions
        cursor.execute("""
        UPDATE health_predictions
        SET htss = ?, health_risk_level = ?, hospital_surge_risk = ?, vulnerability_score = ?, color_code = ?, xai_explanation = ?
        WHERE ward_id = ?
        """, (htss, risk_tier, surge_tier, vuln_score, color, xai_res["summary"], ward_id))

        # Trigger simulated alerts if Extreme Heatwave
        if scenario_type == "EXTREME_HEATWAVE" and risk_tier in ["VERY_HIGH", "EXTREME"]:
            cursor.execute("""
            INSERT INTO alerts (ward_id, timestamp, risk_level, trigger_reason, recipient_group, message, channels, status)
            VALUES (?, ?, ?, 'Simulation Trigger: Extreme Thermal Stress Exceeded', 'Public, Disaster Management, Hospitals', ?, 'SMS, WhatsApp, Emergency Broadcast', 'BROADCASTED')
            """, (ward_id, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), risk_tier, f"[SIMULATION ALERT] Critical heat hazard in {ward_name}. HTSS: {htss}. Hydration stations active."))

    conn.commit()
    conn.close()

    return {
        "scenario": scenario_type,
        "status": "active",
        "message": f"Successfully activated {scenario_type} simulation mode across all 25 Delhi wards.",
        "affected_wards_count": len(wards),
        "high_risk_wards_count": high_risk_count,
        "extreme_risk_wards_count": extreme_risk_count
    }
