# 08. Local Codex Health Checklist PRD

Created: 2026-05-11
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 08 Local Codex bridge health checklist for the `/daily` in-page assistant popup.
Worklog: [../docs/worklogs/2026-05-11-1325-local-codex-health-checklist.md](../docs/worklogs/2026-05-11-1325-local-codex-health-checklist.md)

## Problem Statement

The `/daily` in-page popup can now call the Local Codex extension bridge, but a user cannot quickly tell which installation layer is failing when Local Codex does not respond. The next product goal needs an operator-facing checklist that keeps normal work in the SaaS popup while making extension/native-host/Codex readiness visible.

Real Chrome native host registration and authenticated generation still depend on the user's Windows Chrome profile, but the app can make the failure boundary clear before asking the user to debug registry entries manually.

## Solution

Add an in-page Local Codex health checklist:

1. Show a `Check bridge` action only when the popup execution mode is `Local Codex (extension)`.
2. Use the existing page-to-content-script `status` bridge request as the health probe.
3. Distinguish no bridge response from a bridge response with native host or Codex CLI errors.
4. Display checklist rows for extension content script, native host/Codex availability, credential storage policy, and generation readiness.
5. Keep the Chrome side panel as a manual diagnostic surface, not the default workflow.

## User Stories

1. As an architecture task user, I can click one button inside `/daily` to see whether Local Codex is ready before generating an answer.
2. As an operator, I can distinguish "extension not loaded" from "native host/Codex unavailable" without opening the side panel first.
3. As a security reviewer, I can see that the Local Codex mode still does not store Codex/OpenAI credentials in SaaS or browser storage.
4. As a developer, I can verify the checklist through typecheck/build and keep real Chrome registration as a documented manual verification step.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 08 PRD and active goal documentation | done | pending | this worklog | Document updated |
| `/daily` Local Codex health checklist UI | done | cross-repo pending | SaaS worklog | `npm run typecheck`, `npm run lint`, `npm run build` |
| Checklist status classification | done | cross-repo pending | SaaS worklog | `npm run typecheck`, `npm run build` |
| User guide and roadmap update | done | pending | this worklog + SaaS worklog | Document updated |
| Real installed-extension authenticated generation | deferred | - | - | Requires user Chrome profile/native host registration |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-11 | Goal creation | Active goal created in Codex goal tool |
| 2026-05-11 | SaaS checklist implementation | `npm run typecheck`, `npm run lint`, `npm run build` passed; lint has pre-existing hook warnings outside this slice |
| 2026-05-11 | Browser assistant static verification | `npm run typecheck`, `npm run test`, `npm run build` passed |
| 2026-05-11 | `/daily` availability | `Invoke-WebRequest http://localhost:3000/daily` returned 200 OK |

## Implementation Decisions

- The checklist probes the existing `status` route instead of adding a new privileged browser command.
- A timeout means the content script bridge did not respond, usually because the extension is not loaded or the page was not refreshed after extension reload.
- A response with `available: false` means the in-page bridge is alive, but the native host or Codex CLI/login path is not ready.
- The checklist is advisory; it does not write assistant records and does not store credentials.

## Testing Decisions

- Verify SaaS typecheck/lint/build because the UI is client-side and compiled into the Next.js `/daily` page.
- Verify browser assistant typecheck/test/build if the extension bridge contract changes.
- Manual Chrome generation remains a separate verification step because it requires the user's actual extension id and native host registry entry.

## Out of Scope

- Automatic Windows registry inspection from the SaaS web page.
- Automatic Chrome extension reload/install.
- Mobile Local Codex UX.
- Storing or syncing Codex/OpenAI credentials.
- Changing assistant persistence schema.

## Residual Risks

- The checklist can infer native host/Codex readiness only from the status response text returned by the extension/native host path.
- Real authenticated generation cannot be proven by automated repo tests alone.

## Next Slice Candidate

Run and record real installed-extension Local Codex generation from `/daily` on the target Windows profile, including the actual failure/success evidence from the health checklist.
