"""
Cooling Centres & AI Optimization API Endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from ..models import CoolingCentre, Ward, Demographic, HealthPrediction
from ..engine.cooling_optimizer import recommend_cooling_centres

router = APIRouter(prefix="/api/cooling-centres", tags=["Cooling Centres"])

@router.get("")
def get_cooling_centres(db: Session = Depends(get_db)):
    """Returns active cooling centres and hydration stations."""
    centres = db.query(CoolingCentre).all()
    results = []
    for c in centres:
        ward = db.query(Ward).filter(Ward.id == c.ward_id).first()
        results.append({
            "id": c.id,
            "name": c.name,
            "ward_id": c.ward_id,
            "ward_name": ward.name if ward else "Delhi",
            "lat": c.lat,
            "lon": c.lon,
            "capacity": c.capacity,
            "ac_available": c.ac_available,
            "water_station": c.water_station,
            "status": c.status,
            "is_recommended": c.is_recommended
        })
    return results

@router.get("/recommendations")
def get_cooling_center_recommendations(top_n: int = 3, db: Session = Depends(get_db)):
    """
    Runs spatial AI optimization algorithm to propose optimal new cooling center locations
    based on heat risk, vulnerable population density, and distance to existing facilities.
    """
    wards = db.query(Ward).all()
    centres = db.query(CoolingCentre).all()

    ward_dicts = []
    for w in wards:
        demog = db.query(Demographic).filter(Demographic.ward_id == w.id).first()
        pred = db.query(HealthPrediction).filter(HealthPrediction.ward_id == w.id).order_by(HealthPrediction.id.desc()).first()
        ward_dicts.append({
            "id": w.id,
            "name": w.name,
            "zone": w.zone,
            "lat": w.lat,
            "lon": w.lon,
            "pop_density": demog.pop_density if demog else 20000,
            "elderly_pct": demog.elderly_pct if demog else 10.0,
            "outdoor_worker_pct": demog.outdoor_worker_pct if demog else 20.0,
            "htss": pred.htss if pred else 50.0
        })

    centre_dicts = [{"name": c.name, "lat": c.lat, "lon": c.lon} for c in centres]

    recs = recommend_cooling_centres(ward_dicts, centre_dicts, top_n=top_n)
    return {
        "status": "success",
        "algorithm": "Spatial Vulnerability & Facility Distance Optimization",
        "top_recommendations": recs
    }
