# Architect Browser Assistant

Planned Chrome extension repository for the Architect SaaS workspace.

The implementation direction is Chromex-inspired, but the extension is Architect-owned code rather than a live Chromex dependency. Keep it separate from `architect-saas`:

```text
D:\architect-workspace\
  architect-saas\
  architect-browser-assistant\
```

Future implementation should preserve the SaaS boundary:

- The extension owns browser UI, page context collection, native bridge/local login integration, and calls to SaaS APIs.
- The SaaS app owns authentication, permissions, database access, retrieval, assistant records, and audit/rate-limit policy.
- The extension must not connect directly to the production database.

## First Slice

The first implementation slice is `Task Assistant Core Loop`.

- Chrome MV3 side panel foundation
- SaaS task context detection
- SaaS retrieval/record/summary API client
- `ArchitectLocalAssistantRuntime` adapter
- deterministic `MockAssistantRuntime`
- guarded `chrome.storage` wrapper that rejects credential-like keys

## Local Codex Bridge

Slice 06 adds the first installable local bridge path:

- Chrome MV3 uses the `nativeMessaging` permission.
- The side panel talks to the service worker, and the service worker calls native host `com.architect.browser_assistant.codex_bridge`.
- The native host runs `codex exec - --json --sandbox read-only --skip-git-repo-check` with the selected task context and evidence.
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

For a bridge smoke test without invoking the real Codex CLI, add `-Mock`:

```powershell
npm run native-host:install:windows -- -ExtensionId <chrome-extension-id> -Mock
```

After registration, open the extension side panel, change Mode to `Local Codex`, retrieve evidence, and generate an answer. If Codex CLI is not installed or authenticated, the panel remains available but reports the native host/Codex status instead of saving credentials.
