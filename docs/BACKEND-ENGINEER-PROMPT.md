# Backend Engineer — Master Prompt for Codex

> Copy this entire file into Codex as your initial prompt. Read everything before writing any code.

---

## Who You Are

You are the **backend engineer** on a 2-person hackathon team building the **WealthOS Wealth Wellness Hub** — an institutional wealth adviser intelligence terminal. You own **all backend code** (`services/orchestrator/`) and the **shared API contract files** (`src/lib/types.ts`, `src/lib/api.ts`).

A frontend engineer is working in parallel on `src/app/` and `src/components/`. You must NOT touch those files. They must NOT touch yours.

---

## Critical Context — Read These Files First

Before writing ANY code, you MUST read and understand these files:

1. **`CLAUDE.md`** — Full project architecture, commands, module structure
2. **`docs/plans/2026-03-11-wealth-wellness-hub-v2.md`** — The COMPLETE implementation plan with 17 tasks, exact code, exact tests, exact file paths. **This is your primary instruction set. Follow it task by task.**
3. **`services/orchestrator/app/config.py`** — Settings and env var loading (auto-reads `.env.local`)
4. **`services/orchestrator/app/main.py`** — FastAPI app entry point
5. **`services/orchestrator/app/models.py`** — Existing Pydantic models
6. **`services/orchestrator/pyproject.toml`** — Python dependencies

---

## What This Project Already Has

This is NOT a greenfield project. There is a working FastAPI backend with existing endpoints, tests, and data. You are EXTENDING it, not rewriting it.

### Existing backend structure (`services/orchestrator/`):
```
app/
  __init__.py
  main.py              # FastAPI app, registers routers, health endpoint
  config.py            # Settings dataclass, reads .env.local automatically
  models.py            # Pydantic models for v1 endpoints
  orchestrator.py      # Intent classifier (keyword-based routing)
  routes/
    __init__.py
    alerts.py          # POST /alerts/run
    planning.py        # POST /planning/query
    research.py        # POST /research/query
  workflows/
    __init__.py
    alerts.py          # Alert generation from portfolio symbols + news
    planning.py        # Scenario planning (property/liquidity/risk)
    research.py        # Research query with keyword search
  tools/
    __init__.py
    client_data.py     # Loads client_profile.json + mock-portfolio.json
    market_data.py     # Finnhub API + mock news fallback
    planning_calculators.py  # Affordability, liquidity buffer, cashflow
    research_store.py  # Custom keyword-based corpus search
data/
  client_profile.json  # Alex Chen profile (v1 format)
  research_corpus/
    asia-tech-equity-outlook.md
    digital-asset-risk-playbook.md
    singapore-household-liquidity.md
tests/
  test_health.py
  test_client_data.py
  test_research_store.py
  test_planning_calculators.py
  test_alerts.py
  test_orchestrator.py
pyproject.toml
```

### Existing v1 endpoints (DO NOT BREAK THESE):
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Returns `{"status": "ok"}` |
| POST | `/research/query` | Keyword-based research search |
| POST | `/planning/query` | Scenario planning with mortgage/liquidity calcs |
| POST | `/alerts/run` | Portfolio alerts from mock/Finnhub news |

### Existing tests (17 tests, ALL must keep passing):
```bash
cd services/orchestrator
python3 -m pytest -q
# Expected: 17 passed
```

### API keys available (auto-loaded from `.env.local`):
- `NVIDIA_API_KEY` — NVIDIA NIM endpoint for LLM calls (model: `moonshotai/kimi-k2.5`)
- `FINNHUB_API_KEY` — Market news API
- `FINLIGHT_API_KEY` — Financial data API
- `ALPHA_VANTAGE_API_KEY` — Market data API

---

## What You Are Building

You are adding a **v2 API layer** alongside the existing v1 endpoints. All new endpoints use the `/v2/` prefix. The v2 layer consists of:

