import { describe, expect, it } from "vitest";
import { buildCodexPrompt, handleRequest, parseCodexJsonlOutput } from "./codex-bridge-host.mjs";

const input = {
  question: "Check closure risk",
  taskContext: {
    taskId: "task-1",
    projectId: "project-1",
    title: "Permit evidence review",
    description: "Check whether the task has enough evidence.",
    status: "in_review",
    issueId: "ARCH-1",
    projectName: "Architect",
  },
  evidence: [
    {
      id: "evidence-1",
      kind: "task",
      priority: 1,
      title: "Current task",
      excerpt: "Evidence is incomplete.",
    },
  ],
};

describe("codex native host", () => {
  it("builds a bounded Codex prompt from task context and evidence", () => {
    const prompt = buildCodexPrompt(input);

    expect(prompt).toContain("Permit evidence review");
    expect(prompt).toContain("Evidence is incomplete.");
    expect(prompt).toContain("Return only valid JSON");
  });

  it("extracts the last agent message from Codex JSONL", () => {
    const output = parseCodexJsonlOutput(
      [
        '{"type":"thread.started","thread_id":"t"}',
        '{"type":"item.completed","item":{"type":"agent_message","text":"first"}}',
        '{"type":"item.completed","item":{"type":"agent_message","text":"final"}}',
      ].join("\n"),
    );

    expect(output).toBe("final");
  });

  it("returns a mock generated response for protocol self tests", async () => {
    const previous = process.env.ARCHITECT_CODEX_BRIDGE_MOCK;
    process.env.ARCHITECT_CODEX_BRIDGE_MOCK = "1";

    const response = await handleRequest({ type: "generate", requestId: "test", payload: input });

    if (previous === undefined) {
      delete process.env.ARCHITECT_CODEX_BRIDGE_MOCK;
    } else {
      process.env.ARCHITECT_CODEX_BRIDGE_MOCK = previous;
    }

    expect(response.ok).toBe(true);
    expect(response.output.answer).toContain("Local Codex bridge mock response");
  });
});
