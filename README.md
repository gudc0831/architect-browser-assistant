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

## Official Law Source Verification

When a task review needs legal/regulation grounding, Architect SaaS owns the server-side verification flow through `POST /api/assistant/task-review`. SaaS calls `verified-legal-evidence-api` with server-only credentials, receives redacted answer-ready legal evidence, and returns evidence metadata such as `verificationStatus: "verified"`, law/article fields, checked time, and source URL.

The Browser Assistant does not store `LAW_OPEN_DATA_OC`, does not request `law.go.kr` host permissions, and does not call the National Law Information Center Open API directly. The extension consumes SaaS-returned verified regulation evidence only. If a legal task has only unverified regulation seeds, Local Codex generation fails closed before the native runtime receives the prompt.

The extension host permission is limited to the configured SaaS origin. Sensitive setting keys such as `lawOpenDataOc`, tokens, API keys, and service credentials are rejected by guarded extension storage.

Manual task-flow verification:

```powershell
cd D:\architect-workspace\architect-browser-assistant
node scripts\verify-official-law-task-flow.mjs --origin http://localhost:3000 --task-id <task-id> --mode preview
```

The script calls SaaS `POST /api/assistant/task-review` and verifies the current server boundary. In `preview` mode it checks that no assistant record or WIKI candidate is created. In `generate` mode it accepts only the task-review orchestrator's server-side write path, where generated records remain `candidateState: "not_candidate"` and WIKI approval remains a Knowledge admin action. If centralized legal verification fails, the script exits with `status: "blocked"` and skips Browser Assistant writes.

Assistant retrieval data sources:

- `task`: current task text plus related project tasks.
- `project_document`: uploaded task/project files after text extraction or manual analysis is saved.
- `central_knowledge`: approved WIKI items only. Assistant records are candidates until a Knowledge admin approves them.
- `web_or_skill`: user-approved external evidence saved through the assistant external-evidence API.
- `regulation`: server-returned verified legal evidence from SaaS/verified-legal, or low-trust seeds that must not be used for legal generation until centralized verification succeeds.

For local development, the SaaS local backend stores JSON metadata under `LOCAL_DATA_ROOT` or `D:\architect-start-data` by default: `data\tasks.json`, `data\files.json`, `data\assistant-records.json`, and uploaded binaries under `uploads\projects\<projectId>\tasks\<taskId>\...`. Do not rely on dropping files into the upload folder alone; retrieval only sees files that were committed through the SaaS file APIs/UI and have usable analysis metadata. To make a document searchable by the assistant, upload it to the relevant task, then save file analysis with extracted text or a summary. Use `verificationState: "user_confirmed"` when a user has checked the extracted text.

For production users, use the cloud backend/storage path instead of local folders. The same retrieval contract applies: project membership gates task/file access, Knowledge admin gates WIKI approval, and only approved WIKI items are reused as central knowledge.

Development checks:

```powershell
cd D:\architect-workspace\architect-browser-assistant
npm run release:check
```

The release gate runs typecheck, lint, unit tests, production build, release readiness validation, and native-host self-test. Run it before treating any build as a public MVP candidate.

The readiness validator checks MV3 manifest shape, scoped permissions, SaaS origin alignment, native-host template/installer guardrails, generated native-host manifest shape, and production signing metadata warnings. JSON output includes `warningSummary` plus per-warning `scope` and `resolution` fields so local development warnings can be separated from production promotion blockers.

Current warning policy:

| Readiness check | Scope | Local action | Production action |
| --- | --- | --- | --- |
| `host-permissions`, `content-script-matches` | Defaults to the canonical Preview alias when `ARCHITECT_SAAS_ORIGIN` is unset | Keep this default for Preview validation. Use explicit exact origins for local development, such as localhost plus the Preview alias. | Set `ARCHITECT_SAAS_ORIGIN` to the exact production SaaS origin and rebuild. |
| `repo-local-native-host-launcher`, `generated-native-host-manifest` | `local-dev` | Keep as warnings; these are generated per machine/extension id and must not be committed. | Generate with the Windows installer only after the Chrome extension id and install root are known. |
| `production-signing-metadata` | `production-promotion` | No local secret or certificate is required. | Provide extension id, release owner, Web Store publisher, native-host install root, and signing subject or an explicit unsigned waiver. |
| `web-store-upload-boundary` | `production-promotion` or `manual-release` | No upload is performed by local validation. | Upload to Chrome Web Store outside this validator after package checks pass and operator approval is recorded. |

