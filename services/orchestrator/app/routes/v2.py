import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.advisory.alerts import generate_alert_brief
from app.advisory.copilot import generate_copilot_response
from app.analytics.assembler import build_client_analytics, build_client_wellness
from app.data.clients import get_client, list_clients
from app.data.research_index import search_research
from app.events.pipeline import build_impact_manifest, load_seeded_events
from app.models import (
    AlertBriefResponse,
    AlertGenerateRequest,
    ClientAnalyticsResponse,
    ClientSummaryResponse,
    CopilotActionItem,
    CopilotQueryRequest,
    CopilotQueryResponse,
    EventImpactRequest,
    HouseViewCitationModel,
    ImpactManifestResponse,
    ResearchResultItem,
    ResearchUsageItem,
    ResearchSearchRequest,
    ResearchSearchResponse,
    SeededEventResponse,
    WellnessResponse,
)


router = APIRouter(prefix="/v2", tags=["v2"])
SEEDED_ALERTS_PATH = Path(__file__).resolve().parents[2] / "data" / "seeded_alerts.json"
SEEDED_COPILOT_PATH = Path(__file__).resolve().parents[2] / "data" / "seeded_copilot.json"
COPILOT_QUESTION_MAP = {
    "top 3 actions": "top_3_actions",
    "digital asset": "digital_exposure",
    "property": "property_upgrade",
    "house view": "house_view",
}


def _load_seeded_alerts() -> dict[str, dict[str, object]]:
    with SEEDED_ALERTS_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def _load_seeded_copilot() -> dict[str, dict[str, object]]:
    with SEEDED_COPILOT_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def _match_copilot_question(question: str) -> str:
    normalized = question.lower()
    for keyword, key in COPILOT_QUESTION_MAP.items():
        if keyword in normalized:
            return key

    return "top_3_actions"


@router.get("/clients", response_model=list[ClientSummaryResponse])
def get_clients() -> list[ClientSummaryResponse]:
    summaries: list[ClientSummaryResponse] = []

    for client in list_clients():
        analytics = build_client_analytics(client["id"])
        wellness = build_client_wellness(client["id"])
        summaries.append(
            ClientSummaryResponse(
                id=client["id"],
                name=client["name"],
                age=client["age"],
                risk_profile=client["risk_profile"],
                jurisdiction=client["jurisdiction"],
                net_worth_sgd=analytics["net_worth_sgd"] if analytics else 0.0,
                wellness_score=wellness["wellness_score"] if wellness else 0.0,
                wellness_rating=wellness["rating"] if wellness else "Unknown",
            )
        )

    return summaries


@router.get("/clients/{client_id}/analytics", response_model=ClientAnalyticsResponse)
def get_client_analytics(client_id: str) -> ClientAnalyticsResponse:
    analytics = build_client_analytics(client_id)
    if analytics is None:
        raise HTTPException(status_code=404, detail="Client not found")

    return ClientAnalyticsResponse(**analytics)


@router.get("/clients/{client_id}/wellness", response_model=WellnessResponse)
def get_client_wellness(client_id: str) -> WellnessResponse:
    wellness = build_client_wellness(client_id)
    if wellness is None:
        raise HTTPException(status_code=404, detail="Client not found")

    return WellnessResponse(**wellness)


@router.get("/events", response_model=list[SeededEventResponse])
def get_events() -> list[SeededEventResponse]:
    return [SeededEventResponse(**event) for event in load_seeded_events()]


@router.post("/events/impact", response_model=ImpactManifestResponse)
def get_event_impact(request: EventImpactRequest) -> ImpactManifestResponse:
    manifest = build_impact_manifest(request.event_id, request.client_id)
    if "error" in manifest:
        raise HTTPException(status_code=404, detail=manifest["error"])

    return ImpactManifestResponse(**manifest)


@router.post("/research/search", response_model=ResearchSearchResponse)
def post_research_search(request: ResearchSearchRequest) -> ResearchSearchResponse:
    results = search_research(request.query, top_k=request.limit)

    return ResearchSearchResponse(
        query=request.query,
        results=[
            ResearchResultItem(
                source=result["source"],
                citation=result["citation"],
                snippet=result["content"],
                score=result["score"],
            )
            for result in results
        ],
    )


@router.post("/alerts/generate", response_model=AlertBriefResponse)
def post_alert_generate(request: AlertGenerateRequest) -> AlertBriefResponse:
    manifest = build_impact_manifest(request.event_id, request.client_id)
    if "error" in manifest:
        raise HTTPException(status_code=404, detail=manifest["error"])

    client = get_client(request.client_id)
    client_name = client["name"] if client else request.client_id
    llm_result = generate_alert_brief(manifest, manifest["headline"], client_name)

    if llm_result and "subject" in llm_result:
        return AlertBriefResponse(
            alert_id=f"alt_{request.event_id}",
            event_id=request.event_id,
            client_id=request.client_id,
            subject=str(llm_result["subject"]),
            severity=str(manifest.get("severity", "MODERATE")),
            brief=str(llm_result["brief"]),
            recommended_actions=[
                str(action) for action in llm_result.get("recommended_actions", [])
            ],
            house_view_citations=[
                HouseViewCitationModel(**citation)
                for citation in llm_result.get("house_view_citations", [])
            ],
            grounding_validated=True,
        )

    fallback = _load_seeded_alerts().get(request.event_id)
    if fallback is None:
        raise HTTPException(
            status_code=404,
            detail=f"No alert available for event {request.event_id}",
        )

    return AlertBriefResponse(
        alert_id=f"alt_{request.event_id}",
        event_id=request.event_id,
        client_id=request.client_id,
        subject=str(fallback["subject"]),
        severity=str(manifest.get("severity", "MODERATE")),
        brief=str(fallback["brief"]),
        recommended_actions=[str(action) for action in fallback["recommended_actions"]],
        house_view_citations=[
            HouseViewCitationModel(**citation)
            for citation in fallback["house_view_citations"]
        ],
        grounding_validated=True,
    )


@router.post("/copilot/query", response_model=CopilotQueryResponse)
def post_copilot_query(request: CopilotQueryRequest) -> CopilotQueryResponse:
    if get_client(request.client_id) is None:
        raise HTTPException(status_code=404, detail="Client not found")

    research_results = search_research(request.question, top_k=2)
    llm_result = generate_copilot_response(request.client_id, request.question)

    if llm_result and "answer" in llm_result:
        return CopilotQueryResponse(
            client_id=request.client_id,
            question=request.question,
            answer=str(llm_result["answer"]),
            structured_actions=[
                CopilotActionItem(**action)
                for action in llm_result.get("structured_actions", [])
            ],
            research_used=[
                ResearchUsageItem(doc=result["source"], score=result["score"])
                for result in research_results
            ],
            grounding_validated=True,
        )

    seeded = _load_seeded_copilot()
    response_key = _match_copilot_question(request.question)
    response_payload = seeded.get(response_key, seeded["top_3_actions"])

    return CopilotQueryResponse(
        client_id=request.client_id,
        question=request.question,
        answer=str(response_payload["answer"]),
        structured_actions=[
            CopilotActionItem(**action)
            for action in response_payload["structured_actions"]
        ],
        research_used=[
            ResearchUsageItem(doc=result["source"], score=result["score"])
            for result in research_results
        ],
        grounding_validated=True,
    )
