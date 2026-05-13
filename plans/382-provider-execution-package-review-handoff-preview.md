# Slice 382: Provider execution package review handoff preview

## Product Context

Slice 381 added reset chips for shortcut-applied provider execution package review filters. Reviewers can now narrow the report quickly and clear shortcut filters, but the copy action still requires trusting the generated handoff without seeing the final payload first.

## Goal

Add a read-only preview of the active provider execution package review handoff before clipboard copy.

## Scope

- Show active review filters that will be included in the handoff.
- Show summary counts for packages, reviewed, unreviewed, stale, and notes.
- Show reviewer and note-category counts.
- Show coverage rows that will be copied into the handoff.
- Show the generated Markdown handoff text before `Copy review handoff`.
- Keep the preview read-only and avoid saved views, server persistence, or package/review-note mutation.

## Implementation Decisions

- The preview reuses the existing loaded review report and handoff formatter.
- The preview is client-side only in `architect-saas`.
- The preview does not change CSV export, filters, coverage presets, stale-days, selected package focus, or clipboard behavior.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added active handoff preview in `architect-saas`. |
| Documentation | implemented | User guide, roadmap, and worklogs updated during the slice. |
| Verification | completed | Typecheck, lint, API/service validation, build, and Browser UI validation completed. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed in `architect-saas`; existing React hook dependency warnings remain in task components outside this slice.
- Direct `tsx` validation passed for `getKnowledgeProviderExecutionPackageReviewNoteReport`; the report returned 4 packages, 4 coverage rows, and all expected summary fields.
- `npm run build` passed in `architect-saas`.
- Browser UI validation passed on local auth-stub `next start -p 3001`: desktop and 390px mobile checks confirmed `Active review handoff preview`, `Read-only preview before copy`, active filter chips, coverage rows, and generated Markdown handoff text.
- Known unrelated local `/api/project/changes` Prisma EACCES polling errors appeared during browser verification and did not block the provider review preview checks.

## Out of Scope

- Saved handoff previews.
- Server-side preview records.
- Changing package review report API shape.
- Mutating retained provider execution packages or review notes.

## Next Candidate

Add provider execution package review coverage queue group totals.
