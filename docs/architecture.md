# Architecture

This document is the technical map of WealthOS.

It is intentionally different from [product-strategy-brief.md](product-strategy-brief.md):

- the product strategy brief explains the product vision and feature direction
- this file explains what exists in the repo now, what the target platform should become, and where new work should go

## Current System

WealthOS currently has two runtime parts:

- a Next.js App Router frontend in `src/`
- a small FastAPI orchestration service in `services/orchestrator/`

The system is still an early prototype. It is not yet a production institutional platform.

## Current Frontend

### Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Recharts

### Current Routes

- `/` in [src/app/page.tsx](../src/app/page.tsx)
- `/research` in [src/app/research/page.tsx](../src/app/research/page.tsx)
- `/planning` in [src/app/planning/page.tsx](../src/app/planning/page.tsx)
- `/alerts` in [src/app/alerts/page.tsx](../src/app/alerts/page.tsx)
- `/api/portfolio` in [src/app/api/portfolio/route.ts](../src/app/api/portfolio/route.ts)

### Route Responsibilities

`/`

- renders the portfolio dashboard
- reads mock portfolio and transaction data through dashboard widgets

`/research`

- provides a UI for research question submission
- calls the orchestrator research endpoint
- renders an answer and citations

`/planning`

- provides a UI for deterministic planning queries
- calls the orchestrator planning endpoint
- renders summary, recommendation, and metrics

`/alerts`

- provides a UI for portfolio-aware alert generation
- calls the orchestrator alerts endpoint
- renders alert cards and recommendations

`/api/portfolio`

- exposes the mock portfolio payload from the frontend app

## Current Backend

The backend service lives in `services/orchestrator/`.

### Current Structure

- `app/main.py` boots FastAPI and registers routes
- `app/routes/` exposes research, planning, and alerts HTTP endpoints
- `app/workflows/` contains workflow-specific orchestration logic
- `app/tools/` contains data access, research retrieval, planning calculators, and market data helpers
- `app/orchestrator.py` contains a simple intent router
- `data/` contains seeded client profile and research corpus inputs

### Current Service Role

The orchestrator is currently a lightweight backend used to support:

- cited research answers
- structured planning responses
- portfolio alert responses

It is intentionally small so the team can iterate quickly.

## Current Data Sources

### Frontend Data

`src/data/`

- `mock-portfolio.json`
- `mock-transactions.json`

These files drive the dashboard surface and the thin portfolio API route.

### Backend Data

`services/orchestrator/data/`

- `client_profile.json`
- `research_corpus/*.md`

These files drive the current seeded orchestration workflows.

## Current Data Flow

Current flow is:

1. the dashboard renders from frontend mock JSON
2. the workflow pages call the FastAPI service
3. the FastAPI service reads seeded data and workflow tools
4. the frontend renders the orchestrator response

This means the system already demonstrates multiple workflow surfaces, but it is still mostly seeded and locally scoped.

## Current Constraints

- no live Bloomberg, custodian, OMS, or internal research system integrations
- no authentication or entitlement model
- no production persistence layer
- no normalized institutional portfolio model across many clients and asset classes
- no mandate-aware rebalance engine yet
- no pitch-copilot implementation yet

## Target Platform Summary

The target platform described in [product-strategy-brief.md](product-strategy-brief.md) should evolve into five technical layers:

### 1. Integration Layer

Purpose:

- connect to internal and external systems without replacing them

Examples:

- market data providers
- internal research repositories
- custodian and portfolio feeds
- OMS and compliance systems

### 2. Normalized Portfolio Context Layer

Purpose:

- unify client, wallet, position, mandate, and risk context

This should become the technical foundation for portfolio-manager workflows.

### 3. Workflow Intelligence Layer

Purpose:

- support the main product workflows through specialized modules

Target workflows:

- portfolio command
- universe monitor
- research navigation
- pitch copilot

### 4. Audit And Control Layer

Purpose:

- keep every recommendation inspectable and human-governed

Key rules:

- no autonomous execution
- explicit source trails
- approval before action

### 5. Operator Experience Layer

Purpose:

- provide user-facing workspaces for PMs, RMs, and future reviewers

## Transition Path

The repo should evolve in this order:

### Phase 1

- strengthen portfolio-manager workflow coverage
- improve position and wallet context
- make monitoring and alerts more tightly tied to owned exposures

### Phase 2

- deepen research navigation
- connect research to holdings and candidate investments
- add AI-assisted pitch drafting with source trails

### Phase 3

- add richer integrations
- add stronger entitlement and governance models
- harden audit and workflow controls

## Contributor Boundaries

### Frontend

`src/app/`

- route composition
- page-level UI
- API entrypoints that belong in the frontend app

`src/components/dashboard/`

- dashboard-specific widgets

`src/components/shared/`

- app-shell components such as navigation

`src/components/ui/`

- shared UI primitives
- treat as shared infrastructure and coordinate changes carefully

### Backend

`services/orchestrator/app/routes/`

- HTTP route boundaries

`services/orchestrator/app/workflows/`

- workflow-specific orchestration logic

`services/orchestrator/app/tools/`

- deterministic data access, research, market, and calculation utilities

### Data Contracts

Changes to these areas should be treated carefully because they affect multiple surfaces:

- `src/data/`
- `services/orchestrator/data/`
- `src/lib/types.ts`

## Practical Rule

When adding work:

1. decide whether it belongs to current prototype scope or target platform direction
2. update the product strategy brief if the product story changed
3. update this architecture doc if the technical boundaries changed
4. implement the smallest coherent slice in either frontend or orchestrator
