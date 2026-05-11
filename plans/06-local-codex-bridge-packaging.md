# 06. Local Codex Bridge Packaging PRD

Created: 2026-05-11
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 06 Local Codex bridge packaging and extension install foundation.
Worklog: [../docs/worklogs/2026-05-11-1050-local-codex-bridge-packaging-planning.md](../docs/worklogs/2026-05-11-1050-local-codex-bridge-packaging-planning.md)

## Source Review

Latest official docs checked before implementation:

- Chrome Native Messaging: https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging
- Chrome Side Panel API: https://developer.chrome.com/docs/extensions/reference/api/sidePanel
- Chrome extension service worker lifecycle: https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle
- OpenAI Codex non-interactive mode: https://developers.openai.com/codex/noninteractive
- OpenAI Codex CLI: https://developers.openai.com/codex/cli

Implementation decisions from those docs:

- Use Chrome `nativeMessaging`, not a localhost server, for the first local bridge because Chrome provides host registration, allowed extension origins, and stdio framing.
- Keep the persistent PC UI in the MV3 side panel. The side panel calls the service worker; the service worker calls the native host.
- Register a per-user Windows native host under HKCU after the real unpacked extension id is known.
- Invoke Codex through `codex exec - --json` so the native host can pass a generated prompt on stdin and parse machine-readable JSONL events.
- Run Codex in a read-only sandbox for this answer-generation bridge. This slice must not let the browser extension mutate the local workspace.

## Problem Statement

The product direction requires user-local ChatGPT/Codex execution for architecture task answers while SaaS remains responsible for auth, task data, evidence retrieval, assistant records, and governance. Before this slice, `LocalRuntimeClient` always returned unavailable, so the extension could not validate the real local execution path or installation shape.

## Solution

Add a Chrome native messaging bridge foundation:

1. Add `nativeMessaging` to the MV3 manifest.
2. Add service worker routes for local runtime status, capabilities, and generation.
3. Make `LocalRuntimeClient` call those routes instead of returning a hard-coded unavailable state.
4. Add a Node native host that speaks Chrome native messaging framing and can run `codex exec`.
5. Add Windows host registration tooling and a mock self-test path for installation verification before real Codex auth is available.
6. Add a side-panel runtime mode selector so testers can switch between deterministic mock and Local Codex.

## User Stories

1. As an architect task user, I can select `Local Codex` in the extension side panel and immediately see whether the local bridge is available.
2. As an architect task user, I can generate an answer from selected task context and retrieved evidence without storing Codex credentials in the extension.
3. As a developer/operator, I can build the extension, load it unpacked, register the Windows native host after obtaining the extension id, and run a mock bridge smoke test.
4. As a security reviewer, I can verify that extension storage still rejects credential-like keys and that the native host is origin-scoped through Chrome native messaging.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| PRD and current goal documentation | done | pending | this worklog | Document updated |
| MV3 native messaging permission and service worker routes | done | pending | this worklog | `npm run typecheck`, `npm run test` |
| `LocalRuntimeClient` bridge implementation | done | pending | this worklog | `npm run typecheck`, `npm run test` |
| Side-panel runtime selector and error reporting | done | pending | this worklog | `npm run typecheck`, `npm run build` |
| Node native host with Codex `exec` JSONL parsing | done | pending | this worklog | `npm run native-host:self-test`, `npm run test` |
| Windows native host installer script | done | pending | this worklog | Script review, build verification |
| Real Chrome native host registration | deferred | - | - | Requires unpacked extension id from tester's Chrome profile |
| Real Codex CLI authenticated generation | deferred | - | - | Requires local Codex install/login in tester's Windows profile |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-11 | Baseline before slice | `npm run typecheck` passed; `npm run test` passed |
| 2026-05-11 | Bridge unit and protocol tests | `npm run typecheck` passed; `npm run test` passed |
| 2026-05-11 | Native host mock smoke test | `npm run native-host:self-test` passed |
| 2026-05-11 | Final static verification | `npm run lint` passed; `npm run build` passed |

## Functional Decisions

- The extension never stores Codex, ChatGPT, OpenAI, or SaaS service credentials.
- The native host accepts only three request types: `status`, `capabilities`, and `generate`.
- `generate` sends only selected task context, the user question, and evidence excerpts already returned or approved through SaaS flows.
- The native host asks Codex to return a JSON object with `answer` and `draftSummary`; if Codex returns plain text, the host falls back to a safe draft summary wrapper.
- Mock native host mode exists only for install verification and development smoke tests.

## Testing Decisions

- Unit test the browser runtime client with mocked `chrome.runtime.sendMessage`.
- Unit test native host prompt construction, JSONL extraction, and mock generation.
- Verify the native host process independently with `npm run native-host:self-test`.
- Verify production bundle with `npm run build`.
- Do not write the Windows registry during automated verification. Registry registration is user/profile-specific and requires the final extension id.

## Out of Scope

- Mobile assistant UX.
- Chrome Web Store packaging and signing.
- A compiled native host executable or MSI installer.
- Automatic page scraping beyond user-approved title, URL, excerpt, or skill output.
- Storing or syncing ChatGPT/Codex credentials.
- SaaS data model changes.

## Residual Risks

- Chrome native host registration still needs manual verification after the user loads `dist` and gets a stable extension id.
- Real Codex generation depends on a locally installed and authenticated Codex CLI.
- The Windows `.cmd` launcher is acceptable for the development slice, but production packaging should replace it with a signed executable or managed installer.
- `codex exec` behavior can change with CLI versions, so the host surfaces safe errors and keeps a mock self-test path.

## Next Slice Candidate

Implement real Chrome install verification and local Codex authenticated smoke testing on the target Windows profile, then decide whether production packaging should be a signed native executable, installer, or managed enterprise deployment.
