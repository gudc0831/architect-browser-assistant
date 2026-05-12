# 35. Assistant Audit Cleanup Rollup Package PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup reviewer rollup package export.
Worklog: [../docs/worklogs/2026-05-12-1405-assistant-audit-cleanup-rollup-package.md](../docs/worklogs/2026-05-12-1405-assistant-audit-cleanup-rollup-package.md)

## Problem Statement

JSON and CSV coverage exports support automation and spreadsheets, but monthly governance review also needs a readable package that summarizes reviewers, categories, stale status, and coverage rows in one artifact.

## Solution

Add a Markdown rollup package:

1. Use the same filters as cleanup note report, summary, dashboard, CSV, and JSON exports.
2. Include filters, summary metrics, category counts, reviewer counts, stale threshold/counts, and coverage rows.
3. Add `Export rollup package` to the Admin cleanup note report.
4. Keep the package read-only and grounded in cleanup ids and archive preview tokens.

## Acceptance Criteria

1. Admin users can export a Markdown reviewer rollup package for the active filter scope.
2. Package includes summary metrics, category counts, reviewer counts, stale threshold/counts, and coverage rows.
3. Package is read-only and links evidence back to cleanup ids and tokens.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 35 PRD and roadmap entry | implemented | architect-browser-assistant `bf2ff60` | [browser worklog](../docs/worklogs/2026-05-12-1405-assistant-audit-cleanup-rollup-package.md) | PRD and roadmap updated |
| Markdown rollup export API | implemented | architect-saas `69c0211` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1405-assistant-audit-cleanup-rollup-package.md) | API returned Markdown attachment with title, reviewer counts, stale threshold, and token |
| Admin UI export action | implemented | architect-saas `69c0211` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1405-assistant-audit-cleanup-rollup-package.md) | Browser verified `Export rollup package` link |
| User guide and worklogs | implemented | architect-saas `69c0211`; architect-browser-assistant `bf2ff60` | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: cleanup reviewer rollup package export |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | API verification | `GET /api/admin/assistant/cleanup-review-notes/coverage/package?month=2026-05&category=review_note&archivePreviewToken=b0ad7bf1bf61cf86308c2afe&staleDays=7` returned `200`, Markdown attachment, rollup title, reviewer counts, stale threshold, and cleanup token. |
| 2026-05-12 | Browser verification | `agent-browser` verified `Export rollup package` link in cleanup review-note report. Console contained React DevTools and Fast Refresh logs only. |

## Out of Scope

- Signed evidence packages.
- Uploading packages to external storage.
- Changing per-cleanup Markdown package contents.

## Next Slice Candidate

Add cleanup review coverage filter presets so admins can quickly switch between all cleanup runs, stale unreviewed runs, and reviewed cleanup runs.
