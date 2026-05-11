# 12. Local Codex Run History And Diagnostics PRD

Created: 2026-05-11
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 12 Local Codex run history and diagnostics display in the `/daily` in-page assistant popup.
Worklog: [../docs/worklogs/2026-05-11-1452-local-codex-run-history-diagnostics.md](../docs/worklogs/2026-05-11-1452-local-codex-run-history-diagnostics.md)

## Problem Statement

Slice 11 proved that the default `/daily` in-page assistant popup can call the installed Chrome extension, native host, and Local Codex path, and can save a `local-chatgpt-codex` assistant record. Operators still need to see that proof in the task popup without leaving the daily list or reading backend data.

## Solution

Expose recent assistant records for the selected task in the `/daily` popup and make Local Codex diagnostics more actionable:

1. Add a task-scoped assistant records read API in `architect-saas`.
2. Show recent records in the in-page popup with execution mode, runtime mode, save time, confidence, evidence count, and a short answer/summary preview.
3. Make Local Codex health failures distinguish page bridge, native host/Codex, credential, and generation readiness states.
4. Refresh history after a new assistant run is saved.
5. Verify in `/daily` with existing Local Codex record `001`.

## User Stories

1. As an operator, I can confirm from the task popup that the last run used Local Codex.
2. As an operator, I can compare Local Codex, SaaS API, and mock runs without opening Admin or database tools.
3. As a developer, I can verify saved run mode and runtime mode through the UI and a repeatable command.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 12 PRD and active goal documentation | done | architect-browser-assistant docs commit | this worklog | Document created |
| Task-scoped assistant records API | done | architect-saas `fa2b0f0` | SaaS worklog | `GET /api/assistant/records?taskId=arch-task-001` returned task-scoped records |
| `/daily` popup recent run history | done | architect-saas `fa2b0f0` | SaaS worklog | Browser showed task 001 history count 12 with latest `Local Codex / 47% / extension bridge / evidence 10` |
| Local Codex diagnostics display cleanup | done | architect-saas `fa2b0f0` | SaaS worklog | Browser showed `Page bridge missing` diagnostic when extension bridge was not injected |
| Browser verification on `/daily` | done | architect-saas `fa2b0f0` | this worklog | Passed in Codex in-app browser against `http://localhost:3000/daily` |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-11 | Goal creation | Active goal created in Codex goal tool |
| 2026-05-11 | SaaS static checks | `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing hook dependency warnings outside Slice 12 |
| 2026-05-11 | Saved Local Codex record | `npm run assistant:verify-record -- --backend-mode local --execution-mode local-chatgpt-codex --runtime-mode extension-native-bridge-in-page --question-contains 001 --since-minutes 240 --json --strict` matched record `5a17423c-c291-4609-98b6-a39d6634d968` |
| 2026-05-11 | `/daily` browser proof | Task 001 popup showed recent history, latest Local Codex runtime evidence, and actionable Local Codex diagnostic text |

## Implementation Decisions

- Keep the default user surface as the SaaS `/daily` in-page assistant popup.
- Use a SaaS API contract for record history; the extension must not read storage or database internals.
- Display runtime details compactly so the popup remains usable beside the daily list.
- Do not trigger a new real Local Codex generation unless explicit user approval is provided.

## Testing Decisions

- Run SaaS `npm run typecheck` and `npm run lint`.
- Run the existing assistant record verifier for the Local Codex record created in Slice 11.
- Use browser verification on `/daily` to confirm the history and diagnostics are visible.

## Out of Scope

- Full assistant history page.
- Editing assistant records from the popup.
- Mobile assistant UX.
- New persistence schema.

## Residual Risks

- The current local data contains mojibake in older records; the UI should still present mode/timestamp/evidence metadata clearly.
- Cloud and local repositories share the API contract, but this slice verifies against the current local `/daily` data path.

## Next Slice Candidate

Improve task closure and work-summary approval flow for assistant-backed tasks.
