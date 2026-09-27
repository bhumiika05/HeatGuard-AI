"""
Weather API Endpoints (IMD & ERA5 Data Layer)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import WeatherObservation, WeatherForecast, Ward
from ..engine.imd_service import IMDDataService

router = APIRouter(prefix="/api/weather", tags=["Weather"])
imd_service = IMDDataService()

@router.get("/current")
def get_current_weather(db: Session = Depends(get_db)):
    """Returns current micro-weather observations across all wards."""
    return db.query(WeatherObservation).order_by(WeatherObservation.id.desc()).limit(25).all()

@router.get("/live-imd-station")
def get_live_imd_station():
    """Returns live/cached IMD station observation with provenance status."""
    return imd_service.fetch_live_weather("DELHI_SDR")

@router.get("/imd-5day-forecast")
def get_imd_5day_forecast(district: str = "Delhi"):
    """Returns official IMD 5-day heatwave forecast and warning levels."""
    return imd_service.fetch_5day_forecast(district)

@router.get("/ward/{ward_id}")
def get_ward_weather_forecast(ward_id: int, db: Session = Depends(get_db)):
    """Returns historical and 5-day forecast weather data for a specific ward."""
    ward = db.query(Ward).filter(Ward.id == ward_id).first()
    if not ward:
        raise HTTPException(status_code=404, detail="Ward not found")
    obs = db.query(WeatherObservation).filter(WeatherObservation.ward_id == ward_id).order_by(WeatherObservation.id.desc()).limit(30).all()
    forecasts = db.query(WeatherForecast).filter(WeatherForecast.ward_id == ward_id).all()
    return {
        "ward_id": ward_id,
        "ward_name": ward.name,
        "recent_observations": obs,
        "imd_forecasts": forecasts
    }