### New modules to create:
```
app/
  analytics/
    __init__.py
    engine.py          # 8 deterministic calculations (net worth, DSR, HHI, etc.)
    wellness.py        # Composite wellness score + behavioral resilience
    assembler.py       # Combines engine + wellness into full client response objects
  data/
    __init__.py
    clients.py         # Multi-client JSON loader from data/clients/
    research_index.py  # BM25 search over markdown corpus
  events/
    __init__.py
    pipeline.py        # Event loading, entity→security mapping, exposure calc, severity
  advisory/
    __init__.py
    llm_client.py      # NVIDIA NIM wrapper (OpenAI SDK with custom base_url)
    alerts.py          # LLM alert brief generation with research evidence
    copilot.py         # LLM copilot response with client analytics context
  routes/
    v2.py              # All new v2 endpoints
```

### New data files to create:
```
data/
  clients/
    alex_chen.json     # Primary demo client (full portfolio, SGD values)
    priya_sharma.json  # Stub client (aggressive, tech+crypto heavy)
    david_lim.json     # Stub client (conservative, bonds+property)
  seeded_events.json   # 3 curated market events with pre-extracted entities
  entity_security_map.json  # Entity name → ticker symbol mapping
  seeded_alerts.json   # Pre-written alert briefs (LLM fallback for demo safety)
  seeded_copilot.json  # Pre-written copilot responses (LLM fallback)
```

### New v2 endpoints:
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v2/clients` | List 3 clients with summary wellness scores |
| GET | `/v2/clients/{id}/analytics` | Full deterministic analytics for one client |
| GET | `/v2/clients/{id}/wellness` | Wellness score + 5 sub-scores + top risks |
| GET | `/v2/events` | List seeded market events |
| POST | `/v2/events/impact` | Compute impact manifest for event × client |
| POST | `/v2/alerts/generate` | LLM alert brief (falls back to seeded if LLM unavailable) |
| POST | `/v2/copilot/query` | LLM copilot advisory (falls back to seeded) |
| POST | `/v2/research/search` | BM25 search over markdown corpus |

### Shared contract files you own:
- `src/lib/types.ts` — TypeScript types matching your Pydantic response models
- `src/lib/api.ts` — Frontend API call functions for all v2 endpoints

---

## Commands

```bash
# Navigate to backend
cd services/orchestrator

# Install dependencies (including dev deps)
pip install -e ".[dev]"

# Run the backend server
python3 -m uvicorn app.main:app --reload --port 8000

# Run ALL tests (must pass after every task)
python3 -m pytest -q

# Run a single test file
python3 -m pytest tests/test_analytics_engine.py -v

