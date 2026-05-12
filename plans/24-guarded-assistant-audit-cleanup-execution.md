# 24. Guarded Assistant Audit Cleanup Execution PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify guarded assistant audit cleanup execution that requires a matching archive preview token.
Worklog: [../docs/worklogs/2026-05-12-1100-guarded-assistant-audit-cleanup.md](../docs/worklogs/2026-05-12-1100-guarded-assistant-audit-cleanup.md)

## Problem Statement

Slice 23 made assistant action audit and governance-note retention visible through a read-only archive preview. Admins still need a guarded execution path for cleanup, but deletion must not be possible without first producing a matching archive preview/export and recording the cleanup decision as its own audit event.

## Solution

Add a guarded assistant audit cleanup flow:

1. Include a deterministic `archivePreviewToken` in the retention preview/export response.
2. Require cleanup requests to provide the same retention window, token, and explicit confirmation text.
3. Recompute the preview server-side, compare the token, and delete only the currently eligible assistant action audit/governance-note event ids.
4. Record an append-only cleanup audit event with token, cutoff, actor id, deleted ids, skipped ids, and count metadata.
5. Surface the cleanup control in `/admin/assistant` next to the retention preview, with clear eligible/deleted/skipped feedback.

## Acceptance Criteria

1. Admin users can run cleanup only after a matching archive preview/export token is generated for the same retention cutoff.
2. Cleanup requires explicit confirmation and reports deleted vs skipped event counts.
3. Cleanup writes an audit event containing archive preview token, cutoff, actor id, deleted ids, and skipped ids.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 24 PRD and roadmap entry | implemented | pending browser-assistant commit | [browser worklog](../docs/worklogs/2026-05-12-1100-guarded-assistant-audit-cleanup.md) | PRD and roadmap updated |
| Preview token | implemented | `architect-saas` `1b0be19` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1100-guarded-assistant-audit-cleanup.md) | Preview/export include deterministic archive preview token |
| Guarded cleanup API | implemented | `architect-saas` `1b0be19` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1100-guarded-assistant-audit-cleanup.md) | Token mismatch returned 400; matching token/cutoff/confirmation wrote cleanup audit |
| Admin UI cleanup controls | implemented | `architect-saas` `1b0be19` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1100-guarded-assistant-audit-cleanup.md) | Browser verified disabled default state and enabled guarded state |
| User guide and worklogs | implemented | pending repo commits | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: guarded assistant audit cleanup execution requiring archive preview/export token |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | API verification | `GET /api/admin/assistant/audit-retention?retentionDays=365&limit=500` returned token `b0ad7bf1bf61cf86308c2afe`, 6 relevant events, 0 eligible, 6 protected. POST with a bad token returned 400. POST with matching `cutoffAt`, token, and confirmation wrote cleanup audit `a9c28b2b-81f0-4879-9952-f6b8f1be18f5` with 0 deleted and 0 skipped. |
| 2026-05-12 | Browser verification | `agent-browser` verified `/admin/assistant`: default cleanup disabled, retention days `0` plus exact confirmation enabled `Run cleanup`, monthly row stayed 6/6/3/3, and 390px mobile cleanup panel rendered without obvious overlap. Screenshots saved under `architect-saas/output/browser-check/slice24-cleanup/`. |

## Out of Scope

- Background cleanup jobs.
- Cleanup for usage events or non-assistant audit domains.
- Restoring deleted audit events.
- Changing the assistant retention policy itself.

## Next Slice Candidate

Add assistant audit cleanup history reporting and export so admins can review cleanup runs separately from the live audit timeline.
