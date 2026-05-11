# Architect Browser Assistant

Chrome extension repository for the Architect SaaS workspace.

The implementation direction is Chromex-inspired, but the extension is Architect-owned code rather than a live Chromex dependency. Keep it separate from `architect-saas`:

```text
D:\architect-workspace\
  architect-saas\
  architect-browser-assistant\
```

Repository boundary:

- The extension owns browser UI, page context collection, native bridge/local login integration, and calls to SaaS APIs.
- The SaaS app owns authentication, permissions, database access, retrieval, assistant records, and audit/rate-limit policy.
- The extension must not connect directly to the production database.

## Implemented Slices

- Slice 01: Chrome MV3 side-panel foundation, SaaS task context detection, retrieval/record/summary API client, local runtime adapter, deterministic mock runtime, and guarded `chrome.storage`.
- Slice 06: Chrome native messaging permission, service-worker local runtime routes, Node native host, Windows installer script, and manual side-panel diagnostics for Local Codex.
- Slice 07: In-page `/daily` assistant popup bridge to the Local Codex extension/native-host runtime.
- Slice 08: In-page `/daily` Local Codex bridge health checklist.
- Slice 09: Local installed-path verifier for extension manifest, HKCU registry, launcher, native host, and Codex CLI status.

## Default User Surface

The SaaS `/daily` in-page assistant popup is the default PC workflow. Select a task in `/daily`, open the bottom-right `AI review` popup, and choose the execution mode:

- `Mock`: deterministic local SaaS client response for development.
- `SaaS API`: organization-governed SaaS generation path.
- `Local Codex (extension)`: in-page popup request sent through the Chrome extension content script, service worker, native host, and local Codex CLI.

The Chrome side panel is secondary and hidden during normal work. Open it manually only for bridge diagnostics, such as confirming native host availability or inspecting Local Codex errors.

## Local Codex Bridge

The bridge path is intentionally narrow:

- Chrome MV3 uses the `nativeMessaging` permission.
- The content script accepts only same-window, same-origin page messages for `status` and `generate`.
- The service worker forwards those local runtime requests to native host `com.architect.browser_assistant.codex_bridge`.
- The native host runs `codex exec - --json --sandbox read-only --skip-git-repo-check` with the selected task context, question, and evidence.
- No ChatGPT, Codex, OpenAI, or SaaS secret is stored in extension storage.

Development checks:

```powershell
cd D:\architect-workspace\architect-browser-assistant
npm run native-host:self-test
npm run build
```

Windows unpacked extension setup:

1. Run `npm run build`.
2. Open `chrome://extensions`, enable Developer mode, and load the `dist` folder.
3. Copy the generated 32-character extension id.
4. Register the native host for the current Windows user:

```powershell
npm run native-host:install:windows -- -ExtensionId <chrome-extension-id>
```

The installer writes a launcher with absolute `node.exe` and Codex CLI paths. Use the default real-mode install for `/daily` Local Codex generation; `-Mock` is only for smoke tests.

For a bridge smoke test without invoking the real Codex CLI, add `-Mock`:

```powershell
npm run native-host:install:windows -- -ExtensionId <chrome-extension-id> -Mock
```

Verify the installed path:

```powershell
npm run native-host:verify:windows -- --extension-id <chrome-extension-id> --strict
```

Useful verifier options:

- `--json`: print machine-readable check results.
- `--mock-only`: verify extension/native-host path without checking real Codex CLI.
- `--skip-registry`: skip HKCU registry inspection.
- `--strict`: return a non-zero exit code when any check fails.

Verify the generation handler without invoking Codex:

```powershell
npm run native-host:verify-generation -- --json --mock --strict
```

Real generation is a separate approval step because it sends the bounded verification prompt through the user's Codex CLI:

```powershell
npm run native-host:verify-generation -- --json --allow-external --strict
```

Verify that Chrome has the unpacked extension registered in the profile used for `/daily`:

```powershell
npm run extension:verify-chrome-profile -- --json --strict
```

After registration, reload the extension and use `/daily` for normal work. The side panel remains available for manual diagnostics only.
