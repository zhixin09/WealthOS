# Worklog

## Active Ownership

| Area | Owner | Status | Notes |
| --- | --- | --- | --- |
| Backend v2 analytics/events/advisory + shared API contracts | Codex | Done | Implemented the Wealth Wellness Hub v2 backend surface in `services/orchestrator/**` and updated the shared contracts in `src/lib/types.ts` and `src/lib/api.ts`. Frontend-owned `src/app/**` and `src/components/**` remained untouched. |
| README setup docs | Codex | Done | Beginner-first onboarding now covers blank-machine setup, backend dependency install, and two-terminal local startup. |

## Handoff Notes

### 2026-03-11 - Wealth Wellness Hub v2 backend

- Owner: Codex
- Status: done
- Changed: Added seeded multi-client data, seeded events/alerts/copilot payloads, deterministic analytics + wellness scoring, event-to-impact pipeline, BM25 research index, v2 FastAPI routes, NVIDIA/OpenAI-compatible advisory wrappers with seeded fallbacks, shared TypeScript contracts, and a golden-path integration test.
- Files: `services/orchestrator/app/analytics/*`, `services/orchestrator/app/advisory/*`, `services/orchestrator/app/data/*`, `services/orchestrator/app/events/*`, `services/orchestrator/app/routes/v2.py`, `services/orchestrator/app/main.py`, `services/orchestrator/app/models.py`, `services/orchestrator/data/clients/*.json`, `services/orchestrator/data/seeded_*.json`, `services/orchestrator/data/entity_security_map.json`, `services/orchestrator/pyproject.toml`, `services/orchestrator/tests/test_clients_loader.py`, `services/orchestrator/tests/test_analytics_engine.py`, `services/orchestrator/tests/test_wellness.py`, `services/orchestrator/tests/test_assembler.py`, `services/orchestrator/tests/test_event_pipeline.py`, `services/orchestrator/tests/test_bm25_search.py`, `services/orchestrator/tests/test_llm_client.py`, `services/orchestrator/tests/test_v2_endpoints.py`, `services/orchestrator/tests/test_golden_path.py`, `src/lib/types.ts`, `src/lib/api.ts`, `CLAUDE.md`, `docs/worklog.md`
- Risks: live `/v2/alerts/generate` and `/v2/copilot/query` will attempt NVIDIA NIM first when `NVIDIA_API_KEY` is present, so latency depends on that upstream even though seeded fallbacks remain in place.
- Next: frontend can wire the new `src/lib/api.ts` v2 helpers and types into the dashboard/research/alerts surfaces, and optionally align any product copy with the final seeded advisory text.

### 2026-03-11 - README onboarding rewrite

- Owner: Codex
- Status: done
- Changed: Rewrote `README.md` to be a step-by-step macOS setup guide for someone starting from nothing, including Homebrew, `nvm`, Node 22, Python 3.11, backend virtualenv setup, and local run instructions.
- Files: `README.md`, `docs/worklog.md`
- Risks: the guide is macOS-first; Windows and Linux users still need equivalent package-manager and shell-profile steps.
- Next: restore the broader `docs/` set referenced by `AGENTS.md` or remove those stale references if the repo is intentionally moving to a smaller doc surface.
