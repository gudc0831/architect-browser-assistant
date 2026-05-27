#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";

const EXTENSION_ID_PATTERN = /^[a-p]{32}$/;
const UNSIGNED_NATIVE_HOST_WAIVER_VALUE = "ALLOW_UNSIGNED_NATIVE_HOST_WITHOUT_CODE_SIGNING_CERT";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const repoRoot = path.resolve(scriptDir, "..");

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const packet = await createPromotionPacket({ repoRoot, options, env: process.env });
    if (options.json) {
      console.log(JSON.stringify(packet, null, 2));
    } else {
      printPacket(packet);
    }
    process.exitCode = options.strict && !packet.ok ? 1 : 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Release promotion dry-run failed.";
    console.error(`FAIL release promotion dry-run: ${message}`);
    process.exitCode = 1;
  }
}

export async function createPromotionPacket({ repoRoot: root = repoRoot, options = {}, env = process.env } = {}) {
  const normalizedOptions = {
    allowUnsignedNativeHost: false,
    extensionId: "",
    installRoot: "",
    json: false,
    nativeHostSigningSubject: "",
    releaseOwner: "",
    saasOrigin: "",
    strict: false,
    webStorePublisher: "",
    ...options,
  };
  const metadata = summarizeMetadata(normalizedOptions, env);
  const artifact = await summarizeArtifact(path.join(root, "dist"));
  const readiness = runProductionReadiness({ root, options: normalizedOptions, env, metadata });
  const externalDependencies = buildExternalDependencies(metadata, artifact);
  const blockingExternalDependencies = externalDependencies.filter((dependency) => dependency.blocking);
  const failedChecks = readiness.report?.checks?.filter((check) => check.status === "fail") ?? [];
  const commands = buildCommandSet(metadata);

  return {
    ok: artifact.exists && readiness.ok && blockingExternalDependencies.length === 0,
    mode: "production-promotion-dry-run",
    generatedAt: new Date().toISOString(),
    artifact,
    metadata,
    readiness,
    externalDependencies,
    blockingExternalDependencies,
    failedChecks,
    commands,
    boundary:
      "Dry-run only. This command does not upload to Chrome Web Store, sign binaries, issue certificates, or update native-host registry entries.",
  };
}

export function summarizeMetadata(options = {}, env = process.env) {
  const extensionId = valueFromOptionOrEnv(options.extensionId, env, "ARCHITECT_CHROME_EXTENSION_ID");
  const saasOrigin = valueFromOptionOrEnv(options.saasOrigin, env, "ARCHITECT_SAAS_ORIGIN");
  const nativeHostSigningSubject = valueFromOptionOrEnv(
    options.nativeHostSigningSubject,
    env,
    "ARCHITECT_NATIVE_HOST_SIGNING_SUBJECT",
  );
  const releaseOwner = valueFromOptionOrEnv(options.releaseOwner, env, "ARCHITECT_RELEASE_OWNER");
  const webStorePublisher = valueFromOptionOrEnv(options.webStorePublisher, env, "ARCHITECT_CHROME_WEB_STORE_PUBLISHER");
  const nativeHostInstallRoot = valueFromOptionOrEnv(options.installRoot, env, "ARCHITECT_NATIVE_HOST_INSTALL_ROOT");
  const unsignedNativeHostWaiver =
    Boolean(options.allowUnsignedNativeHost) ||
    String(env.ARCHITECT_NATIVE_HOST_SIGNING_WAIVER ?? "").trim() === UNSIGNED_NATIVE_HOST_WAIVER_VALUE;

  return {
    extensionId: {
      ...extensionId,
      valid: EXTENSION_ID_PATTERN.test(extensionId.value),
    },
    saasOrigin: {
      ...saasOrigin,
      origin: normalizeOrigin(saasOrigin.value),
      valid: Boolean(normalizeOrigin(saasOrigin.value)),
    },
    nativeHostSigningSubject: {
      ...nativeHostSigningSubject,
      configured: Boolean(nativeHostSigningSubject.value),
    },
    releaseOwner: {
      ...releaseOwner,
      configured: Boolean(releaseOwner.value),
    },
    webStorePublisher: {
      ...webStorePublisher,
      configured: Boolean(webStorePublisher.value),
    },
    nativeHostInstallRoot: {
      ...nativeHostInstallRoot,
      configured: Boolean(nativeHostInstallRoot.value),
    },
    unsignedNativeHostWaiver: {
      configured: unsignedNativeHostWaiver,
      source: options.allowUnsignedNativeHost ? "cli" : unsignedNativeHostWaiver ? "env" : "missing",
    },
  };
}

