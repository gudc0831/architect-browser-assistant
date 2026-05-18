#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { handleRequest } from "../native-host/codex-bridge-host.mjs";

const HOST_NAME = "com.architect.browser_assistant.codex_bridge";
const EXTENSION_ID_PATTERN = /^[a-p]{32}$/;

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const options = parseArgs(process.argv.slice(2));
const nativeHostDir = path.join(repoRoot, "native-host");
const runtimeNativeHostDir = options.installRoot ? path.resolve(options.installRoot) : nativeHostDir;
const hostManifestPath = path.join(runtimeNativeHostDir, `${HOST_NAME}.json`);
const launcherPath = path.join(runtimeNativeHostDir, "architect-codex-bridge.cmd");
const distManifestPath = path.join(repoRoot, "dist", "manifest.json");

const checks = [];
let launcherCodexCliPath = "";

try {
  await verify();
  const summary = summarize(checks);
  if (options.json) {
    console.log(JSON.stringify({ ok: summary.fail === 0, summary, checks }, null, 2));
  } else {
    printReport(summary, checks);
  }
  process.exitCode = options.strict && summary.fail > 0 ? 1 : 0;
} catch (error) {
  const message = error instanceof Error ? error.message : "Verifier failed";
  if (options.json) {
    console.log(JSON.stringify({ ok: false, error: message, checks }, null, 2));
  } else {
    console.error(`FAIL verifier: ${message}`);
  }
  process.exitCode = 1;
}

async function verify() {
  addCheck("platform", "Windows profile", process.platform === "win32" ? "pass" : "warn", process.platform === "win32"
    ? "Running on Windows, so HKCU Chrome native messaging registry can be checked."
    : `Running on ${process.platform}; registry checks are skipped.`);

  await verifyDistManifest();
  const hostManifest = await verifyHostManifest();
  await verifyLauncher(hostManifest);
  await verifyRegistry(hostManifest);
  await verifyNativeHostMock();
  if (!options.mockOnly) {
    await verifyCodexCliStatus();
  }
}

async function verifyDistManifest() {
  if (!existsSync(distManifestPath)) {
    addCheck("extension-build", "Extension build", "warn", "dist/manifest.json was not found. Run `npm run build` before Chrome reload.");
    return;
  }

  const manifest = await readJson(distManifestPath);
  const hasNativePermission = Array.isArray(manifest.permissions) && manifest.permissions.includes("nativeMessaging");
  addCheck(
    "extension-build",
    "Extension build",
    hasNativePermission ? "pass" : "fail",
    hasNativePermission
      ? "dist/manifest.json exists and includes nativeMessaging permission."
      : "dist/manifest.json exists but does not include nativeMessaging permission.",
  );
}

async function verifyHostManifest() {
  if (!existsSync(hostManifestPath)) {
    addCheck("host-manifest", "Native host manifest", "fail", `Manifest not found: ${hostManifestPath}`);
    return null;
  }

  const manifest = await readJson(hostManifestPath);
  const allowedOrigins = Array.isArray(manifest.allowed_origins) ? manifest.allowed_origins : [];
  const manifestExtensionId = extractExtensionId(allowedOrigins[0]);
  const expectedExtensionId = options.extensionId ?? manifestExtensionId;
  const extensionMatches =
    expectedExtensionId &&
    EXTENSION_ID_PATTERN.test(expectedExtensionId) &&
    allowedOrigins.includes(`chrome-extension://${expectedExtensionId}/`);

  addCheck(
    "host-manifest",
    "Native host manifest",
    manifest.name === HOST_NAME && manifest.type === "stdio" && extensionMatches ? "pass" : "fail",
    extensionMatches
      ? `Manifest allows chrome-extension://${expectedExtensionId}/.`
      : "Manifest is missing the expected extension id origin. Re-run the installer with `-ExtensionId <id>`.",
    { manifestPath: hostManifestPath, expectedExtensionId, allowedOrigins },
  );

  if (options.productionInstall) {
    const manifestOutsideRepo = !path.resolve(hostManifestPath).startsWith(path.resolve(repoRoot));
    const installRootMatches = options.installRoot
      ? path.resolve(hostManifestPath).startsWith(path.resolve(options.installRoot))
      : true;
    addCheck(
      "production-install-manifest-path",
      "Production native host manifest path",
      manifestOutsideRepo && installRootMatches ? "pass" : "fail",
      manifestOutsideRepo
        ? `Native host manifest is outside the repo checkout: ${hostManifestPath}.`
        : "Production install should register a stable install-root manifest, not the repo-local native-host manifest.",
    );
  }

  if (options.extensionId && manifestExtensionId && options.extensionId !== manifestExtensionId) {
    addCheck(
      "extension-id-match",
      "Extension id match",
      "fail",
      `Provided extension id ${options.extensionId} does not match manifest id ${manifestExtensionId}.`,
    );
  }

  return manifest;
}

