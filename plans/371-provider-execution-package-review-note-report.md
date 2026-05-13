# Slice 371: Provider execution package review note report

## Product Context

Slice 370 lets admins add review notes to one provider execution package. Reviewers also need a cross-package report that finds notes by category, reviewer, digest, execution id, and review state.

## Goal

Add a provider execution package review-note report API and Admin UI report surface.

## Scope

- Add a read-only report API for provider execution package review notes.
- Include execution metadata with every note row.
- Support category, reviewer, package digest, execution id, and coverage preset filters.
- Show report results in Admin Knowledge without mutating source notes or packages.

## Implementation Decisions

- Report rows are derived from append-only note events and retained provider execution audit metadata.
- Filtering is read-only and does not create audit events.
- The selected package id is used as a focused report filter in the UI.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| SaaS service/API | implemented | Added provider execution package review-note report assembly. |
| Admin UI | implemented | Added report loading and focused report panel under package history. |
| Documentation | implemented | Roadmap/worklogs updated in the slice batch. |
| Verification | completed-with-blocker | typecheck, lint, build, and direct API verification passed; Browser UI was blocked by a local `.next` dev manifest EPERM. |

## Verification Log

- `npm run typecheck` passed after report API/UI implementation on 2026-05-13 16:36 KST.
- Direct `tsx` service/API verification passed for filtered report notes and reviewed coverage on 2026-05-13 16:50 KST.
- Browser UI verification could not run because the local Next dev server could not unlink `.next/dev/server/app-paths-manifest.json`; production build still passed.

## Out of Scope

- Mutating notes from the report.
- Rebuilding or signing evidence packages.

## Next Candidate

Add CSV export for provider execution package review notes.
