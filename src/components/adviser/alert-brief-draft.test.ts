import * as assert from "node:assert/strict";
import { test } from "node:test";

import type { AlertBrief } from "./contracts";
import {
  cloneAlertBriefDraft,
  hasAlertBriefDraftChanges,
  updateAlertBriefAction,
} from "./alert-brief-draft";

const sampleBrief: AlertBrief = {
  alert_id: "alex_chen-evt_crypto_001",
  subject: "Crypto drawdown - Portfolio impact for Alex Chen",
  severity: "HIGH",
  brief:
    "Alex Chen has 16.4% mapped exposure to this event. The RM should review whether the current sizing still fits the mandate and risk budget.",
  recommended_actions: [
    "Review digital asset sizing against the current mandate.",
    "Protect liquid reserves during the volatility window.",
  ],
  house_view_citations: [
    {
      doc: "digital-asset-risk-playbook.md",
      excerpt: "Position sizing discipline matters more than narrative conviction.",
    },
  ],
  grounding_validated: true,
};

test("cloneAlertBriefDraft returns an independent copy", () => {
  const draft = cloneAlertBriefDraft(sampleBrief);

  assert.deepEqual(draft, sampleBrief);
  assert.notStrictEqual(draft, sampleBrief);
  assert.notStrictEqual(draft.recommended_actions, sampleBrief.recommended_actions);
});

test("updateAlertBriefAction only updates the targeted action", () => {
  const draft = cloneAlertBriefDraft(sampleBrief);
  const updated = updateAlertBriefAction(
    draft,
    1,
    "Prepare a client outreach note with balanced downside framing.",
  );

  assert.equal(
    updated.recommended_actions[1],
    "Prepare a client outreach note with balanced downside framing.",
  );
  assert.equal(
    draft.recommended_actions[1],
    "Protect liquid reserves during the volatility window.",
  );
});

test("hasAlertBriefDraftChanges detects subject, brief, and action edits", () => {
  const draft = cloneAlertBriefDraft(sampleBrief);
  const editedActionDraft = updateAlertBriefAction(
    draft,
    0,
    "Confirm the current risk budget before any client outreach.",
  );

  assert.equal(hasAlertBriefDraftChanges(sampleBrief, draft), false);
  assert.equal(hasAlertBriefDraftChanges(sampleBrief, editedActionDraft), true);
  assert.equal(
    hasAlertBriefDraftChanges(sampleBrief, {
      ...draft,
      subject: "Updated subject",
    }),
    true,
  );
  assert.equal(
    hasAlertBriefDraftChanges(sampleBrief, {
      ...draft,
      brief: "Updated brief",
    }),
    true,
  );
});

test("cloning the original brief resets the draft back to AI output", () => {
  const edited = updateAlertBriefAction(
    cloneAlertBriefDraft(sampleBrief),
    0,
    "Trim exposure immediately.",
  );
  const reset = cloneAlertBriefDraft(sampleBrief);

  assert.notDeepEqual(reset, edited);
  assert.deepEqual(reset, sampleBrief);
});
