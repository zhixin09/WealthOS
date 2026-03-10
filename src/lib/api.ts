import type { AlertsResponse, PlanningResponse, ResearchResponse } from "@/lib/types";

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

export function queryResearch(question: string): Promise<ResearchResponse> {
  return request<ResearchResponse>("/research/query", { question });
}

export function queryPlanning(question: string): Promise<PlanningResponse> {
  return request<PlanningResponse>("/planning/query", { question });
}

export function runAlerts(limit = 4): Promise<AlertsResponse> {
  return request<AlertsResponse>("/alerts/run", { limit });
}
