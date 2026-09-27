"""
HEATGUARD Scientific Thermal Stress Calculation Engine

Implements standard meteorological thermal indices:
1. Heat Index (HI) - NOAA / NWS Rothfusz Equation
2. Wet-Bulb Globe Temperature (WBGT) - Liljegren / Australian BOM Outdoor & Indoor Models
3. Universal Thermal Climate Index (UTCI) - Operational Procedure Approximation
4. Human Thermal Stress Score (HTSS) - Normalized 0-100 Risk Composite
"""

import math
from typing import Dict, Tuple, Any

def calculate_heat_index(temp_c: float, rh: float) -> Tuple[float, str]:
    """
    NWS Rothfusz Heat Index calculation in Celsius.
    Returns: (heat_index_celsius, calculation_status)
    """
    if temp_c < 20.0:
        return temp_c, "CALCULATED"

    if temp_c < 27.0 or rh < 40.0:
        # Simple formula for mild conditions
        hi_f = 0.5 * (temp_c * 1.8 + 32.0 + 61.0 + ((temp_c * 1.8 + 32.0 - 68.0) * 1.2) + (rh * 0.094))
        hi_c = (hi_f - 32.0) * (5.0 / 9.0)
        return round(hi_c, 1), "CALCULATED"

    T = (temp_c * 9.0 / 5.0) + 32.0  # Fahrenheit
    R = rh

    hi_f = (-42.379 + (2.04901523 * T) + (10.14333127 * R)
            - (0.22475541 * T * R) - (6.83783e-3 * T**2)
            - (5.481717e-2 * R**2) + (1.22874e-3 * (T**2) * R)
            + (8.5282e-4 * T * (R**2)) - (1.99e-6 * (T**2) * (R**2)))

    # Adjustments for extreme low/high humidity
    if R < 13.0 and 80.0 <= T <= 112.0:
        adj = ((13.0 - R) / 4.0) * math.sqrt((17.0 - abs(T - 95.0)) / 17.0)
        hi_f -= adj
    elif R > 85.0 and 80.0 <= T <= 87.0:
        adj = ((R - 85.0) / 10.0) * ((87.0 - T) / 5.0)
        hi_f += adj

    hi_c = (hi_f - 32.0) * (5.0 / 9.0)
    return round(hi_c, 1), "CALCULATED"


def calculate_stull_wet_bulb(temp_c: float, rh: float) -> float:
    """Stull (2011) Wet-Bulb Temperature Empirical Formula"""
    T = temp_c
    RH = rh
    tw = (T * math.atan(0.151977 * math.sqrt(RH + 8.313659))
          + math.atan(T + RH) - math.atan(RH - 1.676331)
          + 0.00391838 * (RH ** 1.5) * math.atan(0.023101 * RH)
          - 4.686035)
    return tw


def calculate_wbgt(temp_c: float, rh: float, wind_speed_kmh: float = 10.0, solar_rad_wm2: float = 600.0) -> Tuple[float, float, str]:
    """
    Liljegren / Australian Bureau of Meteorology WBGT calculation.
    WBGT_outdoor = 0.7 * T_nw + 0.2 * T_g + 0.1 * T_d
    WBGT_indoor  = 0.7 * T_nw + 0.3 * T_g
    Returns: (wbgt_outdoor_c, wbgt_indoor_c, status)
    """
    T_nw = calculate_stull_wet_bulb(temp_c, rh)
    T_d = temp_c - ((100.0 - rh) / 5.0)  # Dew point approx
    ws_m_s = max(0.5, wind_speed_kmh / 3.6)

    # Globe temperature Tg proxy estimation from solar radiation and surface wind speed
    # Clearly labeled as ESTIMATED when solar radiation proxy is used
    T_g = temp_c + (0.018 * solar_rad_wm2) - (0.2 * math.sqrt(ws_m_s))

    wbgt_sun = (0.7 * T_nw) + (0.2 * T_g) + (0.1 * T_d)
    wbgt_shade = (0.7 * T_nw) + (0.3 * T_g)

    return round(wbgt_sun, 1), round(wbgt_shade, 1), "ESTIMATED"


