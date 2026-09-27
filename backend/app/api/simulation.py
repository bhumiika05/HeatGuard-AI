"""
Simulation Scenario API Router
"""

from fastapi import APIRouter
from ..schemas import SimulationRequest, SimulationResponse
from ..engine.simulation import apply_simulation_scenario

router = APIRouter(prefix="/api/simulation", tags=["Simulation Demo Mode"])

@router.post("/set-scenario", response_model=SimulationResponse)
def set_simulation_scenario(req: SimulationRequest):
    """
    Triggers real-time scenario shift (NORMAL, HEATWAVE, EXTREME_HEATWAVE) for SIH judging.
    Recalculates micro-weather, thermal indices, ML risk levels, alerts, and intervention tracking.
    """
    res = apply_simulation_scenario(req.scenario)
    return res
