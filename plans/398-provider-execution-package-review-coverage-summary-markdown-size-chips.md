# Slice 398: Provider execution package review coverage group summary Markdown size chips

## Product Context

Slice 397 added the report generated-at chip for summary context. Reviewers can see when the report was generated, but they still lack compact size context for the exact Markdown being copied or downloaded.

## Goal

Show provider execution package review coverage group summary Markdown size chips.

## Scope

- Add line and character count chips near the grouped coverage summary status area.
- Derive counts from the exact summary string used by preview, copy, and download.
- Preserve active filters, generated-at chip, summary preview, copy/download actions, local status chips, reset action, grouped queues, density controls, and digest focus actions.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Compute the counts from `providerExecutionPackageCoverageGroupSummary`.
- Keep the chips read-only and updated with the current loaded report/filters.
- Leave report API shape unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added Markdown size chips in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Browser UI validation passed. |

## Verification Log

- 2026-05-14 10:59 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 11:00 KST: `npm run lint` passed in `architect-saas` with the pre-existing hook dependency warnings.
- 2026-05-14 10:59 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })` still returns coverage group totals.
- 2026-05-14 11:01 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 11:01 KST: Browser UI validation passed on desktop and mobile against `next start`; line and character chips matched the visible summary preview string.

## Out of Scope

- Summary compression or truncation.
- Changing the Markdown summary format.
- Server-side summary archive records.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary dominant queue chip.
