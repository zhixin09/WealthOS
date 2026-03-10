# Worklog

## Active Ownership

| Area | Owner | Status | Notes |
| --- | --- | --- | --- |
| Backend v2 analytics/events/advisory + shared API contracts | Codex | Done | Implemented the Wealth Wellness Hub v2 backend surface in `services/orchestrator/**` and updated the shared contracts in `src/lib/types.ts` and `src/lib/api.ts`. Frontend-owned `src/app/**` and `src/components/**` remained untouched. |
| Adviser terminal frontend (`src/app/**`, `src/components/**`, `src/app/globals.css`) | Codex | In Progress | Rebuilding dashboard, alerts, planning, and research around a shared active-client context and v2-compatible frontend adapters. |
| README repo description | Codex | Done | Replaced the setup-first README with a short GitHub-facing project description aligned to the Wealth Wellness Hub problem statement. |
| Alerts RM brief editing | Codex | Done | Adviser briefs now support session-only RM editing, preview mode, reset-to-AI, and review gating before send. |

## Handoff Notes

### 2026-03-11 - README project description rewrite

- Owner: Codex
- Status: done
- Changed: Replaced the setup-guide README with a concise GitHub-facing project description focused on the Wealth Wellness Hub problem statement, solution, and RM value.
- Files: `README.md`, `docs/worklog.md`
- Risks: the repo landing page is now submission-friendly, but local setup instructions no longer live in the README.
- Next: if the team still wants onboarding docs, move the old setup guide into a separate `docs/setup.md` or submission appendix.

### 2026-03-11 - Wealth Wellness Hub v2 backend

- Owner: Codex
- Status: done
- Changed: Added seeded multi-client data, seeded events/alerts/copilot payloads, deterministic analytics + wellness scoring, event-to-impact pipeline, BM25 research index, v2 FastAPI routes, NVIDIA/OpenAI-compatible advisory wrappers with seeded fallbacks, shared TypeScript contracts, and a golden-path integration test.
- Files: `services/orchestrator/app/analytics/*`, `services/orchestrator/app/advisory/*`, `services/orchestrator/app/data/*`, `services/orchestrator/app/events/*`, `services/orchestrator/app/routes/v2.py`, `services/orchestrator/app/main.py`, `services/orchestrator/app/models.py`, `services/orchestrator/data/clients/*.json`, `services/orchestrator/data/seeded_*.json`, `services/orchestrator/data/entity_security_map.json`, `services/orchestrator/pyproject.toml`, `services/orchestrator/tests/test_clients_loader.py`, `services/orchestrator/tests/test_analytics_engine.py`, `services/orchestrator/tests/test_wellness.py`, `services/orchestrator/tests/test_assembler.py`, `services/orchestrator/tests/test_event_pipeline.py`, `services/orchestrator/tests/test_bm25_search.py`, `services/orchestrator/tests/test_llm_client.py`, `services/orchestrator/tests/test_v2_endpoints.py`, `services/orchestrator/tests/test_golden_path.py`, `src/lib/types.ts`, `src/lib/api.ts`, `CLAUDE.md`, `docs/worklog.md`
- Risks: live `/v2/alerts/generate` and `/v2/copilot/query` will attempt NVIDIA NIM first when `NVIDIA_API_KEY` is present, so latency depends on that upstream even though seeded fallbacks remain in place.
- Next: frontend can wire the new `src/lib/api.ts` v2 helpers and types into the dashboard/research/alerts surfaces, and optionally align any product copy with the final seeded advisory text.

### 2026-03-11 - Adviser terminal frontend rebuild

- Owner: Codex
- Status: in progress
- Changed: Rebuilt the frontend around an adviser-terminal flow with a shared active-client context, new adviser components, dashboard header/book/wellness surfaces, a three-state alerts journey, a copilot planning page, and a research navigator. Added a frontend-owned v2 compatibility adapter that prefers `/v2/*` endpoints and keeps seeded demo fallbacks in place for demo safety.
- Files: `docs/worklog.md`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/alerts/page.tsx`, `src/app/planning/page.tsx`, `src/app/research/page.tsx`, `src/app/globals.css`, `src/components/shared/sidebar.tsx`, `src/components/shared/client-context.tsx`, `src/components/dashboard/net-worth-card.tsx`, `src/components/dashboard/portfolio-chart.tsx`, `src/components/dashboard/asset-table.tsx`, `src/components/dashboard/recent-transactions.tsx`, `src/components/dashboard/market-overview.tsx`, `src/components/adviser/*`
- Risks: this branch still uses a local compatibility adapter rather than the shared `src/lib/api.ts` v2 helpers now available on `main`, and `npm run lint` / `npm run build` did not complete within the current shell session. This shell also could not source Node 22 via `~/.nvm/nvm.sh` because that path does not exist here.
- Next: rerun lint/build in a Node 22 shell, verify the four-page demo path against a live frontend, and decide whether to converge the frontend back onto the shared `src/lib/api.ts` v2 helpers or keep the local adapter for fallback behavior.

### 2026-03-11 - README onboarding rewrite

- Owner: Codex
- Status: done
- Changed: Rewrote `README.md` to be a step-by-step macOS setup guide for someone starting from nothing, including Homebrew, `nvm`, Node 22, Python 3.11, backend virtualenv setup, and local run instructions.
- Files: `README.md`, `docs/worklog.md`
- Risks: the guide is macOS-first; Windows and Linux users still need equivalent package-manager and shell-profile steps.
- Next: restore the broader `docs/` set referenced by `AGENTS.md` or remove those stale references if the repo is intentionally moving to a smaller doc surface.

### 2026-03-11 - Alerts RM brief editing

- Owner: Codex
- Status: done
- Changed: Converted the alerts adviser brief from a read-only AI output into a session-only RM draft workflow with edit/preview toggle, reset-to-AI, review gating before send, and overwrite confirmation before regenerating a dirty draft.
- Files: `docs/worklog.md`, `docs/plans/2026-03-11-alert-brief-rm-editing-design.md`, `docs/plans/2026-03-11-alert-brief-rm-editing.md`, `src/app/alerts/page.tsx`, `src/components/adviser/alert-brief-panel.tsx`, `src/components/adviser/alert-brief-draft.ts`, `src/components/adviser/alert-brief-draft.test.ts`
- Risks: draft edits are still session-only and the send action remains a demo toast rather than a persisted compliance or client-delivery workflow.
- Next: persist adviser drafts across refreshes and connect send/review states to a real approval or outbound workflow when the product is ready for that layer.
