#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const FIXED_DOS_TIME = 0;
const FIXED_DOS_DATE = 33;
const UTF8_FLAG = 0x0800;
const STORE_METHOD = 0;
const CRC32_TABLE = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const repoRoot = path.resolve(scriptDir, "..");

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const report = await createExtensionPackage({ repoRoot, options });
    if (options.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      printReport(report);
    }
    process.exitCode = options.strict && !report.ok ? 1 : 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Extension package failed.";
    console.error(`FAIL extension package: ${message}`);
    process.exitCode = 1;
  }
}

export async function createExtensionPackage({ repoRoot: root = repoRoot, options = {} } = {}) {
  const normalizedOptions = {
    json: false,
    out: "",
    production: false,
    source: "dist",
    strict: false,
    ...options,
  };
  const sourceDir = path.resolve(root, normalizedOptions.source);
  const manifestPath = path.join(sourceDir, "manifest.json");
  const errors = [];
  const warnings = [];

  if (!existsSync(manifestPath)) {
    errors.push(`Extension manifest not found at ${manifestPath}. Run npm run build first.`);
    return emptyReport({
      sourceDir,
      outPath: resolveOutPath(root, normalizedOptions.out, "unknown"),
      production: normalizedOptions.production,
      errors,
      warnings,
    });
  }

  const manifest = await readJson(manifestPath);
  const manifestValidation = validateManifest(manifest, { production: normalizedOptions.production });
  errors.push(...manifestValidation.errors);
  warnings.push(...manifestValidation.warnings);

  const version = sanitizeVersion(String(manifest.version ?? "0.0.0"));
  const outPath = resolveOutPath(root, normalizedOptions.out, version);
  if (path.resolve(outPath).startsWith(`${sourceDir}${path.sep}`)) {
    errors.push("Package output path must not be inside the source dist directory.");
  }

  if (errors.length > 0) {
    return emptyReport({ sourceDir, outPath, manifest, production: normalizedOptions.production, errors, warnings });
  }

  const files = await listFiles(sourceDir);
  const entries = await Promise.all(
    files.map(async (filePath) => ({
      name: path.relative(sourceDir, filePath).replace(/\\/g, "/"),
      bytes: await readFile(filePath),
    })),
  );
  const invalidEntry = entries.find((entry) => entry.name.startsWith("../") || path.isAbsolute(entry.name));
  if (invalidEntry) {
    errors.push(`Invalid package entry path: ${invalidEntry.name}`);
    return emptyReport({ sourceDir, outPath, manifest, production: normalizedOptions.production, errors, warnings });
  }

  const zipBuffer = createZipBuffer(entries);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, zipBuffer);

  return {
    ok: true,
    sourceDir,
    outPath,
    manifest: {
      name: manifest.name ?? null,
      version: manifest.version ?? null,
      manifestVersion: manifest.manifest_version ?? null,
    },
    production: normalizedOptions.production,
    zipFormat: "store",
    fileCount: entries.length,
    totalInputBytes: entries.reduce((sum, entry) => sum + entry.bytes.byteLength, 0),
    packageBytes: zipBuffer.byteLength,
    sha256: createHash("sha256").update(zipBuffer).digest("hex"),
    entries: entries.map((entry) => entry.name),
    warnings,
    errors,
  };
}

export function validateManifest(manifest, { production = false } = {}) {
  const errors = [];
  const warnings = [];

  if (manifest?.manifest_version !== 3) {
    errors.push("manifest.json must use manifest_version 3.");
  }
  if (!manifest?.name || !manifest?.version) {
    errors.push("manifest.json must include name and version.");
  }

  const hostPermissions = Array.isArray(manifest?.host_permissions) ? manifest.host_permissions : [];
  const contentScriptMatches = Array.isArray(manifest?.content_scripts)
    ? manifest.content_scripts.flatMap((script) => (Array.isArray(script.matches) ? script.matches : []))
    : [];
  const patterns = [...hostPermissions, ...contentScriptMatches];
  const invalidPatterns = patterns.filter((pattern) => !isExactHttpOriginPattern(pattern));
  const localPatterns = patterns.filter((pattern) => isLocalOriginPattern(pattern));

  if (patterns.length === 0) {
    errors.push("manifest.json must include host_permissions and content_scripts.matches patterns.");
  }
  if (invalidPatterns.length > 0) {
    errors.push(`manifest.json contains invalid or overly broad URL patterns: ${invalidPatterns.join(", ")}.`);
  }
  if (production && localPatterns.length > 0) {
    errors.push(`Production package cannot target local URL patterns: ${localPatterns.join(", ")}.`);
  } else if (localPatterns.length > 0) {
    warnings.push(`Local development URL patterns are present: ${localPatterns.join(", ")}.`);
  }

  return { errors, warnings };
}

