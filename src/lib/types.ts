export type ResearchCitation = {
  source: string;
  citation: string;
  snippet: string;
};

export type ResearchResponse = {
  answer: string;
  citations: ResearchCitation[];
};

export type PlanningMetric = {
  label: string;
  value: string;
};

export type PlanningResponse = {
  scenario: string;
  summary: string;
  recommendation: string;
  key_metrics: PlanningMetric[];
};

export type AlertItem = {
  headline: string;
  source: string;
  eventSummary: string;
  impactedHoldings: string[];
  recommendation: string;
  currentPrice: number | null;
};

export type AlertsResponse = {
  generated_at: string;
  alerts: AlertItem[];
};

export type ClientSummary = {
  id: string;
  name: string;
  age: number;
  risk_profile: string;
  jurisdiction: string;
  net_worth_sgd: number;
  wellness_score: number;
  wellness_rating: string;
};

export type ClientAnalytics = {
  client_id: string;
  name: string;
  risk_profile: string;
  jurisdiction: string;
  net_worth_sgd: number;
  gross_assets_sgd: number;
  total_liabilities_sgd: number;
  allocation: Record<string, number>;
  liquid_reserves_sgd: number;
  liquidity_runway_months: number;
  dsr: number;
  diversification_score: number;
  max_concentration: number;
  concentrated_holdings: string[];
  digital_asset_pct: number;
  digital_asset_level: string;
  behavioral_resilience: number;
};

export type WellnessSubScore = {
  score: number;
  label: string;
};

export type WellnessResponse = {
  client_id: string;
  wellness_score: number;
  rating: string;
  sub_scores: {
    liquidity: WellnessSubScore;
    debt_burden: WellnessSubScore;
    diversification: WellnessSubScore;
    digital_safety: WellnessSubScore;
    concentration: WellnessSubScore;
  };
  top_risks: string[];
};

export type SeededEvent = {
  id: string;
  headline: string;
  body: string;
  source: string;
  timestamp: string;
  event_type: string;
  entities?: string[];
};

export type HoldingExposure = {
  ticker: string;
  name: string;
  value_sgd: number;
  exposure_pct: number;
};

export type ImpactManifest = {
  event_id: string;
  client_id: string;
  headline: string;
  event_type: string;
  matched_holdings: HoldingExposure[];
  matched_securities: string[];
  total_exposure_pct: number;
  severity: string;
  severity_rationale: string;
};

export type HouseViewCitation = {
  doc: string;
  excerpt: string;
};

export type AlertBrief = {
  alert_id: string;
  event_id: string;
  client_id: string;
  subject: string;
  severity: string;
  brief: string;
  recommended_actions: string[];
  house_view_citations: HouseViewCitation[];
  grounding_validated: boolean;
};

export type CopilotAction = {
  rank: number;
  action: string;
  rationale: string;
  urgency: string;
};

export type ResearchUsage = {
  doc: string;
  score: number;
};

export type CopilotResponse = {
  client_id: string;
  question: string;
  answer: string;
  structured_actions: CopilotAction[];
  research_used: ResearchUsage[];
  grounding_validated: boolean;
};

export type ResearchResult = {
  source: string;
  citation: string;
  snippet: string;
  score: number;
};

export type ResearchSearchResponse = {
  query: string;
  results: ResearchResult[];
};