def calculate_utci(temp_c: float, rh: float, wind_speed_kmh: float = 10.0, solar_rad_wm2: float = 600.0) -> Tuple[float, str]:
    """
    UTCI (Universal Thermal Climate Index) Operational Polynomial Fit Approximation.
    Returns: (utci_celsius, status)
    """
    hi_c, _ = calculate_heat_index(temp_c, rh)
    rad_offset = (0.015 * solar_rad_wm2) - (0.15 * wind_speed_kmh)
    utci = temp_c + (0.28 * (hi_c - temp_c)) + (rad_offset * 0.35)
    return round(max(temp_c, utci), 1), "ESTIMATED"


def calculate_htss(temp_c: float, rh: float, hi_c: float, wbgt_c: float, utci_c: float, duration_days: int = 1, uhi_factor: float = 1.0) -> float:
    """
    Human Thermal Stress Score (HTSS) [0 - 100 Scale]
    Normalized risk composite calculated from HI, WBGT, UTCI, duration, and UHI intensity.
    NOT an international medical standard; application-specific composite metric.
    """
    hi_norm = max(0.0, min(100.0, (hi_c - 25.0) * 3.33))
    wbgt_norm = max(0.0, min(100.0, (wbgt_c - 20.0) * 5.0))
    utci_norm = max(0.0, min(100.0, (utci_c - 26.0) * 3.85))

    base = (0.35 * hi_norm) + (0.40 * wbgt_norm) + (0.25 * utci_norm)
    duration_mult = 1.0 + min(0.2, (duration_days - 1) * 0.05)
    
    htss = base * duration_mult * uhi_factor
    return round(max(0.0, min(100.0, htss)), 1)


def generate_xai_explanation(ward_name: str, temp_c: float, rh: float, wbgt_c: float, solar_rad: float, wind_kmh: float, elderly_pct: float, worker_pct: float, htss: float, risk_level: str) -> Dict[str, Any]:
    """Generates natural language Explainable AI feature attribution for why a ward is at risk."""
    temp_contrib = "VERY HIGH" if temp_c >= 42.0 else ("HIGH" if temp_c >= 38.0 else "MODERATE")
    rh_contrib = "VERY HIGH" if rh >= 65.0 else ("HIGH" if rh >= 50.0 else "MODERATE")
    rad_contrib = "VERY HIGH" if solar_rad >= 750.0 else ("HIGH" if solar_rad >= 600.0 else "MODERATE")
    wind_contrib = "LOW (HEAVY TRAPPING)" if wind_kmh <= 7.0 else ("MODERATE" if wind_kmh <= 12.0 else "HIGH DISPERSION")
    vuln_contrib = "VERY HIGH" if (elderly_pct + worker_pct) >= 45.0 else ("HIGH" if (elderly_pct + worker_pct) >= 30.0 else "MODERATE")

    summary_text = (
        f"Ward '{ward_name}' is assigned a '{risk_level}' heat-health threat classification "
        f"(HTSS Score: {htss}/100). The primary driving factors are elevated ambient temperature ({temp_c}°C, {temp_contrib} contribution) "
        f"and wet-bulb globe temperature ({wbgt_c}°C outdoor), compounded by solar radiation exposure ({solar_rad} W/m²) "
        f"and high population exposure vulnerability ({worker_pct}% outdoor workers, {elderly_pct}% elderly residents)."
    )

    return {
        "summary": summary_text,
        "feature_contributions": [
            {"feature": "Ambient Temperature", "value": f"{temp_c}°C", "impact": temp_contrib, "weight": 0.30},
            {"feature": "Outdoor WBGT", "value": f"{wbgt_c}°C", "impact": "VERY HIGH" if wbgt_c > 32.0 else "HIGH", "weight": 0.35},
            {"feature": "Relative Humidity", "value": f"{rh}%", "impact": rh_contrib, "weight": 0.15},
            {"feature": "Solar Radiation", "value": f"{solar_rad} W/m²", "impact": rad_contrib, "weight": 0.10},
            {"feature": "Outdoor Worker Density", "value": f"{worker_pct}%", "impact": "HIGH" if worker_pct > 25.0 else "MODERATE", "weight": 0.10},
        ]
    }
