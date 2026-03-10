import type {
  AlertBrief,
  ClientAnalytics,
  ClientSummary,
  CopilotResponse,
  DemoDocument,
  DemoHolding,
  SeededEvent,
  WellnessResponse,
} from "@/components/adviser/contracts";

export const DEMO_CLIENTS: ClientSummary[] = [
  {
    id: "alex_chen",
    name: "Alex Chen",
    age: 34,
    risk_profile: "moderate",
    jurisdiction: "Singapore",
    net_worth_sgd: 1_154_900,
    wellness_score: 71.3,
    wellness_rating: "Good",
  },
  {
    id: "priya_sharma",
    name: "Priya Sharma",
    age: 38,
    risk_profile: "aggressive",
    jurisdiction: "Singapore",
    net_worth_sgd: 2_560_000,
    wellness_score: 54.2,
    wellness_rating: "Watchlist",
  },
  {
    id: "david_lim",
    name: "David Lim",
    age: 58,
    risk_profile: "conservative",
    jurisdiction: "Singapore",
    net_worth_sgd: 2_480_000,
    wellness_score: 82.1,
    wellness_rating: "Excellent",
  },
];

export const DEMO_ANALYTICS: Record<string, ClientAnalytics> = {
  alex_chen: {
    client_id: "alex_chen",
    name: "Alex Chen",
    net_worth_sgd: 1_154_900,
    gross_assets_sgd: 1_466_900,
    total_liabilities_sgd: 312_000,
    allocation: {
      equities: 12.3,
      digital_assets: 24.9,
      real_estate: 46.5,
      cash: 10.8,
      cpf: 5.5,
    },
    liquid_reserves_sgd: 157_500,
    liquidity_runway_months: 21.9,
    dsr: 0.203,
    diversification_score: 68,
    max_concentration: 12.4,
    concentrated_holdings: ["Bitcoin", "District 15 Condo"],
    digital_asset_pct: 24.9,
    digital_asset_level: "high",
    behavioral_resilience: 74,
  },
  priya_sharma: {
    client_id: "priya_sharma",
    name: "Priya Sharma",
    net_worth_sgd: 2_560_000,
    gross_assets_sgd: 2_705_000,
    total_liabilities_sgd: 145_000,
    allocation: {
      equities: 44.4,
      digital_assets: 50.1,
      cash: 5.5,
    },
    liquid_reserves_sgd: 150_000,
    liquidity_runway_months: 8.3,
    dsr: 0.061,
    diversification_score: 41,
    max_concentration: 44.4,
    concentrated_holdings: ["Nvidia", "Bitcoin"],
    digital_asset_pct: 50.1,
    digital_asset_level: "high",
    behavioral_resilience: 57,
  },
  david_lim: {
    client_id: "david_lim",
    name: "David Lim",
    net_worth_sgd: 2_480_000,
    gross_assets_sgd: 3_140_000,
    total_liabilities_sgd: 660_000,
    allocation: {
      fixed_income: 25.5,
      real_estate: 47.8,
      cash: 13.4,
      cpf: 9.9,
      equities: 3.4,
    },
    liquid_reserves_sgd: 420_000,
    liquidity_runway_months: 28,
    dsr: 0.429,
    diversification_score: 79,
    max_concentration: 47.8,
    concentrated_holdings: ["Taman Jurong Property"],
    digital_asset_pct: 0,
    digital_asset_level: "low",
    behavioral_resilience: 86,
  },
};

