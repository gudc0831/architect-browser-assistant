# 11. Daily Installed Extension Local Codex Proof PRD

Created: 2026-05-11
Parent document: [../PLAN.md](../PLAN.md)
Current status: `in_progress`
Goal: Implement and verify 11 `/daily` installed-extension Local Codex browser proof.
Worklog: [../docs/worklogs/2026-05-11-1405-daily-installed-extension-local-codex-proof.md](../docs/worklogs/2026-05-11-1405-daily-installed-extension-local-codex-proof.md)

## Problem Statement

Slice 10 proved that the native host `generate` handler can call real Codex and return a grounded draft summary. The product still needs evidence from the actual default user surface: the SaaS `/daily` in-page assistant popup running through the installed Chrome extension content script, service worker, native host, and Codex CLI.

## Solution

Run and record the installed-extension browser proof:

1. Rebuild the extension.
2. Verify the native host registration and Codex status for the installed extension id.
3. Open `/daily` in Chrome with the unpacked extension loaded.
4. Select a task in the daily list.
5. Open the in-page `AI review` popup.
6. Select `Local Codex (extension)`.
7. Run `Check bridge` and record that the extension bridge and native host/Codex steps pass.
8. Run `Retrieve + Generate` for the selected task.
9. Confirm an assistant record is saved with execution mode `local-chatgpt-codex`.
10. Record verification evidence, residual risks, and next slice candidate.

## User Stories

1. As an operator, I can prove the default `/daily` popup uses the installed extension and local Codex path.
2. As a developer, I can separate native-host command proof from browser UI proof.
3. As a product owner, I can decide the next slice based on real installed-extension behavior rather than a mock or direct script.

## Implementation Status

Current implementation state: `in_progress`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 11 PRD and active goal documentation | done | a636a2d | this worklog | Document updated |
| Extension build and installed-path verification | done | a636a2d | this worklog | `npm run build` passed; installed-path verifier passed with 7 pass / 0 fail under user profile access |
| Chrome profile extension registration verification | done | 537ab6a | this worklog | `extension:verify-chrome-profile` found the extension in Chrome `Default` profile pointing to `dist` |
| Native host Chrome protocol and launcher hardening | done | pending | this worklog | Fixed one-frame native message reads, real-mode launcher path pinning, WindowsApps Codex path rejection, and launcher self-test coverage |
| `/daily` browser `Check bridge` evidence | done | pending | this worklog | Chrome `/daily` popup passed `Extension bridge`, `Native host / Codex`, `Credentials`, and `Generation` |
| `/daily` missing-bridge operator guidance | done | SaaS `bc000af`, `510832a` | SaaS worklog `2026-05-11-1412-local-codex-bridge-reload-guidance.md` | SaaS `npm run typecheck` passed; `/daily` popup displayed reload/verifier guidance |
| `/daily` real Local Codex generation evidence | pending | - | this worklog | - |
| Assistant record saved as `local-chatgpt-codex` | pending | - | this worklog | - |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-11 | Goal creation | Active goal created in Codex goal tool |
| 2026-05-11 | Extension build | Passed `npm run build` |
| 2026-05-11 | Installed native path | Passed `npm run native-host:verify:windows -- --extension-id ianebfgjhjklildppcocmbmifedapooj --json --strict` with 7 pass / 0 warn / 0 fail under user-profile access |
| 2026-05-11 | `/daily` in-app browser check | Failed as expected: Codex in-app browser has no Architect extension content script |
| 2026-05-11 | `/daily` Chrome extension-surface check | Failed: `Check bridge` reported `Extension bridge` fail and `Native host / Codex` warn because the page bridge did not respond |
| 2026-05-11 | Chrome extension reload automation | Blocked: browser security policy prevents navigating automation to `chrome://extensions/?id=ianebfgjhjklildppcocmbmifedapooj`; user must reload the unpacked extension manually |
| 2026-05-11 | `/daily` missing-bridge guidance | Added clearer SaaS popup recovery guidance, verified with SaaS `npm run typecheck`, and confirmed the updated guidance appears in the `/daily` popup |
| 2026-05-11 | `/daily` Chrome extension-surface recheck | Still blocked after page refresh: `Extension bridge` fail, `Native host / Codex` warn, `Generation` fail; manual extension reload remains required |
| 2026-05-11 | Chrome profile extension registration | Passed `npm run extension:verify-chrome-profile -- --json --strict`; Chrome `Default` profile has extension id `ianebfgjhjklildppcocmbmifedapooj` pointing to `D:\architect-workspace\architect-browser-assistant\dist` |
| 2026-05-11 | Native host launcher and protocol hardening | Passed `npm run test`, `npm run typecheck`, `npm run lint`, and `npm run native-host:verify:windows -- --extension-id ianebfgjhjklildppcocmbmifedapooj --json --strict` with 11 pass / 0 fail |
| 2026-05-11 | `/daily` Chrome extension-surface bridge proof | Passed in the `/daily` in-page popup: `Extension bridge`, `Native host / Codex`, `Credentials`, and `Generation` all reported pass |

## Implementation Decisions

- Treat the SaaS `/daily` in-page assistant popup as the default user surface.
- Keep the Chrome side panel as a secondary diagnostics surface only.
- Use the installed extension id already registered in HKCU unless verification shows it is stale.
- Do not treat direct native-host script success as sufficient for this slice; it is only a prerequisite.
- When Chrome extension reload cannot be automated, stop at the explicit user action instead of bypassing browser security controls.
- Read one Chrome native message frame immediately instead of waiting for stdin EOF; Chrome keeps the native messaging pipe open while it waits for a response.
- Pin the native host launcher to an absolute user-level Codex wrapper path and fail verification for `Program Files\WindowsApps` packaged executable paths that produce `spawn EPERM`.

## Testing Decisions

- Run browser assistant `npm run build` and `npm run native-host:verify:windows -- --extension-id <id> --strict`.
- Run SaaS typecheck/build only if code changes in `architect-saas`.
- Prefer browser automation for `/daily` proof when the installed extension is reachable; otherwise document the exact manual blocker.
- Real generation may call external Codex/OpenAI through the user's Codex CLI and must remain explicit.

## Out of Scope

- Mobile assistant UX.
- Chrome Web Store packaging.
- Replacing the side panel.
- New SaaS persistence schema.

## Residual Risks

- The Codex in-app browser does not load the user's installed Chrome extension; installed-extension proof uses the user's Chrome profile.
- Chrome extension reload currently requires user-visible browser interaction because `chrome://extensions` is blocked to browser automation.
- Real generation still requires explicit user approval because selected task context and evidence are sent through Codex CLI to the external Codex/OpenAI service.

## User Approval Needed

The `/daily` bridge proof is ready. The next action is real Local Codex generation for selected task `001`, which sends the selected task context, question, and retrieved evidence through the user's Codex CLI to the external Codex/OpenAI service. The active goal remains open until real generation and saved-record evidence are recorded.

## Next Slice Candidate

If `/daily` browser proof passes, improve operator-facing diagnostics and saved-record evidence display for Local Codex runs.