export function buildExternalDependencies(metadata, artifact = {}) {
  const productionOriginConfigured =
    metadata.saasOrigin.valid && artifact.productionOriginReady && artifact.saasOrigin === metadata.saasOrigin.origin;
  const codeSigningStatus = metadata.nativeHostSigningSubject.configured
    ? "configured"
    : metadata.unsignedNativeHostWaiver.configured
      ? "waived"
      : "missing";

  return [
    dependency(
      "production-saas-origin",
      productionOriginConfigured ? "configured" : "missing",
      productionOriginConfigured
        ? `Built manifest targets ${artifact.saasOrigin}.`
        : "Set ARCHITECT_SAAS_ORIGIN to the production SaaS origin, rebuild, and rerun the dry-run.",
    ),
    dependency(
      "chrome-extension-id",
      metadata.extensionId.valid ? "configured" : "missing",
      metadata.extensionId.valid
        ? "Chrome extension id is available for readiness and native-host origin checks."
        : "Pass --extension-id or set ARCHITECT_CHROME_EXTENSION_ID.",
    ),
    dependency(
      "native-host-code-signing",
      codeSigningStatus,
      codeSigningStatus === "configured"
        ? "Native-host signing subject is configured."
        : codeSigningStatus === "waived"
          ? "Unsigned native-host interim path is explicitly waived; replace with a real signing subject before signed release."
          : "Set ARCHITECT_NATIVE_HOST_SIGNING_SUBJECT or explicitly pass --allow-unsigned-native-host for an interim unsigned dry-run.",
    ),
    dependency(
      "release-owner",
      metadata.releaseOwner.configured ? "configured" : "missing",
      metadata.releaseOwner.configured ? "Release owner metadata is configured." : "Set ARCHITECT_RELEASE_OWNER.",
    ),
    dependency(
      "chrome-web-store-publisher",
      metadata.webStorePublisher.configured ? "configured" : "missing",
      metadata.webStorePublisher.configured
        ? "Chrome Web Store publisher metadata is configured."
        : "Set ARCHITECT_CHROME_WEB_STORE_PUBLISHER.",
    ),
    dependency(
      "native-host-install-root",
      metadata.nativeHostInstallRoot.configured ? "configured" : "missing",
      metadata.nativeHostInstallRoot.configured
        ? "Native-host production install-root metadata is configured."
        : "Set ARCHITECT_NATIVE_HOST_INSTALL_ROOT or pass --install-root.",
    ),
    dependency(
      "native-host-production-install",
      "manual-verification-required",
      "Run native-host production install verification after explicit approval for install-root/registry changes.",
      false,
    ),
    dependency(
      "chrome-web-store-upload",
      "manual-approval-required",
      "Upload is intentionally outside this dry-run and requires explicit operator approval.",
      false,
    ),
  ];
}

export function buildCommandSet(metadata) {
  const extensionId = metadata.extensionId.value || "<chrome-extension-id>";
  const saasOrigin = metadata.saasOrigin.origin || "https://your-saas-origin.example";
  const installRoot = metadata.nativeHostInstallRoot.value || "$env:LOCALAPPDATA\\Architect\\BrowserAssistant\\native-host";
  const unsignedWaiverFlag = metadata.unsignedNativeHostWaiver.configured ? " --allow-unsigned-native-host" : "";

  return {
    productionBuild: `$env:ARCHITECT_SAAS_ORIGIN="${saasOrigin}"\nnpm run build`,
    productionReadiness: `npm run release:readiness:production -- --json --strict --extension-id ${extensionId}${unsignedWaiverFlag}`,
    promotionDryRun: `npm run release:promotion:dry-run -- --json --strict --extension-id ${extensionId}${unsignedWaiverFlag}`,
    nativeHostProductionVerify: `npm run native-host:verify-production-install -- --json --extension-id ${extensionId} --install-root "${installRoot}"`,
    webStoreProfileVerify: `npm run extension:verify-chrome-profile -- --json --strict --require-webstore --extension-id ${extensionId}`,
  };
}

