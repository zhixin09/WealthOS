import {
  BRIEF_CITATIONS,
  DEMO_ANALYTICS,
  DEMO_CLIENTS,
  DEMO_EVENTS,
  DEMO_HOLDINGS,
  DEMO_WELLNESS,
  EVENT_TICKER_MAP,
  HOUSE_VIEW_LIBRARY,
  SEEDED_COPILOT_RESPONSES,
} from "@/components/adviser/demo-data";
import type {
  AlertBrief,
  ClientAnalytics,
  ClientSummary,
  CopilotResponse,
  ImpactManifest,
  ImpactHolding,
  ResearchResult,
  ResearchSearchResponse,
  SeededEvent,
  WellnessResponse,
} from "@/components/adviser/contracts";

const ORCHESTRATOR_URL =
  process.env.NEXT_PUBLIC_ORCHESTRATOR_URL ?? "http://127.0.0.1:8000";

async function delay(ms: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function minimumDelay<T>(promise: Promise<T>, ms: number) {
  const [result] = await Promise.all([promise, delay(ms)]);
  return result;
}

async function requestJson<T>(
  path: string,
  init?: RequestInit,
  fallback?: () => Promise<T> | T,
  minimumWaitMs = 0,
): Promise<T> {
  const execute = async () => {
    try {
      const response = await fetch(`${ORCHESTRATOR_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      return (await response.json()) as T;
    } catch {
      if (!fallback) {
        throw new Error("Request failed");
      }

      return await fallback();
    }
  };

  if (minimumWaitMs > 0) {
    return minimumDelay(execute(), minimumWaitMs);
  }

  return execute();
}

function getClientSummary(clientId: string) {
  return DEMO_CLIENTS.find((client) => client.id === clientId) ?? DEMO_CLIENTS[0];
}

function getAnalytics(clientId: string) {
  return DEMO_ANALYTICS[clientId] ?? DEMO_ANALYTICS.alex_chen;
}

function getWellness(clientId: string) {
  return DEMO_WELLNESS[clientId] ?? DEMO_WELLNESS.alex_chen;
}

function getEvent(eventId: string) {
  return DEMO_EVENTS.find((event) => event.id === eventId) ?? DEMO_EVENTS[0];
}

function classifySeverity(totalExposurePct: number): ImpactManifest["severity"] {
  if (totalExposurePct >= 20) {
    return "CRITICAL";
  }

  if (totalExposurePct >= 10) {
    return "HIGH";
  }

  if (totalExposurePct >= 3) {
    return "MODERATE";
  }

  return "LOW";
}

function buildImpactFallback(eventId: string, clientId: string): ImpactManifest {
  const analytics = getAnalytics(clientId);
  const event = getEvent(eventId);
  const trackedTickers = EVENT_TICKER_MAP[eventId] ?? [];
  const matchedHoldings: ImpactHolding[] = (DEMO_HOLDINGS[clientId] ?? [])
    .filter((holding) => trackedTickers.includes(holding.ticker))
    .map((holding) => ({
      ...holding,
      exposure_pct: Number(
        ((holding.value_sgd / analytics.gross_assets_sgd) * 100).toFixed(1),
      ),
    }))
    .sort((left, right) => right.value_sgd - left.value_sgd);

  const totalExposurePct = Number(
    matchedHoldings
      .reduce((sum, holding) => sum + holding.exposure_pct, 0)
      .toFixed(1),
  );
  const severity = classifySeverity(totalExposurePct);

  const rationale =
    matchedHoldings.length > 0
      ? `${totalExposurePct}% total exposure across ${matchedHoldings.length} holding(s) for ${getClientSummary(clientId).name}. ${
          severity === "CRITICAL"
            ? "This exceeds the escalation threshold for adviser intervention."
            : severity === "HIGH"
              ? "This is material enough to justify an adviser brief today."
              : severity === "MODERATE"
                ? "The exposure is real, but still proportionate to the broader book."
                : "Direct exposure is limited and currently manageable."
        }`
      : `No direct listed holdings matched the event entity map for ${getClientSummary(clientId).name}.`;

  return {
    event_id: eventId,
    headline: event.headline,
    matched_holdings: matchedHoldings,
    total_exposure_pct: totalExposurePct,
    severity,
    severity_rationale: rationale,
  };
}

function buildBriefFallback(eventId: string, clientId: string): AlertBrief {
  const client = getClientSummary(clientId);
  const analytics = getAnalytics(clientId);
  const impact = buildImpactFallback(eventId, clientId);
  const event = getEvent(eventId);

  const recommendations =
    eventId === "evt_crypto_001"
      ? [
          `Review digital asset sizing against the current ${analytics.digital_asset_pct.toFixed(1)}% exposure.`,
          `Keep liquid reserves of ${analytics.liquid_reserves_sgd.toLocaleString("en-SG")} SGD ring-fenced during the volatility window.`,
          "Prepare a client outreach note focused on sizing discipline rather than reactive liquidation.",
        ]
      : eventId === "evt_fed_001"
        ? [
            "Re-test rate sensitivity across growth-heavy public-market holdings.",
            "Reconfirm that debt service remains comfortable under a higher-for-longer path.",
            "Keep any equity rotation gradual to avoid replacing one concentration with another.",
          ]
        : [
            "Monitor follow-through guidance from Nvidia and peers before changing the long-term thesis.",
            "Recheck single-name concentration after the next mark-to-market move.",
            "Frame the event as a thesis review, not an automatic exit signal.",
          ];

  return {
    alert_id: `${clientId}-${eventId}`,
    subject: `${event.headline} - Portfolio Impact for ${client.name}`,
    severity: impact.severity,
    brief: `${client.name} has ${impact.total_exposure_pct.toFixed(1)}% mapped exposure to this event. The balance sheet remains ${
      analytics.liquidity_runway_months >= 12 ? "liquid enough to avoid forced action" : "sensitive to follow-through volatility"
    }, but the adviser conversation should focus on position sizing, mandate fit, and whether the current house view still supports the risk budget.`,
    recommended_actions: recommendations,
    house_view_citations: BRIEF_CITATIONS[eventId] ?? [],
    grounding_validated: true,
  };
}

function buildCopilotFallback(
  clientId: string,
  question: string,
): CopilotResponse {
  const normalized = question.toLowerCase();
  const analytics = getAnalytics(clientId);
  const client = getClientSummary(clientId);
  const wellness = getWellness(clientId);

  if (
    SEEDED_COPILOT_RESPONSES[clientId]?.["top-3-actions"] &&
    normalized.includes("top 3 actions")
  ) {
    return SEEDED_COPILOT_RESPONSES[clientId]["top-3-actions"];
  }

  if (normalized.includes("digital asset")) {
    return {
      question,
      answer: `${client.name} is carrying ${analytics.digital_asset_pct.toFixed(1)}% digital-asset exposure, which is above what we would normally tolerate for a ${client.risk_profile} mandate. Liquidity is still healthy enough to avoid forced selling, so the advice should focus on reducing fragility rather than de-risking into weakness all at once.`,
      structured_actions: [
        {
          rank: 1,
          action: "Set a digital-asset sizing range and a trim trigger",
          rationale:
            "Current exposure already breaches the house-view comfort zone for this mandate.",
          urgency: "HIGH",
        },
        {
          rank: 2,
          action: "Map correlations across BTC, ETH, and satellite positions",
          rationale:
            "The visible line items look diversified, but stress correlations collapse fast.",
          urgency: "MEDIUM",
        },
        {
          rank: 3,
          action: "Protect the liquidity buffer from being repurposed into the selloff",
          rationale:
            "Runway is valuable precisely because it prevents forced action during volatility.",
          urgency: "LOW",
        },
      ],
      research_used: [
        { doc: "digital-asset-risk-playbook.md", score: 0.95 },
        { doc: "singapore-household-liquidity.md", score: 0.71 },
      ],
      grounding_validated: true,
    };
  }

  if (normalized.includes("property upgrade")) {
    return {
      question,
      answer: `${client.name} can explore a property upgrade, but only if the decision is sequenced after protecting liquidity and tightening concentration risk. With ${analytics.liquidity_runway_months.toFixed(1)} months of runway, the client has breathing room, but a large housing step-up would make the balance sheet even more dependent on one asset class.`,
      structured_actions: [
        {
          rank: 1,
          action: "Run an updated post-upgrade liquidity scenario before any offer",
          rationale:
            "The runway today is healthy, but the next property would absorb the slack quickly.",
          urgency: "HIGH",
        },
        {
          rank: 2,
          action: "Avoid funding the upgrade by selling only liquid growth assets",
          rationale:
            "That would reduce diversification exactly when property concentration is increasing.",
          urgency: "MEDIUM",
        },
        {
          rank: 3,
          action: "Frame the upgrade decision against the 5-year goals list",
          rationale:
            "The housing move competes with retirement and education funding capacity.",
          urgency: "LOW",
        },
      ],
      research_used: [
        { doc: "singapore-household-liquidity.md", score: 0.91 },
        { doc: "digital-asset-risk-playbook.md", score: 0.52 },
      ],
      grounding_validated: true,
    };
  }

  return {
    question,
    answer: `${client.name} screens with a ${wellness.wellness_score.toFixed(1)} wellness score, ${formatNumber(analytics.liquidity_runway_months)} months of liquidity runway, and a ${(analytics.dsr * 100).toFixed(1)}% debt-service ratio. The immediate advisory work should stay anchored to the largest concentration and liquidity decisions rather than tactical noise.`,
    structured_actions: [
      {
        rank: 1,
        action: "Prioritize the largest balance-sheet concentration first",
        rationale:
          "This is still the fastest way to improve resilience without overtrading the book.",
        urgency: "HIGH",
      },
      {
        rank: 2,
        action: "Use house-view research to frame the next portfolio conversation",
        rationale:
          "The client story is stronger when actions are grounded in a repeatable advisory framework.",
        urgency: "MEDIUM",
      },
      {
        rank: 3,
        action: "Protect liquidity and optionality",
        rationale:
          "Runway is a strategic asset because it buys time when markets reprice abruptly.",
        urgency: "LOW",
      },
    ],
    research_used: [
      { doc: "singapore-household-liquidity.md", score: 0.8 },
      { doc: "asia-tech-equity-outlook.md", score: 0.68 },
    ],
    grounding_validated: true,
  };
}

function formatNumber(value: number) {
  return value.toFixed(1);
}

function scoreResearch(query: string): ResearchResult[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 1);

  return HOUSE_VIEW_LIBRARY.flatMap((document) =>
    document.entries
      .map((entry) => {
        const haystack = `${document.title} ${document.description} ${entry.citation} ${entry.snippet}`.toLowerCase();
        const matches = terms.reduce((count, term) => {
          return count + (haystack.includes(term) ? 1 : 0);
        }, 0);

        const score =
          matches === 0
            ? 0
            : Number((matches / Math.max(terms.length, 1)).toFixed(2));

        return {
          source: document.id,
          citation: entry.citation,
          snippet: entry.snippet,
          score,
        };
      })
      .filter((entry) => entry.score > 0),
  ).sort((left, right) => right.score - left.score);
}

export async function getClients(): Promise<ClientSummary[]> {
  return requestJson<ClientSummary[]>("/v2/clients", undefined, () => DEMO_CLIENTS, 350);
}

export async function getClientAnalytics(clientId: string): Promise<ClientAnalytics> {
  return requestJson<ClientAnalytics>(
    `/v2/clients/${clientId}/analytics`,
    undefined,
    () => getAnalytics(clientId),
    650,
  );
}

export async function getClientWellness(clientId: string): Promise<WellnessResponse> {
  return requestJson<WellnessResponse>(
    `/v2/clients/${clientId}/wellness`,
    undefined,
    () => getWellness(clientId),
    650,
  );
}

export async function getEvents(): Promise<SeededEvent[]> {
  return requestJson<SeededEvent[]>("/v2/events", undefined, () => DEMO_EVENTS, 400);
}

export async function runEventImpact(
  eventId: string,
  clientId: string,
): Promise<ImpactManifest> {
  return requestJson<ImpactManifest>(
    "/v2/events/impact",
    {
      method: "POST",
      body: JSON.stringify({ event_id: eventId, client_id: clientId }),
    },
    () => buildImpactFallback(eventId, clientId),
    1_000,
  );
}

export async function generateAlertBrief(
  eventId: string,
  clientId: string,
): Promise<AlertBrief> {
  return requestJson<AlertBrief>(
    "/v2/alerts/generate",
    {
      method: "POST",
      body: JSON.stringify({ event_id: eventId, client_id: clientId }),
    },
    () => buildBriefFallback(eventId, clientId),
    2_500,
  );
}

export async function queryCopilot(
  clientId: string,
  question: string,
): Promise<CopilotResponse> {
  return requestJson<CopilotResponse>(
    "/v2/copilot/query",
    {
      method: "POST",
      body: JSON.stringify({ client_id: clientId, question }),
    },
    () => buildCopilotFallback(clientId, question),
    2_400,
  );
}

export async function searchResearch(query: string): Promise<ResearchSearchResponse> {
  return requestJson<ResearchSearchResponse>(
    "/v2/research/search",
    {
      method: "POST",
      body: JSON.stringify({ query }),
    },
    () => ({
      query,
      results: scoreResearch(query),
    }),
    800,
  );
}
