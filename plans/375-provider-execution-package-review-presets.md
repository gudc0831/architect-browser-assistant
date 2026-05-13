# Slice 375: Provider execution package review presets

## Product Context

Coverage rows are more useful when reviewers can quickly isolate reviewed, unreviewed, and stale-unreviewed packages.

## Goal

Add provider execution package review coverage presets.

## Scope

- Add `all`, `reviewed`, `unreviewed`, and `stale_unreviewed` coverage presets to the report API.
- Add an Admin UI review-state filter.

## Implementation Decisions

- Presets filter coverage rows and report notes but do not mutate note or package metadata.
- `unreviewed` includes all packages with zero notes; `stale_unreviewed` narrows that set by threshold.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| SaaS service/API | implemented | Added coverage preset filtering. |
| Admin UI | implemented | Added review-state selector. |
| Documentation | implemented | Roadmap/worklogs updated in the slice batch. |
| Verification | completed-with-blocker | typecheck, lint, build, and direct API verification passed; Browser UI was blocked by a local `.next` dev manifest EPERM. |

## Verification Log

- `npm run typecheck` passed after preset implementation on 2026-05-13 16:36 KST.
- Direct `tsx` service/API verification passed for the `reviewed` coverage preset on 2026-05-13 16:50 KST.
- Browser UI verification could not run because the local Next dev server could not unlink `.next/dev/server/app-paths-manifest.json`; production build still passed.

## Out of Scope

- Saved named views.
- Server-side mutations when switching presets.

## Next Candidate

Add stale-unreviewed provider execution package alerts.
