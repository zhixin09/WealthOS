from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str


class ResearchCitation(BaseModel):
    source: str
    citation: str
    snippet: str


class ResearchQueryRequest(BaseModel):
    question: str
    limit: int = 3


class ResearchQueryResponse(BaseModel):
    answer: str
    citations: list[ResearchCitation]


class PlanningMetric(BaseModel):
    label: str
    value: str


class PlanningQueryRequest(BaseModel):
    question: str


class PlanningQueryResponse(BaseModel):
    scenario: str
    summary: str
    recommendation: str
    key_metrics: list[PlanningMetric]


class AlertItem(BaseModel):
    headline: str
    source: str
    eventSummary: str
    impactedHoldings: list[str]
    recommendation: str
    currentPrice: float | None = None


class AlertsRunRequest(BaseModel):
    limit: int = 4


class AlertsRunResponse(BaseModel):
    generated_at: str
    alerts: list[AlertItem]
