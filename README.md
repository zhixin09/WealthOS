# WealthOS

WealthOS is an institutional portfolio intelligence and workflow platform prototype for investment banks, private banks, and asset managers.

The current repo includes:

- a Next.js portfolio dashboard
- first-pass `research`, `planning`, and `alerts` workflow surfaces
- a small FastAPI orchestrator backend
- local mock and seeded data instead of live institutional integrations
- no production database, entitlement model, or execution layer yet

## Prerequisites

- Node.js `22`
- npm

This repo includes [`.nvmrc`](.nvmrc), so if you use `nvm`:

```bash
nvm use
```

## Quick Start

For a new collaborator, these are the exact steps:

```bash
git clone <repo-url>
cd WealthOS
nvm use
npm install
cd services/orchestrator
python3 -m uvicorn app.main:app --reload --port 8000
cd ../..
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The frontend expects the orchestration service at `http://127.0.0.1:8000` by default. To point it elsewhere, set `NEXT_PUBLIC_ORCHESTRATOR_URL`.

## Run Modes

### Development

Use this for normal local work. Run both services in separate terminals:

```bash
cd services/orchestrator
python3 -m uvicorn app.main:app --reload --port 8000
```

```bash
npm run dev
```

This starts the FastAPI backend and the Next.js dev server with the stable webpack pipeline.

### Production

Use this only if you want to test the production build locally:

```bash
npm run build
npm run start
```

Important: `npm run start` serves the compiled production output from `.next/`. It will not work correctly if the production build is stale or missing.

## Common Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

```bash
cd services/orchestrator
python3 -m pytest -q
python3 -m uvicorn app.main:app --reload --port 8000
```

## Troubleshooting

### `npm run start` fails with `routesManifest.dataRoutes is not iterable`

That usually means the `.next/` production build is stale or incomplete.

Run:

```bash
rm -rf .next
npm run build
npm run start
```

If you are just trying to work on the app locally, use `npm run dev` instead.

### `npm run dev` renders unstyled HTML

If the app loads but looks like raw HTML, the dev server is likely serving a broken CSS asset.

Use the default script:

```bash
npm run dev
```

Avoid `npm run dev:turbopack` for now. In this project on Next.js `15.5.12`, Turbopack can emit a CSS URL that returns `404`, which leaves the dashboard markup visible but unstyled.

### Build fails with `Cannot find module '../lightningcss.darwin-arm64.node'`

That usually means dependencies were installed under the wrong Node.js or CPU target.

Run:

```bash
nvm use
rm -rf node_modules
npm install
npm run build
```

### Port 3000 is already in use

Stop the existing dev or production server, or let Next.js choose another port automatically.

## Current Route Map

- `/` - main wealth dashboard
- `/research` - seeded research corpus with cited answers
- `/planning` - deterministic planning scenarios with recommendation output
- `/alerts` - portfolio-aware event alerts with recommendations
- `/api/portfolio` - mock portfolio JSON API

## Project Structure

```text
src/
  app/                  Route entrypoints and API routes
  components/
    dashboard/          Dashboard-specific widgets
    shared/             Shared shell components like the sidebar
    ui/                 Reusable UI primitives
  data/                 Mock JSON fixtures
  lib/                  Small shared utilities
docs/
  architecture.md       Codebase structure and extension guidance
  product-strategy-brief.md
  worklog.md            Lightweight ownership and handoff log
services/
  orchestrator/         FastAPI backend for AI workflow orchestration
```

## Documentation

- [Product Strategy Brief](docs/product-strategy-brief.md)
- [Architecture](docs/architecture.md)
- [Worklog](docs/worklog.md)
- [Agent Instructions](AGENTS.md)

## Current Notes

- The frontend can run without app-specific env vars, but the backend can optionally use `FINNHUB_API_KEY` and `ALPHA_VANTAGE_API_KEY`.
- Mock data lives in `src/data/mock-portfolio.json` and `src/data/mock-transactions.json`.
- Shared UI primitives in `src/components/ui/` should be changed carefully because multiple routes and widgets depend on them.
- `services/orchestrator/` is the backend for research, alerts, and planning workflows.
- The canonical product definition now lives in `docs/product-strategy-brief.md`.
