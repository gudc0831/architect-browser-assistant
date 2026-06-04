import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PassThrough } from "node:stream";
import {
  buildCodexPrompt,
  buildSpawnInvocation,
  handleRequest,
  parseCodexJsonlOutput,
  readNativeMessage,
} from "./codex-bridge-host.mjs";

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

    assert.match(prompt, /Permit evidence review/);
    assert.match(prompt, /Evidence is incomplete\./);
    assert.match(prompt, /official source, API URL, and checkedAt timestamp/);
    assert.match(prompt, /Return only valid JSON/);
  });

  it("extracts the last agent message from Codex JSONL", () => {
    const output = parseCodexJsonlOutput(
      [
        '{"type":"thread.started","thread_id":"t"}',
        '{"type":"item.completed","item":{"type":"agent_message","text":"first"}}',
        '{"type":"item.completed","item":{"type":"agent_message","text":"final"}}',
      ].join("\n"),
    );

    assert.equal(output, "final");
  });

  it("returns a mock generated response for protocol self tests", async () => {
    const previous = process.env.ARCHITECT_CODEX_BRIDGE_MOCK;
    process.env.ARCHITECT_CODEX_BRIDGE_MOCK = "1";

    try {
      const response = await handleRequest({ type: "generate", requestId: "test", payload: input });

      assert.equal(response.ok, true);
      assert.match(response.output.answer, /Local Codex bridge mock response/);
    } finally {
      if (previous === undefined) {
        delete process.env.ARCHITECT_CODEX_BRIDGE_MOCK;
      } else {
        process.env.ARCHITECT_CODEX_BRIDGE_MOCK = previous;
      }
    }
  });

  it("runs Windows npm PowerShell wrappers through the sibling cmd wrapper", () => {
    const invocation = buildSpawnInvocation(
      "C:\\Users\\hcchoi\\AppData\\Roaming\\npm\\codex.ps1",
      ["exec", "-", "--json"],
      "win32",
      (candidate) => candidate === "C:\\Users\\hcchoi\\AppData\\Roaming\\npm\\codex.cmd",
    );

    assert.deepEqual(invocation, {
      command: process.env.ComSpec || "cmd.exe",
      args: [
        "/d",
        "/c",
        'call "C:\\Users\\hcchoi\\AppData\\Roaming\\npm\\codex.cmd" "exec" "-" "--json"',
      ],
      windowsVerbatimArguments: true,
    });
  });

  it("runs Windows cmd wrappers through cmd.exe", () => {
    const invocation = buildSpawnInvocation(
      "C:\\Users\\hcchoi\\AppData\\Roaming\\npm\\codex.cmd",
      ["exec", "-", "--json"],
      "win32",
    );

    assert.deepEqual(invocation, {
      command: process.env.ComSpec || "cmd.exe",
      args: [
        "/d",
        "/c",
        'call "C:\\Users\\hcchoi\\AppData\\Roaming\\npm\\codex.cmd" "exec" "-" "--json"',
      ],
      windowsVerbatimArguments: true,
    });
  });

  it("reads one framed native message without waiting for stdin to close", async () => {
    const stream = new PassThrough();
    const pendingMessage = readNativeMessage(stream);
    const payload = Buffer.from(JSON.stringify({ type: "status", requestId: "framed-status" }), "utf8");
    const header = Buffer.alloc(4);
    header.writeUInt32LE(payload.length, 0);

    stream.write(header);
    stream.write(payload);

    const message = await pendingMessage;
    assert.deepEqual(message, { type: "status", requestId: "framed-status" });
  });
});
