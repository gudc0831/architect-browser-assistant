# 468. Crop Artifact Preview Download

Created: 2026-05-15
Parent: `../PLAN.md`
Related: `465-pdf-raster-and-crop-ocr.md`
Status: `implemented_verified`

## Goal

Close the usability gap left by slice 465 by letting `/daily` users review and download persisted selected-region crop artifacts from the task assistant file evidence controls.

## Why This Slice

Slice 465 persisted selected browser-region crops as file-analysis artifacts, but users could not inspect the stored crop after save. That weakened auditability: the assistant could cite image-region evidence, while the user still had to trust that the persisted artifact matched the captured region.

## Scope

1. Add a server route that streams a saved file-analysis artifact by `fileId` and `analysisId`.
2. Keep storage object paths server-owned; the browser never submits an artifact path for preview/download.
3. Show saved file-analysis records in the `/daily` AI review popup.
4. Render image crop thumbnails for saved crop artifacts.
5. Provide inline preview and attachment download links for each saved crop artifact.
6. Show a pending crop preview before saving a newly selected browser region.
7. Update the SaaS user guide and paired worklogs.

## Out Of Scope

- Editing or deleting analysis artifacts.
- External provider execution or embedding backfill.
- Browser automation of the extension selection overlay.
- New storage retention policy.

## Implementation Status

| Item | Status | Repo | Verification |
| --- | --- | --- | --- |
| Artifact stream route | implemented | `architect-saas` | `typecheck`, direct route validation, and HTTP route validation passed |
| Saved analysis artifact cards | implemented | `architect-saas` | Chrome `/daily` UI render and download validation passed |
| Pending crop preview | implemented | `architect-saas` | `typecheck` passed; extension selection overlay remains out of automation scope |
| User guide | implemented | `architect-saas` | document review passed |
| Roadmap/worklog | implemented | `architect-browser-assistant` | roadmap and worklog review passed |

## Route / Service / Repository Check

- Route: `architect-saas/src/app/api/files/[fileId]/analysis/[analysisId]/artifact/route.ts` streams the stored artifact with `inline` or `attachment` disposition after current project access checks.
- Service: `architect-saas/src/use-cases/file-service.ts` reads the target file, locates the saved analysis id, and downloads only that analysis artifact.
- UI: `architect-saas/src/components/tasks/task-assistant-panel.tsx` shows saved analysis cards, crop thumbnail previews, preview/download links, and a pending crop preview before save.
- Styling: `architect-saas/src/app/globals.css` adds compact analysis cards and crop preview states inside the existing PC-only assistant popup.

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-15 | Final verification | Passed `npm run typecheck`; `npm run lint` passed with 7 pre-existing React Hook warnings; `npm run build` passed with the existing Turbopack NFT warning; artifact route direct validation passed; HTTP route returned inline/attachment PNG responses and rejected invalid disposition; Chrome headless `/daily` validation rendered the saved crop image and completed `Download crop` as a 1057-byte PNG. |

## Residual Risks

- Crop preview/download uses the current app session and project access guard; remote storage availability still depends on the configured storage provider.
- This slice does not add artifact deletion or retention controls.
- The pending pre-save crop preview compiles, but automated browser validation did not drive the extension region-selection overlay because that overlay remains out of this slice's scope.
- The next deeper retrieval step, embedding backfill, still needs a provider/model decision and production database execution plan.

## Next Candidate Slice

1. Admin governance UI for legal-source refresh.
2. Embedding provider/backfill plan for `file_analysis_chunks`.
3. Crop artifact retention/delete controls.
