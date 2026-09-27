"""
Hospitals & Healthcare Preparedness API Endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from ..models import Hospital, Ward, HealthPrediction

router = APIRouter(prefix="/api/hospitals", tags=["Hospitals"])

@router.get("")
def get_hospitals(db: Session = Depends(get_db)):
    """Returns healthcare facilities, emergency bed capacity, and preparedness status."""
    hospitals = db.query(Hospital).all()
    results = []

    for h in hospitals:
        ward = db.query(Ward).filter(Ward.id == h.ward_id).first()
        pred = db.query(HealthPrediction).filter(HealthPrediction.ward_id == h.ward_id).order_by(HealthPrediction.id.desc()).first()
        
        ward_risk = pred.health_risk_level if pred else "MODERATE"
        surge_risk = "HIGH" if ward_risk in ["VERY_HIGH", "EXTREME"] else ("MODERATE" if ward_risk == "HIGH" else "LOW")

        results.append({
            "id": h.id,
            "name": h.name,
            "ward_id": h.ward_id,
            "ward_name": ward.name if ward else "Delhi",
            "lat": h.lat,
            "lon": h.lon,
            "beds": h.beds,
            "icu_beds": h.icu_beds,
            "type": h.type,
            "current_surge_risk": surge_risk,
            "preparedness_status": "HIGH ALERT" if surge_risk == "HIGH" else "READY",
            "nearby_ward_htss": pred.htss if pred else 50.0,
            "recommended_actions": [
                "Ensure continuous stock of IV rehydration fluids & cooling blankets",
                "Reserve 15% emergency bed capacity for heat-stroke triage",
                "Alert ambulance dispatch units for high-risk industrial wards"
            ] if surge_risk == "HIGH" else ["Maintain standard heat emergency preparedness protocols"]
        })

    return results
