import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PassThrough } from "node:stream";
import {
  buildCodexExecArgs,
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

  it("returns sanitized bridge schema status with safe Codex options only", async () => {
    const previous = process.env.ARCHITECT_CODEX_BRIDGE_MOCK;
    process.env.ARCHITECT_CODEX_BRIDGE_MOCK = "1";

    try {
      const response = await handleRequest({
        type: "status",
        requestId: "status-options",
        codexOptions: {
          model: "gpt-5-codex",
          reasoningEffort: "high",
          serviceTier: "priority",
          sandboxMode: "read-only",
          configPath: "C:\\Users\\secret\\.codex\\config.toml",
          env: { OPENAI_API_KEY: "secret" },
          stderr: "raw log",
        },
      });

      assert.equal(response.ok, true);
      assert.equal(response.status.bridgeSchemaVersion, 2);
      assert.deepEqual(response.status.codexOptions, {
        model: "gpt-5-codex",
        reasoningEffort: "high",
        serviceTier: "priority",
        sandboxMode: "read-only",
      });
      assert.equal("configPath" in response.status.codexOptions, false);
      assert.equal("env" in response.status.codexOptions, false);
      assert.equal("stderr" in response.status.codexOptions, false);
    } finally {
      if (previous === undefined) {
        delete process.env.ARCHITECT_CODEX_BRIDGE_MOCK;
      } else {
        process.env.ARCHITECT_CODEX_BRIDGE_MOCK = previous;
      }
    }
  });

  it("maps safe Codex options to read-only exec args without path-like fields", () => {
    const args = buildCodexExecArgs({
      model: "gpt-5-codex",
      reasoningEffort: "medium",
      sandboxMode: "danger-full-access",
      path: "C:\\Users\\secret\\workspace",
    });

    assert.deepEqual(args, [
      "exec",
      "-",
      "--json",
      "--sandbox",
      "read-only",
      "--skip-git-repo-check",
      "--model",
      "gpt-5-codex",
      "-c",
      'model_reasoning_effort="medium"',
    ]);
    assert.equal(args.includes("danger-full-access"), false);
    assert.equal(args.some((arg) => /Users\\secret/.test(arg)), false);
  });

  it("does not echo path-like unknown request types", async () => {
    const response = await handleRequest({
      type: "C:\\Users\\secret\\prompt.txt",
      requestId: "unknown",
    });

    assert.equal(response.ok, false);
    assert.equal(response.error.message, "Unsupported native bridge request type.");
    assert.equal(JSON.stringify(response).includes("Users\\secret"), false);
  });

  it("returns a bounded metadata-only usage summary without session names or paths", async () => {
    const previousCodexHome = process.env.CODEX_HOME;
    const codexHome = await mkdtemp(path.join(os.tmpdir(), "architect-codex-home-"));
    process.env.CODEX_HOME = codexHome;

    try {
      const sessionDir = path.join(codexHome, "sessions", "2026", "06", "05");
      await mkdir(sessionDir, { recursive: true });
      await writeFile(
        path.join(sessionDir, "rollout-secret-name.jsonl"),
        [
          '{"prompt":"do not read"}',
          '{"type":"usage","usage":{"input_tokens":11,"output_tokens":7,"total_tokens":18}}',
        ].join("\n"),
      );
      await writeFile(path.join(sessionDir, "notes.txt"), "ignored");

      const response = await handleRequest({
        type: "usageSummary",
        requestId: "usage",
        codexOptions: {
          model: "gpt-5-codex",
          configPath: path.join(codexHome, "config.toml"),
        },
      });

      assert.equal(response.ok, true);
      assert.equal(response.usageSummary.bridgeSchemaVersion, 2);
      assert.equal(response.usageSummary.metadataOnly, true);
      assert.equal(response.usageSummary.rangeDays, 30);
      assert.equal(response.usageSummary.sessionFileCount, 1);
      assert.equal(response.usageSummary.uncertain.totalTokens, 18);
      assert.equal(response.usageSummary.direct.totalTokens, 0);
      assert.equal(response.usageSummary.buckets.length, 1);
      assert.equal(response.usageSummary.totalSessionBytes > 0, true);
      assert.equal(response.usageSummary.codexOptions.model, "gpt-5-codex");
      const serialized = JSON.stringify(response.usageSummary);
      assert.equal(serialized.includes("rollout-secret-name"), false);
      assert.equal(serialized.includes(codexHome), false);
      assert.equal(serialized.includes("prompt"), false);
      assert.equal(serialized.includes("configPath"), false);
    } finally {
      if (previousCodexHome === undefined) {
        delete process.env.CODEX_HOME;
      } else {
        process.env.CODEX_HOME = previousCodexHome;
      }
      await rm(codexHome, { recursive: true, force: true });
    }
  });

  it("marks usage summary partial at the max-file scan limit without leaking private session data", async () => {
    const previousCodexHome = process.env.CODEX_HOME;
    const codexHome = await mkdtemp(path.join(os.tmpdir(), "architect-codex-home-"));
    process.env.CODEX_HOME = codexHome;

    try {
      const sessionDir = path.join(codexHome, "sessions", "private-user", "secret-project");
      await mkdir(sessionDir, { recursive: true });
      await Promise.all(
        Array.from({ length: 201 }, (_, index) =>
          writeFile(
            path.join(sessionDir, `secret-session-${String(index).padStart(3, "0")}.jsonl`),
            [
              '{"prompt":"private prompt","answer":"private answer","transcript":"private transcript"}',
              '{"rawLog":"stderr raw log","env":{"OPENAI_API_KEY":"secret"}}',
              '{"usage":{"input_tokens":1,"output_tokens":1,"total_tokens":2}}',
            ].join("\n"),
          ),
        ),
      );

      const response = await handleRequest({
        type: "usageSummary",
        requestId: "usage-max-files",
        codexOptions: {
          model: "gpt-5-codex",
          configPath: path.join(codexHome, "config.toml"),
        },
      });

      assert.equal(response.ok, true);
      assert.equal(response.usageSummary.status, "partial");
      assert.equal(response.usageSummary.scanLimit.limited, true);
      assert.equal(response.usageSummary.sessionFileCount, 200);
      assert.equal(
        response.usageSummary.warnings.some((warning) => warning.code === "file_count_limit"),
        true,
      );

      const serialized = JSON.stringify(response.usageSummary);
      assert.equal(serialized.includes("secret-session"), false);
      assert.equal(serialized.includes("private-user"), false);
      assert.equal(serialized.includes("secret-project"), false);
      assert.equal(serialized.includes(codexHome), false);
      assert.equal(serialized.includes(os.userInfo().username), false);
      assert.equal(serialized.includes("private prompt"), false);
      assert.equal(serialized.includes("private answer"), false);
      assert.equal(serialized.includes("private transcript"), false);
      assert.equal(serialized.includes("stderr raw log"), false);
      assert.equal(serialized.includes("OPENAI_API_KEY"), false);
      assert.equal(serialized.includes("configPath"), false);
    } finally {
      if (previousCodexHome === undefined) {
        delete process.env.CODEX_HOME;
      } else {
        process.env.CODEX_HOME = previousCodexHome;
      }
      await rm(codexHome, { recursive: true, force: true });
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
