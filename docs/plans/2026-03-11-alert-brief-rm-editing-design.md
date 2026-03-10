# Alert Brief RM Editing Design

## Goal

Turn the generated adviser brief in the alerts flow into an RM-reviewable draft instead of a read-only AI output.

## Scope

This pass is intentionally session-only.

- No database
- No backend save endpoint
- No multi-user draft sharing
- No compliance workflow persistence

The objective is to make the demo product behave honestly: AI drafts the brief, the RM reviews and edits it, and only then can it be sent.

## User Story

As a relationship manager, I want to review and edit the AI-generated adviser brief before sending it so that client-facing communication remains human-approved.

## UX

The adviser brief screen will support two modes:

- `Preview`: read-only rendering of the current working draft
- `Edit`: editable fields for the RM

Editable fields:

- subject
- main brief body
- recommended actions

Read-only fields:

- severity
- grounding badge
- house view citations

Controls:

- `Edit Draft`
- `Preview Draft`
- `Reset to AI Draft`
- `Reviewed by RM` checkbox
- `Send to Client`
- `Back to Impact`

`Send to Client` stays disabled until the RM explicitly confirms review.

## Data Model

The alerts page owns two draft objects:

- `originalBrief`: the latest AI-generated brief
- `draftBrief`: the RM-edited working copy

Additional local UI state:

- `isEditing`
- `isReviewed`
- `isDirty`
- `showToast`

No new backend types are required. Edit metadata stays local to the client session.

## State Rules

When a new brief is generated:

- `originalBrief` is replaced
- `draftBrief` is reset from `originalBrief`
- `isReviewed` becomes `false`
- `isEditing` becomes `false`

When the RM edits any editable field:

- only `draftBrief` changes
- `originalBrief` remains unchanged
- `isDirty` becomes `true`
- `isReviewed` resets to `false`

When the RM clicks `Reset to AI Draft`:

- `draftBrief` is recreated from `originalBrief`
- `isDirty` becomes `false`
- `isReviewed` becomes `false`

When the RM attempts to regenerate while edits exist:

- the UI asks for confirmation before overwriting the current draft

## Implementation Shape

Add a small draft helper module with pure functions for:

- cloning the generated brief into an editable draft
- updating a recommended action at an index
- checking whether the editable draft differs from the original AI draft

These helpers will be unit-tested independently from the React UI.

## Testing

This repo does not expose an established frontend UI test runner, so this change will test the pure draft-state helpers directly and rely on lint/build verification for the React wiring.

The helper tests should cover:

- creating an editable draft from the AI brief
- updating a single action without mutating the original
- detecting dirty vs clean draft state
- resetting back to the AI draft

## Risks

- Session-only edits are lost on page refresh
- `window.confirm` is sufficient for the overwrite guard, but it is not the final UX
- `Send to Client` remains a demo action rather than a real dispatch or compliance submission

## Follow-Up

If the prototype graduates beyond demo use, the next step should be backend-persisted drafts with timestamps, reviewer identity, and explicit approval status.
