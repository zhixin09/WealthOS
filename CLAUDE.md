# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Frontend (Node 22 — see .nvmrc)
nvm use
npm install
npm run dev              # Do NOT use dev:turbopack — CSS breaks on Next 15.5.12
npm run build
npm run lint             # ESLint: next/core-web-vitals + next/typescript

# Backend
cd services/orchestrator
python3 -m uvicorn app.main:app --reload --port 8000
python3 -m pytest -q
python3 -m pytest tests/test_research_store.py -q   # single test file
```

## Architecture

Two runtimes: a Next.js 15 App Router frontend (`src/`) and a FastAPI orchestrator backend (`services/orchestrator/`). The frontend calls the backend via `src/lib/api.ts` → `NEXT_PUBLIC_ORCHESTRATOR_URL` (default `http://127.0.0.1:8000`). Path alias: `@/*` → `./src/*`.

## Frontend

**Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Recharts, Lucide icons, shadcn-style UI primitives (built on @base-ui/react).

**Theme:** Dark mode only (`<html className="dark">`). Design uses oklch colors, glassmorphism (`.glass-card`), and staggered fade-in animations. Fonts: Inter (sans) + Geist Mono.

**Root layout** (`src/app/layout.tsx`): `TooltipProvider` → flex container with `Sidebar` + scrollable `<main>`.

### Routes

**`/` — Dashboard** (`src/app/page.tsx`)
- Bento grid layout (4-col desktop, 2-col tablet, 1-col mobile) with staggered animations.
- Renders 6 dashboard widgets, all reading from static `mock-portfolio.json` import. No API calls, no state.
- Header: "Good evening, Alex" + formatted date.

**`/research` — Research Navigator** (`src/app/research/page.tsx`)
- RAG-style research query interface. Two-column: answer (left) + citations (right).
- State: `question`, `result`, `error`, `isLoading`.
- Calls `queryResearch(question)` → `POST /research/query`.
- 3 suggested prompts (Singapore liquidity, crypto exposure, Asia tech valuation).
- Renders synthesized answer text + citation cards with source/snippet.

**`/planning` — Financial Planning** (`src/app/planning/page.tsx`)
- Scenario analysis interface. Two-column: summary+recommendation (left) + key metrics (right).
- State: `question`, `result`, `error`, `isLoading`.
- Calls `queryPlanning(question)` → `POST /planning/query`.
- 3 suggested questions (property upgrade, liquidity buffer, portfolio concentration).
- Renders scenario name, summary text, recommendation box, metric grid.

**`/alerts` — Portfolio Alerts** (`src/app/alerts/page.tsx`)
- Event-triggered alert monitor. Single "Run Alerts" button.
- State: `result`, `error`, `isLoading`.
- Calls `runAlerts(4)` → `POST /alerts/run`.
- Renders alert cards with headline, source, event summary, impacted holdings, current price, recommendation.

**`/api/portfolio`** (`src/app/api/portfolio/route.ts`)
- GET endpoint that returns the entire `mock-portfolio.json` as JSON.

### Dashboard Components (`src/components/dashboard/`)

**NetWorthCard** — Displays total net worth ($535,520), trend badge (+2.36%), total assets/liabilities breakdown, monthly change. Color-coded: emerald for positive, rose for negative.

**PortfolioChart** — Recharts donut pie chart of asset allocation (5 categories). Custom tooltip showing category/value/percentage. Right-side legend with color dots.

**AssetTable** — Combined equities + crypto table sorted by value descending. Columns: asset (symbol+name+shares), price, 24h change (color-coded badge), total value.

**HealthScore** — SVG circular progress ring (score out of 100) + 5 category progress bars (savings rate, debt ratio, diversification, emergency fund, investment growth). Color thresholds: emerald ≥80, amber ≥60, rose <60.

**RecentTransactions** — ScrollArea (280px) showing 10 most recent transactions. Icon + color per type (buy/sell/deposit/withdrawal/dividend/interest/payment). Debit types show "-", credit types show "+".

