# Slice 370: Provider execution package review notes

## Product Context

Slice 369 made retained provider execution packages browsable and filterable. Admin reviewers now need append-only package review notes that are tied to the execution audit id and immutable package digest without changing the retained package digest.

## Goal

Add append-only review notes for provider execution evidence packages.

## Scope

- Add an admin-only provider execution package review-note API.
- Store notes as append-only audit events keyed by execution id and package digest.
- Show note creation, note list, note counts, and latest-note metadata in Admin Knowledge.
- Include notes in the package review context while preserving the immutable provider evidence digest.

## Implementation Decisions

- `PLAN.md` remains unchanged because this is detailed provider-governance implementation.
- Notes use a separate audit event type, not a mutation of provider execution audit metadata.
- Package digest validation rejects notes submitted against stale or mismatched package digests.
- Package export keeps the evidence digest stable and exposes notes under review context.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| SaaS service/API | implemented | Added append-only note creation/listing and package review-note context. |
| Admin UI | implemented | Added category/text form, note list, count/latest chips, and history row note indicators. |
| Documentation | implemented | Updated roadmap/worklogs/user guide in the slice batch. |
| Verification | completed-with-blocker | typecheck, lint, build, and direct API verification passed; Browser UI was blocked by a local `.next` dev manifest EPERM. |

## Verification Log

- `npm run typecheck` passed after the Slice 370 service/API/UI implementation on 2026-05-13 16:36 KST.
- Direct `tsx` service/API verification passed for note creation, digest mismatch rejection, report inclusion, CSV export, package review context, and cleanup on 2026-05-13 16:50 KST.
- Browser UI verification could not run because `npm run dev` exited on `EPERM: operation not permitted, unlink '.next/dev/server/app-paths-manifest.json'`; `npm run build` passed and included the new routes.

## Out of Scope

- Editing or deleting review notes.
- Changing provider execution audit records.
- Changing the immutable evidence package digest.
- External provider writes.

## Next Candidate

Add a provider execution package review-note report with filters across retained packages.
