"""
HEATGUARD FastAPI Backend Main Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .database import engine, Base
from .api import (
    weather,
    wards,
    risk,
    alerts,
    interventions,
    cooling,
    hospitals,
    tracking,
    analytics,
    admin,
    simulation
)

# Initialize Database tables if missing
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HEATGUARD — Hyperlocal Heat-Health Early Warning API",
    description="AI-Powered Hyperlocal Heat-Health Early Warning & Decision-Support System for Indian Cities.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router Modules
app.include_router(weather.router)
app.include_router(wards.router)
app.include_router(risk.router)
app.include_router(alerts.router)
app.include_router(interventions.router)
app.include_router(cooling.router)
app.include_router(hospitals.router)
app.include_router(tracking.router)
app.include_router(analytics.router)
app.include_router(admin.router)
app.include_router(simulation.router)

@app.get("/")
def root_status():
    return {
        "title": "HEATGUARD AI Engine API",
        "status": "ONLINE",
        "documentation": "/docs",
        "provenance_policy": "Strict Data Provenance Transparency Enabled"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
