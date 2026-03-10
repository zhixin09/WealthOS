from fastapi import APIRouter

from app.models import PlanningQueryRequest, PlanningQueryResponse
from app.workflows.planning import run_planning_query


router = APIRouter(prefix="/planning", tags=["planning"])


@router.post("/query", response_model=PlanningQueryResponse)
def query_planning(request: PlanningQueryRequest) -> PlanningQueryResponse:
    return run_planning_query(request.question)