export function createZipBuffer(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of entries) {
    const fileName = Buffer.from(entry.name, "utf8");
    const bytes = Buffer.from(entry.bytes);
    const crc = crc32(bytes);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(UTF8_FLAG, 6);
    localHeader.writeUInt16LE(STORE_METHOD, 8);
    localHeader.writeUInt16LE(FIXED_DOS_TIME, 10);
    localHeader.writeUInt16LE(FIXED_DOS_DATE, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(bytes.byteLength, 18);
    localHeader.writeUInt32LE(bytes.byteLength, 22);
    localHeader.writeUInt16LE(fileName.byteLength, 26);
    localHeader.writeUInt16LE(0, 28);
    localParts.push(localHeader, fileName, bytes);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(UTF8_FLAG, 8);
    centralHeader.writeUInt16LE(STORE_METHOD, 10);
    centralHeader.writeUInt16LE(FIXED_DOS_TIME, 12);
    centralHeader.writeUInt16LE(FIXED_DOS_DATE, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(bytes.byteLength, 20);
    centralHeader.writeUInt32LE(bytes.byteLength, 24);
    centralHeader.writeUInt16LE(fileName.byteLength, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    centralParts.push(centralHeader, fileName);

    offset += localHeader.byteLength + fileName.byteLength + bytes.byteLength;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.byteLength, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, end]);
}

export function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = CRC32_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
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

function resolveOutPath(root, out, version) {
  if (out) {
    return path.resolve(root, out);
  }
  return path.join(root, "release", `architect-browser-assistant-${version}.zip`);
}

function emptyReport({ sourceDir, outPath, manifest = null, production, errors, warnings }) {
  return {
    ok: false,
    sourceDir,
    outPath,
    manifest: manifest
      ? {
          name: manifest.name ?? null,
          version: manifest.version ?? null,
          manifestVersion: manifest.manifest_version ?? null,
        }
      : null,
    production,
    zipFormat: "store",
    fileCount: 0,
    totalInputBytes: 0,
    packageBytes: 0,
    sha256: "",
    entries: [],
    warnings,
    errors,
  };
}

function sanitizeVersion(version) {
  return version.replace(/[^0-9A-Za-z._-]/g, "-") || "0.0.0";
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

function printReport(report) {
  console.log("Architect Browser Assistant extension package");
  console.log(`Result: ${report.ok ? "packaged" : "blocked"}`);
  if (report.ok) {
    console.log(`Output: ${report.outPath}`);
    console.log(`Files: ${report.fileCount}, bytes: ${report.packageBytes}, sha256: ${report.sha256}`);
  }
  for (const warning of report.warnings) {
    console.log(`WARN: ${warning}`);
  }
  for (const error of report.errors) {
    console.log(`FAIL: ${error}`);
  }
}

function parseArgs(args) {
  const parsed = {
    json: false,
    out: "",
    production: false,
    source: "dist",
    strict: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--json") {
      parsed.json = true;
      continue;
    }
    if (arg === "--out") {
      parsed.out = args[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (arg === "--production") {
      parsed.production = true;
      continue;
    }
    if (arg === "--source") {
      parsed.source = args[index + 1] ?? "dist";
      index += 1;
      continue;
    }
    if (arg === "--strict") {
      parsed.strict = true;
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }

  return parsed;
}