# Run a single test function
python3 -m pytest tests/test_analytics_engine.py::test_compute_net_worth -v
```

---

## Task Execution Order

Follow the implementation plan (`docs/plans/2026-03-11-wealth-wellness-hub-v2.md`) task by task, in order. Each task has:
- Exact files to create/modify
- Exact test code (write tests FIRST)
- Exact implementation code
- Exact commit commands

**The tasks in order:**

### Day 1: Data Layer + Analytics Engine

**Task 1: Create enriched client data**
- Create `data/clients/alex_chen.json`, `priya_sharma.json`, `david_lim.json`
- Alex is the primary demo client with 16 assets and 2 liabilities, all in SGD
- Priya and David are stub clients for the "Book of Business" sidebar
- Do NOT delete `data/client_profile.json` — existing tests depend on it

**Task 2: Create seeded events and entity security map**
- Create `data/seeded_events.json` — 3 curated market events (crypto crash, Fed rates, Nvidia export ban)
- Each event has pre-extracted entity names in the `entities` array (no NER library needed)
- Create `data/entity_security_map.json` — maps entity names to ticker symbols

**Task 3: Create seeded alert fallbacks**
- Create `data/seeded_alerts.json` — pre-written perfect alert briefs for each of the 3 events
- These are the demo safety net: if LLM is slow/down, serve these instantly
- Also create `data/seeded_copilot.json` — pre-written responses for 4 demo prompt chips

**Task 4: Write API contracts (types.ts + api.ts)**
- Update `src/lib/types.ts` — keep all existing types, add new v2 types below them
- Update `src/lib/api.ts` — keep all existing functions, add new v2 functions
- This unblocks the frontend engineer — do this EARLY on Day 1

**Task 5: Client data loader**
- Create `app/data/clients.py` — `list_clients()` and `get_client(id)` functions
- Uses `lru_cache` + `deepcopy` pattern (same as existing `client_data.py`)
- Reads JSON files from `data/clients/` directory

**Task 6: Analytics engine — core calculations**
- Create `app/analytics/engine.py` — 8 pure functions:
  - `compute_net_worth(client)` — `sum(assets) - sum(liabilities)`
  - `compute_allocation(client)` — `{class: percentage}` dict
  - `compute_liquid_reserves(client)` — sum of assets where `class == "cash"`
  - `compute_liquidity_runway(client)` — `liquid_reserves / monthly_expenses` (cap at 999 if expenses=0)
  - `compute_dsr(client)` — `monthly_debt_payments / monthly_income`
  - `compute_concentration_risk(client)` — per-holding `value/gross_assets`, flag if >15%
  - `compute_diversification_score(weights)` — `(1 - HHI) * 100` where HHI = sum of squared weights
  - `compute_digital_exposure(client)` — sum of digital_assets class / gross, classify as low/moderate/high
- ALL pure functions, no side effects, no API calls
- These numbers are NEVER generated by LLM — they are deterministic

**Task 7: Financial wellness score**
- Create `app/analytics/wellness.py`
- `compute_wellness_score(metrics)` — weighted average of 5 sub-scores (0-100):
  - Liquidity: 25% weight, `min(runway_months/12, 1.0)`
  - Debt burden: 20% weight, `max(0, 1 - dsr/0.6)`
  - Diversification: 20% weight, `diversification_score/100`
  - Digital safety: 15% weight, penalize if digital_pct > 20%
  - Concentration: 20% weight, penalize based on max_concentration
- Rating: Excellent ≥80, Good ≥60, Fair ≥40, At Risk <40
- `compute_behavioral_resilience(risk_profile, digital_pct, max_concentration)` — base score from risk profile, penalize for high digital/concentration

**Task 8: Full client analytics assembler**
- Create `app/analytics/assembler.py`
- `build_client_analytics(client_id)` — loads client, runs ALL engine functions, returns complete analytics dict
- `build_client_wellness(client_id)` — builds analytics + wellness score + identifies top risks
- This is the "glue" module — calls `get_client()`, then all engine functions, then wellness

### Day 1 Evening: Event Pipeline + v2 Endpoints

**Task 9: Event-to-impact pipeline**
- Create `app/events/pipeline.py`
- `load_seeded_events()` — reads `data/seeded_events.json`
- `get_event_by_id(event_id)` — lookup by ID
- `map_entities_to_securities(entities)` — reads `entity_security_map.json`, returns set of tickers
- `compute_client_exposure(client_id, securities)` — find matching holdings, calc exposure % per holding
- `classify_severity(total_exposure_frac, event_type)` — rule-based: >15% = CRITICAL, >5% + rate/regulatory = HIGH, >2% = MODERATE, else LOW
- `build_impact_manifest(event_id, client_id)` — full pipeline: load event → extract entities → map to securities → calc exposure → classify severity

**Task 10: New v2 API endpoints**
- Create `app/routes/v2.py` with ALL v2 endpoints
- Register router in `app/main.py`
- Add new Pydantic models to `app/models.py`
- Endpoints: GET /v2/clients, GET /v2/clients/{id}/analytics, GET /v2/clients/{id}/wellness, GET /v2/events, POST /v2/events/impact

**Task 11: Upgrade research to BM25**
- Add `rank-bm25` to `pyproject.toml` dependencies
- Create `app/data/research_index.py` — `BM25Okapi` index over markdown corpus chunks
- `search_research(query, top_k)` — tokenize, score, return ranked results with scores
- `get_available_docs()` — list the 3 available research documents

**Task 12: Add research search and alert generate to v2**
- Add POST /v2/research/search endpoint — calls BM25 search
- Add POST /v2/alerts/generate endpoint — serves seeded alerts initially (LLM in Task 14)

### Day 2: LLM Integration + Copilot

**Task 13: Add copilot endpoint (seeded, pre-LLM)**
- Create `data/seeded_copilot.json` — 4 pre-written responses for demo prompt chips
- Add POST /v2/copilot/query endpoint — keyword-matches question to seeded response
- Question mapping: "top 3 actions" → top_3_actions, "digital asset" → digital_exposure, "property" → property_upgrade, "house view" → house_view

**Task 14: LLM integration — alert brief generator**
- Add `openai` to `pyproject.toml` dependencies
- Create `app/advisory/llm_client.py` — OpenAI SDK wrapper pointing at NVIDIA NIM:
  - `base_url = "https://integrate.api.nvidia.com/v1"`
  - `model = "moonshotai/kimi-k2.5"`
  - `NVIDIA_API_KEY` from config
  - Returns `None` if no API key (triggers seeded fallback)
  - Strips markdown code fences from response (model may wrap JSON in ``` blocks)
  - 15 second timeout
