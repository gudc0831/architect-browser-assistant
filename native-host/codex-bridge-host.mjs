#!/usr/bin/env node
import { spawn } from "node:child_process";
import process from "node:process";
import { pathToFileURL } from "node:url";

const CAPABILITIES = ["codex-exec", "grounded-answer", "draft-work-summary", "read-only-sandbox"];
const MAX_HOST_RESPONSE_BYTES = 1024 * 1024;
const DEFAULT_CODEX_TIMEOUT_MS = 120_000;
const isLittleEndian = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;

async function main() {
  if (process.argv.includes("--self-test")) {
    process.env.ARCHITECT_CODEX_BRIDGE_MOCK = "1";
    const response = await handleRequest({
      type: "generate",
      requestId: "self-test",
      payload: {
        question: "Check the task and suggest the next architecture review action.",
        taskContext: {
          taskId: "task-self-test",
          projectId: "project-self-test",
          title: "Facade detail review",
          description: "Confirm whether current evidence is enough before issue closure.",
          status: "in_review",
          issueId: "ARCH-SELF-TEST",
          projectName: "Architect Browser Assistant",
        },
        evidence: [
          {
            id: "evidence-self-test",
            kind: "task",
            priority: 1,
            title: "Current task",
            excerpt: "The task is waiting for source confirmation before closure.",
          },
        ],
      },
    });
    console.log(JSON.stringify(response, null, 2));
    process.exit(response.ok ? 0 : 1);
  }

  try {
    const request = await readNativeMessage();
    const response = await handleRequest(request);
    writeNativeMessage(response);
  } catch (error) {
    writeNativeMessage(errorResponse("host_error", error instanceof Error ? error.message : "Native host failed"));
  }
}

export async function handleRequest(request) {
  if (!request || typeof request !== "object") {
    return errorResponse("invalid_request", "Native bridge request must be an object.");
  }

  if (request.type === "status") {
    if (process.env.ARCHITECT_CODEX_BRIDGE_MOCK === "1") {
      return {
        ok: true,
        requestId: request.requestId,
        status: {
          available: true,
          mode: "local-chatgpt-codex",
          reason: "Native host mock mode is enabled.",
        },
      };
    }

    const status = await checkCodexCli();
    return {
      ok: true,
      requestId: request.requestId,
      status: {
        available: status.available,
        mode: "local-chatgpt-codex",
        reason: status.reason,
      },
    };
  }

  if (request.type === "capabilities") {
    return {
      ok: true,
      requestId: request.requestId,
      capabilities: CAPABILITIES,
    };
  }

  if (request.type === "generate") {
    if (!request.payload?.question || !request.payload?.taskContext?.taskId) {
      return errorResponse("invalid_generate_request", "Question and task context are required.", request.requestId);
    }

    if (process.env.ARCHITECT_CODEX_BRIDGE_MOCK === "1") {
      return {
        ok: true,
        requestId: request.requestId,
        output: buildMockOutput(request.payload),
      };
    }

    const output = await runCodexExec(request.payload);
    return {
      ok: true,
      requestId: request.requestId,
      output,
    };
  }

  return errorResponse("unknown_request_type", `Unsupported native bridge request: ${String(request.type)}`, request.requestId);
}

export async function readNativeMessage(input = process.stdin) {
  const buffer = await readNativeMessageBuffer(input);
  if (buffer.length < 4) {
    throw new Error("Native message header is missing.");
  }

  const length = isLittleEndian ? buffer.readUInt32LE(0) : buffer.readUInt32BE(0);
  if (length > MAX_HOST_RESPONSE_BYTES) {
    throw new Error("Native message body exceeded the 1 MB host limit.");
  }

  const body = buffer.subarray(4, 4 + length);
  if (body.length !== length) {
    throw new Error("Native message body length does not match the header.");
  }

  return JSON.parse(body.toString("utf8"));
}

