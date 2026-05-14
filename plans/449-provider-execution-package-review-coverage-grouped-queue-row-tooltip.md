# Slice 449: Provider execution package review coverage grouped queue row tooltip

## Product Context

Slice 448 clarifies row regions. Each row also needs a tooltip so reviewers can understand which package file, review coverage state, and provider sync target the row represents.

## Goal

Add tooltips to individual provider execution package coverage grouped queue rows.

## Scope

- Add dynamic title tooltips to each grouped queue row article.
- Include package filename, review coverage state, and provider sync target.
- Preserve row actions, queue grouping, summary preview, copy/download actions, and report API.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Use a dynamic `title` on the existing row article.
- Reuse existing row fields already rendered in the UI.
- Keep the tooltip read-only and tied to visible row data.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added grouped queue row tooltips in `architect-saas` commit `abd5a867495649f6e709fc0682def150c4514787`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Playwright Browser UI row tooltip checks passed. |

## Verification Log

- 2026-05-14 16:29 KST: `npm run typecheck` passed in both repos.
- 2026-05-14 16:30 KST: `npm run lint` passed in both repos; `architect-saas` retained only pre-existing hook warnings.
- 2026-05-14 16:31 KST: Provider review note report validation returned coverage count 4 and group total 4.
- 2026-05-14 16:33 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 16:40 KST: Playwright desktop validation confirmed row article titles include queue and provider target context.

## Out of Scope

- Changing row sorting.
- Adding row expansion.
- Changing focus digest behavior.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage grouped queue row status tooltip.