- Create `app/advisory/alerts.py` — builds prompt from impact manifest + research evidence, calls LLM, returns structured brief
- Update POST /v2/alerts/generate to try LLM first, fall back to seeded

**Task 15: LLM integration — copilot query**
- Create `app/advisory/copilot.py` — builds prompt from client analytics + wellness + research, calls LLM
- Update POST /v2/copilot/query to try LLM first, fall back to seeded

**Task 16: Update CLAUDE.md**
- Reflect the new v2 architecture in CLAUDE.md

**Task 17: Golden-path integration test**
- Create `tests/test_golden_path.py` — simulates the exact 5-minute demo flow end-to-end
- Tests: list clients → get analytics → get wellness → get events → trigger impact → generate alert → copilot query → research search
- All in one test function, sequential

---

## Architecture Rules

### Deterministic vs LLM boundary (CRITICAL)
```
DETERMINISTIC (app/analytics/):          LLM (app/advisory/):
- Net worth                              - Alert brief text
- Allocation %                           - Copilot answer text
- Liquidity runway                       - Recommended action wording
- DSR
- HHI / Diversification
- Digital exposure %
- Wellness score
- Severity classification
- Exposure calculations

The LLM NEVER generates financial numbers.
The LLM ONLY formats/narrates pre-computed numbers.
```

### Seeded fallback pattern (use everywhere LLM is called):
```python
# Try LLM
llm_result = generate_json(system_prompt, user_prompt)

if llm_result and "expected_key" in llm_result:
    # Use LLM output
    return format_llm_response(llm_result)

# Fallback to seeded
seeded = load_seeded_data()
return format_seeded_response(seeded)
```

### Caching pattern (use for all data loaders):
```python
from functools import lru_cache
from copy import deepcopy

@lru_cache(maxsize=1)
def _load_data():
    # Load from disk once
    return json.load(...)

def get_data():
    return deepcopy(_load_data())  # Always return a copy
```

---

## LLM Client Details

The LLM is NVIDIA NIM running `moonshotai/kimi-k2.5`, accessed via the OpenAI-compatible API:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=settings.nvidia_api_key,  # from NVIDIA_API_KEY env var
)

response = client.chat.completions.create(
    model="moonshotai/kimi-k2.5",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ],
    max_tokens=4096,
    temperature=0.3,
    top_p=1.0,
    timeout=15.0,
)
```

**Important:** This model may NOT support `response_format={"type": "json_object"}`. Instead:
1. Instruct JSON output in the system prompt: "You MUST return valid JSON with this exact structure: {...}"
2. Strip markdown code fences from the response (model sometimes wraps JSON in ```json blocks)
3. If parsing fails, return `None` (triggers seeded fallback)

---

## Testing Requirements

- **Write tests FIRST** (TDD) — every task starts with a failing test
- **Run ALL tests** after every task: `python3 -m pytest -q`
- **Existing 17 tests must never break** — you are adding to them, not replacing
- Use the `fastapi.testclient.TestClient` for endpoint tests
- Use exact assertions for deterministic functions (not approximate)

---

## Git Rules

- Work on `main` branch directly (no feature branches for hackathon speed)
- Always `git pull --rebase` before committing
- Commit after EACH task completes (small, frequent commits)
- Commit message format: `feat: <what changed>` or `test: <what changed>`
- Never commit `.env.local` or API keys (`.env*` is gitignored)

---

## File Ownership — NEVER Touch These

These files belong to the frontend engineer. Do NOT modify them:
```
src/app/**          (page components)
src/components/**   (UI components)
src/app/globals.css (styles)
src/lib/utils.ts    (utility functions)
```