function readNativeMessageBuffer(input) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalLength = 0;
    let expectedLength = null;
    let settled = false;

    function finish(error, buffer) {
      if (settled) {
        return;
      }

      settled = true;
      input.off("data", handleData);
      input.off("end", handleEnd);
      input.off("error", handleError);

      if (error) {
        reject(error);
        return;
      }

      resolve(buffer);
    }

    function handleData(chunk) {
      chunks.push(Buffer.from(chunk));
      totalLength += chunk.length;

      const buffer = Buffer.concat(chunks, totalLength);
      if (expectedLength === null && totalLength >= 4) {
        const bodyLength = isLittleEndian ? buffer.readUInt32LE(0) : buffer.readUInt32BE(0);
        if (bodyLength > MAX_HOST_RESPONSE_BYTES) {
          finish(new Error("Native message body exceeded the 1 MB host limit."));
          return;
        }

        expectedLength = 4 + bodyLength;
      }

      if (expectedLength !== null && totalLength >= expectedLength) {
        input.pause?.();
        finish(null, buffer.subarray(0, expectedLength));
      }
    }

    function handleEnd() {
      finish(new Error("Native message body length does not match the header."));
    }

    function handleError(error) {
      finish(error);
    }

    input.on("data", handleData);
    input.on("end", handleEnd);
    input.on("error", handleError);
    input.resume?.();
  });
}

function writeNativeMessage(payload) {
  const body = Buffer.from(JSON.stringify(payload), "utf8");
  if (body.length > MAX_HOST_RESPONSE_BYTES) {
    writeNativeMessage(errorResponse("response_too_large", "Native bridge response exceeded Chrome's 1 MB host limit."));
    return;
  }

  const header = Buffer.alloc(4);
  if (isLittleEndian) {
    header.writeUInt32LE(body.length, 0);
  } else {
    header.writeUInt32BE(body.length, 0);
  }

  process.stdout.write(Buffer.concat([header, body]));
}

async function checkCodexCli() {
  try {
    await spawnAndCollect(getCodexCommand(), ["exec", "--help"], "", 5_000);
    return {
      available: true,
      reason: "Codex CLI responded to `codex exec --help`.",
    };
  } catch (error) {
    return {
      available: false,
      reason:
        error instanceof Error
          ? `Codex CLI is unavailable: ${error.message}`
          : "Codex CLI is unavailable.",
    };
  }
}

async function runCodexExec(input) {
  const prompt = buildCodexPrompt(input);
  const args = ["exec", "-", "--json", "--sandbox", "read-only", "--skip-git-repo-check"];
  const result = await spawnAndCollect(getCodexCommand(), args, prompt, getCodexTimeoutMs());
  const finalText = parseCodexJsonlOutput(result.stdout);
  return parseAssistantOutput(finalText, input);
}

function getCodexCommand() {
  return process.env.ARCHITECT_CODEX_CLI_PATH || (process.platform === "win32" ? "codex.exe" : "codex");
}

function getCodexTimeoutMs() {
  const raw = Number(process.env.ARCHITECT_CODEX_BRIDGE_TIMEOUT_MS || "");
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_CODEX_TIMEOUT_MS;
}

function spawnAndCollect(command, args, stdinText, timeoutMs) {
  return new Promise((resolve, reject) => {
    const invocation = buildSpawnInvocation(command, args);
    const child = spawn(invocation.command, invocation.args, {
      cwd: process.env.ARCHITECT_CODEX_WORKDIR || process.cwd(),
      env: process.env,
      shell: false,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    const stdout = [];
    const stderr = [];
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        child.kill();
        reject(new Error(`Command timed out after ${timeoutMs}ms: ${invocation.command} ${invocation.args.join(" ")}`));
      }
    }, timeoutMs);

    child.stdout.on("data", (chunk) => stdout.push(Buffer.from(chunk)));
    child.stderr.on("data", (chunk) => stderr.push(Buffer.from(chunk)));
    child.on("error", (error) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      const out = Buffer.concat(stdout).toString("utf8");
      const err = Buffer.concat(stderr).toString("utf8").trim();
      if (code === 0) {
        resolve({ stdout: out, stderr: err });
        return;
      }

      reject(new Error(err || `Command exited with code ${code}: ${invocation.command} ${invocation.args.join(" ")}`));
    });

    child.stdin.end(stdinText);
  });
}

export function buildSpawnInvocation(command, args, platform = process.platform) {
  if (platform === "win32" && /\.ps1$/i.test(command)) {
    return {
      command: "powershell.exe",
      args: ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", command, ...args],
    };
  }

  return { command, args };
}

