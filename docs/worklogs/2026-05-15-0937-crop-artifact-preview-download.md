Req: Continue the Architect Browser Assistant roadmap by closing the crop artifact preview/download gap after slice 465.
Diff: Added `plans/468-crop-artifact-preview-download.md`, updated `plans/README.md` next-candidate status, and marked slice 465's preview/download residual as completed by slice 468.
Why: The roadmap needed to reflect that persisted selected-region crop artifacts are now inspectable from SaaS `/daily` without expanding storage/provider scope.
Verify/Time: Passed roadmap review and paired SaaS verification: `typecheck`, `lint`, `build`, route validation, HTTP artifact checks, and Chrome `/daily` preview/download validation | 2026-05-15 10:32 KST.
