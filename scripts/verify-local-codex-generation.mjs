#!/usr/bin/env node
import process from "node:process";

import { handleRequest } from "../native-host/codex-bridge-host.mjs";

const options = parseArgs(process.argv.slice(2));
const previousMock = process.env.ARCHITECT_CODEX_BRIDGE_MOCK;
const previousTimeout = process.env.ARCHITECT_CODEX_BRIDGE_TIMEOUT_MS;

if (options.mock) {
  process.env.ARCHITECT_CODEX_BRIDGE_MOCK = "1";
} else {
  if (!options.allowExternal) {
    throw new Error(
      "Real Codex generation sends the verification prompt through Codex CLI. Re-run with --allow-external only after explicit approval.",
    );
  }
  delete process.env.ARCHITECT_CODEX_BRIDGE_MOCK;
}

if (options.timeoutMs) {
  process.env.ARCHITECT_CODEX_BRIDGE_TIMEOUT_MS = String(options.timeoutMs);
}

try {
  const startedAt = Date.now();
  const response = await handleRequest({
    type: "generate",
    requestId: options.mock ? "verify-generation-mock" : "verify-generation-real",
    payload: buildVerificationInput(),
  });
  const elapsedMs = Date.now() - startedAt;
  const report = buildReport(response, elapsedMs);

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report);
  }

  process.exitCode = options.strict && !report.ok ? 1 : 0;
} finally {
  restoreEnv("ARCHITECT_CODEX_BRIDGE_MOCK", previousMock);
  restoreEnv("ARCHITECT_CODEX_BRIDGE_TIMEOUT_MS", previousTimeout);
}

function buildVerificationInput() {
  return {
    question:
      "Review whether the current evidence is enough before closing this task. Summarize missing evidence and next action.",
    taskContext: {
      taskId: "verify-local-codex-generation",
      projectId: "architect-browser-assistant",
      title: "Local Codex real generation verification",
      description: "Verify that the native host can produce a grounded architecture task review through Codex.",
      status: "in_review",
      issueId: "VERIFY-CODEX-001",
      projectName: "Architect Browser Assistant",
    },
    evidence: [
      {
        id: "installed-path-verifier",
        kind: "task",
        priority: 1,
        title: "Installed path verifier",
        excerpt:
          "Extension manifest, HKCU native host registry, launcher, mock native host status, and Codex CLI status passed before this generation check.",
      },
      {
        id: "product-rule",
        kind: "central_knowledge",
        priority: 2,
        title: "Architect assistant rule",
        excerpt:
          "Generated answers must distinguish conclusion, evidence, uncertainty, and follow-up action. They are not final legal or permit determinations.",
      },
    ],
  };
}

function buildReport(response, elapsedMs) {
  if (!response.ok) {
    return {
      ok: false,
      mode: options.mock ? "mock" : "real",
      elapsedMs,
      error: response.error?.message ?? "Local Codex generation failed.",
    };
  }

  return {
    ok: true,
    mode: options.mock ? "mock" : "real",
    elapsedMs,
    answerPreview: trimPreview(response.output?.answer),
    draftSummary: response.output?.draftSummary ?? null,
  };
}

function printReport(report) {
  console.log(`Local Codex generation verification (${report.mode})`);
  console.log(`Result: ${report.ok ? "pass" : "fail"}`);
  console.log(`Elapsed: ${report.elapsedMs}ms`);
  if (report.ok) {
    console.log(`Answer preview: ${report.answerPreview}`);
    if (report.draftSummary) {
      console.log(`Conclusion: ${report.draftSummary.conclusion}`);
      console.log(`Scope: ${report.draftSummary.scope}`);
    }
  } else {
    console.log(`Error: ${report.error}`);
  }
}

function trimPreview(value) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text.length > 700 ? `${text.slice(0, 700)}...` : text;
}

function restoreEnv(name, previousValue) {
  if (previousValue === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = previousValue;
  }
}

function parseArgs(args) {
  const parsed = {
    allowExternal: false,
    json: false,
    mock: false,
    strict: false,
    timeoutMs: 180000,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--allow-external") {
      parsed.allowExternal = true;
      continue;
    }
    if (arg === "--json") {
      parsed.json = true;
      continue;
    }
    if (arg === "--mock") {
      parsed.mock = true;
      continue;
    }
    if (arg === "--strict") {
      parsed.strict = true;
      continue;
    }
    if (arg === "--timeout-ms") {
      parsed.timeoutMs = Number(args[index + 1]);
      index += 1;
      continue;
    }
  }

  if (!Number.isFinite(parsed.timeoutMs) || parsed.timeoutMs <= 0) {
    throw new Error("--timeout-ms must be a positive number.");
  }

  return parsed;
}
