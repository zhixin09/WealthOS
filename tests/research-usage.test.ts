import test from "node:test";
import assert from "node:assert/strict";

import { dedupeResearchUsage } from "../src/components/adviser/research-usage.ts";

test("dedupeResearchUsage collapses duplicate docs and keeps the highest score", () => {
  const result = dedupeResearchUsage([
    { doc: "digital-asset-risk-playbook.md", score: 1.31 },
    { doc: "digital-asset-risk-playbook.md", score: 1.49 },
    { doc: "asia-tech-equity-outlook.md", score: 0.47 },
  ]);

  assert.deepEqual(result, [
    { doc: "digital-asset-risk-playbook.md", score: 1.49 },
    { doc: "asia-tech-equity-outlook.md", score: 0.47 },
  ]);
});
