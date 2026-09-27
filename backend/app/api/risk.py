"""
Risk & Prediction API Endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from ..models import HealthPrediction, Ward, Demographic

router = APIRouter(prefix="/api/risk", tags=["Risk"])

@router.get("/summary")
def get_risk_summary(db: Session = Depends(get_db)):
    """Returns city-wide KPI summary of high risk wards, vulnerable population, hospital surge, active alerts."""
    preds = db.query(HealthPrediction).order_by(HealthPrediction.id.desc()).limit(25).all()

    low_count = sum(1 for p in preds if p.health_risk_level == "LOW")
    mod_count = sum(1 for p in preds if p.health_risk_level == "MODERATE")
    high_count = sum(1 for p in preds if p.health_risk_level == "HIGH")
    very_high_count = sum(1 for p in preds if p.health_risk_level == "VERY_HIGH")
    extreme_count = sum(1 for p in preds if p.health_risk_level == "EXTREME")

    high_risk_wards = [p.ward_id for p in preds if p.health_risk_level in ["HIGH", "VERY_HIGH", "EXTREME"]]

    vulnerable_pop_exposed = 0
    if high_risk_wards:
        wards = db.query(Ward).filter(Ward.id.in_(high_risk_wards)).all()
        for w in wards:
            demog = db.query(Demographic).filter(Demographic.ward_id == w.id).first()
            area = w.area_sqkm or 5.0
            dens = demog.pop_density if demog else 20000
            elderly = demog.elderly_pct if demog else 10.0
            worker = demog.outdoor_worker_pct if demog else 20.0
            vuln_frac = (elderly + worker) / 100.0
            vulnerable_pop_exposed += int(area * dens * vuln_frac)

    avg_htss = round(sum(p.htss for p in preds) / len(preds), 1) if preds else 0.0

    return {
        "total_wards": len(preds),
        "low_risk_count": low_count,
        "moderate_risk_count": mod_count,
        "high_risk_count": high_count,
        "very_high_risk_count": very_high_count,
        "extreme_risk_count": extreme_count,
        "high_risk_wards_total": high_count + very_high_count + extreme_count,
        "vulnerable_population_exposed": vulnerable_pop_exposed,
        "city_avg_htss": avg_htss,
        "city_heat_threat_level": "EXTREME" if extreme_count > 0 else ("VERY HIGH" if very_high_count > 0 else ("HIGH" if high_count > 0 else "MODERATE"))
    }

@router.get("/predictions", response_model=List[Dict[str, Any]])
def get_all_predictions(db: Session = Depends(get_db)):
    """Returns predictions and XAI explanations for all wards."""
    preds = db.query(HealthPrediction).order_by(HealthPrediction.id.desc()).limit(25).all()
    results = []
    for p in preds:
        ward = db.query(Ward).filter(Ward.id == p.ward_id).first()
        results.append({
            "ward_id": p.ward_id,
            "ward_name": ward.name if ward else f"Ward {p.ward_id}",
            "zone": ward.zone if ward else "Delhi",
            "htss": p.htss,
            "health_risk_level": p.health_risk_level,
            "hospital_surge_risk": p.hospital_surge_risk,
            "vulnerability_score": p.vulnerability_score,
            "color_code": p.color_code,
            "xai_explanation": p.xai_explanation,
            "provenance_type": p.provenance_type
        })
    return results
