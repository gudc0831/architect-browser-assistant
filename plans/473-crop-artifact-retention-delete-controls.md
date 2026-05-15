# 473. Crop Artifact Retention Delete Controls

Created: 2026-05-15
Parent: `../PLAN.md`
Related: `468-crop-artifact-preview-download.md`
Status: `implemented_verified`

## Goal

Add a narrow retention control for saved selected-region crop artifacts so `/daily` users can remove a persisted crop image without deleting the surrounding file-analysis evidence.

## Why This Slice

Slice 468 made persisted crop artifacts visible and downloadable, but left deletion and retention as an explicit residual risk. That means users could validate a crop after save, but could not remove the stored image if it was captured accidentally, became stale, or should no longer be retained.

## Scope

1. Add an editor-only server mutation that deletes a saved file-analysis crop artifact by `fileId` and `analysisId`.
2. Keep storage bucket/object paths server-owned; the browser submits only the file and analysis ids.
3. Preserve the analysis text, summary, tags, region, confidence, and verification state after artifact deletion.
4. Remove the artifact reference from file metadata after the storage provider deletion succeeds.
5. Add a compact `/daily` saved crop control that updates the file evidence list after deletion.
6. Update paired SaaS and Browser Assistant worklogs.

## Out Of Scope

- Bulk artifact retention policy.
- Scheduled artifact expiry jobs.
- Analysis record deletion.
- Provider OCR or embedding behavior changes.
- External crawling or legal-source refresh workflow.

## Implementation Status

| Item | Status | Repo | Verification |
| --- | --- | --- | --- |
| Artifact delete service | implemented | `architect-saas` | `typecheck`, `lint`, `build` passed |
| Editor-only DELETE route | implemented | `architect-saas` | local HTTP DELETE returned 401 without auth and accepted same-origin integrity header |
| `/daily` crop remove control | implemented | `architect-saas` | `typecheck`, `lint`, `build` passed |
| Roadmap/worklog | implemented | `architect-browser-assistant`, `architect-saas` | `release:check` passed in Browser Assistant |

## Route / Service / UI Check

- Route: `architect-saas/src/app/api/files/[fileId]/analysis/[analysisId]/artifact/route.ts` keeps `GET` preview/download and adds an editor-only `DELETE`.
- Service: `architect-saas/src/use-cases/file-service.ts` locates the selected project's active file, deletes the artifact object through the configured storage provider, then rewrites file metadata with the analysis entry intact and no `artifact` property.
- UI: `architect-saas/src/components/tasks/task-assistant-panel.tsx` adds a saved crop removal button next to preview/download actions and refreshes the selected file from the API response.
- Styling: `architect-saas/src/app/globals.css` keeps the new action compact within the existing artifact action row.

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-15 | Final verification | Passed `npm run typecheck`, `npm run lint`, and `NEXT_DIST_DIR=.next-build npm run build` in `architect-saas`; local `next start` HTTP check returned 401 for unauthenticated `DELETE /api/files/fake-file/analysis/fake-analysis/artifact` with same-origin header; passed `npm run release:check` in `architect-browser-assistant` with the existing production-origin/signing readiness warnings only. |

## Residual Risks

- The delete mutation depends on the configured storage provider successfully removing or quarantining the object.
- This slice does not introduce bulk retention reporting, scheduled expiry, or analysis-record deletion.
- Authenticated manual deletion still depends on a live project/session with saved crop artifacts; this slice verified build, route protection, and UI compilation but did not exercise a real saved artifact deletion in browser.

## Next Candidate Slice

1. Source-by-source legal-source governance review workflow.
2. Embedding execution worker once provider and database credentials are approved.
3. Admin chunk inspection and retrieval debug view for file-analysis evidence.