export const DEMO_WELLNESS: Record<string, WellnessResponse> = {
  alex_chen: {
    client_id: "alex_chen",
    wellness_score: 71.3,
    rating: "Good",
    sub_scores: {
      liquidity: { score: 78, label: "Healthy" },
      debt_burden: { score: 74, label: "Contained" },
      diversification: { score: 66, label: "Watch" },
      digital_safety: { score: 58, label: "Elevated" },
      concentration: { score: 61, label: "Moderate" },
    },
    top_risks: [
      "Digital asset concentration (24.9% of gross assets)",
      "Property remains the single largest balance-sheet exposure",
      "Moderate diversification drag from concentrated conviction holdings",
    ],
  },
  priya_sharma: {
    client_id: "priya_sharma",
    wellness_score: 54.2,
    rating: "Needs Attention",
    sub_scores: {
      liquidity: { score: 57, label: "Tight" },
      debt_burden: { score: 89, label: "Light" },
      diversification: { score: 39, label: "Concentrated" },
      digital_safety: { score: 31, label: "Aggressive" },
      concentration: { score: 46, label: "High" },
    },
    top_risks: [
      "Digital assets exceed 50% of gross assets",
      "Single-name equity concentration in Nvidia",
      "Liquidity runway compresses quickly in a drawdown scenario",
    ],
  },
  david_lim: {
    client_id: "david_lim",
    wellness_score: 82.1,
    rating: "Excellent",
    sub_scores: {
      liquidity: { score: 88, label: "Strong" },
      debt_burden: { score: 63, label: "Manageable" },
      diversification: { score: 81, label: "Balanced" },
      digital_safety: { score: 95, label: "Low Risk" },
      concentration: { score: 78, label: "Property-led" },
    },
    top_risks: [
      "Mortgage servicing still absorbs a meaningful share of monthly income",
      "Real-estate concentration dominates the long-term asset mix",
      "Retirement horizon is short enough to reduce tolerance for equity shocks",
    ],
  },
};

export const DEMO_EVENTS: SeededEvent[] = [
  {
    id: "evt_crypto_001",
    headline: "Bitcoin drops 18% amid sweeping US regulatory crackdown",
    body: "Bitcoin and major altcoins fell sharply after US regulatory bodies announced comprehensive new crypto oversight measures, triggering liquidations across digital asset markets.",
    source: "Bloomberg",
    timestamp: "2026-03-11T14:00:00Z",
    event_type: "regulatory",
  },
  {
    id: "evt_fed_001",
    headline: "Federal Reserve signals higher-for-longer rate path through 2027",
    body: "Fed Chair commentary pushed back rate-cut hopes and triggered a broad valuation reset across duration-sensitive equities and ETFs.",
    source: "Financial Times",
    timestamp: "2026-03-10T18:00:00Z",
    event_type: "rate_decision",
  },
  {
    id: "evt_nvidia_001",
    headline: "Nvidia faces export restrictions on advanced AI chips to Southeast Asia",
    body: "New US trade rules will limit Nvidia's ability to sell its most advanced AI training chips to several Southeast Asian markets, putting the AI infrastructure trade back under scrutiny.",
    source: "Reuters",
    timestamp: "2026-03-11T09:30:00Z",
    event_type: "trade_policy",
  },
];

export const DEMO_HOLDINGS: Record<string, DemoHolding[]> = {
  alex_chen: [
    { ticker: "BTC", name: "Bitcoin", value_sgd: 182_400 },
    { ticker: "ETH", name: "Ethereum", value_sgd: 103_180 },
    { ticker: "SOL", name: "Solana", value_sgd: 79_650 },
    { ticker: "NVDA", name: "Nvidia Corp", value_sgd: 33_100 },
    { ticker: "VOO", name: "Vanguard S&P 500 ETF", value_sgd: 62_000 },
    { ticker: "AAPL", name: "Apple Inc", value_sgd: 23_000 },
    { ticker: "MSFT", name: "Microsoft Corp", value_sgd: 25_000 },
    { ticker: "GOOGL", name: "Alphabet Inc", value_sgd: 19_000 },
    { ticker: "AMZN", name: "Amazon.com Inc", value_sgd: 18_000 },
  ],
  priya_sharma: [
    { ticker: "NVDA", name: "Nvidia Corp", value_sgd: 1_200_000 },
    { ticker: "BTC", name: "Bitcoin", value_sgd: 890_000 },
    { ticker: "ETH", name: "Ethereum", value_sgd: 145_000 },
    { ticker: "SOL", name: "Solana", value_sgd: 320_000 },
  ],
  david_lim: [
    { ticker: "VOO", name: "Vanguard S&P 500 ETF", value_sgd: 110_000 },
    { ticker: "SGS10Y", name: "Singapore Government Securities", value_sgd: 800_000 },
  ],
};

export const EVENT_TICKER_MAP: Record<string, string[]> = {
  evt_crypto_001: ["BTC", "ETH", "SOL"],
  evt_fed_001: ["VOO", "AAPL", "MSFT", "NVDA", "GOOGL", "AMZN"],
  evt_nvidia_001: ["NVDA"],
};

