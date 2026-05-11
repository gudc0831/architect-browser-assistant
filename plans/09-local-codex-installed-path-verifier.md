# 09. Local Codex Installed-Path Verifier PRD

Created: 2026-05-11
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 09 Local Codex installed-path verifier for the `/daily` bridge.
Worklog: [../docs/worklogs/2026-05-11-1336-local-codex-installed-path-verifier.md](../docs/worklogs/2026-05-11-1336-local-codex-installed-path-verifier.md)

## Problem Statement

The `/daily` in-page checklist can show whether the extension bridge responds, but users still need a repeatable local command that checks the installed Chrome/native-host path before they debug the browser UI. Real generation depends on the user's Chrome extension id, HKCU native messaging registry entry, launcher path, native host script, and Codex CLI status.

## Solution

Add a Windows-oriented verifier command in the browser assistant repo:

```powershell
npm run native-host:verify:windows -- --extension-id <chrome-extension-id>
```

The verifier checks:

1. The built extension manifest exists and declares `nativeMessaging`.
2. The native host manifest exists and allows the expected extension origin.
3. The native host launcher exists.
4. The HKCU Chrome NativeMessagingHosts registry key points to the generated manifest.
5. The native host mock status route responds.
6. The real Codex CLI status route responds or reports a clear warning.

## User Stories

1. As an operator, I can run one command from `architect-browser-assistant` to see whether Chrome/native-host/Codex setup is ready.
2. As an architect user, I can use the command output to fix install issues before using `/daily` `Check bridge`.
3. As a developer, I can run the verifier in JSON mode and strict mode when needed.
4. As a security reviewer, I can confirm the verifier does not store or print credentials.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 09 PRD and active goal documentation | done | pending | this worklog | Document updated |
| `native-host:verify:windows` command | done | pending | this worklog | `npm run native-host:verify:windows -- --json --strict` |
| User guide/README verifier instructions | done | pending | this worklog + SaaS worklog | Document updated |
| Real authenticated generation from `/daily` | deferred | - | - | Requires user Chrome profile/Codex login |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-11 | Goal creation | Active goal created in Codex goal tool |
| 2026-05-11 | Native host registration | `npm run native-host:install:windows -- -ExtensionId ianebfgjhjklildppcocmbmifedapooj -Mock` registered HKCU native host |
| 2026-05-11 | Installed-path verifier | `npm run native-host:verify:windows -- --json --strict` passed: 7 pass, 0 warn, 0 fail |
| 2026-05-11 | Browser assistant static verification | `npm run typecheck`, `npm run test`, `npm run lint`, `npm run native-host:self-test`, `npm run build` passed |

## Implementation Decisions

- The verifier is a Node script so it can parse JSON manifests, call the native host module directly, and query Windows registry without adding dependencies.
- Default mode reports failures but exits 0; `--strict` returns non-zero when fail checks are present.
- `--json` emits machine-readable output for future automation.
- `--mock-only` skips the real Codex CLI check when the user wants install-path verification without Codex login.

## Testing Decisions

- Run TypeScript checks, unit tests, native host self-test, and production build in the browser assistant repo.
- Run the verifier in JSON/mock-only mode to confirm it executes deterministically.
- Keep real `/daily` Local Codex generation as a manual next slice because it needs the user's Chrome profile and Codex login state.

## Out of Scope

- Automatic Chrome extension loading/reloading.
- Editing Windows registry from the verifier.
- Reading or storing Codex/OpenAI credentials.
- Mobile verification workflow.

## Residual Risks

- Registry inspection confirms the HKCU native messaging entry, but Chrome still needs the user to reload the unpacked extension after rebuild.
- `codex exec --help` availability does not prove an authenticated generation will succeed; the next slice must record real `/daily` generation evidence.

## Next Slice Candidate

Use the verifier plus `/daily` `Check bridge` to record a real Local Codex generation result from the user's installed Chrome profile.
