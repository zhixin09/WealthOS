# Worklog

## Purpose

This is the lightweight handoff board for the project. Use it to record who is working on what, what changed, and what the next collaborator needs to know.

This file replaces a heavier task tracker or ADR stack.

## How To Use

- Before starting work, claim a scope.
- Keep scopes small and file-based where possible.
- After finishing or pausing, leave a short handoff note.
- If a decision changes architecture or workflow, also update `README.md`, `AGENTS.md`, or `docs/architecture.md`.

## Current Snapshot

- Date: 2026-03-11
- App state: institutional workflow prototype with Next.js frontend and FastAPI orchestrator
- Verification baseline: backend `pytest`, frontend `npm run lint`, and frontend `npm run build` pass
- Main product focus: portfolio-manager workflow and investment-universe monitoring
- Supporting workflow direction: AI-assisted pitch drafting grounded in market context and internal research

## Active Ownership

| Area | Owner | Status | Notes |
| --- | --- | --- | --- |
| Dashboard route and widgets | Unclaimed | Stable | Current portfolio command prototype |
| Research route | Unclaimed | MVP implemented | Seeded corpus and cited answer flow exist |
| Planning route | Unclaimed | MVP implemented | Deterministic scenario calculations are wired |
| Alerts route | Unclaimed | MVP implemented | Portfolio-aware event flow exists and needs hardening |
| Orchestrator backend | Unclaimed | MVP implemented | Core routes, tools, and workflows exist |
| Dev tooling and local styling pipeline | Unclaimed | Stable | Default dev server uses webpack; Turbopack remains opt-in due to CSS 404 risk |
| Shared UI primitives | Coordinate before editing | Shared | Avoid concurrent refactors |
| Mock data contracts | Coordinate before editing | Shared | Changes can break multiple widgets |

## Current Decisions

- `docs/product-strategy-brief.md` is the canonical product strategy document
- `README.md` is setup-focused
- `docs/architecture.md` is the technical map of current system, target platform summary, and transition path
- `docs/worklog.md` is the execution and handoff log
- Use Node.js 22 from `.nvmrc`
- Keep the main product focus on portfolio-manager workflow and universe monitoring
- Treat AI pitch drafting as an important downstream workflow, not the first execution surface
- Use mock and seeded data as the current source of truth for demo behavior
- Split work by route or module to reduce conflicts
- Recommended backend direction: small Python FastAPI orchestration service

## Suggested Next Work

- define a normalized portfolio, wallet, and mandate contract
- tighten the universe-monitor workflow around impacted holdings and watchlists
- design the first pitch-copilot input and output contract with source-trail requirements
- decide which external market and research connectors matter most for the first institutional demo

## Handoff Notes

### 2026-03-10 - Dev CSS loading fix

- Owner: Codex
- Status: done
- Changed: Switched the default `npm run dev` script from Turbopack to plain `next dev` after confirming Turbopack served a CSS URL that returned `404`, leaving the app unstyled in local development
- Files: `package.json`, `README.md`, `docs/worklog.md`
- Risks: `npm run dev:turbopack` still reproduces the broken stylesheet path on this setup with Next.js `15.5.12`; use it only for targeted debugging until the upstream issue is resolved
- Next: Keep using `npm run dev` for normal work and revisit Turbopack after upgrading Next.js or validating a fix upstream

### 2026-03-10 - Documentation baseline created

- Added project-specific `README.md`
- Added `AGENTS.md` for human and AI collaboration rules
- Added `docs/architecture.md` for codebase structure and boundaries
- Added `docs/worklog.md` for ownership and handoff tracking
- No product behavior changed

### 2026-03-10 - Hackathon blueprint and MVP plan added

- Added a future-state blueprint and MVP plan for the earlier hackathon framing
- Updated `README.md` and `AGENTS.md` so collaborators read that material before implementation
- Those docs have since been superseded by the canonical product strategy brief
- No product behavior changed

### 2026-03-10 - MVP workflow pass completed

- Added `services/orchestrator/` FastAPI backend scaffold
- Added backend data tools, research retrieval, planning calculators, alerts workflow, and a simple router
- Replaced the placeholder `research`, `planning`, and `alerts` pages with working MVP UIs
- Added shared frontend API/types helpers for orchestrator calls
- Stretch simulation is still not implemented

### 2026-03-11 - Product docs consolidated

- Owner: Codex
- Status: done
- Changed: Created `docs/product-strategy-brief.md` as the canonical strategic document, rewrote `docs/architecture.md` around current system plus target transition, updated `README.md` and `AGENTS.md` to point at the new source of truth, and removed the superseded blueprint and older plan docs
- Files: `README.md`, `AGENTS.md`, `docs/product-strategy-brief.md`, `docs/architecture.md`, `docs/worklog.md`
- Risks: the new strategy brief is broad and should be refined as the first institutional workflow contracts become clearer
- Next: lock the first portfolio-manager and universe-monitor data contracts before more feature work lands

## Handoff Template

Copy this block when handing work over:

```md
### YYYY-MM-DD - <task name>

- Owner: <name>
- Status: <done|paused|blocked>
- Changed: <short summary>
- Files: <paths>
- Risks: <what might break or need follow-up>
- Next: <clear next action>
```
