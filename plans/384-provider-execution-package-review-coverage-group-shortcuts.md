# Slice 384: Provider execution package review coverage group shortcuts

## Product Context

Slice 383 added read-only coverage group totals for provider execution package review rows. Reviewers can see reviewed, unreviewed, and stale counts, but still need to manually change the review-state selector before scanning the matching queue.

## Goal

Add read-only shortcuts from provider execution package review coverage totals to the matching review-state queue.

## Scope

- Add reviewed, unreviewed, and stale shortcuts to the provider execution package coverage totals.
- Shortcuts update only the existing review-state filter.
- Preserve active digest, reviewer, note-type, execution, and stale-days filters.
- Keep shortcuts read-only with no saved views, provider writes, package mutations, or review-note mutations.

## Implementation Decisions

- Reuse the existing client-side `coveragePreset` state in `architect-saas`.
- Keep the report API unchanged because Slice 383 already exposes filtered coverage group totals.
- Show shortcuts on the reviewed, unreviewed, and stale total cards, not on all visible, because the requested workflow is group focus.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added coverage total shortcuts in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs. |
| Verification | completed | Typecheck, lint, API/service validation, build, and Browser UI validation completed. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed in `architect-saas`; remaining warnings are pre-existing task hook dependency warnings outside this slice.
- Direct `getKnowledgeProviderExecutionPackageReviewNoteReport` validation confirmed `all`, `reviewed`, `unreviewed`, and `stale_unreviewed` coverage presets still return valid reports and filtered coverage totals.
- `npm run build` passed in `architect-saas`.
- Browser UI validation on `next start -p 3001` with local auth override confirmed `Focus reviewed`, `Focus unreviewed`, and `Focus stale` render at 1440x900 and 390x844.
- Browser UI validation confirmed each shortcut updates only the review-state filter while preserving digest, reviewer, note-type, and stale-days filters.
- Known unrelated local `/api/project/changes` Prisma error appeared during Browser UI verification and did not block the provider review shortcut checks.

## Out of Scope

- Saved coverage group views.
- New review-note categories.
- Server-side persisted shortcut state.
- Mutating retained provider execution packages or package review notes.
- Changing CSV export columns or handoff payload format.

## Next Candidate

Add provider execution package review coverage queue grouping.
