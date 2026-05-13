# Slice 376: Provider execution package stale alerts

## Product Context

Unreviewed provider execution packages become operationally risky over time. Reviewers need a configurable stale threshold and visible stale count.

## Goal

Add stale-unreviewed package alerts for provider execution package review.

## Scope

- Add stale-days threshold handling to the report API.
- Calculate stale-unreviewed status for packages with zero notes.
- Show stale count and threshold context in Admin Knowledge.

## Implementation Decisions

- Stale state is read-only and derived at request time.
- The default stale threshold is 7 days and can be set from 0 to 365 days.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| SaaS service/API | implemented | Added stale-days normalization and stale-unreviewed status. |
| Admin UI | implemented | Added stale-days input and stale summary chip. |
| Documentation | implemented | Roadmap/worklogs updated in the slice batch. |
| Verification | completed-with-blocker | typecheck, lint, build, and direct API verification passed; Browser UI was blocked by a local `.next` dev manifest EPERM. |

## Verification Log

- `npm run typecheck` passed after stale alert implementation on 2026-05-13 16:36 KST.
- Direct `tsx` service/API verification passed with `staleDays=0` in the report request on 2026-05-13 16:50 KST.
- Browser UI verification could not run because the local Next dev server could not unlink `.next/dev/server/app-paths-manifest.json`; production build still passed.

## Out of Scope

- Notifications.
- Scheduled reminders.

## Next Candidate

Add reviewer rollup controls for provider execution package reviews.
