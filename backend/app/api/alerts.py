"""
Alert System API Endpoints (Multi-channel simulation & tracking)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models import Alert, Ward
from ..schemas import AlertCreate, AlertResponse

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    """Returns active and past heat advisories."""
    return db.query(Alert).order_by(Alert.id.desc()).all()

@router.post("/send", response_model=AlertResponse)
def create_and_send_alert(alert_in: AlertCreate, db: Session = Depends(get_db)):
    """Simulates broadcasting an alert via SMS, WhatsApp, Email, and Emergency Dashboard."""
    ward = db.query(Ward).filter(Ward.id == alert_in.ward_id).first()
    if not ward:
        raise HTTPException(status_code=404, detail="Ward not found")

    channels_str = ", ".join(alert_in.channels)

    new_alert = Alert(
        ward_id=alert_in.ward_id,
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        risk_level=alert_in.risk_level,
        trigger_reason=alert_in.trigger_reason,
        recipient_group=alert_in.recipient_group,
        message=alert_in.message,
        channels=channels_str,
        status="BROADCASTED"
    )

    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    """Marks an alert as acknowledged by authority or hospital emergency team."""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = "ACKNOWLEDGED"
    alert.acknowledged_by = "Disaster Management Authority"
    db.commit()
    return {"status": "success", "message": f"Alert {alert_id} acknowledged."}
