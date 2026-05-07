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

The real local ChatGPT/Codex bridge is intentionally behind `LocalRuntimeClient` and remains unavailable until the runtime discovery/spike chooses a native messaging or localhost bridge path.
