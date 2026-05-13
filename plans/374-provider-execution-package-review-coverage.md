# Slice 374: Provider execution package review coverage

## Product Context

Summary counts need drill-down rows so admins can see which package evidence is reviewed, unreviewed, or stale.

## Goal

Add provider execution package review coverage rows.

## Scope

- Add per-package coverage rows to the report API.
- Include package digest, filename, target, artifact type, note count, latest note timestamp, reviewer ids, and coverage status.
- Show a compact coverage list in Admin Knowledge.

## Implementation Decisions

- Coverage rows use existing provider execution audit ids as stable keys.
- Stale state is calculated from execution creation time plus the selected stale-days threshold.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| SaaS service/API | implemented | Added coverage row assembly. |
| Admin UI | implemented | Added compact coverage rows. |
| Documentation | implemented | Roadmap/worklogs updated in the slice batch. |
| Verification | completed-with-blocker | typecheck, lint, build, and direct API verification passed; Browser UI was blocked by a local `.next` dev manifest EPERM. |

## Verification Log

- `npm run typecheck` passed after coverage implementation on 2026-05-13 16:36 KST.
- Direct `tsx` service/API verification passed for reviewed coverage rows on 2026-05-13 16:50 KST.
- Browser UI verification could not run because the local Next dev server could not unlink `.next/dev/server/app-paths-manifest.json`; production build still passed.

## Out of Scope

- Mutating package review state directly.
- Archiving or deleting provider execution audits.

## Next Candidate

Add provider execution package review coverage presets.
