# 469. Review Clearance

Created: 2026-05-15
Parent: `../PLAN.md`
Related: `465-pdf-raster-and-crop-ocr.md`, `468-crop-artifact-preview-download.md`
Status: `implemented_verified`

## Goal

Clear the current code review findings across the paired SaaS and Browser Assistant repos: SaaS Turbopack NFT tracing warning, SaaS React Hooks lint warnings, Browser Assistant page-message generate payload validation, and SaaS admin `sortOrder` validation.

## Scope

1. Fix React Hook dependency warnings without changing task UI behavior.
2. Keep OCR temp-file operations trace-safe for Turbopack production builds.
3. Reject malformed Browser Assistant `generate` page messages before they reach the extension runtime.
4. Reject unsafe or non-integer admin `sortOrder` values at the SaaS use-case boundary.
5. Record verification and worklogs in both repos.

## Out Of Scope

- New user-facing UI.
- New database migrations.
- Changing OCR provider behavior or adding a paid/OCR provider.
- Refactoring the broader admin route body parsing layer.

## Implementation Status

| Item | Status | Repo | Verification |
| --- | --- | --- | --- |
| React Hook lint warnings | implemented | `architect-saas` | `npm run lint` passed without hook warnings |
| Turbopack NFT warning | implemented | `architect-saas` | `NEXT_DIST_DIR=.next-build npm run build` passed without Turbopack warnings |
| Admin `sortOrder` guard | implemented | `architect-saas` | `npm run typecheck`, `npm run lint`, production build passed |
| Generate payload guard | implemented | `architect-browser-assistant` | RED/GREEN Vitest coverage plus final `npm run test` passed |
| Roadmap/worklog | implemented | both repos | plan and paired worklogs added |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-15 | SaaS final verification | Passed `npm run typecheck`; passed `npm run lint`; passed `$env:NEXT_DIST_DIR='.next-build'; npm run build` with no Turbopack warnings. Default `.next` was avoided because the local checkout had an `EPERM` unlink lock on `.next/diagnostics/build-diagnostics.json`. |
| 2026-05-15 | Browser Assistant final verification | Passed `npm run typecheck`; passed `npm run lint`; passed `npm run test` with 7 files and 16 tests; passed `npm run build`. |

## Decision Notes

- The Turbopack issue was fixed at the OCR temp-file I/O sites with `turbopackIgnore` comments. A temporary `next.config.ts` ignore rule was tested and then removed so the final state does not hide unrelated warnings.
- Browser Assistant validation now normalizes `question`, task context, and evidence before forwarding `generate` to the extension runtime. Malformed messages return a page-bridge error and do not call `chrome.runtime.sendMessage`.
- SaaS admin `sortOrder` validation lives in `admin-service` so all global/project create and update paths share one guard.

## Residual Risks

- SaaS does not currently have a general unit-test runner or nearby admin-service unit tests; this clearance relied on typecheck, lint, and production build verification for the admin guard.
- The Browser Assistant diff sits on top of pre-existing region-capture edits in the same files, so commits should stage hunks carefully if a commit is requested later.

## Next Candidate Slice

1. Admin governance UI for legal-source refresh.
2. Embedding provider/backfill plan for `file_analysis_chunks`.
3. Crop artifact retention/delete controls.