async function verifyLauncher(manifest) {
  const manifestLauncherPath = typeof manifest?.path === "string" ? manifest.path : launcherPath;
  const expected = path.resolve(manifestLauncherPath);
  const exists = existsSync(expected);
  addCheck(
    "launcher",
    "Native host launcher",
    exists ? "pass" : "fail",
    exists ? `Launcher exists: ${expected}` : `Launcher is missing: ${expected}`,
  );

  if (!exists) {
    return;
  }

  const launcherText = await readFile(expected, "utf8");
  if (options.productionInstall) {
    const launcherOutsideRepo = !path.resolve(expected).startsWith(path.resolve(repoRoot));
    const installRootMatches = options.installRoot ? path.resolve(expected).startsWith(path.resolve(options.installRoot)) : true;
    addCheck(
      "production-install-launcher-path",
      "Production native host launcher path",
      launcherOutsideRepo && installRootMatches ? "pass" : "fail",
      launcherOutsideRepo
        ? `Native host launcher is outside the repo checkout: ${expected}.`
        : "Production install should use a stable install-root launcher, not the repo-local launcher.",
    );
  }
  const mockEnabled = /\bARCHITECT_CODEX_BRIDGE_MOCK=1\b/.test(launcherText);
  addCheck(
    "launcher-mode",
    "Native host launcher mode",
    options.mockOnly || !mockEnabled ? "pass" : "fail",
    mockEnabled
      ? options.mockOnly
        ? "Launcher is intentionally configured for mock mode."
        : "Launcher is still configured for mock mode; re-run the installer without -Mock for real Local Codex generation."
      : "Launcher is configured for real Local Codex mode.",
  );

  const nodePath = extractQuotedLauncherCommand(launcherText);
  addCheck(
    "launcher-node-path",
    "Native host Node path",
    nodePath && path.isAbsolute(nodePath) && existsSync(nodePath) ? "pass" : "fail",
    nodePath && path.isAbsolute(nodePath) && existsSync(nodePath)
      ? `Launcher uses absolute Node path: ${nodePath}.`
      : "Launcher should use an absolute node.exe path so Chrome can start the native host without relying on PATH.",
  );

  const codexCliPath = extractLauncherEnvValue(launcherText, "ARCHITECT_CODEX_CLI_PATH");
  launcherCodexCliPath = codexCliPath || "";
  const codexCliPathUsesWindowsApps = Boolean(codexCliPath && /\\Program Files\\WindowsApps\\/i.test(codexCliPath));
  addCheck(
    "launcher-codex-path",
    "Native host Codex CLI path",
    options.mockOnly || (codexCliPath && existsSync(codexCliPath) && !codexCliPathUsesWindowsApps) ? "pass" : "fail",
    codexCliPath
      ? codexCliPathUsesWindowsApps
        ? "Launcher points at a WindowsApps packaged executable; use the user Codex bin wrapper instead to avoid spawn EPERM."
        : existsSync(codexCliPath)
        ? `Launcher pins Codex CLI path: ${codexCliPath}.`
        : `Launcher pins Codex CLI path but the file was not found: ${codexCliPath}.`
      : options.mockOnly
        ? "Codex CLI path is not required for mock-only verification."
        : "Launcher should set ARCHITECT_CODEX_CLI_PATH for real generation from Chrome.",
  );

  const selfTest = await runCmdLauncher(expected, ["--self-test"]);
  const selfTestOk = selfTest.code === 0 && isJsonObjectOk(selfTest.stdout);
  addCheck(
    "launcher-self-test",
    "Native host launcher self-test",
    selfTestOk ? "pass" : "fail",
    selfTestOk
      ? "Launcher can start Node and run the native host self-test."
      : selfTest.stderr || selfTest.stdout || "Launcher self-test failed.",
  );
}

