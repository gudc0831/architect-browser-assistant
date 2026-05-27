#!/usr/bin/env node
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const EXTENSION_ID_PATTERN = /^[a-p]{32}$/;
const HOST_NAME = "com.architect.browser_assistant.codex_bridge";
const UNSIGNED_NATIVE_HOST_WAIVER_VALUE = "ALLOW_UNSIGNED_NATIVE_HOST_WITHOUT_CODE_SIGNING_CERT";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const options = parseArgs(process.argv.slice(2));
const checks = [];

try {
  await verifyReleaseReadiness();
  const summary = summarize(checks);
  const report = {
    ok: summary.fail === 0,
    mode: options.production ? "production" : "local",
    summary,
    warningSummary: summarizeWarnings(checks),
    checks,
  };
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report);
  }
  process.exitCode = options.strict && summary.fail > 0 ? 1 : 0;
} catch (error) {
  const message = error instanceof Error ? error.message : "Release readiness verification failed.";
  if (options.json) {
    console.log(JSON.stringify({ ok: false, error: message, checks }, null, 2));
  } else {
    console.error(`FAIL release readiness: ${message}`);
  }
  process.exitCode = 1;
}

async function verifyReleaseReadiness() {
  const packageJson = await readJson(path.join(repoRoot, "package.json"));
  verifyPackageScripts(packageJson);
  await verifyDistManifest();
  await verifyNativeHostFiles();
  verifyProductionSigningMetadata();
}

function verifyPackageScripts(packageJson) {
  const scripts = packageJson?.scripts ?? {};
  const releaseCheck = String(scripts["release:check"] ?? "");
  addCheck(
    "release-check-script",
    "Release check includes readiness gate",
    releaseCheck.includes("release:readiness") ? "pass" : "fail",
    releaseCheck.includes("release:readiness")
      ? "`npm run release:check` executes the release readiness validator."
      : "`npm run release:check` must include `npm run release:readiness -- --strict`.",
  );

  addCheck(
    "production-readiness-script",
    "Production readiness script",
    typeof scripts["release:readiness:production"] === "string" ? "pass" : "fail",
    typeof scripts["release:readiness:production"] === "string"
      ? "`npm run release:readiness:production` is available for signed production promotion."
      : "Add a production-specific readiness script that enforces production origin and signing metadata.",
  );

  addCheck(
    "production-build-script",
    "Production build script",
    typeof scripts["release:build:production"] === "string" ? "pass" : "fail",
    typeof scripts["release:build:production"] === "string"
      ? "`npm run release:build:production` builds and validates the production package."
      : "Add a production package build command that runs build plus production readiness.",
  );

  addCheck(
    "native-host-production-install-verifier",
    "Native host production install verifier",
    typeof scripts["native-host:verify-production-install"] === "string" ? "pass" : "fail",
    typeof scripts["native-host:verify-production-install"] === "string"
      ? "Production native-host install verification command is available."
      : "Add a production native-host install verifier command.",
  );
}

