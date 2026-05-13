# Slice 372: Provider execution package review note CSV

## Product Context

Slice 371 exposes a filtered review-note report. Operations review often needs a portable tabular export that preserves the same filters without granting edit capability.

## Goal

Add CSV export for provider execution package review notes.

## Scope

- Add a read-only CSV export route for filtered provider execution package review notes.
- Include note id, execution id, package digest, category, reviewer, execution metadata, filename, and note text.
- Add an Admin UI export action using the active report filters.

## Implementation Decisions

- CSV cells are escaped against spreadsheet formula injection.
- Export uses the report service so API and UI filters stay aligned.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| SaaS service/API | implemented | Added filtered CSV export route. |
| Admin UI | implemented | Added `Export notes CSV` action. |
| Documentation | implemented | Roadmap/worklogs updated in the slice batch. |
| Verification | completed-with-blocker | typecheck, lint, build, and direct API verification passed; Browser UI was blocked by a local `.next` dev manifest EPERM. |

## Verification Log

- `npm run typecheck` passed after CSV export implementation on 2026-05-13 16:36 KST.
- Direct `tsx` service/API verification passed for CSV header and note text output on 2026-05-13 16:50 KST.
- Browser UI verification could not run because the local Next dev server could not unlink `.next/dev/server/app-paths-manifest.json`; production build still passed.

## Out of Scope

- Bulk note import.
- Spreadsheet formatting beyond CSV.

## Next Candidate

Add summary metrics for provider execution package review coverage.
