#!/usr/bin/env node
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULT_EXTENSION_ID = "ianebfgjhjklildppcocmbmifedapooj";

const options = parseArgs(process.argv.slice(2));

try {
  const report = await verifyChromeProfile();
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report);
  }
  process.exitCode = options.strict && !report.ok ? 1 : 0;
} catch (error) {
  const message = error instanceof Error ? error.message : "Chrome profile verifier failed.";
  if (options.json) {
    console.log(JSON.stringify({ ok: false, error: message }, null, 2));
  } else {
    console.error(`FAIL Chrome profile verifier: ${message}`);
  }
  process.exitCode = 1;
}

async function verifyChromeProfile() {
  const chromeUserDataDir = resolveChromeUserDataDir();
  const profiles = await readProfileDirectories(chromeUserDataDir);
  const matches = [];
  const errors = [];

  for (const profile of profiles) {
    for (const fileName of ["Preferences", "Secure Preferences"]) {
      const filePath = path.join(profile.fullPath, fileName);
      if (!existsSync(filePath)) {
        continue;
      }

      try {
        const parsed = JSON.parse(stripBom(await readFile(filePath, "utf8")));
        const setting = parsed?.extensions?.settings?.[options.extensionId];
        if (setting) {
          matches.push({
            profile: profile.name,
            file: fileName,
            state: setting.state ?? null,
            location: setting.location ?? null,
            path: setting.path ?? null,
            manifestName: setting.manifest?.name ?? null,
            manifestVersion: setting.manifest?.version ?? null,
            fromWebstore: setting.from_webstore ?? null,
          });
        }
      } catch (error) {
        errors.push({
          profile: profile.name,
          file: fileName,
          error: error instanceof Error ? error.message : "Unable to parse profile preferences.",
        });
      }
    }
  }

  const webstoreMatches = matches.filter((match) => match.fromWebstore === true);
  return {
    ok: options.requireWebstore ? webstoreMatches.length > 0 : matches.length > 0,
    extensionId: options.extensionId,
    chromeUserDataDir,
    profilesChecked: profiles.map((profile) => profile.name),
    matches,
    errors,
    recommendation:
      options.requireWebstore && webstoreMatches.length === 0
        ? "Install the published Chrome Web Store extension in the Chrome profile used for /daily."
        : matches.length > 0
        ? "Reload the matched unpacked extension profile and refresh /daily."
        : "Load the rebuilt dist folder as an unpacked extension in the Chrome profile used for /daily, then register native host with that extension id if it differs.",
  };
}

function resolveChromeUserDataDir() {
  if (options.chromeUserDataDir) {
    return path.resolve(options.chromeUserDataDir);
  }

  const localAppData = process.env.LOCALAPPDATA;
  if (!localAppData) {
    throw new Error("LOCALAPPDATA is not set; pass --chrome-user-data-dir explicitly.");
  }

  return path.join(localAppData, "Google", "Chrome", "User Data");
}

async function readProfileDirectories(chromeUserDataDir) {
  if (!existsSync(chromeUserDataDir)) {
    throw new Error(`Chrome user data directory not found: ${chromeUserDataDir}`);
  }

  const entries = await readdir(chromeUserDataDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      fullPath: path.join(chromeUserDataDir, entry.name),
    }));
}

function stripBom(value) {
  return value.replace(/^\uFEFF/, "");
}

function printReport(report) {
  console.log("Architect Chrome extension profile verification");
  console.log(`Extension id: ${report.extensionId}`);
  console.log(`Chrome user data: ${report.chromeUserDataDir}`);
  console.log(`Profiles checked: ${report.profilesChecked.length}`);
  if (report.matches.length === 0) {
    console.log("Result: not found");
    console.log(`Recommendation: ${report.recommendation}`);
    return;
  }

  console.log("Result: found");
  for (const match of report.matches) {
    console.log(
      `- ${match.profile} / ${match.file}: ${match.manifestName ?? "<unknown>"} ${match.manifestVersion ?? ""} ${match.fromWebstore ? "webstore" : "unpacked"} ${match.path ?? ""}`.trim(),
    );
  }
}

function parseArgs(args) {
  const parsed = {
    chromeUserDataDir: null,
    extensionId: DEFAULT_EXTENSION_ID,
    json: false,
    strict: false,
    requireWebstore: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--chrome-user-data-dir") {
      parsed.chromeUserDataDir = args[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (arg === "--extension-id") {
      parsed.extensionId = args[index + 1] ?? "";
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
    if (arg === "--require-webstore") {
      parsed.requireWebstore = true;
      continue;
    }
  }

  if (!/^[a-p]{32}$/.test(parsed.extensionId)) {
    throw new Error("--extension-id must be a 32-character Chrome extension id.");
  }

  return parsed;
}
