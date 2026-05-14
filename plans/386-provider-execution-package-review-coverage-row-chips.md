# Slice 386: Provider execution package review coverage group row chips

## Product Context

Slice 385 grouped provider execution package review coverage rows into stale, unreviewed, and reviewed queues. The grouped rows still need compact scan fields so reviewers can compare state, note count, target, and stale/latest context without parsing row text.

## Goal

Add compact row chips to grouped provider execution package review coverage rows.

## Scope

- Show review-state, note-count, provider target, and latest-review or stale-threshold chips inside each grouped coverage row.
- Keep the grouped stale, unreviewed, and reviewed queue layout from Slice 385.
- Preserve row-level digest focus actions.
- Keep chips read-only with no saved views, provider writes, package mutations, or review-note mutations.

## Implementation Decisions

- Reuse existing source-chip styling in `architect-saas`.
- Add a small coverage-status label map so row chips display stable human-readable labels.
- Keep report API, CSV export, and handoff payload unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added grouped coverage row chips in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs. |
| Verification | completed | Typecheck, lint, API/service validation, build, and Browser UI validation completed. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed in `architect-saas`; remaining warnings are pre-existing task hook dependency warnings outside this slice.
- Direct `getKnowledgeProviderExecutionPackageReviewNoteReport` validation confirmed coverage rows expose status, note count, target, and stale-days values needed by the chips.
- `npm run build` passed in `architect-saas`.
- Browser UI validation on `next start -p 3001` with local auth override confirmed the row chips render at 1440x900 and 390x844.
- Known unrelated local `/api/project/changes` Prisma error appeared during Browser UI verification and did not block the row chip checks.

## Out of Scope

- Saved row chip display preferences.
- Server-side row-chip payload changes.
- New review-note categories.
- Mutating retained provider execution packages or package review notes.
- Changing CSV export columns or handoff payload format.

## Next Candidate

Add provider execution package review coverage queue density controls.
