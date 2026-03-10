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
pip install -e ".[dev]"
python3 -m uvicorn app.main:app --reload --port 8000
python3 -m pytest -q
python3 -m pytest tests/test_analytics_engine.py -q   # single test file
```

## Architecture

Two runtimes: Next.js 15 App Router frontend (`src/`) + FastAPI orchestrator backend (`services/orchestrator/`). Frontend calls backend via `src/lib/api.ts` → `NEXT_PUBLIC_ORCHESTRATOR_URL` (default `http://127.0.0.1:8000`). Path alias: `@/*` → `./src/*`.

## Collaboration Contract

| Owner | File Ownership |
|-------|----------------|
| Backend engineer | `services/orchestrator/**`, `src/data/**`, `src/lib/types.ts`, `src/lib/api.ts` |
| Frontend engineer | `src/app/**`, `src/components/**`, `src/app/globals.css` |

Shared contract files (`types.ts`, `api.ts`) are owned by backend engineer. Frontend reads them, does not edit.

## Implementation Plan

Full plan with task breakdown, code, and demo script: `docs/plans/2026-03-11-wealth-wellness-hub-v2.md`

## Frontend

**Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Recharts, Lucide icons, shadcn-style UI primitives (built on @base-ui/react).

**Theme:** Dark mode only (`<html className="dark">`). oklch colors, glassmorphism (`.glass-card`), staggered fade-in animations. Fonts: Inter (sans) + Geist Mono.

**Root layout** (`src/app/layout.tsx`): `TooltipProvider` → flex container with `Sidebar` + scrollable `<main>`.

### Current Routes (v1 — being migrated to v2)

- `/` — Dashboard bento grid with 6 widgets reading from static `mock-portfolio.json`
- `/research` — RAG-style research query → `POST /research/query`
- `/planning` — Scenario analysis → `POST /planning/query`
- `/alerts` — Alert monitor → `POST /alerts/run`
- `/api/portfolio` — GET endpoint returning `mock-portfolio.json`

### Dashboard Components (`src/components/dashboard/`)

NetWorthCard, PortfolioChart (Recharts donut), AssetTable (equities+crypto sorted by value), HealthScore (SVG circular progress + 5 category bars), RecentTransactions (ScrollArea, 10 items), MarketOverview (hardcoded 6 indices).

### Sidebar (`src/components/shared/sidebar.tsx`)

Collapsible (240px/68px). 4 nav items. Active route via `usePathname()`. Footer: "Alex Chen", "Moderate Risk".

### UI Primitives (`src/components/ui/`)

Avatar, Badge, Button, Card, Chart, Dialog, Input, ScrollArea, Separator, Sheet, Skeleton, Table, Tabs, Tooltip.

### API Layer (`src/lib/api.ts`)

Legacy v1 functions + new v2 functions. v2 endpoints use `/v2/` prefix.

### Types (`src/lib/types.ts`)

Legacy types (ResearchResponse, PlanningResponse, AlertsResponse) + v2 types (ClientSummary, ClientAnalytics, WellnessResponse, ImpactManifest, AlertBrief, CopilotResponse, ResearchSearchResponse).

## Mock Data

### `src/data/mock-portfolio.json` — used by v1 dashboard (Alex Chen, USD values)

Net worth $535,520. Equities (6): AAPL, MSFT, NVDA, GOOGL, AMZN, VOO. Crypto (3): BTC, ETH, SOL. Real estate: SGD 920k condo. Bank deposits: SGD 157.5k. CPF: SGD 235k. Liabilities: mortgage $285k + car loan $27k.

### `services/orchestrator/data/clients/` — used by v2 analytics (SGD values)

3 clients: `alex_chen.json` (moderate, full portfolio), `priya_sharma.json` (aggressive, tech+crypto heavy), `david_lim.json` (conservative, bonds+property).

### `src/data/mock-transactions.json` — 15 transactions (buy/sell/deposit/withdrawal/dividend/interest/payment)

## Backend (`services/orchestrator/`)

