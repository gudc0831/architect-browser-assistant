# Slice 435: Provider execution package review coverage summary review-needed chip tooltip

## Product Context

Slice 434 added a tooltip to the empty queue count chip. The review-needed chip needs the same tooltip treatment so reviewers can distinguish visible unreviewed packages from global provider package counts.

## Goal

Add a tooltip to the provider execution package coverage summary review-needed chip.

## Scope

- Add a static title tooltip to the existing review-needed chip.
- Explain that the count covers visible provider execution packages with no matching review note.
- Preserve review-needed count calculation, grouped queues, summary preview, local handoff actions, and report API.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Use a static `title` on the existing chip-style review-needed container.
- Keep the tooltip read-only and focused on visible review-note coverage.
- Keep queue grouping and local state behavior unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the review-needed chip tooltip in `architect-saas` commit `c2160406b7588f1d80261ae46c3b376e93b601fa`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Playwright Browser UI review-needed tooltip checks passed. |

## Verification Log

- 2026-05-14 16:17 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 16:17 KST: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-14 16:18 KST: `npm run lint` passed in `architect-saas` with the pre-existing task hook warnings.
- 2026-05-14 16:18 KST: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-14 16:20 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })`, filename `provider-execution-package-coverage-summary-2026-05-14.md`, and totals.
- 2026-05-14 16:21 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 16:22 KST: Playwright desktop and mobile validation confirmed Slice 435-443 titles, summary chips, and grouped coverage queue sections.

## Out of Scope

- Changing review-needed count calculation.
- Changing grouped queue layout.
- New action buttons or status chips.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary stale priority chip tooltip.