async function verifyDistManifest() {
  const manifestPath = path.join(repoRoot, "dist", "manifest.json");
  if (!existsSync(manifestPath)) {
    addCheck("dist-manifest", "Built extension manifest", "fail", "dist/manifest.json is missing; run `npm run build` first.");
    return;
  }

  const manifest = await readJson(manifestPath);
  addCheck(
    "manifest-version",
    "MV3 manifest",
    manifest.manifest_version === 3 ? "pass" : "fail",
    manifest.manifest_version === 3 ? "manifest_version is 3." : "Extension must build as Manifest V3.",
  );
  addCheck(
    "manifest-identity",
    "Manifest identity",
    typeof manifest.name === "string" && typeof manifest.version === "string" && /^\d+\.\d+\.\d+/.test(manifest.version)
      ? "pass"
      : "fail",
    `Built manifest identity: ${manifest.name ?? "<missing>"} ${manifest.version ?? "<missing>"}.`,
  );

  const permissions = Array.isArray(manifest.permissions) ? manifest.permissions : [];
  const requiredPermissions = ["sidePanel", "storage", "activeTab", "nativeMessaging"];
  const missingPermissions = requiredPermissions.filter((permission) => !permissions.includes(permission));
  const broadPermissions = permissions.filter((permission) => ["tabs", "scripting", "webRequest", "debugger"].includes(permission));
  addCheck(
    "manifest-permissions",
    "Manifest permissions",
    missingPermissions.length === 0 && broadPermissions.length === 0 ? "pass" : "fail",
    missingPermissions.length === 0 && broadPermissions.length === 0
      ? `Permissions are scoped to ${permissions.join(", ")}.`
      : `Missing required permissions: ${missingPermissions.join(", ") || "none"}; broad permissions present: ${broadPermissions.join(", ") || "none"}.`,
  );

  const hostPermissions = Array.isArray(manifest.host_permissions) ? manifest.host_permissions : [];
  const contentScriptMatches = Array.isArray(manifest.content_scripts)
    ? manifest.content_scripts.flatMap((script) => (Array.isArray(script.matches) ? script.matches : []))
    : [];
  verifyUrlPatterns("host-permissions", "Host permissions", hostPermissions);
  verifyUrlPatterns("content-script-matches", "Content script matches", contentScriptMatches);
  addCheck(
    "host-content-match",
    "Host/content-script origin alignment",
    sameSet(hostPermissions, contentScriptMatches) ? "pass" : "fail",
    sameSet(hostPermissions, contentScriptMatches)
      ? "host_permissions and content_scripts.matches use the same SaaS origin pattern."
      : `host_permissions (${hostPermissions.join(", ")}) and matches (${contentScriptMatches.join(", ")}) differ.`,
  );

  addCheck(
    "manifest-entrypoints",
    "Manifest entrypoints",
    manifest.background?.service_worker && manifest.side_panel?.default_path ? "pass" : "fail",
    manifest.background?.service_worker && manifest.side_panel?.default_path
      ? `Background ${manifest.background.service_worker}; side panel ${manifest.side_panel.default_path}.`
      : "Manifest must include background service worker and side panel entrypoint.",
  );
}

function verifyUrlPatterns(id, label, patterns) {
  if (patterns.length === 0) {
    addCheck(id, label, "fail", "No URL patterns were found.");
    return;
  }

  const invalid = patterns.filter((pattern) => !isExactHttpOriginPattern(pattern));
  const local = patterns.filter((pattern) => isLocalOriginPattern(pattern));
  let status = invalid.length === 0 ? "pass" : "fail";
  let detail =
    invalid.length === 0
      ? `Patterns are exact HTTP(S) origins: ${patterns.join(", ")}.`
      : `Invalid or overly broad patterns: ${invalid.join(", ")}.`;

  if (options.production && local.length > 0) {
    status = "fail";
    detail = `Production readiness cannot use local origin patterns: ${local.join(", ")}.`;
  } else if (!options.production && local.length > 0 && status === "pass") {
    status = "warn";
    detail = `Local development origin is in use: ${local.join(", ")}. Run production readiness with ARCHITECT_SAAS_ORIGIN set before publishing.`;
  }

  addCheck(id, label, status, detail, {
    scope: local.length > 0 && !options.production ? "local-dev" : "production-promotion",
    resolution:
      local.length > 0
        ? "Set ARCHITECT_SAAS_ORIGIN to the production SaaS origin and rebuild before production readiness."
        : "Keep URL patterns limited to one exact SaaS HTTP(S) origin.",
  });
}