export const HOUSE_VIEW_LIBRARY: DemoDocument[] = [
  {
    id: "singapore-household-liquidity.md",
    title: "Singapore Household Liquidity",
    description: "Liquidity buffers, spending resilience, and runway calibration for Singapore advisory books.",
    badge: "House View",
    entries: [
      {
        citation: "Liquidity Framework Sec. 2",
        snippet: "Advisers should frame emergency reserves as months of nondiscretionary spending, not as a nominal cash target detached from the client balance sheet.",
      },
      {
        citation: "Liquidity Framework Sec. 4",
        snippet: "When runway already exceeds 18 months, incremental cash accumulation has diminishing value relative to diversification repairs elsewhere in the portfolio.",
      },
    ],
  },
  {
    id: "digital-asset-risk-playbook.md",
    title: "Digital Asset Risk Playbook",
    description: "Position-sizing guardrails, concentration limits, and response playbooks for volatile digital assets.",
    badge: "House View",
    entries: [
      {
        citation: "Risk Playbook Sec. 1",
        snippet: "Concentrated crypto exposure increases drawdown risk because correlations across major digital assets often rise sharply during stress events.",
      },
      {
        citation: "Risk Playbook Sec. 3",
        snippet: "For moderate-risk households, digital assets above a 20% balance-sheet share should trigger an explicit sizing review rather than an automatic liquidation order.",
      },
    ],
  },
  {
    id: "asia-tech-equity-outlook.md",
    title: "Asia Tech Equity Outlook",
    description: "How house view translates valuation discipline and AI-capex conviction into portfolio actions.",
    badge: "House View",
    entries: [
      {
        citation: "Asia Tech Outlook Sec. 2",
        snippet: "In concentrated growth portfolios, valuation discipline matters as much as narrative momentum when rates stay elevated for longer.",
      },
      {
        citation: "Asia Tech Outlook Sec. 5",
        snippet: "Investors should differentiate between durable earnings beneficiaries and high-beta names that are merely sentiment proxies during policy shocks.",
      },
    ],
  },
];

export const SEEDED_COPILOT_RESPONSES: Record<string, Record<string, CopilotResponse>> =
  {
    alex_chen: {
      "top-3-actions": {
        question: "What are the top 3 actions for this client this quarter?",
        answer:
          "Alex's advisory agenda this quarter should stay focused on risk rebalancing, not return chasing. The balance sheet is still fundamentally healthy, but the wellness profile is being dragged lower by elevated digital-asset exposure and only moderate diversification support around the core property position.",
        structured_actions: [
          {
            rank: 1,
            action: "Trim digital asset exposure back toward a 20% ceiling",
            rationale:
              "Digital assets are 24.9% of gross assets, which is high for a moderate-risk mandate and the clearest controllable drag on the wellness score.",
            urgency: "HIGH",
          },
          {
            rank: 2,
            action: "Redeploy trimmed proceeds into diversified public-market exposure",
            rationale:
              "A broader equity mix would improve diversification and reduce dependence on Bitcoin plus the primary property as the two dominant risk buckets.",
            urgency: "MEDIUM",
          },
          {
            rank: 3,
            action: "Preserve liquid reserves while reviewing the 5-year property upgrade plan",
            rationale:
              "Liquidity runway remains strong at 21.9 months, so the next planning conversation should protect that buffer before any large housing commitment.",
            urgency: "LOW",
          },
        ],
        research_used: [
          { doc: "digital-asset-risk-playbook.md", score: 0.96 },
          { doc: "singapore-household-liquidity.md", score: 0.83 },
        ],
        grounding_validated: true,
      },
    },
  };

export const BRIEF_CITATIONS: Record<string, AlertBrief["house_view_citations"]> = {
  evt_crypto_001: [
    {
      doc: "digital-asset-risk-playbook.md",
      excerpt:
        "Concentrated crypto exposure increases drawdown risk because correlations across major digital assets often rise sharply during stress events.",
    },
  ],
  evt_fed_001: [
    {
      doc: "asia-tech-equity-outlook.md",
      excerpt:
        "In concentrated growth portfolios, valuation discipline matters as much as narrative momentum when rates stay elevated for longer.",
    },
  ],
  evt_nvidia_001: [
    {
      doc: "asia-tech-equity-outlook.md",
      excerpt:
        "Investors should differentiate between durable earnings beneficiaries and high-beta names that are merely sentiment proxies during policy shocks.",
    },
  ],
};
