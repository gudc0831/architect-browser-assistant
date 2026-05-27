import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  createExtensionPackage,
  createZipBuffer,
  crc32,
  validateManifest,
} from "./package-extension.mjs";

test("package-extension creates a deterministic Web Store zip", async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), "architect-extension-package-"));
  try {
    await writeFixtureDist(repoRoot, {
      hostPattern: "https://architect.example.com/*",
    });

    const first = await createExtensionPackage({
      repoRoot,
      options: { out: "release/first.zip", production: true },
    });
    const second = await createExtensionPackage({
      repoRoot,
      options: { out: "release/second.zip", production: true },
    });
    const zipEntries = readCentralDirectoryEntries(await readFile(first.outPath));

    assert.equal(first.ok, true);
    assert.equal(first.sha256, second.sha256);
    assert.deepEqual(first.entries, ["assets/app.js", "manifest.json"]);
    assert.deepEqual(
      zipEntries.map((entry) => entry.name),
      ["assets/app.js", "manifest.json"],
    );
    assert.deepEqual(
      zipEntries.map((entry) => entry.method),
      [0, 0],
    );
  } finally {
    await rm(repoRoot, { force: true, recursive: true });
  }
});

test("package-extension blocks production packages with local origins", async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), "architect-extension-package-"));
  try {
    await writeFixtureDist(repoRoot, {
      hostPattern: "http://localhost:3000/*",
    });

    const report = await createExtensionPackage({
      repoRoot,
      options: { out: "release/local.zip", production: true },
    });

    assert.equal(report.ok, false);
    assert.match(report.errors.join("\n"), /Production package cannot target local URL patterns/);
    assert.equal(report.packageBytes, 0);
  } finally {
    await rm(repoRoot, { force: true, recursive: true });
  }
});

test("package-extension uses standard CRC32 values", () => {
  assert.equal(crc32(Buffer.from("123456789")), 0xcbf43926);
});

test("package-extension validates MV3 manifest URL scope", () => {
  const result = validateManifest({
    manifest_version: 3,
    name: "Architect Browser Assistant",
    version: "0.1.0",
    host_permissions: ["<all_urls>"],
    content_scripts: [{ matches: ["https://architect.example.com/*"] }],
  });

  assert.match(result.errors.join("\n"), /invalid or overly broad URL patterns/);
});

test("package-extension writes a parseable empty zip buffer", () => {
  const zip = createZipBuffer([]);
  assert.equal(zip.readUInt32LE(0), 0x06054b50);
  assert.deepEqual(readCentralDirectoryEntries(zip), []);
});

async function writeFixtureDist(repoRoot, { hostPattern }) {
  const distDir = path.join(repoRoot, "dist");
  await mkdir(path.join(distDir, "assets"), { recursive: true });
  await writeFile(
    path.join(distDir, "manifest.json"),
    JSON.stringify(
      {
        manifest_version: 3,
        name: "Architect Browser Assistant",
        version: "0.1.0",
        host_permissions: [hostPattern],
        content_scripts: [{ matches: [hostPattern], js: ["assets/app.js"] }],
      },
      null,
      2,
    ),
  );
  await writeFile(path.join(distDir, "assets", "app.js"), "console.log('architect');\n");
}

function readCentralDirectoryEntries(zip) {
  const eocdOffset = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  assert.notEqual(eocdOffset, -1);
  const entryCount = zip.readUInt16LE(eocdOffset + 10);
  let offset = zip.readUInt32LE(eocdOffset + 16);
  const entries = [];

  for (let index = 0; index < entryCount; index += 1) {
    assert.equal(zip.readUInt32LE(offset), 0x02014b50);
    const method = zip.readUInt16LE(offset + 10);
    const nameLength = zip.readUInt16LE(offset + 28);
    const extraLength = zip.readUInt16LE(offset + 30);
    const commentLength = zip.readUInt16LE(offset + 32);
    const name = zip.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");
    entries.push({ method, name });
    offset += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}
