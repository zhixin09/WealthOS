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
  digital_asset_level: "low" | "moderate" | "high";
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
  event_type: "regulatory" | "rate_decision" | "trade_policy";
};

export type ImpactHolding = {
  ticker: string;
  name: string;
  value_sgd: number;
  exposure_pct: number;
};

export type ImpactManifest = {
  event_id: string;
  headline: string;
  matched_holdings: ImpactHolding[];
  total_exposure_pct: number;
  severity: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  severity_rationale: string;
};

export type HouseViewCitation = {
  doc: string;
  excerpt: string;
};

export type AlertBrief = {
  alert_id: string;
  subject: string;
  severity: ImpactManifest["severity"];
  brief: string;
  recommended_actions: string[];
  house_view_citations: HouseViewCitation[];
  grounding_validated: boolean;
};

export type StructuredAction = {
  rank: number;
  action: string;
  rationale: string;
  urgency: "HIGH" | "MEDIUM" | "LOW";
};

export type CopilotResponse = {
  question: string;
  answer: string;
  structured_actions: StructuredAction[];
  research_used: {
    doc: string;
    score: number;
  }[];
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

export type DemoHolding = {
  ticker: string;
  name: string;
  value_sgd: number;
};

export type DemoDocument = {
  id: string;
  title: string;
  description: string;
  badge: string;
  entries: Array<{
    citation: string;
    snippet: string;
  }>;
};
