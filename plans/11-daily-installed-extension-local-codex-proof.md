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
| Slice 11 PRD and active goal documentation | done | pending | this worklog | Document updated |
| Extension build and installed-path verification | done | pending | this worklog | `npm run build` passed; installed-path verifier passed with 7 pass / 0 fail under user profile access |
| `/daily` browser `Check bridge` evidence | blocked | - | this worklog | Chrome `/daily` page loaded, but extension content script did not respond |
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

## Implementation Decisions

- Treat the SaaS `/daily` in-page assistant popup as the default user surface.
- Keep the Chrome side panel as a secondary diagnostics surface only.
- Use the installed extension id already registered in HKCU unless verification shows it is stale.
- Do not treat direct native-host script success as sufficient for this slice; it is only a prerequisite.
- When Chrome extension reload cannot be automated, stop at the explicit user action instead of bypassing browser security controls.

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

- The Codex in-app browser may not load the user's installed Chrome extension; proof may require the user's Chrome profile.
- Chrome extension reload currently requires user-visible browser interaction because `chrome://extensions` is blocked to browser automation.
- The next slice may need a dedicated browser proof harness if extension UI automation remains fragile.

## User Action Needed

1. Open `chrome://extensions` in Chrome.
2. Find `Architect Browser Assistant` with extension id `ianebfgjhjklildppcocmbmifedapooj`.
3. Click reload for the unpacked extension.
4. Refresh `http://localhost:3000/daily`.
5. Tell Codex to continue; the active goal remains open until `Check bridge`, real generation, and saved-record evidence are recorded.

## Next Slice Candidate

If `/daily` browser proof passes, improve operator-facing diagnostics and saved-record evidence display for Local Codex runs.