**Stack:** FastAPI, Pydantic v2, Python 3.11+, rank_bm25, OpenAI SDK (pointing at NVIDIA NIM endpoint, model `moonshotai/kimi-k2.5`).

**Config** (`app/config.py`): Auto-loads `.env.local` from repo root. Keys: `NVIDIA_API_KEY` (NVIDIA NIM LLM — falls back to seeded responses if missing), `FINNHUB_API_KEY`, `FINLIGHT_API_KEY`, `ALPHA_VANTAGE_API_KEY`, `WEALTHOS_CORS_ORIGINS`.

### v1 Endpoints (legacy, still working)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check |
| POST | `/research/query` | Keyword-based research search |
| POST | `/planning/query` | Scenario planning (property/liquidity/risk) |
| POST | `/alerts/run` | Portfolio alerts from mock/Finnhub news |

### v2 Endpoints (new)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v2/clients` | List all clients with summary wellness scores |
| GET | `/v2/clients/{id}/analytics` | Full deterministic analytics for one client |
| GET | `/v2/clients/{id}/wellness` | Wellness score + 5 sub-scores + top risks |
| GET | `/v2/events` | List seeded market events |
| POST | `/v2/events/impact` | Compute impact manifest for event × client |
| POST | `/v2/alerts/generate` | LLM alert brief (seeded fallback if no API key) |
| POST | `/v2/copilot/query` | LLM copilot advisory (seeded fallback if no API key) |
| POST | `/v2/research/search` | BM25 search over markdown corpus |

### Backend Modules

**Analytics layer** (deterministic — LLM never touches these numbers):
- `app/analytics/engine.py` — 8 core calculations: net worth, allocation, liquid reserves, liquidity runway, DSR, concentration risk, diversification score, digital exposure
- `app/analytics/wellness.py` — composite wellness score (0-100, weighted from 5 sub-scores) + behavioral resilience proxy
- `app/analytics/assembler.py` — combines engine + wellness into full client response objects

**Data layer:**
- `app/data/clients.py` — multi-client JSON loader from `data/clients/`
- `app/data/research_index.py` — BM25Okapi search over `data/research_corpus/*.md`

**Event pipeline:**
- `app/events/pipeline.py` — load seeded events, map entities to securities via `data/entity_security_map.json`, compute client exposure, classify severity (LOW/MODERATE/HIGH/CRITICAL)

**Advisory layer** (LLM with seeded fallbacks):
- `app/advisory/llm_client.py` — NVIDIA NIM wrapper (OpenAI SDK → `integrate.api.nvidia.com/v1`, model `moonshotai/kimi-k2.5`, 15s timeout)
- `app/advisory/alerts.py` — alert brief generation with house-view evidence injection
- `app/advisory/copilot.py` — copilot response with client analytics + research context injection

**Seeded fallback data:**
- `data/seeded_events.json` — 3 curated market events (crypto crash, Fed rates, Nvidia export ban)
- `data/seeded_alerts.json` — pre-written alert briefs matching each event
- `data/seeded_copilot.json` — pre-written copilot responses for 4 demo prompt chips
- `data/entity_security_map.json` — entity name → ticker lookup

**Legacy modules** (v1, still working):
- `app/tools/client_data.py` — loads `data/client_profile.json` + `src/data/mock-portfolio.json`
- `app/tools/market_data.py` — Finnhub API + mock news fallback
- `app/tools/planning_calculators.py` — affordability, liquidity buffer, cashflow calculators
- `app/tools/research_store.py` — keyword-based corpus search (replaced by BM25 in v2)
- `app/workflows/` — v1 workflow orchestration for research, planning, alerts

### Research Corpus (`data/research_corpus/`)

3 markdown docs (~3 chunks each): singapore-household-liquidity, digital-asset-risk-playbook, asia-tech-equity-outlook.

### Tests

Run `python3 -m pytest -q` from `services/orchestrator/`. Covers: health endpoint, intent classification, research search (v1+v2), client data loading, planning calculators, alerts workflow, analytics engine, wellness score, assembler, event pipeline, v2 endpoints, golden-path integration test.