async function verifyNativeHostFiles() {
  const hostScriptPath = path.join(repoRoot, "native-host", "codex-bridge-host.mjs");
  const launcherPath = path.join(repoRoot, "native-host", "architect-codex-bridge.cmd");
  const templatePath = path.join(repoRoot, "native-host", "native-host-manifest.template.json");
  const manifestPath = path.join(repoRoot, "native-host", `${HOST_NAME}.json`);
  const installerPath = path.join(repoRoot, "scripts", "install-native-host-windows.ps1");

  addCheck(
    "native-host-files",
    "Native host files",
    [hostScriptPath, templatePath, installerPath].every((filePath) => existsSync(filePath)) ? "pass" : "fail",
    "Native host script, manifest template, and Windows installer must be present.",
  );

  addCheck(
    "repo-local-native-host-launcher",
    "Repo-local native host launcher",
    existsSync(launcherPath) ? "pass" : "warn",
    existsSync(launcherPath)
      ? "Repo-local native host launcher is present."
      : "Repo-local launcher is absent. The Windows installer generates an environment-specific launcher for a specific extension id and install root.",
    {
      scope: "local-dev",
      resolution: "Do not commit this generated launcher. Run the native-host installer for a specific extension id/install root when needed.",
    },
  );

  if (existsSync(templatePath)) {
    const template = await readJson(templatePath);
    const templateOk =
      template.name === HOST_NAME &&
      template.type === "stdio" &&
      template.path === "__GENERATED_LAUNCHER_PATH__" &&
      Array.isArray(template.allowed_origins) &&
      template.allowed_origins.includes("chrome-extension://__EXTENSION_ID__/");
    addCheck(
      "native-host-template",
      "Native host manifest template",
      templateOk ? "pass" : "fail",
      templateOk
        ? "Template uses generated launcher and extension-id placeholders."
        : "Template must keep generated launcher and extension-id placeholders.",
    );
  }

  if (existsSync(installerPath)) {
    const installer = await readFile(installerPath, "utf8");
    const installerOk =
      installer.includes("^[a-p]{32}$") &&
      installer.includes("NativeMessagingHosts") &&
      installer.includes("ARCHITECT_CODEX_CLI_PATH") &&
      installer.includes("InstallRoot");
    addCheck(
      "native-host-installer",
      "Native host installer guardrails",
      installerOk ? "pass" : "fail",
      installerOk
        ? "Installer validates Chrome extension id, writes HKCU native host registration, pins Codex CLI path, and supports stable install roots."
        : "Installer must validate extension id, register HKCU native host, pin Codex CLI path, and support a production install root.",
    );
  }

  if (!existsSync(manifestPath)) {
    addCheck(
      "generated-native-host-manifest",
      "Generated native host manifest",
      "warn",
      "Generated native host manifest is absent. It is created by the Windows installer for a specific extension id.",
      {
        scope: "local-dev",
        resolution: "Do not commit this generated manifest. Run native-host install/verify steps after the extension id is known.",
      },
    );
    return;
  }

  const manifest = await readJson(manifestPath);
  const allowedOrigins = Array.isArray(manifest.allowed_origins) ? manifest.allowed_origins : [];
  const expectedExtensionId = options.extensionId || process.env.ARCHITECT_CHROME_EXTENSION_ID || null;
  const hasValidOrigin = allowedOrigins.some((origin) => /^chrome-extension:\/\/[a-p]{32}\/$/.test(origin));
  const hasExpectedOrigin = expectedExtensionId ? allowedOrigins.includes(`chrome-extension://${expectedExtensionId}/`) : true;
  addCheck(
    "generated-native-host-manifest",
    "Generated native host manifest",
    manifest.name === HOST_NAME && manifest.type === "stdio" && hasValidOrigin && hasExpectedOrigin ? "pass" : "fail",
    hasExpectedOrigin
      ? `Generated manifest allows ${allowedOrigins.join(", ")}.`
      : `Generated manifest does not include expected extension id ${expectedExtensionId}.`,
  );
}

