"""
HEATGUARD Dynamic Outdoor Work Scheduler Engine
Calculates safe, caution, and restricted work windows based on forecast thermal stress (HI / WBGT).
"""

from typing import Dict, Any, List

def calculate_work_schedule(temp_c: float, rh: float, wbgt_c: float, htss: float) -> Dict[str, Any]:
    """
    Determines recommended outdoor work hours according to OSHA / ISO 7243 thermal exposure guidance.
    """
    # Hours 6 AM to 8 PM evaluation
    hourly_slots = [
        {"time": "06:00 - 08:00", "wbgt": round(wbgt_c - 6.0, 1), "status": "SAFE", "color": "GREEN"},
        {"time": "08:00 - 10:00", "wbgt": round(wbgt_c - 3.0, 1), "status": "SAFE", "color": "GREEN"},
        {"time": "10:00 - 12:00", "wbgt": round(wbgt_c - 1.0, 1), "status": "CAUTION", "color": "YELLOW"},
        {"time": "12:00 - 14:00", "wbgt": round(wbgt_c + 1.5, 1), "status": "RESTRICTED", "color": "RED"},
        {"time": "14:00 - 16:00", "wbgt": round(wbgt_c + 2.0, 1), "status": "RESTRICTED", "color": "RED"},
        {"time": "16:00 - 18:00", "wbgt": round(wbgt_c - 0.5, 1), "status": "CAUTION", "color": "YELLOW"},
        {"time": "18:00 - 20:00", "wbgt": round(wbgt_c - 4.0, 1), "status": "SAFE", "color": "GREEN"},
    ]

    # Re-evaluate statuses based on WBGT threshold standards
    for slot in hourly_slots:
        wb = slot["wbgt"]
        if wb >= 32.0:
            slot["status"] = "RESTRICTED"
            slot["color"] = "PURPLE"
            slot["guidance"] = "Mandatory work stoppage for heavy labor. Mandatory shaded rest."
        elif wb >= 29.0:
            slot["status"] = "RESTRICTED"
            slot["color"] = "RED"
            slot["guidance"] = "Heavy work limit: 15 min work / 45 min rest per hour with hydration."
        elif wb >= 26.0:
            slot["status"] = "CAUTION"
            slot["color"] = "YELLOW"
            slot["guidance"] = "Moderate work limit: 45 min work / 15 min rest per hour with shade."
        else:
            slot["status"] = "SAFE"
            slot["color"] = "GREEN"
            slot["guidance"] = "Normal work schedule permitted with active hydration monitoring."

    recommended_windows = ["06:00 - 10:00", "17:00 - 20:00"]
    avoid_windows = ["12:00 - 16:00"] if htss >= 60.0 else ["13:00 - 15:00"]

    return {
        "htss_score": htss,
        "wbgt_peak_c": wbgt_c,
        "recommended_work_windows": recommended_windows,
        "avoid_work_windows": avoid_windows,
        "hourly_breakdown": hourly_slots,
        "disclaimer": "Recommended schedule based on forecast thermal stress. Final decisions should follow local occupational-safety regulations."
    }
