import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("official law task-flow verifier stops at WIKI candidate creation", async () => {
  const script = await readFile(new URL("./verify-official-law-task-flow.mjs", import.meta.url), "utf8");

  assert.equal(script.includes("/api/admin/knowledge/candidates/${encodeURIComponent(record.id)}/approve"), false);
  assert.equal(script.includes("/api/assistant/summaries"), false);
  assert.equal(script.includes('readArg(args, "oc")'), false);
  assert.match(script, /\/api\/assistant\/task-review/);
  assert.doesNotMatch(script, /\/api\/assistant\/retrieve/);
  assert.doesNotMatch(script, /\/api\/assistant\/records",\s*\{\s*method:\s*"POST"/);
  assert.match(script, /approvalAttempted:\s*false/);
  assert.match(script, /candidateCreated:\s*false/);
  assert.match(script, /candidateState !== "not_candidate"/);
});