async function summarizeArtifact(distDir) {
  const manifestPath = path.join(distDir, "manifest.json");
  if (!existsSync(manifestPath)) {
    return {
      exists: false,
      manifestPath,
      productionOriginReady: false,
      detail: "dist/manifest.json is missing. Run `npm run build` after setting ARCHITECT_SAAS_ORIGIN.",
    };
  }

  const manifest = await readJson(manifestPath);
  const hostPermissions = Array.isArray(manifest.host_permissions) ? manifest.host_permissions : [];
  const contentScriptMatches = Array.isArray(manifest.content_scripts)
    ? manifest.content_scripts.flatMap((script) => (Array.isArray(script.matches) ? script.matches : []))
    : [];
  const allPatterns = [...hostPermissions, ...contentScriptMatches];
  const localPatterns = allPatterns.filter((pattern) => isLocalOriginPattern(pattern));
  const invalidPatterns = allPatterns.filter((pattern) => !isExactHttpOriginPattern(pattern));
  const saasOrigins = [...new Set(allPatterns.map(patternToOrigin).filter(Boolean))];
  const fingerprint = await hashDirectory(distDir);

  return {
    exists: true,
    manifestPath,
    name: manifest.name ?? null,
    version: manifest.version ?? null,
    hostPermissions,
    contentScriptMatches,
    saasOrigin: saasOrigins.length === 1 ? saasOrigins[0] : "",
    productionOriginReady: allPatterns.length > 0 && localPatterns.length === 0 && invalidPatterns.length === 0 && saasOrigins.length === 1,
    localPatterns,
    invalidPatterns,
    fileCount: fingerprint.fileCount,
    totalBytes: fingerprint.totalBytes,
    sha256: fingerprint.sha256,
  };
}

function runProductionReadiness({ root, options, env, metadata }) {
  const readinessEnv = {
    ...env,
    ARCHITECT_SAAS_ORIGIN: metadata.saasOrigin.value || env.ARCHITECT_SAAS_ORIGIN,
    ARCHITECT_RELEASE_OWNER: metadata.releaseOwner.value || env.ARCHITECT_RELEASE_OWNER,
    ARCHITECT_CHROME_WEB_STORE_PUBLISHER:
      metadata.webStorePublisher.value || env.ARCHITECT_CHROME_WEB_STORE_PUBLISHER,
    ARCHITECT_NATIVE_HOST_INSTALL_ROOT:
      metadata.nativeHostInstallRoot.value || env.ARCHITECT_NATIVE_HOST_INSTALL_ROOT,
    ARCHITECT_NATIVE_HOST_SIGNING_SUBJECT:
      metadata.nativeHostSigningSubject.value || env.ARCHITECT_NATIVE_HOST_SIGNING_SUBJECT,
  };
  const args = [path.join(root, "scripts", "verify-release-readiness.mjs"), "--json", "--strict", "--production"];
  if (metadata.extensionId.valid) {
    args.push("--extension-id", metadata.extensionId.value);
  }
  if (options.allowUnsignedNativeHost) {
    args.push("--allow-unsigned-native-host");
  }

  const result = spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    env: readinessEnv,
  });
  const stdout = result.stdout?.trim() ?? "";
  const stderr = result.stderr?.trim() ?? "";
  let report = null;
  let parseError = "";
  if (stdout) {
    try {
      report = JSON.parse(stdout);
    } catch (error) {
      parseError = error instanceof Error ? error.message : "Unable to parse readiness JSON.";
    }
  }

  return {
    ok: Boolean(report?.ok) && result.status === 0,
    exitCode: result.status,
    signal: result.signal,
    report,
    stderr,
    parseError,
  };
}

async function hashDirectory(dir) {
  const files = await listFiles(dir);
  const aggregate = createHash("sha256");
  let totalBytes = 0;
  for (const filePath of files) {
    const bytes = await readFile(filePath);
    const relativePath = path.relative(dir, filePath).replace(/\\/g, "/");
    const fileHash = createHash("sha256").update(bytes).digest("hex");
    totalBytes += bytes.byteLength;
    aggregate.update(`${relativePath}\0${bytes.byteLength}\0${fileHash}\n`);
  }

  return {
    fileCount: files.length,
    totalBytes,
    sha256: aggregate.digest("hex"),
  };
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    } else {
      const fileStat = await stat(fullPath);
      if (fileStat.isFile()) {
        files.push(fullPath);
      }
    }
  }
  return files.sort((left, right) => left.localeCompare(right));
}