export function buildCodexPrompt(input) {
  const task = input.taskContext;
  const evidence = Array.isArray(input.evidence) ? input.evidence : [];
  const evidenceBlock = evidence
    .slice()
    .sort((a, b) => Number(a.priority ?? 99) - Number(b.priority ?? 99))
    .slice(0, 12)
    .map((item, index) => {
      const source = item.sourceUrl ? `\nsourceUrl: ${trimText(item.sourceUrl, 500)}` : "";
      return [
        `[${index + 1}] ${trimText(item.title || "Untitled evidence", 200)}`,
        `kind: ${trimText(item.kind || "unknown", 80)}`,
        `excerpt: ${trimText(item.excerpt || "", 1800)}${source}`,
      ].join("\n");
    })
    .join("\n\n");

  return [
    "You are Architect Browser Assistant, a task-centered assistant for architecture and construction work.",
    "Use only the provided task context and evidence. If evidence is insufficient, say what should be checked next.",
    "Do not present legal or permit conclusions as final determinations.",
    "Answer in Korean if the user's question is Korean; otherwise answer in the user's language.",
    "Return only valid JSON with this exact shape:",
    '{"answer":"string","draftSummary":{"conclusion":"string","tags":["string"],"scope":"string","followUpAction":"string"}}',
    "",
    "Task context:",
    JSON.stringify(
      {
        taskId: task.taskId,
        projectId: task.projectId,
        projectName: task.projectName,
        issueId: task.issueId,
        title: task.title,
        description: task.description,
        status: task.status,
      },
      null,
      2,
    ),
    "",
    "User question:",
    trimText(input.question, 4000),
    "",
    "Evidence:",
    evidenceBlock || "No evidence was provided.",
  ].join("\n");
}

export function parseCodexJsonlOutput(stdoutText) {
  let lastAgentMessage = "";
  for (const line of stdoutText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    try {
      const event = JSON.parse(trimmed);
      if (event.type === "item.completed" && event.item?.type === "agent_message" && typeof event.item.text === "string") {
        lastAgentMessage = event.item.text;
      }
      if (event.type === "turn.failed" && event.error?.message) {
        throw new Error(String(event.error.message));
      }
    } catch {
      if (!lastAgentMessage) {
        lastAgentMessage = trimmed;
      }
    }
  }

  return lastAgentMessage || stdoutText.trim();
}

function parseAssistantOutput(finalText, input) {
  const parsed = tryParseJson(extractJsonObject(finalText));
  if (parsed && typeof parsed.answer === "string") {
    return {
      answer: parsed.answer,
      draftSummary: normalizeDraftSummary(parsed.draftSummary, input),
    };
  }

  return {
    answer: finalText || "Local Codex did not return an answer.",
    draftSummary: {
      conclusion: "Review generated answer and confirm the evidence before task closure.",
      tags: ["assistant", "local-codex"],
      scope: input.taskContext.issueId || input.taskContext.taskId,
      followUpAction: "Confirm whether the cited evidence is enough for this architecture task.",
    },
  };
}

function extractJsonObject(value) {
  const trimmed = String(value || "").trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  return start >= 0 && end > start ? trimmed.slice(start, end + 1) : trimmed;
}

function tryParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeDraftSummary(summary, input) {
  const fallback = buildMockOutput(input).draftSummary;
  if (!summary || typeof summary !== "object") {
    return fallback;
  }

  return {
    conclusion: typeof summary.conclusion === "string" ? summary.conclusion : fallback.conclusion,
    tags: Array.isArray(summary.tags) ? summary.tags.filter((tag) => typeof tag === "string").slice(0, 8) : fallback.tags,
    scope: typeof summary.scope === "string" ? summary.scope : fallback.scope,
    followUpAction:
      typeof summary.followUpAction === "string" ? summary.followUpAction : fallback.followUpAction,
  };
}

function buildMockOutput(input) {
  const primaryEvidence = Array.isArray(input.evidence) ? input.evidence[0] : undefined;
  const title = input.taskContext.title || input.taskContext.taskId;
  return {
    answer: [
      `Local Codex bridge mock response for "${title}".`,
      primaryEvidence
        ? `Primary evidence: ${primaryEvidence.title} - ${primaryEvidence.excerpt}`
        : "No evidence is attached yet. Collect official or project evidence before closing this task.",
      "This is an architecture review assistant note, not a final legal or permit determination.",
    ].join("\n\n"),
    draftSummary: {
      conclusion: primaryEvidence
        ? "Evidence was reviewed and should be confirmed before task closure."
        : "Additional evidence collection is required before task closure.",
      tags: ["assistant", "local-codex"],
      scope: input.taskContext.issueId || input.taskContext.taskId,
      followUpAction: "Confirm official source, project condition, and applicability scope.",
    },
  };
}

function trimText(value, maxLength) {
  const text = String(value ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function errorResponse(code, message, requestId) {
  return {
    ok: false,
    requestId,
    error: {
      code,
      message,
    },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