async function verifyRegistry(manifest) {
  if (options.skipRegistry) {
    addCheck("registry", "Chrome native host registry", "warn", "Registry check skipped by --skip-registry.");
    return;
  }

  if (process.platform !== "win32") {
    addCheck("registry", "Chrome native host registry", "warn", "Registry check is available only on Windows.");
    return;
  }

  const result = await runProcess("reg.exe", [
    "query",
    `HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${HOST_NAME}`,
    "/ve",
  ]);

  if (result.code !== 0) {
    addCheck("registry", "Chrome native host registry", "fail", result.stderr || "HKCU native host registry key was not found.");
    return;
  }

  const registryPath = parseRegistryDefaultValue(result.stdout);
  const manifestPath = typeof manifest?.path === "string" ? hostManifestPath : hostManifestPath;
  const registryMatches = registryPath && path.resolve(registryPath) === path.resolve(manifestPath);
  addCheck(
    "registry",
    "Chrome native host registry",
    registryMatches ? "pass" : "fail",
    registryMatches
      ? `HKCU registry points to ${registryPath}.`
      : `HKCU registry points to ${registryPath || "<missing>"}, expected ${manifestPath}.`,
  );
}

async function verifyNativeHostMock() {
  const previousMock = process.env.ARCHITECT_CODEX_BRIDGE_MOCK;
  process.env.ARCHITECT_CODEX_BRIDGE_MOCK = "1";
  try {
    const response = await handleRequest({ type: "status", requestId: "verify-mock-status" });
    addCheck(
      "native-host-mock",
      "Native host mock status",
      response.ok && response.status?.available ? "pass" : "fail",
      response.ok ? response.status?.reason ?? "Native host mock status responded." : response.error?.message ?? "Native host mock failed.",
    );
  } finally {
    if (previousMock === undefined) {
      delete process.env.ARCHITECT_CODEX_BRIDGE_MOCK;
    } else {
      process.env.ARCHITECT_CODEX_BRIDGE_MOCK = previousMock;
    }
  }
}

async function verifyCodexCliStatus() {
  const previousMock = process.env.ARCHITECT_CODEX_BRIDGE_MOCK;
  const previousCodexCliPath = process.env.ARCHITECT_CODEX_CLI_PATH;
  delete process.env.ARCHITECT_CODEX_BRIDGE_MOCK;
  if (launcherCodexCliPath) {
    process.env.ARCHITECT_CODEX_CLI_PATH = launcherCodexCliPath;
  }
  try {
    const response = await handleRequest({ type: "status", requestId: "verify-real-status" });
    const available = Boolean(response.ok && response.status?.available);
    addCheck(
      "codex-cli",
      "Codex CLI",
      available ? "pass" : "warn",
      response.ok ? response.status?.reason ?? "Codex CLI status responded." : response.error?.message ?? "Codex CLI status failed.",
    );
  } finally {
    if (previousMock !== undefined) {
      process.env.ARCHITECT_CODEX_BRIDGE_MOCK = previousMock;
    }
    if (previousCodexCliPath === undefined) {
      delete process.env.ARCHITECT_CODEX_CLI_PATH;
    } else {
      process.env.ARCHITECT_CODEX_CLI_PATH = previousCodexCliPath;
    }
  }
}

