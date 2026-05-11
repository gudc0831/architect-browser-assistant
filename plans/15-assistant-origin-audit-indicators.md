# 15. Assistant Origin Audit Indicators PRD

Created: 2026-05-11
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 15 assistant-origin audit indicators in task detail/history for approved assistant summary task changes.
Worklog: [../docs/worklogs/2026-05-11-1610-assistant-origin-audit-indicators.md](../docs/worklogs/2026-05-11-1610-assistant-origin-audit-indicators.md)

## Problem Statement

Slice 14 lets an operator apply approved assistant summaries to a task decision and create follow-up child tasks, but the normal task detail view still makes those assistant-origin changes look like ordinary text. Operators need visible provenance without opening raw assistant logs.

## Solution

Add lightweight assistant-origin indicators to the existing task detail surface:

1. Detect approved assistant summary markers in task decisions.
2. Detect assistant-created follow-up tasks from their `Source assistant record` metadata.
3. On a parent task, show assistant record IDs and assistant-created child task IDs.
4. On a child follow-up task, show the source assistant record and parent task reference.
5. Keep this as read-only provenance; do not alter editing or save requirements.

## User Stories

1. As an operator, I can see that a task decision came from an approved assistant summary.
2. As an operator, I can see which follow-up tasks were created from assistant output.
3. As a reviewer, I can trace assistant-origin changes from task detail without opening raw logs.

## Acceptance Criteria

1. Task detail shows approved assistant summary record IDs parsed from the decision field.
2. Parent task detail shows assistant-created child task IDs and their source assistant record IDs.
3. Follow-up child task detail shows its source assistant record and parent task reference.
4. The indicator is read-only and does not change manual task editing behavior.
5. Static and browser verification evidence is recorded.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 15 PRD and roadmap entry | done | browser docs commit | this worklog | Document created |
| Detail-panel assistant provenance parser | done | architect-saas commit | SaaS worklog | Parsed approved summary and source assistant record markers |
| Parent/child assistant indicator UI | done | architect-saas commit | SaaS worklog | Parent task showed approved record and assistant-created child task `202` |
| Browser verification on `/daily` | done | architect-saas commit | this worklog | Passed in Codex in-app browser against `http://localhost:3000/daily` |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-11 | Goal creation | Active Goal 15 created in Codex goal tool |
| 2026-05-11 | SaaS static checks | `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing hook dependency warnings outside Slice 15 |
| 2026-05-11 | `/daily` browser proof | Task `001` detail panel showed `AI provenance`, approved summary record id, assistant-created follow-up task `202`, and source assistant record id |

## Out of Scope

- New persistent audit tables.
- Admin audit dashboard changes.
- Mobile-specific provenance UI.
- Changing the assistant summary approval flow.

## Next Slice Candidate

Add a structured assistant-action audit API/table so task changes no longer depend only on text markers for provenance.
