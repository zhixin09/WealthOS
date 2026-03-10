# Product Strategy Brief Design

**Date:** 2026-03-11

## Goal

Replace the fragmented strategic documentation with one canonical product strategy brief that explains both what WealthOS is today and what it is intended to become for investment banks and asset managers.

## Recommended Documentation Model

Use a layered but minimal documentation model:

- `README.md` stays operational and setup-focused
- `docs/worklog.md` stays execution-focused
- `docs/product-strategy-brief.md` becomes the canonical strategy document
- remove overlapping strategic and plan docs that are no longer the source of truth

## Product Center

The product should be framed around institutional portfolio workflows, not a generic wealth dashboard.

Primary workflow:

- portfolio manager streamlining fragmented portfolios across asset classes and client mandates

Secondary workflow:

- investment-universe monitoring across proprietary research, market news, and external data systems

Supporting workflow:

- AI-assisted pitch drafting using live market context plus proprietary internal research

## Canonical Brief Structure

The strategy brief should contain:

1. what WealthOS is
2. who it is for
3. institutional pain points
4. product thesis
5. core workflows
6. full feature breakdown
7. operating model and guardrails
8. current system in the repo
9. target platform vision
10. transition path from current state to target state
11. open questions and risks

## Architecture Doc Direction

`docs/architecture.md` should remain technical and honest, but it should stop trying to be the primary strategic narrative.

It should be rewritten around:

- current system
- target platform summary
- transition path
- technical boundaries for collaborators

## Cleanup Direction

Remove or replace overlapping docs that create multiple competing narratives.

Recommended changes:

- replace the current strategy/blueprint docs with `docs/product-strategy-brief.md`
- remove old plan docs if they are no longer active
- update `README.md` to point to the new canonical strategy brief
- update `docs/worklog.md` to reflect the new source-of-truth docs

## Execution Recommendation

Proceed with a single in-session documentation cleanup:

1. create the canonical product strategy brief
2. rewrite the architecture doc to align with it
3. simplify the README doc links
4. remove outdated overlapping plans/docs
5. update the worklog to reflect the cleanup
