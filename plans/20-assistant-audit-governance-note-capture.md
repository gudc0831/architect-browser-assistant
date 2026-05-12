# 20. Assistant Audit Governance Note Capture PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 20 assistant audit governance note capture for operational review.
Worklog: [../docs/worklogs/2026-05-12-1002-assistant-audit-governance-note-capture.md](../docs/worklogs/2026-05-12-1002-assistant-audit-governance-note-capture.md)

## Problem Statement

Slice 19 added a read-only drill-down for each structured assistant action audit record. Admins can review the evidence, but they cannot capture their governance review outcome without editing task or audit metadata. Governance notes must be append-only so the immutable assistant action audit remains trustworthy.

## Solution

Add append-only governance notes to the assistant action audit drill-down:

1. Store each note as a separate admin audit event linked to the source assistant action audit id.
2. Keep the original assistant action audit event metadata unchanged.
3. Add a note category and note text form in the drill-down panel.
4. Show existing notes in the drill-down with reviewer id and timestamp.
5. Leave export package expansion for a later slice.

## Acceptance Criteria

1. Admin users can add append-only governance notes from an assistant action audit drill-down.
2. Notes store reviewer id, timestamp, category, text, source audit id, and source assistant record id.
3. Notes appear in the drill-down after save without mutating the original audit event.
4. The API applies admin/project authorization and validates category/text.
5. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 20 PRD and roadmap entry | done | browser this commit | browser worklog | Document created and roadmap updated |
| Governance note append API | done | SaaS `c4bc6c4` | SaaS worklog | Note POST and detail API checks passed |
| Governance note UI in drill-down | done | SaaS `c4bc6c4` | SaaS worklog | Browser note form/list/save verified |
| User guide and worklogs | done | SaaS `c4bc6c4`; browser this commit | SaaS/browser worklogs | User guide and worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: assistant audit governance note capture |
| 2026-05-12 | Static checks | SaaS `npm run typecheck` passed; SaaS `npm run lint` passed with 7 pre-existing hook dependency warnings; browser-assistant `npm run typecheck` and `npm run lint` passed |
| 2026-05-12 | API proof | `POST /api/admin/assistant/action-audits/{auditId}/notes?month=2026-05` created an append-only note event; detail API returned governance notes for the source audit |
| 2026-05-12 | Browser proof | `/admin/assistant` drill-down showed `Governance notes`, note category/text fields, enabled `Add note`, save status, and newly appended note in the list |
| 2026-05-12 | Residual environment note | Browser console still showed pre-existing `/api/project/changes` 500 polling errors unrelated to governance note capture |

## Out of Scope

- Editing or deleting governance notes.
- Exporting governance notes in CSV/evidence packages.
- Full approval workflow or sign-off states.
- Backfilling historical review comments.

## Next Slice Candidate

Add assistant audit evidence package export that includes action audit records, governance drill-down data, and append-only governance notes.
