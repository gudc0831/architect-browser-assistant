# 16. Structured Assistant Action Audit PRD

Created: 2026-05-11
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 16 structured assistant-action audit persistence for approved assistant task changes.
Worklog: [../docs/worklogs/2026-05-11-1621-structured-action-audit.md](../docs/worklogs/2026-05-11-1621-structured-action-audit.md)

## Problem Statement

Slice 15 shows assistant provenance by parsing task decision and child-task note markers. That works as a fallback, but provenance should not depend only on editable text fields.

## Solution

Persist structured assistant action audit events when a user explicitly applies an approved assistant summary to a task or creates a follow-up task:

1. Reuse the existing SaaS assistant audit event repository.
2. Add `/api/assistant/action-audits` for task-scoped read/write.
3. Write `task_update_applied` and `follow_up_task_created` audit records from the `/daily` in-page assistant popup.
4. Read structured action audits in the `/daily` task detail panel.
5. Preserve the Slice 15 text-marker parser as a fallback.

## Acceptance Criteria

1. Task update proposal application writes a structured audit record with assistant record id, source task, target task, status movement, and summary.
2. Follow-up task creation writes a structured audit record with assistant record id, parent/source task, and created task id.
3. `/daily` task detail shows `Structured audit records` when structured audits exist.
4. Existing `AI provenance` text-marker fallback still works for older data.
5. Static checks, API checks, and browser verification are recorded.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 16 PRD and roadmap entry | done | browser docs commit | this worklog | Document created |
| Action audit API | done | architect-saas commit | SaaS worklog | GET/POST checked against local dev |
| Popup action audit writes | done | architect-saas commit | SaaS worklog | Task update and follow-up actions call the audit API |
| Detail-panel structured audit UI | done | architect-saas commit | SaaS worklog | Browser showed structured task update and follow-up audit records |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-11 | Static checks | `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing hook dependency warnings |
| 2026-05-11 | API proof | `GET /api/assistant/action-audits?taskId=arch-task-001` returned saved update and follow-up action audits |
| 2026-05-11 | `/daily` browser proof | Task `001` detail panel showed `Structured audit records`, `Task update applied`, `Follow-up task created`, source record id, and follow-up task `202` |

## Out of Scope

- A full admin audit dashboard.
- Backfilling every historical text marker into structured audit records.
- Mobile-specific audit UI.

## Next Slice Candidate

Add an admin-facing assistant action audit review surface with filters by task, action, assistant record, and actor.