**MarketOverview** — 2×3 grid of hardcoded market indices (S&P 500, NASDAQ, STI, BTC, ETH, Gold) with static prices and change percentages.

### Sidebar (`src/components/shared/sidebar.tsx`)

Collapsible sidebar (240px expanded, 68px collapsed). 4 nav items: Dashboard, Research, Planning, Alerts. Active route detection via `usePathname()`. Footer shows user profile ("Alex Chen", "Moderate Risk"). Tooltips appear when collapsed.

### UI Primitives (`src/components/ui/`)

Shadcn-style components: Avatar, Badge, Button, Card, Chart, Dialog, Input, ScrollArea, Separator, Sheet, Skeleton, Table, Tabs, Tooltip. Used across multiple routes.

### API Layer (`src/lib/api.ts`)

Generic `request<T>(path, body)` function that POSTs JSON to the orchestrator. Three exports:
- `queryResearch(question)` → `/research/query`
- `queryPlanning(question)` → `/planning/query`
- `runAlerts(limit=4)` → `/alerts/run`

### Type Definitions (`src/lib/types.ts`)

- `ResearchResponse` — `{ answer, citations: [{ source, citation, snippet }] }`
- `PlanningResponse` — `{ scenario, summary, recommendation, key_metrics: [{ label, value }] }`
- `AlertsResponse` — `{ generated_at, alerts: [{ headline, source, eventSummary, impactedHoldings, recommendation, currentPrice }] }`

### Utility (`src/lib/utils.ts`)

`cn(...inputs)` — combines classnames via clsx + tailwind-merge.

## Mock Data

### `src/data/mock-portfolio.json` — Client: Alex Chen

- **Profile:** Age 34, Singapore, moderate risk, 1 dependent, $18,500/mo income, $7,200/mo fixed expenses, 10-15 year horizon.
- **Net worth:** $535,520 ($847,520 assets − $312,000 liabilities), +$12,340/+2.36% monthly.
- **Equities (6):** AAPL, MSFT, NVDA, GOOGL, AMZN, VOO — total ~$104,568.
- **Crypto (3):** BTC (1.25), ETH (15.5), SOL (200) — total ~$211,023.
- **Real estate:** Singapore condo, $920,000 current value.
- **Bank deposits:** DBS Savings $45k, DBS FD $80k (3.5%, matures Sep 2026), OCBC Savings $32.5k — total $157,500.
- **CPF:** OA $125k, SA $68k, MA $42k — total $235,000.
- **Liabilities:** Mortgage $285k ($2,800/mo, 2.6%, 18yr) + Car loan $27k ($950/mo, 2.78%, 3yr).
- **Health score:** 78/100 — savings 85, debt 72, diversification 80, emergency 68, growth 82.
- **Allocation:** Real Estate 46.5%, Crypto 24.9%, Equities 12.3%, Bank 10.8%, CPF 5.5%.

### `src/data/mock-transactions.json` — 15 transactions

Mix of buy, sell, deposit, withdrawal, dividend, interest, payment. Most recent: 2026-03-10 (buy 5 NVDA).

## Backend (`services/orchestrator/`)

**Stack:** FastAPI, Pydantic, Python 3.11+.

**Config** (`app/config.py`): Env vars `FINNHUB_API_KEY` (optional, falls back to mock news), `ALPHA_VANTAGE_API_KEY` (defined but unused), `WEALTHOS_CORS_ORIGINS` (default localhost:3000).

**CORS:** Allows localhost:3000 and 127.0.0.1:3000.

### Endpoints

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | `/health` | — | `{ status: "ok" }` |
| POST | `/research/query` | `{ question, limit? }` | `{ answer, citations }` |
| POST | `/planning/query` | `{ question }` | `{ scenario, summary, recommendation, key_metrics }` |
| POST | `/alerts/run` | `{ limit? }` | `{ generated_at, alerts }` |

### Intent Classification (`app/orchestrator.py`)

