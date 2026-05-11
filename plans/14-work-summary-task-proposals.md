# 14. Work Summary Task Proposals PRD

Created: 2026-05-11
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 14 approved work-summary task update suggestions and follow-up task proposals for the `/daily` in-page assistant popup.
Worklog: [../docs/worklogs/2026-05-11-1530-work-summary-task-proposals.md](../docs/worklogs/2026-05-11-1530-work-summary-task-proposals.md)

## Problem Statement

The `/daily` in-page assistant can generate, save, and approve work summaries, but approved summaries still end at the assistant summary layer. Operators need a safe bridge from approved assistant output into the actual task record without letting generated text mutate task state automatically.

## Solution

After a work summary is approved, show two optional proposals in the same in-page popup:

1. A task record update proposal that appends the approved summary to the task decision field and suggests a conservative status update.
2. A follow-up task proposal that creates a child task from the approved follow-up action.
3. Each proposal must require its own explicit button click after summary approval.
4. Neither proposal runs automatically when a summary is approved.

## User Stories

1. As an operator, I can approve an assistant summary and then decide whether that summary should update the task record.
2. As an operator, I can create a follow-up task from the approved follow-up action without retyping the context.
3. As a reviewer, I can see that assistant-generated task changes require separate user confirmation.

## Acceptance Criteria

1. Approved work-summary fields are shown as task update and follow-up task proposals.
2. The task record is not edited by the summary approval action alone.
3. The task update proposal applies through the existing task PATCH API with task version control.
4. The follow-up proposal creates a child task through the existing task POST API.
5. Verification evidence is recorded in both browser-assistant and SaaS worklogs.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 14 PRD and active goal documentation | done | browser docs commit | this worklog | Document created |
| Approved-summary proposal UI | done | architect-saas commit | SaaS worklog | Browser showed `Task 반영 제안` only after summary approval |
| Task update confirmation action | done | architect-saas commit | SaaS worklog | Explicit PATCH action succeeded and disabled its button |
| Follow-up child task confirmation action | done | architect-saas commit | SaaS worklog | Explicit POST action created child task `202` and disabled its button |
| Browser verification on `/daily` | done | architect-saas commit | this worklog | Passed in Codex in-app browser against `http://localhost:3000/daily` |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-11 | Goal creation | Active goal created in Codex goal tool |
| 2026-05-11 | SaaS static checks | `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing hook dependency warnings outside Slice 14 |
| 2026-05-11 | `/daily` browser proof | Task `001` Mock flow displayed post-approval proposals, applied the task update only after explicit confirmation, and created follow-up child task `202` only after explicit confirmation |

## Out of Scope

- Automatic task completion or bulk status changes.
- Mobile assistant UX.
- Chrome side-panel UX changes.
- Admin WIKI promotion changes.

## Next Slice Candidate

After proposal actions are verified, add lightweight audit indicators to the task history/detail view so users can see which task changes came from approved assistant summaries.
