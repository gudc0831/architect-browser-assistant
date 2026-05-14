# Slice 436: Provider execution package review coverage summary stale priority chip tooltip

## Product Context

Slice 435 adds context to the review-needed chip. The stale priority chip also needs tooltip context for the active stale-day threshold.

## Goal

Add a tooltip to the provider execution package coverage summary stale priority chip.

## Scope

- Add a static title tooltip to the existing stale priority chip.
- Explain that stale priority compares visible unreviewed packages against the active stale-day threshold.
- Preserve stale priority calculation, grouped queues, summary preview, local handoff actions, and report API.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Use a static `title` on the existing chip-style stale priority container.
- Keep the tooltip read-only and focused on stale review priority semantics.
- Keep stale threshold filters and local state behavior unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the stale priority chip tooltip in `architect-saas` commit `c2160406b7588f1d80261ae46c3b376e93b601fa`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Playwright Browser UI stale-priority tooltip checks passed. |

## Verification Log

- 2026-05-14 16:17 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 16:17 KST: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-14 16:18 KST: `npm run lint` passed in `architect-saas` with the pre-existing task hook warnings.
- 2026-05-14 16:18 KST: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-14 16:20 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })`, filename `provider-execution-package-coverage-summary-2026-05-14.md`, and totals.
- 2026-05-14 16:21 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 16:22 KST: Playwright desktop and mobile validation confirmed Slice 435-443 titles, summary chips, and grouped coverage queue sections.

## Out of Scope

- Changing stale priority calculation.
- Changing stale-day filters.
- New action buttons or status chips.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary local-only handoff chip tooltip.