async function readJson(filePath) {
  const text = await readFile(filePath, "utf8");
  return JSON.parse(text.replace(/^\uFEFF/, ""));
}

function runProcess(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const stdout = [];
    const stderr = [];
    child.stdout.on("data", (chunk) => stdout.push(Buffer.from(chunk)));
    child.stderr.on("data", (chunk) => stderr.push(Buffer.from(chunk)));
    child.on("error", (error) => {
      resolve({ code: 1, stdout: "", stderr: error.message });
    });
    child.on("close", (code) => {
      resolve({
        code: code ?? 1,
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8").trim(),
      });
    });
  });
}

function runCmdLauncher(command, args) {
  return runProcess("cmd.exe", ["/d", "/c", "call", command, ...args]);
}

function parseRegistryDefaultValue(stdout) {
  const line = stdout
    .split(/\r?\n/)
    .map((value) => value.trim())
    .find((value) => /\bREG_SZ\b/i.test(value));
  const match = line?.match(/\bREG_SZ\b\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

function extractExtensionId(origin) {
  const match = String(origin ?? "").match(/^chrome-extension:\/\/([a-p]{32})\/$/);
  return match?.[1] ?? null;
}

function extractQuotedLauncherCommand(launcherText) {
  const match = launcherText.match(/^\s*"([^"]+)"\s+"[^"]*codex-bridge-host\.mjs"/im);
  return match?.[1] ?? null;
}

function extractLauncherEnvValue(launcherText, name) {
  const quotedPattern = new RegExp(`^\\s*set\\s+"${name}=([^"]+)"`, "im");
  const plainPattern = new RegExp(`^\\s*set\\s+${name}=([^\\r\\n]+)`, "im");
  return quotedPattern.exec(launcherText)?.[1]?.trim() ?? plainPattern.exec(launcherText)?.[1]?.trim() ?? null;
}

function isJsonObjectOk(value) {
  try {
    return JSON.parse(value).ok === true;
  } catch {
    return false;
  }
}

function addCheck(id, label, status, detail, meta) {
  checks.push({ id, label, status, detail, ...(meta ? { meta } : {}) });
}

function summarize(items) {
  return {
    pass: items.filter((item) => item.status === "pass").length,
    warn: items.filter((item) => item.status === "warn").length,
    fail: items.filter((item) => item.status === "fail").length,
  };
}

function printReport(summary, items) {
  console.log("Architect Local Codex bridge verification");
  for (const item of items) {
    console.log(`[${item.status.toUpperCase()}] ${item.label}: ${item.detail}`);
  }
  console.log(`Summary: ${summary.pass} pass, ${summary.warn} warn, ${summary.fail} fail`);
  if (summary.fail > 0 && !options.strict) {
    console.log("Use --strict to return a non-zero exit code when fail checks are present.");
  }
}

function parseArgs(args) {
  const parsed = {
    extensionId: null,
    json: false,
    strict: false,
    skipRegistry: false,
    mockOnly: false,
    productionInstall: false,
    installRoot: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--extension-id") {
      parsed.extensionId = args[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (arg === "--json") {
      parsed.json = true;
      continue;
    }
    if (arg === "--strict") {
      parsed.strict = true;
      continue;
    }
    if (arg === "--skip-registry") {
      parsed.skipRegistry = true;
      continue;
    }
    if (arg === "--mock-only") {
      parsed.mockOnly = true;
      continue;
    }
    if (arg === "--production-install") {
      parsed.productionInstall = true;
      continue;
    }
    if (arg === "--install-root") {
      parsed.installRoot = args[index + 1] ?? null;
      index += 1;
      continue;
    }
  }

  if (parsed.extensionId && !EXTENSION_ID_PATTERN.test(parsed.extensionId)) {
    throw new Error("--extension-id must be the 32-character Chrome extension id from chrome://extensions.");
  }

  return parsed;
}
