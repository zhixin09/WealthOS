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
