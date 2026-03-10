from fastapi import APIRouter

from app.models import AlertsRunRequest, AlertsRunResponse
from app.workflows.alerts import run_alerts_workflow


router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.post("/run", response_model=AlertsRunResponse)
def run_alerts(request: AlertsRunRequest) -> AlertsRunResponse:
    return run_alerts_workflow(limit=request.limit)
