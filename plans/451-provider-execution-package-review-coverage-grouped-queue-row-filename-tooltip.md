# Slice 451: Provider execution package review coverage grouped queue row filename tooltip

## Product Context

Slice 450 explains the row status label. The filename line also needs tooltip context because it is the local provider execution package evidence file reviewers use for handoff and review.

## Goal

Add a tooltip to provider execution package coverage grouped queue row filename lines.

## Scope

- Add a static title tooltip to each row filename line.
- Explain that the filename identifies the local provider execution package evidence file.
- Preserve row actions, queue grouping, summary preview, copy/download actions, and report API.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Use a static `title` on the existing row filename paragraph.
- Keep filename rendering unchanged.
- Keep the tooltip read-only and evidence-file focused.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added grouped queue row filename tooltips in `architect-saas` commit `abd5a867495649f6e709fc0682def150c4514787`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Playwright Browser UI filename tooltip checks passed. |

## Verification Log

- 2026-05-14 16:29 KST: `npm run typecheck` passed in both repos.
- 2026-05-14 16:30 KST: `npm run lint` passed in both repos; `architect-saas` retained only pre-existing hook warnings.
- 2026-05-14 16:31 KST: Provider review note report validation returned coverage count 4 and group total 4.
- 2026-05-14 16:33 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 16:40 KST: Playwright desktop validation confirmed the row filename tooltip.

## Out of Scope

- Changing filename generation.
- Adding filename copy actions.
- Creating a server-side archive.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage grouped queue row chips tooltip.
