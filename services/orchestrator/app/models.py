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


class ClientSummaryResponse(BaseModel):
    id: str
    name: str
    age: int
    risk_profile: str
    jurisdiction: str
    net_worth_sgd: float
    wellness_score: float
    wellness_rating: str


class ClientAnalyticsResponse(BaseModel):
    client_id: str
    name: str
    risk_profile: str
    jurisdiction: str
    net_worth_sgd: float
    gross_assets_sgd: float
    total_liabilities_sgd: float
    allocation: dict[str, float]
    liquid_reserves_sgd: float
    liquidity_runway_months: float
    dsr: float
    diversification_score: float
    max_concentration: float
    concentrated_holdings: list[str]
    digital_asset_pct: float
    digital_asset_level: str
    behavioral_resilience: int


class WellnessSubScoreModel(BaseModel):
    score: float
    label: str


class WellnessResponse(BaseModel):
    client_id: str
    wellness_score: float
    rating: str
    sub_scores: dict[str, WellnessSubScoreModel]
    top_risks: list[str]


class SeededEventResponse(BaseModel):
    id: str
    headline: str
    body: str
    source: str
    timestamp: str
    event_type: str
    entities: list[str]


class HoldingExposureModel(BaseModel):
    ticker: str
    name: str
    value_sgd: float
    exposure_pct: float


class EventImpactRequest(BaseModel):
    event_id: str
    client_id: str


class ImpactManifestResponse(BaseModel):
    event_id: str
    client_id: str
    headline: str
    event_type: str
    matched_holdings: list[HoldingExposureModel]
    matched_securities: list[str]
    total_exposure_pct: float
    severity: str
    severity_rationale: str


class ResearchSearchRequest(BaseModel):
    query: str
    limit: int = 3


class ResearchResultItem(BaseModel):
    source: str
    citation: str
    snippet: str
    score: float


class ResearchSearchResponse(BaseModel):
    query: str
    results: list[ResearchResultItem]


class AlertGenerateRequest(BaseModel):
    event_id: str
    client_id: str


class HouseViewCitationModel(BaseModel):
    doc: str
    excerpt: str


class AlertBriefResponse(BaseModel):
    alert_id: str
    event_id: str
    client_id: str
    subject: str
    severity: str
    brief: str
    recommended_actions: list[str]
    house_view_citations: list[HouseViewCitationModel]
    grounding_validated: bool


class CopilotQueryRequest(BaseModel):
    client_id: str
    question: str


class CopilotActionItem(BaseModel):
    rank: int
    action: str
    rationale: str
    urgency: str


class ResearchUsageItem(BaseModel):
    doc: str
    score: float


class CopilotQueryResponse(BaseModel):
    client_id: str
    question: str
    answer: str
    structured_actions: list[CopilotActionItem]
    research_used: list[ResearchUsageItem]
    grounding_validated: bool