Production SaaS origin packaging:

```powershell
$env:ARCHITECT_SAAS_ORIGIN="https://your-saas-origin.example"
npm run build
```

`ARCHITECT_SAAS_ORIGIN` controls the MV3 `host_permissions` and content-script `matches` entries at build time. It accepts one or more exact origins separated by commas, semicolons, or spaces. If it is unset or every value is invalid, the manifest falls back to the stable Preview alias `https://architect-start2-git-codex-multi-d1c003-chois-projects-7b2948cf.vercel.app/*` so Preview `/daily` keeps the in-page Local Codex bridge.

For a local development package that works on both localhost and the deployed Preview alias, build with both origins:

```powershell
$env:ARCHITECT_SAAS_ORIGIN="http://localhost:3000,https://architect-start2-git-codex-multi-d1c003-chois-projects-7b2948cf.vercel.app"
npm run build
```

Reload the unpacked extension in `chrome://extensions` and refresh `/daily` after rebuilding.

Production release readiness:

```powershell
$env:ARCHITECT_SAAS_ORIGIN="https://your-saas-origin.example"
npm run build
$env:ARCHITECT_CHROME_EXTENSION_ID="<chrome-extension-id>"
$env:ARCHITECT_NATIVE_HOST_SIGNING_SUBJECT="<native-host signing subject>"
$env:ARCHITECT_RELEASE_OWNER="<release owner>"
$env:ARCHITECT_CHROME_WEB_STORE_PUBLISHER="<publisher account or group>"
$env:ARCHITECT_NATIVE_HOST_INSTALL_ROOT="$env:LOCALAPPDATA\Architect\BrowserAssistant\native-host"
npm run release:readiness:production -- --json --extension-id <chrome-extension-id>
```

The production readiness command runs strict production validation. It does not upload to Chrome Web Store, sign an installer, issue a code-signing certificate, or change a user's registry. It blocks promotion when production origin, extension id, signing subject, release owner, Web Store publisher, or native-host install-root metadata is missing.

If the operator explicitly approves an interim unsigned native-host path because no code-signing certificate exists yet, keep the owner, publisher, extension id, SaaS origin, and install-root metadata configured and run:

```powershell
npm run release:readiness:production -- --allow-unsigned-native-host
```

That waiver turns only the missing native-host signing subject into a warning. It does not sign an installer and does not remove the need for a real code-signing certificate before a signed native-host release.

Production promotion dry-run packet:

```powershell
$env:ARCHITECT_SAAS_ORIGIN="https://your-saas-origin.example"
npm run build
npm run release:package -- --json --strict --production
npm run release:promotion:dry-run -- --json --strict --extension-id <chrome-extension-id>
```

`release:package` creates the Chrome Web Store upload ZIP from the current `dist` folder under ignored `release/` output. It validates MV3 basics and, with `--production`, rejects localhost manifest origins. `release:promotion:dry-run` emits a non-secret operator packet with the built `dist` artifact fingerprint, production readiness result, blocking metadata gaps, manual approval dependencies, and follow-up commands. Neither command uploads to Chrome Web Store, signs binaries, issues certificates, generates native-host launchers/manifests, or writes native-host registry entries. If the operator has explicitly approved the unsigned native-host interim path, pass `--allow-unsigned-native-host` to the dry-run as well so the packet matches the readiness command.

Focused development checks:

```powershell
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

For a production-style local install check, install the native host into a stable directory and verify that Chrome is not pointed at the repo checkout:

```powershell
npm run native-host:install:windows -- -ExtensionId <chrome-extension-id> -InstallRoot "$env:LOCALAPPDATA\Architect\BrowserAssistant\native-host"
npm run native-host:verify-production-install -- --extension-id <chrome-extension-id> --install-root "$env:LOCALAPPDATA\Architect\BrowserAssistant\native-host" --json
npm run extension:verify-chrome-profile -- --extension-id <chrome-extension-id> --require-webstore --json --strict
```

The installer writes a launcher with absolute `node.exe` and Codex CLI paths. Windows npm `codex.ps1` wrappers are supported by resolving the sibling `codex.cmd` wrapper when available, so stdin prompts such as `codex exec -` are passed correctly instead of being parsed as PowerShell parameters. Use the default real-mode install for `/daily` Local Codex generation; `-Mock` is only for smoke tests.

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
