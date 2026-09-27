"""
Intervention Management API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models import Intervention, Ward
from ..schemas import InterventionCreate, InterventionResponse

router = APIRouter(prefix="/api/interventions", tags=["Interventions"])

@router.get("", response_model=List[InterventionResponse])
def get_interventions(db: Session = Depends(get_db)):
    """Returns active and completed mitigation interventions."""
    return db.query(Intervention).order_by(Intervention.id.desc()).all()

@router.post("", response_model=InterventionResponse)
def create_intervention(inter_in: InterventionCreate, db: Session = Depends(get_db)):
    """Deploys a new mitigation intervention in a ward (e.g. cooling center, hydration hub)."""
    ward = db.query(Ward).filter(Ward.id == inter_in.ward_id).first()
    if not ward:
        raise HTTPException(status_code=404, detail="Ward not found")

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    new_inter = Intervention(
        ward_id=inter_in.ward_id,
        action_type=inter_in.action_type,
        description=inter_in.description,
        status="ACTIVE",
        created_at=now,
        updated_at=now
    )
    db.add(new_inter)
    db.commit()
    db.refresh(new_inter)
    return new_inter

@router.put("/{inter_id}/status")
def update_intervention_status(inter_id: int, status: str, db: Session = Depends(get_db)):
    """Updates status of an intervention (ACTIVE, COMPLETED, CANCELLED)."""
    inter = db.query(Intervention).filter(Intervention.id == inter_id).first()
    if not inter:
        raise HTTPException(status_code=404, detail="Intervention not found")
    inter.status = status.upper()
    inter.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db.commit()
    return {"status": "success", "message": f"Intervention {inter_id} status updated to {status}."}
