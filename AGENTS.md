# AGENTS.md

## Purpose

This file is the working contract for human collaborators and AI coding agents in this repo. Read it before making changes.

## Project Goal

Build a coherent institutional portfolio intelligence prototype without letting the repo drift into conflicting narratives or ad hoc architecture. Prioritise clarity, traceability, and safe handoff over premature abstraction.

## Required Reading Order

1. [README.md](README.md)
2. [docs/product-strategy-brief.md](docs/product-strategy-brief.md)
3. [docs/architecture.md](docs/architecture.md)
4. [docs/worklog.md](docs/worklog.md)

## Operating Rules

- Use Node.js 22 from `.nvmrc`.
- Before coding, claim the task or area in `docs/worklog.md`.
- Prefer scoped changes by route or module.
- Avoid editing shared primitives in `src/components/ui/` unless the task truly requires it.
- If you change a shared API, data shape, or folder boundary, update the docs in the same change.
- Keep mock data and UI assumptions in sync.
- Do not add major infrastructure such as auth, database, background jobs, or external APIs silently. Document the decision first.

## Current Product Boundaries

- The main product direction is portfolio-manager workflow plus investment-universe monitoring.
- The dashboard is the current portfolio command prototype.
- `Research`, `Planning`, and `Alerts` are early workflow surfaces backed by the orchestrator.
- `src/data/` and `services/orchestrator/data/` are the current seeded data sources.
- There is no live institutional integration, auth layer, or trade execution capability yet.

## Safe Work Split

For a 2-person team, split work by feature area:

- One person owns a route or domain at a time.
- Shared files require coordination.
- If two people need the same file, one should finish the contract first, then the other builds on top.

Good split examples:

- Person A: dashboard metrics and charts
- Person B: research route or backend workflow improvements

- Person A: mock data contract changes
- Person B: styling and layout polish on isolated routes

Bad split examples:

- Both people editing the same dashboard card set
- Both people reshaping `mock-portfolio.json` without agreement
- Both people refactoring `src/components/ui/` at the same time

## Commands

```bash
source ~/.nvm/nvm.sh
nvm use
npm run lint
npm run build
```

```bash
cd services/orchestrator
python3 -m pytest -q
```

Use the backend test suite plus `npm run lint` and `npm run build` before claiming the MVP is done.

## File Boundaries

- `src/app/`: routes, page composition, API route entrypoints
- `src/components/dashboard/`: dashboard-specific widgets
- `src/components/shared/`: app-wide shared shells such as sidebar
- `src/components/ui/`: reusable UI primitives
- `src/data/`: mock portfolio and transaction fixtures
- `services/orchestrator/`: Python FastAPI orchestration service for AI workflows
- `docs/product-strategy-brief.md`: canonical product strategy source of truth
- `docs/architecture.md`: technical map of current and target system shape
- `docs/worklog.md`: execution and handoff log

## Definition Of Done

A task is only done when:

- the intended behavior is implemented
- docs are updated if structure or workflow changed
- `python3 -m pytest -q` passes for backend changes
- `npm run lint` passes
- `npm run build` passes
- `docs/worklog.md` has a short handoff note

## Handoff Format

Add a short note to `docs/worklog.md` with:

- what changed
- files touched
- anything risky or unfinished
- what the next person should do next

## Decision Rule

When speed and cleanliness conflict, choose the fastest approach that does not create confusion for the next collaborator or contradict the product strategy brief.
