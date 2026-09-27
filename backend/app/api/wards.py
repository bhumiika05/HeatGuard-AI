"""
Wards API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json
from ..database import get_db
from ..models import Ward, Demographic, WeatherObservation, WeatherForecast, ThermalIndices, HealthPrediction, Hospital, CoolingCentre
from ..schemas import WardBase
from ..engine.work_scheduler import calculate_work_schedule

router = APIRouter(prefix="/api/wards", tags=["Wards"])

@router.get("", response_model=List[WardBase])
def get_all_wards(db: Session = Depends(get_db)):
    """Returns metadata and demographic indicators for all 25 Delhi wards."""
    return db.query(Ward).all()

@router.get("/geojson")
def get_wards_geojson(db: Session = Depends(get_db)):
    """Returns a GeoJSON FeatureCollection of all ward boundaries for Leaflet GIS mapping."""
    wards = db.query(Ward).all()
    features = []

    for w in wards:
        prediction = db.query(HealthPrediction).filter(HealthPrediction.ward_id == w.id).order_by(HealthPrediction.id.desc()).first()
        thermal = db.query(ThermalIndices).filter(ThermalIndices.ward_id == w.id).order_by(ThermalIndices.id.desc()).first()
        weather = db.query(WeatherObservation).filter(WeatherObservation.ward_id == w.id).order_by(WeatherObservation.id.desc()).first()
        demog = db.query(Demographic).filter(Demographic.ward_id == w.id).first()

        geom = json.loads(w.geojson) if w.geojson else None

        features.append({
            "type": "Feature",
            "properties": {
                "id": w.id,
                "name": w.name,
                "zone": w.zone,
                "lat": w.lat,
                "lon": w.lon,
                "area_sqkm": w.area_sqkm,
                "pop_density": demog.pop_density if demog else 20000,
                "elderly_pct": demog.elderly_pct if demog else 10.0,
                "children_pct": demog.children_pct if demog else 8.0,
                "outdoor_worker_pct": demog.outdoor_worker_pct if demog else 20.0,
                "green_cover_pct": demog.green_cover_pct if demog else 15.0,
                "built_up_pct": demog.built_up_pct if demog else 70.0,
                "temperature_c": weather.temperature_c if weather else 35.0,
                "relative_humidity_pct": weather.relative_humidity_pct if weather else 50.0,
                "heat_index_c": thermal.heat_index_c if thermal else 38.0,
                "wbgt_outdoor_c": thermal.wbgt_outdoor_c if thermal else 30.0,
                "utci_c": thermal.utci_c if thermal else 36.0,
                "htss": prediction.htss if prediction else 50.0,
                "health_risk_level": prediction.health_risk_level if prediction else "MODERATE",
                "hospital_surge_risk": prediction.hospital_surge_risk if prediction else "MODERATE",
                "color_code": prediction.color_code if prediction else "YELLOW",
                "xai_explanation": prediction.xai_explanation if prediction else ""
            },
            "geometry": geom
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

@router.get("/{ward_id}/detail")
def get_ward_detail(ward_id: int, db: Session = Depends(get_db)):
    """Returns comprehensive ward inspection details including XAI, work schedule, hospitals & cooling centres."""
    ward = db.query(Ward).filter(Ward.id == ward_id).first()
    if not ward:
        raise HTTPException(status_code=404, detail="Ward not found")

    demog = db.query(Demographic).filter(Demographic.ward_id == ward_id).first()
    weather = db.query(WeatherObservation).filter(WeatherObservation.ward_id == ward_id).order_by(WeatherObservation.id.desc()).first()
    thermal = db.query(ThermalIndices).filter(ThermalIndices.ward_id == ward_id).order_by(ThermalIndices.id.desc()).first()
    prediction = db.query(HealthPrediction).filter(HealthPrediction.ward_id == ward_id).order_by(HealthPrediction.id.desc()).first()

    hospitals = db.query(Hospital).filter(Hospital.ward_id == ward_id).all()
    cooling_centres = db.query(CoolingCentre).filter(CoolingCentre.ward_id == ward_id).all()

    temp = weather.temperature_c if weather else 38.0
    rh = weather.relative_humidity_pct if weather else 50.0
    wbgt = thermal.wbgt_outdoor_c if thermal else 31.0
    htss = prediction.htss if prediction else 60.0
    work_sched = calculate_work_schedule(temp, rh, wbgt, htss)

    risk_level = prediction.health_risk_level if prediction else "MODERATE"
    actions = []
    if risk_level == "EXTREME":
        actions = [
            "ACTIVATE MUNICIPAL HEAT ACTION PLAN (LEVEL 3 RED ALERT)",
            "Deploy emergency cooling buses and temporary hydration tents",
            "Enforce mandatory outdoor work stoppage between 12:00 PM - 04:00 PM",
            "Issue priority surge alert to regional referral hospitals (AIIMS/Safdarjung)",
            "Conduct door-to-door welfare checks for isolated elderly residents"
        ]
    elif risk_level == "VERY_HIGH":
        actions = [
            "Activate all community AC cooling centres with extended operating hours",
            "Deploy mobile water tankers to high outdoor-worker industrial clusters",
            "Issue SMS/WhatsApp heat advisories to registered outdoor workers",
            "Notify primary healthcare centres to prepare heat-stroke rehydration units"
        ]
    elif risk_level == "HIGH":
        actions = [
            "Issue public heat advisory for vulnerable groups (children & elderly)",
            "Ensure drinking water availability at metro stations and bus hubs",
            "Adjust construction and street sweeping working shifts to morning/evening"
        ]
    else:
        actions = [
            "Maintain standard hydration advisories",
            "Monitor micro-weather updates and 3-day forecast trends"
        ]

    # IMD 5-Day Forecast query
    forecast_weather = db.query(WeatherForecast).filter(WeatherForecast.ward_id == ward_id).limit(5).all()
    forecast_list = []
    for idx, fw in enumerate(forecast_weather):
        forecast_list.append({
            "day": fw.forecast_day,
            "date": fw.timestamp,
            "temperature_c": fw.temperature_max_c,
            "humidity_pct": fw.relative_humidity_pct,
            "forecast_risk": "VERY_HIGH" if fw.temperature_max_c >= 43.0 else ("HIGH" if fw.temperature_max_c >= 39.0 else "MODERATE")
        })

    return {
        "ward": {
            "id": ward.id,
            "name": ward.name,
            "zone": ward.zone,
            "lat": ward.lat,
            "lon": ward.lon,
            "area_sqkm": ward.area_sqkm,
            "pop_density": demog.pop_density if demog else 20000,
            "elderly_pct": demog.elderly_pct if demog else 10.0,
            "children_pct": demog.children_pct if demog else 8.0,
            "outdoor_worker_pct": demog.outdoor_worker_pct if demog else 20.0,
            "green_cover_pct": demog.green_cover_pct if demog else 15.0,
            "built_up_pct": demog.built_up_pct if demog else 70.0
        },
        "current_weather": {
            "temperature_c": weather.temperature_c if weather else 0.0,
            "relative_humidity_pct": weather.relative_humidity_pct if weather else 0.0,
            "wind_speed_kmh": weather.wind_speed_kmh if weather else 0.0,
            "solar_radiation_wm2": weather.solar_radiation_wm2 if weather else 0.0
        },
        "thermal_indices": {
            "heat_index_c": thermal.heat_index_c if thermal else 0.0,
            "wbgt_outdoor_c": thermal.wbgt_outdoor_c if thermal else 0.0,
            "wbgt_indoor_c": thermal.wbgt_indoor_c if thermal else 0.0,
            "utci_c": thermal.utci_c if thermal else 0.0,
            "htss": prediction.htss if prediction else 0.0,
            "status": "CALCULATED / ESTIMATED"
        },
        "health_prediction": {
            "health_risk_level": prediction.health_risk_level if prediction else "MODERATE",
            "hospital_surge_risk": prediction.hospital_surge_risk if prediction else "MODERATE",
            "vulnerability_score": prediction.vulnerability_score if prediction else 50.0,
            "color_code": prediction.color_code if prediction else "YELLOW",
            "xai_explanation": prediction.xai_explanation if prediction else "",
            "provenance_type": prediction.provenance_type if prediction else "SYNTHETIC/DEMO"
        },
        "recommended_actions": actions,
        "safe_work_schedule": work_sched,
        "forecast_5_day": forecast_list,
        "hospitals": [{"id": h.id, "name": h.name, "beds": h.beds, "type": h.type} for h in hospitals],
        "cooling_centres": [{"id": c.id, "name": c.name, "capacity": c.capacity, "ac_available": c.ac_available} for c in cooling_centres]
    }
