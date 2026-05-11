# 07. In-Page Local Codex Bridge PRD

Created: 2026-05-11
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 07 in-page Local Codex bridge for the `/daily` assistant popup.
Worklog: [../docs/worklogs/2026-05-11-1307-in-page-local-codex-bridge-planning.md](../docs/worklogs/2026-05-11-1307-in-page-local-codex-bridge-planning.md)

## Problem Statement

Slice 06 proved the Chrome native messaging bridge through the manually opened side panel, but the product direction now makes the SaaS in-page `/daily` assistant popup the default PC workflow. Users should not have to leave the daily task list or rely on the Chrome side panel to generate architecture task guidance.

## Solution

Expose the already-built extension/native-host local runtime to the SaaS page through a narrow page-to-content-script bridge:

1. The SaaS `/daily` popup keeps the bottom-right `AI review` workflow as the primary user surface.
2. A new popup execution mode, `Local Codex (extension)`, sends `status` and `generate` requests to the extension content script with `window.postMessage`.
3. The extension content script validates same-window, same-origin requests and forwards supported commands to the MV3 service worker.
4. The service worker continues to own native messaging and Codex execution.
5. The SaaS app stores generated assistant records with execution mode `local-chatgpt-codex` and runtime mode `extension-native-bridge-in-page`.
6. The Chrome side panel remains available only as a manual diagnostic surface and is not the default UI.

## User Stories

1. As an architecture task user, I can select a task in `/daily`, open the in-page `AI review` popup, and run Local Codex without switching to a separate side panel.
2. As an operator, I can keep the Chrome side panel hidden during normal work while still opening it manually for bridge diagnostics.
3. As a security reviewer, I can verify that page messages are restricted to the same window and origin, and that Codex credentials are not stored in the SaaS app or extension storage.
4. As a project manager, I can distinguish local Codex generated records from mock and SaaS API generated records.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 07 PRD and goal documentation | done | pending | this worklog | Document updated |
| Content-script page bridge for `status` and `generate` | done | pending | this worklog | `npm run typecheck`, `npm run lint`, `npm run build` |
| SaaS `/daily` popup Local Codex execution mode | done | cross-repo pending | SaaS worklog | `npm run typecheck`, `npm run lint`, `npm run build` |
| Assistant record execution-mode mapping | done | cross-repo pending | SaaS worklog | `npm run typecheck`, `npm run build` |
| Side panel remains manual/secondary | done | previous commit | 2026-05-11-1138 worklogs | Verified by code and docs |
| Real installed-extension smoke test | deferred | - | - | Requires the user's loaded Chrome extension id and native host registration |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-11 | Browser assistant type and static checks | `npm run typecheck`, `npm run lint` passed |
| 2026-05-11 | Browser assistant unit tests | `npm run test` passed: 6 files, 13 tests |
| 2026-05-11 | Native host mock protocol | `npm run native-host:self-test` passed |
| 2026-05-11 | Browser assistant production bundle | `npm run build` passed |
| 2026-05-11 | SaaS popup type/static/build checks | `npm run typecheck`, `npm run lint`, `npm run build` passed; lint has pre-existing hook warnings outside this slice |

## Implementation Decisions

- The page bridge supports only `status` and `generate`; it does not expose arbitrary extension commands.
- The bridge accepts messages only when `event.source === window` and `event.origin === window.location.origin`.
- The SaaS app calls the bridge only from the browser runtime; no server-side API key or Codex credential is introduced.
- The generated answer is normalized before saving so a malformed native response still creates a reviewable draft shape or a clear error.
- `local-codex` is a UI-only value; persisted assistant records use the existing domain value `local-chatgpt-codex`.

## Testing Decisions

- Use TypeScript checks for the typed page bridge and UI mode changes.
- Keep native host protocol coverage in the browser-assistant test suite.
- Use build verification in both repos because this slice crosses MV3 bundle generation and Next.js client compilation.
- Defer real Chrome native host execution until the user reloads the built extension and registers the final extension id.

## Out of Scope

- Mobile assistant UX.
- Replacing the side panel diagnostics UI.
- Automatic Chrome extension reload/install automation.
- Storing Codex/OpenAI credentials in SaaS, browser storage, or local files.
- New SaaS database schema.

## Residual Risks

- The in-page Local Codex mode requires the rebuilt extension content script to be loaded on the SaaS origin.
- Real generation still depends on the user's Windows native host registration and authenticated Codex CLI.
- If the extension is not loaded, the SaaS popup times out and reports that the bridge did not respond.

## Next Slice Candidate

Verify real installed-extension Local Codex generation from `/daily`, then add an operator-facing bridge health checklist that confirms extension id, native host registry entry, Codex CLI availability, and authenticated generation.