function verifyProductionSigningMetadata() {
  const extensionId = options.extensionId || process.env.ARCHITECT_CHROME_EXTENSION_ID || "";
  const signingSubject = process.env.ARCHITECT_NATIVE_HOST_SIGNING_SUBJECT || "";
  const releaseOwner = process.env.ARCHITECT_RELEASE_OWNER || "";
  const webStorePublisher = process.env.ARCHITECT_CHROME_WEB_STORE_PUBLISHER || "";
  const nativeHostInstallRoot = process.env.ARCHITECT_NATIVE_HOST_INSTALL_ROOT || "";
  const hasSigningSubject = Boolean(signingSubject.trim());
  const hasUnsignedNativeHostWaiver =
    options.allowUnsignedNativeHost ||
    process.env.ARCHITECT_NATIVE_HOST_SIGNING_WAIVER === UNSIGNED_NATIVE_HOST_WAIVER_VALUE;
  const missing = [];

  if (!EXTENSION_ID_PATTERN.test(extensionId)) {
    missing.push("ARCHITECT_CHROME_EXTENSION_ID or --extension-id");
  }
  if (!hasSigningSubject && !hasUnsignedNativeHostWaiver) {
    missing.push("ARCHITECT_NATIVE_HOST_SIGNING_SUBJECT");
  }
  if (!releaseOwner.trim()) {
    missing.push("ARCHITECT_RELEASE_OWNER");
  }
  if (!webStorePublisher.trim()) {
    missing.push("ARCHITECT_CHROME_WEB_STORE_PUBLISHER");
  }
  if (!nativeHostInstallRoot.trim()) {
    missing.push("ARCHITECT_NATIVE_HOST_INSTALL_ROOT");
  }

  const signingMetadataStatus =
    missing.length > 0 ? (options.production ? "fail" : "warn") : hasSigningSubject ? "pass" : "warn";
  const signingMetadataDetail =
    missing.length > 0
      ? `Missing production signing metadata: ${missing.join(", ")}.`
      : hasSigningSubject
        ? "Production extension id, native-host signing subject, release owner, Web Store publisher, and install root are configured."
        : "Production extension id, release owner, Web Store publisher, and install root are configured; native-host code signing is explicitly waived for this unsigned interim path.";

  addCheck("production-signing-metadata", "Production signing metadata", signingMetadataStatus, signingMetadataDetail, {
    scope: "production-promotion",
    resolution:
      missing.length > 0
        ? "Set production metadata env vars, pass --extension-id, and provide either a signing subject or an explicit unsigned-native-host waiver."
        : hasSigningSubject
          ? "Keep production metadata configured for signed promotion."
          : "Replace the unsigned waiver with a real code-signing subject before signed native-host release.",
  });

  addCheck(
    "web-store-upload-boundary",
    "Chrome Web Store upload boundary",
    options.production && webStorePublisher.trim() ? "pass" : "warn",
    options.production && webStorePublisher.trim()
      ? "Web Store publisher metadata is present; this validator still does not upload packages."
      : "Chrome Web Store upload is intentionally outside this validator; configure publisher metadata before promotion.",
    {
      scope: options.production && webStorePublisher.trim() ? "manual-release" : "production-promotion",
      resolution: "Perform Chrome Web Store upload outside this validator after metadata and package checks pass.",
    },
  );
}

async function readJson(filePath) {
  const text = await readFile(filePath, "utf8");
  return JSON.parse(text.replace(/^\uFEFF/, ""));
}

function isExactHttpOriginPattern(pattern) {
  if (pattern === "<all_urls>" || pattern.includes("*://") || pattern.includes("/*/")) {
    return false;
  }
  return /^https?:\/\/[^/*]+\/\*$/.test(pattern);
}

function isLocalOriginPattern(pattern) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\/\*$/.test(pattern);
}

function sameSet(left, right) {
  return left.length === right.length && left.every((item) => right.includes(item));
}

function addCheck(id, label, status, detail, metadata = {}) {
  checks.push({ id, label, status, detail, ...metadata });
}

function summarize(items) {
  return {
    pass: items.filter((item) => item.status === "pass").length,
    warn: items.filter((item) => item.status === "warn").length,
    fail: items.filter((item) => item.status === "fail").length,
  };
}

function summarizeWarnings(items) {
  return items
    .filter((item) => item.status === "warn")
    .reduce((summary, item) => {
      const scope = item.scope || "unspecified";
      summary[scope] = (summary[scope] ?? 0) + 1;
      return summary;
    }, {});
}

function printReport(report) {
  console.log(`Architect Browser Assistant release readiness (${report.mode})`);
  for (const item of report.checks) {
    const scope = item.scope ? ` / ${item.scope}` : "";
    console.log(`[${item.status.toUpperCase()}${scope}] ${item.label}: ${item.detail}`);
    if (item.status !== "pass" && item.resolution) {
      console.log(`  Resolution: ${item.resolution}`);
    }
  }
  console.log(`Summary: ${report.summary.pass} pass, ${report.summary.warn} warn, ${report.summary.fail} fail`);
}

function parseArgs(args) {
  const parsed = {
    extensionId: "",
    allowUnsignedNativeHost: false,
    json: false,
    production: false,
    strict: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--extension-id") {
      parsed.extensionId = args[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (arg === "--json") {
      parsed.json = true;
      continue;
    }
    if (arg === "--allow-unsigned-native-host") {
      parsed.allowUnsignedNativeHost = true;
      continue;
    }
    if (arg === "--production") {
      parsed.production = true;
      continue;
    }
    if (arg === "--strict") {
      parsed.strict = true;
      continue;
    }
  }

  if (parsed.extensionId && !EXTENSION_ID_PATTERN.test(parsed.extensionId)) {
    throw new Error("--extension-id must be the 32-character Chrome extension id.");
  }

  return parsed;
}
