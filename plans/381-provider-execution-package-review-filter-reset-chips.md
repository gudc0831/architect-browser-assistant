# Slice 381: Provider execution package review filter reset chips

## Product Context

Slice 380 added digest quick filters and note-category summary chips. Once reviewers use those shortcuts, they need a visible way to clear shortcut-applied digest, note-category, and reviewer filters without manually editing each control.

## Goal

Add read-only reset chips for provider execution package review shortcut filters.

## Scope

- Show active reset controls for digest, note-category, and reviewer shortcut filters.
- Let admins clear each shortcut filter individually.
- Let admins clear all shortcut filters together.
- Keep CSV export, copy handoff, coverage preset, stale-days, target, status, artifact, and selected package focus behavior unchanged.

## Implementation Decisions

- Reset chips only change existing client-side controlled filter state.
- Reset chips do not create server saved views or mutate provider execution packages, review notes, or audit records.
- The digest reset clears the shared package digest filter used by package history and review report.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added digest, note-category, reviewer, and all-shortcut reset chips in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs. |
| Verification | completed | Typecheck, lint, build, API/service validation, and Browser UI validation completed. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed in `architect-saas`; existing hook dependency warnings remain in task components outside this slice.
- Direct service validation passed for `getKnowledgeProviderExecutionPackageReviewNoteReport` with digest, note-category, reviewer, coverage preset, and stale-days filters.
- `npm run build` passed in `architect-saas`.
- Browser UI validation passed on `http://localhost:3001/admin/knowledge`: digest, note-category, and reviewer shortcut filters produced visible reset chips; `Clear review shortcuts` returned the review report to no active shortcut filters and 4 package rows; mobile 390px rendering kept the reset chip region available.
- Console observation: repeated `GET /api/project/changes` 500 errors appeared during local auth-stub verification and are tracked as unrelated local polling noise for this slice.

## Out of Scope

- Saved review presets.
- Resetting non-shortcut filters such as target, status, artifact, coverage preset, stale-days, or selected execution focus.
- Server-side persistence for filter state.

## Next Candidate

Add provider execution package review active filter handoff preview before copy.
