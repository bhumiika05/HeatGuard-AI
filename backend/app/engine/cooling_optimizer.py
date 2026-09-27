"""
HEATGUARD Cooling Centre Optimization Engine
Spatial scoring algorithm to identify optimal new cooling center locations.
Evaluates:
- High Human Thermal Stress Score (HTSS)
- Vulnerable population density (elderly % + outdoor worker %)
- Total population density
- Distance matrix to existing active cooling centres
"""

import math
from typing import List, Dict, Any

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates geographical distance between two lat/lon points in kilometers."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def recommend_cooling_centres(wards: List[Dict[str, Any]], existing_centres: List[Dict[str, Any]], top_n: int = 3) -> List[Dict[str, Any]]:
    """
    Evaluates each ward for underserved cooling infrastructure and recommends top N optimal locations.
    """
    recommendations = []

    for ward in wards:
        w_lat = ward["lat"]
        w_lon = ward["lon"]
        htss = ward.get("htss", 60.0)
        pop_density = ward.get("pop_density", 20000)
        elderly_pct = ward.get("elderly_pct", 12.0)
        worker_pct = ward.get("outdoor_worker_pct", 25.0)

        # Distance to nearest existing cooling center
        min_dist_km = 999.0
        nearest_centre_name = "None"
        for centre in existing_centres:
            dist = haversine_distance_km(w_lat, w_lon, centre["lat"], centre["lon"])
            if dist < min_dist_km:
                min_dist_km = dist
                nearest_centre_name = centre["name"]

        # Optimization Score Formula:
        # Score = (HTSS * 0.35) + (Vulnerability Factor * 0.30) + (PopDensity Factor * 0.15) + (Distance to Nearest * 0.20)
        vuln_factor = min(100.0, (elderly_pct * 2.5) + (worker_pct * 2.0))
        pop_factor = min(100.0, pop_density / 400.0)
        dist_factor = min(100.0, min_dist_km * 25.0)  # >4km distance gives 100 points

        optimization_score = (htss * 0.35) + (vuln_factor * 0.30) + (pop_factor * 0.15) + (dist_factor * 0.20)

        estimated_served = int((pop_density * 0.08) * (1.0 + worker_pct / 50.0))

        reason = (
            f"High thermal stress ({htss}/100) combined with {worker_pct}% outdoor workers and "
            f"{min_dist_km:.2f} km separation from nearest active cooling facility ({nearest_centre_name})."
        )

        recommendations.append({
            "ward_id": ward["id"],
            "ward_name": ward["name"],
            "zone": ward["zone"],
            "recommended_lat": round(w_lat + 0.002, 4),
            "recommended_lon": round(w_lon - 0.003, 4),
            "optimization_score": round(optimization_score, 1),
            "htss_score": htss,
            "vulnerability_factor": round(vuln_factor, 1),
            "min_distance_to_existing_km": round(min_dist_km, 2),
            "nearest_existing_centre": nearest_centre_name,
            "estimated_population_served": estimated_served,
            "reason": reason
        })

    # Sort descending by optimization score
    recommendations.sort(key=lambda x: x["optimization_score"], reverse=True)
    return recommendations[:top_n]