`classify_intent(question)` — keyword matching:
- "alert/headline/news/portfolio event" → alerts
- "afford/property/liquidity/plan/risk profile" → planning
- Everything else → research

### Workflow: Research (`app/workflows/research.py`)

1. `search_corpus(question, limit)` — tokenize query, remove stopwords, score chunks by exact token match (+1) and phrase bonus (3-word +4, 2-word +2), return top N.
2. Format answer from top citation + supporting sources list.
3. Return answer + citations array.

### Workflow: Planning (`app/workflows/planning.py`)

1. Load client profile, portfolio snapshot, risk profile.
2. Infer scenario from keywords: `property-upgrade`, `liquidity-buffer`, or `risk-rebalance` (default).
3. Run scenario-specific calculations:
   - **Property upgrade:** Standard mortgage calc (25% down, 4% rate, 25yr). Checks affordability (surplus ≥0 AND debt service ratio ≤0.7). Returns monthly payment, surplus, liquidity runway.
   - **Liquidity buffer:** `liquid_reserves / monthly_expenses` = months of runway.
   - **Risk rebalance:** Extracts crypto allocation %, calculates free cash flow, flags concentration risk for moderate-risk profile.
4. Return scenario name, summary, recommendation, key metrics.

### Workflow: Alerts (`app/workflows/alerts.py`)

1. Extract all symbols from portfolio (equities + crypto).
2. For each symbol, fetch news via `get_company_news(symbol)` — uses Finnhub API if key set, otherwise mock data.
3. Deduplicate by headline, limit to N alerts.
4. For each alert, get current price from portfolio data and generate recommendation:
   - Crypto symbols (BTC/ETH/SOL): position sizing + liquidity advice.
   - Moderate risk tolerance: monitor but avoid reactive trading.
   - Default: monitor against risk budget.

### Tools

**Client Data** (`app/tools/client_data.py`):
- `get_client_profile()` — loads `data/client_profile.json` (lru_cache, returns deepcopy).
- `get_portfolio_snapshot()` — loads `src/data/mock-portfolio.json` (lru_cache, returns deepcopy).
- `get_risk_profile()` — derives from client profile: clientName, jurisdiction, riskTolerance, investmentHorizon.

**Market Data** (`app/tools/market_data.py`):
- `get_company_news(symbol)` — Finnhub API with 5s timeout, falls back to mock news for AAPL/NVDA/BTC/ETH.
- `get_market_quote(symbol)` — looks up currentPrice from portfolio snapshot (equities then crypto). Returns None if not found.

**Planning Calculators** (`app/tools/planning_calculators.py`):
- `calculate_affordability(property_price, down_payment_ratio, annual_interest_rate, loan_term_years, monthly_income, monthly_fixed_expenses)` — standard mortgage amortization formula.
- `calculate_liquidity_buffer(liquid_reserves, monthly_fixed_expenses)` — simple division.
- `calculate_cashflow_after_scenario(monthly_income, monthly_fixed_expenses, additional_monthly_costs)` — simple subtraction.

**Research Store** (`app/tools/research_store.py`):
- `load_corpus()` — reads `data/research_corpus/*.md`, splits into paragraph chunks, indexes as `{source, citation, content}`.
- `search_corpus(query, limit)` — tokenize + stopword removal + scoring (token match + phrase bonus).

### Research Corpus (`services/orchestrator/data/research_corpus/`)

3 markdown documents, each split into ~3 paragraph chunks:
- `singapore-household-liquidity.md` — liquidity buffer best practices for Singapore households.
- `digital-asset-risk-playbook.md` — risk management for concentrated crypto exposure.
- `asia-tech-equity-outlook.md` — Asia tech equity valuation and accumulation strategy.

### Backend Data (`services/orchestrator/data/client_profile.json`)

Same Alex Chen profile as frontend mock data (name, age, jurisdiction, risk tolerance, income, expenses, goals).

### Tests

5 test files covering: health endpoint, intent classification, research corpus search, client data loading, planning calculator math, alerts workflow symbol extraction.
