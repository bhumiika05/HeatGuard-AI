"""
Pydantic schemas for API request and response models
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class WardBase(BaseModel):
    id: int
    name: str
    zone: str
    lat: float
    lon: float
    area_sqkm: Optional[float] = None
    pop_density: Optional[int] = None
    elderly_pct: Optional[float] = None
    children_pct: Optional[float] = None
    outdoor_worker_pct: Optional[float] = None
    green_cover_pct: Optional[float] = None
    built_up_pct: Optional[float] = None
    geojson: Optional[str] = None

    class Config:
        from_attributes = True


class WeatherDataBase(BaseModel):
    id: int
    ward_id: int
    timestamp: str
    temperature_c: float
    relative_humidity_pct: float
    wind_speed_kmh: float
    solar_radiation_wm2: float
    cloud_cover_pct: float
    is_forecast: int

    class Config:
        from_attributes = True


class ThermalIndicesBase(BaseModel):
    id: int
    weather_id: int
    ward_id: int
    timestamp: str
    heat_index_c: float
    wbgt_outdoor_c: float
    wbgt_indoor_c: float
    utci_c: float
    htss: float
    status: str

    class Config:
        from_attributes = True


class HealthPredictionBase(BaseModel):
    id: int
    ward_id: int
    timestamp: str
    htss: float
    health_risk_level: str
    hospital_surge_risk: str
    vulnerability_score: float
    color_code: str
    temperature_contrib: Optional[str] = None
    humidity_contrib: Optional[str] = None
    radiation_contrib: Optional[str] = None
    wind_contrib: Optional[str] = None
    vulnerability_contrib: Optional[str] = None
    xai_explanation: Optional[str] = None
    provenance_type: str = "SYNTHETIC/DEMO"

    class Config:
        from_attributes = True


class WardFullDetail(BaseModel):
    ward: WardBase
    current_weather: WeatherDataBase
    thermal_indices: ThermalIndicesBase
    health_prediction: HealthPredictionBase
    recommended_actions: List[str]
    safe_work_hours: Dict[str, Any]
    hospitals_nearby: List[Dict[str, Any]]
    cooling_centres_nearby: List[Dict[str, Any]]


class AlertCreate(BaseModel):
    ward_id: int
    risk_level: str
    trigger_reason: str
    recipient_group: str
    message: str
    channels: List[str]


class AlertResponse(BaseModel):
    id: int
    ward_id: int
    timestamp: str
    risk_level: str
    trigger_reason: str
    recipient_group: str
    message: str
    channels: str
    status: str
    acknowledged_by: Optional[str] = None

    class Config:
        from_attributes = True


class InterventionCreate(BaseModel):
    ward_id: int
    action_type: str
    description: str


class InterventionResponse(BaseModel):
    id: int
    ward_id: int
    action_type: str
    description: str
    status: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class SimulationRequest(BaseModel):
    scenario: str = Field(..., description="NORMAL, HEATWAVE, or EXTREME_HEATWAVE")


class SimulationResponse(BaseModel):
    scenario: str
    status: str
    message: str
    affected_wards_count: int
    high_risk_wards_count: int
    extreme_risk_wards_count: int
