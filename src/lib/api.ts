import type {
  AlertBrief,
  AlertsResponse,
  ClientAnalytics,
  ClientSummary,
  CopilotResponse,
  ImpactManifest,
  PlanningResponse,
  ResearchResponse,
  ResearchSearchResponse,
  SeededEvent,
  WellnessResponse,
} from "@/lib/types";

const ORCHESTRATOR_URL =
  process.env.NEXT_PUBLIC_ORCHESTRATOR_URL ?? "http://127.0.0.1:8000";

async function request<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${ORCHESTRATOR_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}.`);
  }

  return (await response.json()) as T;
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${ORCHESTRATOR_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed for ${path}.`);
  }

  return (await response.json()) as T;
}

export function queryResearch(question: string): Promise<ResearchResponse> {
  return request<ResearchResponse>("/research/query", { question });
}

export function queryPlanning(question: string): Promise<PlanningResponse> {
  return request<PlanningResponse>("/planning/query", { question });
}

export function runAlerts(limit = 4): Promise<AlertsResponse> {
  return request<AlertsResponse>("/alerts/run", { limit });
}

export function getClients(): Promise<ClientSummary[]> {
  return get<ClientSummary[]>("/v2/clients");
}

export function getClientAnalytics(clientId: string): Promise<ClientAnalytics> {
  return get<ClientAnalytics>(`/v2/clients/${clientId}/analytics`);
}

export function getClientWellness(clientId: string): Promise<WellnessResponse> {
  return get<WellnessResponse>(`/v2/clients/${clientId}/wellness`);
}

export function getEvents(): Promise<SeededEvent[]> {
  return get<SeededEvent[]>("/v2/events");
}

export function runEventImpact(eventId: string, clientId: string): Promise<ImpactManifest> {
  return request<ImpactManifest>("/v2/events/impact", {
    event_id: eventId,
    client_id: clientId,
  });
}

export function generateAlertBrief(eventId: string, clientId: string): Promise<AlertBrief> {
  return request<AlertBrief>("/v2/alerts/generate", {
    event_id: eventId,
    client_id: clientId,
  });
}

export function queryCopilot(clientId: string, question: string): Promise<CopilotResponse> {
  return request<CopilotResponse>("/v2/copilot/query", {
    client_id: clientId,
    question,
  });
}

export function searchResearch(query: string, limit = 3): Promise<ResearchSearchResponse> {
  return request<ResearchSearchResponse>("/v2/research/search", {
    query,
    limit,
  });
}
