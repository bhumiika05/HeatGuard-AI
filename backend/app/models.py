"""
Unified Data Model (SQLAlchemy ORM) for HEATGUARD
Supports multi-source architecture: IMD Live & Forecast, ERA5 Historical, NCDC Health Surveillance, Public Census.
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Ward(Base):
    __tablename__ = "wards"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String, default="India")
    state = Column(String, default="Delhi")
    district = Column(String, default="Delhi")
    city = Column(String, default="Delhi")
    zone = Column(String, nullable=False)
    name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    area_sqkm = Column(Float)
    geojson = Column(Text)


class Demographic(Base):
    __tablename__ = "demographics"

    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"))
    pop_density = Column(Integer)
    total_population = Column(Integer)
    elderly_pct = Column(Float)
    children_pct = Column(Float)
    outdoor_worker_pct = Column(Float)
    green_cover_pct = Column(Float)
    built_up_pct = Column(Float)
    healthcare_access_score = Column(Float, default=75.0)
    source = Column(String, default="Census of India 2011 / Projections")
    data_type = Column(String, default="REAL")


class WeatherObservation(Base):
    __tablename__ = "weather_observations"

    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"))
    timestamp = Column(String, nullable=False)
    temperature_c = Column(Float, nullable=False)
    dew_point_c = Column(Float)
    relative_humidity_pct = Column(Float, nullable=False)
    wind_speed_kmh = Column(Float, nullable=False)
    wind_direction_deg = Column(Float, default=270.0)
    solar_radiation_wm2 = Column(Float, nullable=False)
    cloud_cover_pct = Column(Float, nullable=False)
    surface_pressure_hpa = Column(Float, default=1008.0)
    source_provider = Column(String, default="IMD Station / ERA5 Proxy")
    data_type = Column(String, default="REAL")

# Aliases for backwards compatibility
WeatherData = WeatherObservation


class WeatherForecast(Base):
    __tablename__ = "weather_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"))
    forecast_day = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)
    temperature_max_c = Column(Float, nullable=False)
    temperature_min_c = Column(Float, nullable=False)
    relative_humidity_pct = Column(Float, nullable=False)
    wind_speed_kmh = Column(Float, nullable=False)
    solar_radiation_wm2 = Column(Float, nullable=False)
    source_provider = Column(String, default="IMD 5-Day Forecast API")
    data_type = Column(String, default="REAL/FORECAST")


class HeatwaveWarning(Base):
    __tablename__ = "heatwave_warnings"

    id = Column(Integer, primary_key=True, index=True)
    district = Column(String, default="Delhi")
    warning_date = Column(String, nullable=False)
    warning_level = Column(String, nullable=False)
    description = Column(Text)
    source_provider = Column(String, default="IMD District Heatwave Advisory")
    data_type = Column(String, default="REAL")


class HealthObservation(Base):
    __tablename__ = "health_observations"

    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"))
    timestamp = Column(String, nullable=False)
    suspected_heatstroke_cases = Column(Integer, default=0)
    confirmed_heatstroke_deaths = Column(Integer, default=0)
    emergency_heat_admissions = Column(Integer, default=0)
    cardiovascular_admissions = Column(Integer, default=0)
    all_cause_mortality_proxy = Column(Integer, default=0)
    surveillance_source = Column(String, default="NCDC / MoHFW Surveillance Integration")
    data_type = Column(String, default="SYNTHETIC/DEMO")


class ThermalIndices(Base):
    __tablename__ = "thermal_indices"

    id = Column(Integer, primary_key=True, index=True)
    weather_id = Column(Integer, ForeignKey("weather_observations.id"))
    ward_id = Column(Integer, ForeignKey("wards.id"))
    timestamp = Column(String, nullable=False)
    heat_index_c = Column(Float, nullable=False)
    wbgt_outdoor_c = Column(Float, nullable=False)
    wbgt_indoor_c = Column(Float, nullable=False)
    utci_c = Column(Float, nullable=False)
    htss = Column(Float, nullable=False)
    status = Column(String, default="CALCULATED")
    data_type = Column(String, default="DERIVED")


class VulnerabilityScore(Base):
    __tablename__ = "vulnerability_scores"

    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"))
    overall_score = Column(Float, nullable=False)
    elderly_component = Column(Float)
    worker_component = Column(Float)
    density_component = Column(Float)
    green_cover_component = Column(Float)
    built_up_component = Column(Float)
    data_type = Column(String, default="DERIVED")


class HealthPrediction(Base):
    __tablename__ = "health_predictions"

    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"))
    timestamp = Column(String, nullable=False)
    htss = Column(Float, nullable=False)
    health_risk_level = Column(String, nullable=False)
    hospital_surge_risk = Column(String, nullable=False)
    vulnerability_score = Column(Float, nullable=False)
    color_code = Column(String, nullable=False)
    temperature_contrib = Column(String)
    humidity_contrib = Column(String)
    radiation_contrib = Column(String)
    wind_contrib = Column(String)
    vulnerability_contrib = Column(String)
    xai_explanation = Column(Text)
    provenance_type = Column(String, default="SYNTHETIC/DEMO")


class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    ward_id = Column(Integer, ForeignKey("wards.id"))
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    beds = Column(Integer)
    icu_beds = Column(Integer)
    type = Column(String)
    current_surge_risk = Column(String, default="LOW")
    preparedness_status = Column(String, default="READY")
    data_type = Column(String, default="REAL")


class CoolingCentre(Base):
    __tablename__ = "cooling_centres"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    ward_id = Column(Integer, ForeignKey("wards.id"))
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    capacity = Column(Integer)
    ac_available = Column(Boolean)
    water_station = Column(Boolean)
    status = Column(String, default="ACTIVE")
    is_recommended = Column(Boolean, default=False)
    recommendation_reason = Column(Text)
    data_type = Column(String, default="REAL")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"))
    timestamp = Column(String, nullable=False)
    risk_level = Column(String, nullable=False)
    trigger_reason = Column(String, nullable=False)
    recipient_group = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    channels = Column(String, nullable=False)
    status = Column(String, default="BROADCASTED")
    acknowledged_by = Column(String)
    data_type = Column(String, default="DERIVED")


class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"))
    action_type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="ACTIVE")
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)
    data_type = Column(String, default="DERIVED")


class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    target_name = Column(String, nullable=False)
    version = Column(String, default="v1.0.0")
    accuracy = Column(Float)
    precision = Column(Float)
    recall = Column(Float)
    f1_score = Column(Float)
    roc_auc = Column(Float)
    validation_strategy = Column(String, default="Chronological Split")
    feature_importance = Column(Text)
    confusion_matrix = Column(Text)
    trained_at = Column(String)

# Alias for backwards compatibility
ModelMetrics = ModelVersion


class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    date_range = Column(String, nullable=False)
    geographic_coverage = Column(String, nullable=False)
    variables = Column(Text, nullable=False)
    last_updated = Column(String, nullable=False)
    data_type = Column(String, nullable=False)


class TrackingEvent(Base):
    __tablename__ = "tracking_events"

    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(Integer, ForeignKey("wards.id"))
    date = Column(String, nullable=False)
    predicted_risk = Column(String)
    observed_htss = Column(Float)
    actual_risk = Column(String)
    alert_sent = Column(Integer, default=0)
    intervention_completed = Column(Integer, default=0)
    data_type = Column(String, default="DERIVED")
