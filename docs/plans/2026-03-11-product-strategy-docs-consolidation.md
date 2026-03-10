# Product Strategy Docs Consolidation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate WealthOS documentation around one canonical product strategy brief for investment-bank and asset-manager workflows while keeping setup and execution docs lean.

**Architecture:** Create `docs/product-strategy-brief.md` as the single strategic source of truth, rewrite `docs/architecture.md` so it cleanly separates current state from target platform direction, and remove overlapping plan/blueprint documents that are no longer active. Keep `README.md` operational and `docs/worklog.md` execution-focused.

**Tech Stack:** Markdown documentation, Next.js repo structure, Node.js 22 local workflow

---

### Task 1: Create the canonical product strategy brief

**Files:**
- Create: `docs/product-strategy-brief.md`

**Step 1: Write the brief structure**

Create sections for:

- what WealthOS is
- target customers and users
- core institutional pain points
- product thesis
- core workflows
- full feature breakdown
- operating principles and compliance posture
- current state in the repo
- target platform vision
- phased transition path
- open questions

**Step 2: Fill the brief with the approved positioning**

Ensure the brief reflects:

- primary workflow: portfolio manager streamlining fragmented portfolios
- secondary workflow: investment-universe monitoring and alerting
- supporting workflow: AI-assisted pitch drafting with live market context
- human-in-the-loop, auditable, no autonomous execution

**Step 3: Review for internal consistency**

Check that the brief does not overclaim what is currently implemented.

### Task 2: Rewrite the architecture doc to support the brief

**Files:**
- Modify: `docs/architecture.md`

**Step 1: Reframe the document**

Split the document into:

- current system
- target platform summary
- transition path
- technical boundaries for contributors

**Step 2: Remove conflicting positioning**

Remove generic “demo dashboard” framing where it conflicts with the institutional product thesis.

**Step 3: Keep technical honesty**

Explicitly state what exists now in the repo versus what is planned next.

### Task 3: Simplify the README to point at the canonical strategy doc

**Files:**
- Modify: `README.md`

**Step 1: Keep README operational**

Retain setup, run, troubleshooting, route map, and project structure.

**Step 2: Update documentation links**

Point collaborators to:

- `docs/product-strategy-brief.md`
- `docs/architecture.md`
- `docs/worklog.md`

**Step 3: Remove links to superseded strategic docs**

### Task 4: Remove overlapping strategic and plan docs

**Files:**
- Delete: `docs/hackathon-blueprint.md`
- Delete: `docs/plans/2026-03-10-hackathon-mvp-implementation.md`
- Delete: `docs/plans/2026-03-10-project-documentation.md`

**Step 1: Verify they are superseded**

Confirm their strategic content is covered by the new canonical brief and architecture doc.

**Step 2: Delete the superseded files**

Keep only the active consolidation/design plan artifacts from this cleanup.

### Task 5: Update the worklog to reflect the new documentation model

**Files:**
- Modify: `docs/worklog.md`

**Step 1: Update current decisions**

Record that:

- `docs/product-strategy-brief.md` is the canonical strategy document
- `README.md` is setup-focused
- `docs/worklog.md` is execution-focused

**Step 2: Add a handoff note**

Record the documentation consolidation and what changed.

### Task 6: Verify the repo after documentation cleanup

**Files:**
- Verify only

**Step 1: Run lint**

Run: `source ~/.nvm/nvm.sh && nvm use node && npm run lint`
Expected: exit code `0`

**Step 2: Run production build**

Run: `source ~/.nvm/nvm.sh && nvm use node && npm run build`
Expected: exit code `0`