async function readJson(filePath) {
  return JSON.parse((await readFile(filePath, "utf8")).replace(/^\uFEFF/, ""));
}

function valueFromOptionOrEnv(optionValue, env, key) {
  const optionText = typeof optionValue === "string" ? optionValue.trim() : "";
  if (optionText) {
    return { value: optionText, source: "cli" };
  }
  const envText = typeof env[key] === "string" ? env[key].trim() : "";
  if (envText) {
    return { value: envText, source: "env" };
  }
  return { value: "", source: "missing" };
}

function dependency(id, status, detail, defaultBlocking = true) {
  return {
    id,
    status,
    detail,
    blocking: defaultBlocking && (status === "missing" || status === "invalid"),
  };
}

function normalizeOrigin(value) {
  if (!value) {
    return "";
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "";
    }
    return url.origin;
  } catch {
    return "";
  }
}

function patternToOrigin(pattern) {
  if (!isExactHttpOriginPattern(pattern)) {
    return "";
  }
  return pattern.slice(0, -2);
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

function printPacket(packet) {
  console.log("Architect Browser Assistant production promotion dry-run");
  console.log(`Result: ${packet.ok ? "ready for manual promotion steps" : "blocked"}`);
  if (packet.artifact.exists) {
    console.log(
      `Artifact: ${packet.artifact.name ?? "<unknown>"} ${packet.artifact.version ?? ""} / ${packet.artifact.fileCount} files / sha256 ${packet.artifact.sha256}`,
    );
    console.log(`SaaS origin: ${packet.artifact.saasOrigin || "<not production-ready>"}`);
  } else {
    console.log(`Artifact: ${packet.artifact.detail}`);
  }

  const summary = packet.readiness.report?.summary;
  if (summary) {
    console.log(`Readiness: ${summary.pass} pass, ${summary.warn} warn, ${summary.fail} fail`);
  } else {
    console.log(`Readiness: unavailable${packet.readiness.parseError ? ` (${packet.readiness.parseError})` : ""}`);
  }

  if (packet.failedChecks.length > 0) {
    console.log("Failed checks:");
    for (const check of packet.failedChecks) {
      console.log(`- ${check.id}: ${check.detail}`);
    }
  }

  console.log("External dependencies:");
  for (const dependency of packet.externalDependencies) {
    console.log(`- ${dependency.id}: ${dependency.status}${dependency.blocking ? " (blocking)" : ""}`);
  }

  console.log("Next commands:");
  for (const [label, command] of Object.entries(packet.commands)) {
    console.log(`${label}:`);
    console.log(command);
  }
  console.log(packet.boundary);
}

function parseArgs(args) {
  const parsed = {
    allowUnsignedNativeHost: false,
    extensionId: "",
    installRoot: "",
    json: false,
    nativeHostSigningSubject: "",
    releaseOwner: "",
    saasOrigin: "",
    strict: false,
    webStorePublisher: "",
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--allow-unsigned-native-host") {
      parsed.allowUnsignedNativeHost = true;
      continue;
    }
    if (arg === "--extension-id") {
      parsed.extensionId = args[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (arg === "--install-root") {
      parsed.installRoot = args[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (arg === "--json") {
      parsed.json = true;
      continue;
    }
    if (arg === "--native-host-signing-subject") {
      parsed.nativeHostSigningSubject = args[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (arg === "--release-owner") {
      parsed.releaseOwner = args[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (arg === "--saas-origin") {
      parsed.saasOrigin = args[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (arg === "--strict") {
      parsed.strict = true;
      continue;
    }
    if (arg === "--web-store-publisher") {
      parsed.webStorePublisher = args[index + 1] ?? "";
      index += 1;
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }

  if (parsed.extensionId && !EXTENSION_ID_PATTERN.test(parsed.extensionId)) {
    throw new Error("--extension-id must be a 32-character Chrome extension id.");
  }
  return parsed;
}
