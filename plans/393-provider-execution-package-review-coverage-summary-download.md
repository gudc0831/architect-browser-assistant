# Slice 393: Provider execution package review coverage group summary Markdown download

## Product Context

Slice 392 added count chips above the provider execution package coverage group summary preview. Reviewers can now inspect and copy the compact Markdown summary, but sometimes need a local Markdown artifact for handoff or audit review without using the server.

## Goal

Add a client-side Markdown download action for the provider execution package review coverage group summary.

## Scope

- Add `Download group summary` beside the grouped coverage summary controls.
- Download the same Markdown string shown in the preview and copied by `Copy group summary`.
- Use a provider execution package coverage summary filename with the report date.
- Preserve summary filter chips, summary count chips, summary preview, copy action, grouped headings, density controls, empty-state guidance, row chips, and digest focus actions.
- Keep the action client-side and read-only with no server writes, provider writes, package mutations, or review-note mutations.

## Implementation Decisions

- Reuse the existing `downloadTextFile` client helper in `architect-saas`.
- Use `text/markdown` MIME type and the report `generatedAt` date in the filename.
- Keep report API, CSV export, and full review handoff payload unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added `Download group summary` in `architect-saas` beside the grouped coverage summary controls. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Browser UI download validation passed. |

## Verification Log

- 2026-05-14 11:26 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 11:26 KST: `npm run lint` passed in `architect-saas` with the pre-existing hook dependency warnings.
- 2026-05-14 11:26 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })` still returns coverage group totals.
- 2026-05-14 11:27 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 11:27 KST: Browser UI validation passed on desktop and mobile against `next start`; `Download group summary` produced `provider-execution-package-coverage-summary-2026-05-14.md`, and the downloaded Markdown matched the visible summary preview. The local auth-stub run still emitted the known unrelated `/api/project/changes` Prisma polling noise.

## Out of Scope

- Server-side summary archive records.
- Saved summary snapshots.
- Changing the existing full review handoff copy.
- Mutating retained provider execution packages or package review notes.
- Changing CSV export columns or handoff payload format.

## Next Candidate

Add provider execution package review coverage group summary download status chip.
