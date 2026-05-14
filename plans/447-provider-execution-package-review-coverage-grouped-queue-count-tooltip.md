# Slice 447: Provider execution package review coverage grouped queue count tooltip

## Product Context

Slice 446 adds section-level context. The count chip inside each section also needs a tooltip because it is the compact signal reviewers scan while comparing stale, unreviewed, and reviewed buckets.

## Goal

Add tooltips to provider execution package coverage grouped queue count chips.

## Scope

- Add dynamic title tooltips to each grouped queue count.
- Repeat the visible package count under the active filters.
- Preserve queue grouping, row rendering, summary preview, copy/download actions, and report API.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Use a dynamic `title` on the existing queue count span.
- Use the existing queue row count without adding new derivation.
- Keep the tooltip read-only and filter-scoped.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added grouped queue count tooltips in `architect-saas` commit `abd5a867495649f6e709fc0682def150c4514787`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Playwright Browser UI count tooltip checks passed. |

## Verification Log

- 2026-05-14 16:29 KST: `npm run typecheck` passed in both repos.
- 2026-05-14 16:30 KST: `npm run lint` passed in both repos; `architect-saas` retained only pre-existing hook warnings.
- 2026-05-14 16:31 KST: Provider review note report validation returned coverage count 4 and group total 4.
- 2026-05-14 16:33 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 16:40 KST: Playwright desktop validation confirmed queue count titles include visible package count under active filters.

## Out of Scope

- Changing count labels.
- Adding rollup chips.
- Persisting count snapshots.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage grouped queue rows tooltip.
