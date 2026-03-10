# Alert Brief RM Editing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the generated adviser brief editable by the RM in the alerts flow while keeping citations read-only and enforcing a human review step before sending.

**Architecture:** Keep all edit state in the frontend alerts page. Add a small pure helper module for draft cloning, updates, reset, and dirty detection; test that helper first. Then wire the helper-backed state into the alerts page and replace the brief panel with an edit/preview workflow.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Node test runner for helper verification, existing frontend UI primitives

---

### Task 1: Document and claim the feature

**Files:**
- Modify: `docs/worklog.md`
- Create: `docs/plans/2026-03-11-alert-brief-rm-editing-design.md`
- Create: `docs/plans/2026-03-11-alert-brief-rm-editing.md`

**Step 1: Add active ownership entry**

Add a row for the alerts RM brief editing scope in `docs/worklog.md`.

**Step 2: Write the design doc**

Capture scope, UX, data flow, and risks in `docs/plans/2026-03-11-alert-brief-rm-editing-design.md`.

**Step 3: Save this implementation plan**

Write this plan file to `docs/plans/2026-03-11-alert-brief-rm-editing.md`.

### Task 2: Add failing tests for draft helper behavior

**Files:**
- Create: `src/components/adviser/alert-brief-draft.ts`
- Create: `src/components/adviser/alert-brief-draft.test.ts`

**Step 1: Write the failing test**

Cover:

- cloning the AI brief into a draft
- updating one recommended action without mutating the original
- detecting dirty state
- resetting to the AI draft

**Step 2: Run test to verify it fails**

Run:

```bash
npx tsc --module commonjs --target es2020 --outDir .tmp-tests src/components/adviser/alert-brief-draft.test.ts src/components/adviser/alert-brief-draft.ts src/components/adviser/contracts.ts && node --test .tmp-tests/alert-brief-draft.test.js
```

Expected: fail because the helper functions do not exist yet or the assertions do not pass.

### Task 3: Implement the helper minimally

**Files:**
- Modify: `src/components/adviser/alert-brief-draft.ts`

**Step 1: Write minimal implementation**

Export pure functions:

- `cloneAlertBriefDraft`
- `updateAlertBriefAction`
- `hasAlertBriefDraftChanges`

Keep the implementation small and immutable.

**Step 2: Run the helper test to verify it passes**

Run:

```bash
npx tsc --module commonjs --target es2020 --outDir .tmp-tests src/components/adviser/alert-brief-draft.test.ts src/components/adviser/alert-brief-draft.ts src/components/adviser/contracts.ts && node --test .tmp-tests/alert-brief-draft.test.js
```

Expected: pass.

### Task 4: Wire editable draft state into the alerts page

**Files:**
- Modify: `src/app/alerts/page.tsx`

**Step 1: Add parent-owned draft state**

Track:

- `originalBrief`
- `draftBrief`
- `isEditing`
- `isReviewed`

Compute dirty state from the helper.

**Step 2: Guard regeneration when dirty**

Use `window.confirm` before overwriting RM edits with a regenerated AI brief.

**Step 3: Reset state correctly**

Reset editing/review state on client changes, event changes, and fresh generation.

### Task 5: Replace the read-only brief panel with an edit/preview workflow

**Files:**
- Modify: `src/components/adviser/alert-brief-panel.tsx`

**Step 1: Add editable fields**

Make `subject`, `brief`, and `recommended_actions` editable in edit mode.

**Step 2: Keep citations read-only**

Do not allow edits to `house_view_citations`.

**Step 3: Add controls**

Add:

- edit/preview toggle
- reset to AI draft
- reviewed-by-RM checkbox
- send button disabled until reviewed

**Step 4: Preserve current demo send behavior**

Keep the success toast but make it honest by requiring RM review first.

### Task 6: Verify and hand off

**Files:**
- Modify: `docs/worklog.md`

**Step 1: Run helper tests**

Run the Node-based helper test command again and confirm pass.

**Step 2: Run frontend verification**

Run:

```bash
source ~/.nvm/nvm.sh && nvm use && npm run lint
source ~/.nvm/nvm.sh && nvm use && npm run build
```

Expected: both commands pass.

**Step 3: Add handoff note**

Document:

- what changed
- files touched
- risks
- next step