You DO own and should modify:
```
services/orchestrator/**   (all backend code)
src/lib/types.ts           (shared TypeScript types)
src/lib/api.ts             (shared API call functions)
src/data/**                (mock data JSONs)
CLAUDE.md                  (project documentation)
```

---

## Data Schemas

### Client JSON shape (used by all analytics):
```json
{
  "id": "alex_chen",
  "name": "Alex Chen",
  "age": 34,
  "risk_profile": "moderate",
  "jurisdiction": "Singapore",
  "monthly_income_sgd": 18500,
  "monthly_expenses_sgd": 7200,
  "monthly_debt_payments_sgd": 3750,
  "investment_horizon": "10-15 years",
  "financial_goals": ["..."],
  "dependents": 1,
  "assets": [
    {"id": "eq_aapl", "name": "Apple Inc", "ticker": "AAPL", "class": "equities", "value_sgd": 14722.76, "currency": "USD", "raw_value": 10905.75}
  ],
  "liabilities": [
    {"id": "mort_condo", "name": "Condo Mortgage", "value_sgd": 285000, "monthly_payment_sgd": 2800, "rate_pct": 2.6}
  ]
}
```

Asset classes: `equities`, `digital_assets`, `real_estate`, `cash`, `cpf`, `fixed_income`

### Seeded event shape:
```json
{
  "id": "evt_crypto_001",
  "headline": "Bitcoin drops 18% amid sweeping US regulatory crackdown",
  "body": "...",
  "source": "Bloomberg",
  "timestamp": "2026-03-11T14:00:00Z",
  "event_type": "regulatory",
  "entities": ["Bitcoin", "Crypto"]
}
```

### Entity security map shape:
```json
{
  "Bitcoin": ["BTC"],
  "Crypto": ["BTC", "ETH", "SOL"],
  "Federal Reserve": ["VOO", "AAPL", "MSFT", "NVDA", "GOOGL", "AMZN"],
  "Nvidia": ["NVDA"]
}
```

---

## Verification Checklist

After ALL tasks are complete, verify:

1. `python3 -m pytest -q` — ALL tests pass (existing 17 + new ~30+)
2. `python3 -m uvicorn app.main:app --port 8000` — server starts without errors
3. `curl http://localhost:8000/health` → `{"status":"ok"}`
4. `curl http://localhost:8000/v2/clients` → returns 3 clients with wellness scores
5. `curl http://localhost:8000/v2/clients/alex_chen/analytics` → returns full analytics
6. `curl http://localhost:8000/v2/clients/alex_chen/wellness` → returns wellness + sub-scores
7. `curl http://localhost:8000/v2/events` → returns 3 events
8. `curl -X POST http://localhost:8000/v2/events/impact -H "Content-Type: application/json" -d '{"event_id":"evt_crypto_001","client_id":"alex_chen"}'` → returns impact manifest with BTC/ETH/SOL exposure
9. `curl -X POST http://localhost:8000/v2/alerts/generate -H "Content-Type: application/json" -d '{"event_id":"evt_crypto_001","client_id":"alex_chen"}'` → returns alert brief
10. `curl -X POST http://localhost:8000/v2/copilot/query -H "Content-Type: application/json" -d '{"client_id":"alex_chen","question":"What are the top 3 actions?"}'` → returns copilot response
11. `curl -X POST http://localhost:8000/v2/research/search -H "Content-Type: application/json" -d '{"query":"crypto risk","limit":3}'` → returns BM25-ranked results

---

## Priority Order If Running Out of Time

1. Tasks 1-4 (data + contracts) — **MUST COMPLETE** — frontend engineer is blocked without these
2. Tasks 5-8 (analytics engine) — **MUST COMPLETE** — these power the dashboard
3. Tasks 9-10 (event pipeline + v2 endpoints) — **MUST COMPLETE** — these power the alert demo
4. Tasks 11-12 (BM25 + research/alert endpoints) — **HIGH PRIORITY** — completes the alert flow
5. Task 13 (copilot with seeded responses) — **HIGH PRIORITY** — copilot works without LLM
6. Tasks 14-15 (LLM integration) — **NICE TO HAVE** — seeded fallbacks already work
7. Tasks 16-17 (docs + integration test) — **NICE TO HAVE** — polish

The demo works with seeded fallbacks even if LLM integration is never completed. Prioritize deterministic logic over LLM calls.
