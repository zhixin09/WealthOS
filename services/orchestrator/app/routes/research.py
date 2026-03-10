from fastapi import APIRouter

from app.models import ResearchQueryRequest, ResearchQueryResponse
from app.workflows.research import run_research_query


router = APIRouter(prefix="/research", tags=["research"])


@router.post("/query", response_model=ResearchQueryResponse)
def query_research(request: ResearchQueryRequest) -> ResearchQueryResponse:
    return run_research_query(request.question, limit=request.limit)
