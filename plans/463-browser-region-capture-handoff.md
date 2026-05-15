# 463. Browser Region Capture Handoff

Created: 2026-05-14
Parent: `../PLAN.md`
Related: `03-file-and-image-analysis.md`, `462-ocr-provider-and-image-region-analysis.md`
Status: `implemented_verified`

## Goal

Close the browser-side half of the image-region evidence workflow by letting a user select a visible SaaS page region through the Architect Browser Assistant extension and hand the normalized region coordinates back into `/daily` file analysis as `image_region` evidence metadata.

## Why This Slice

Slice 462 created the SaaS-side OCR and `image_region` data model, but users still had to type coordinates manually. The remaining product gap was the extension/browser bridge: a user needed a real region selection action that feeds the existing file evidence controls without introducing a new upload/storage model in the same step.

This slice was chosen because it directly reduces the OCR/image-analysis unfinished axis while keeping responsibility boundaries clear:

1. `architect-browser-assistant` owns page-local browser selection and visible-tab capture.
2. `architect-saas` owns the file analysis form and evidence persistence through the existing `/api/files/:fileId/analysis` route.
3. The first implementation stores normalized region metadata and a review summary; automatic crop OCR and screenshot persistence remain separate provider/storage slices.

## Product Gap Reassessment

| PLAN axis | Previous state | After this slice |
| --- | --- | --- |
| Regulation DB / official sources | Foundation implemented | unchanged |
| OCR / image analysis | SaaS provider contract and manual region metadata | browser region selector and handoff implemented |
| Postgres text/vector/hybrid search | first text-hybrid implementation | unchanged |
| Knowledge admin authority model | explicit guard mapped to current RBAC | unchanged |
| Public release readiness | release gate and origin packaging partly implemented | unchanged |

Overall completion moves from roughly 86% to roughly 88-89%. The selected-area workflow is now real enough for user-reviewed image evidence, but the product should not be called 90%+ until at least the production release/signing gate or scanned-PDF rasterization/vector chunking risk is reduced.

## Scope

1. Add a shared browser-capture contract in the extension runtime.
2. Add a content-script page-local command `select-region`.
3. Render a temporary crosshair overlay, collect a drag rectangle, normalize pixel and percent coordinates, and support Escape cancellation.
4. Forward the capture request to the extension background worker.
5. Use `chrome.tabs.captureVisibleTab()` in the background worker and return screenshot metadata plus selected region.
6. Add `/daily` file evidence control action `Select browser region` for `image_region` mode.
7. Fill the region fields and default analysis summary from the extension response.
8. Add a content-script unit test for status forwarding and region-capture forwarding.

## Out Of Scope

- Cropping and persisting the screenshot image.
- Running OCR directly on the selected crop.
- Scanned PDF rasterization.
- External-tab capture outside the configured SaaS origin.
- New file upload/storage flow for captured screenshots.

## Implementation Status

| Item | Status | Repo | Verification |
| --- | --- | --- | --- |
| Browser capture contract | implemented | `architect-browser-assistant` | `npm run typecheck` passed |
| content-script `select-region` bridge | implemented | `architect-browser-assistant` | targeted Vitest passed |
| background `captureVisibleTab` handler | implemented | `architect-browser-assistant` | `npm run typecheck` passed |
| `/daily` region handoff button | implemented | `architect-saas` | `npm run typecheck` passed |
| region summary/default field population | implemented | `architect-saas` | code path verified |
| roadmap/worklogs | implemented | both | this document plus worklogs |

## Route / Service / Repository Check

- Extension content script: `architect-browser-assistant/src/content/content-script.ts` accepts `architect:page-local-runtime-request` with `command: "select-region"`.
- Extension background worker: `architect-browser-assistant/src/background/service-worker.ts` handles `architect:capture-visible-tab` and calls `chrome.tabs.captureVisibleTab()`.
- Shared extension contract: `architect-browser-assistant/src/runtime/browser-capture-contract.ts` defines region, viewport, payload, and message shapes.
- SaaS UI: `architect-saas/src/components/tasks/task-assistant-panel.tsx` calls the page-local bridge, fills `image_region` fields, and saves through the existing `/api/files/:fileId/analysis` path from slice 462.
- Repository/search boundary: no new repository contract was required. Saved `image_region` analyses still flow through `saveFileAnalysis()` and the slice 461 project-document retrieval path.

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-14 | SaaS compile check | `npm run typecheck` passed |
| 2026-05-14 | Browser Assistant compile check | `npm run typecheck` passed |
| 2026-05-14 | content-script bridge test | `npm run test -- src/content/content-script.test.ts` passed |
| 2026-05-14 | SaaS lint | `npm run lint` passed with 7 pre-existing React Hook warnings |
| 2026-05-14 | SaaS production build | `npm run build` passed |
| 2026-05-14 | Browser Assistant release gate | `npm run release:check` passed. 6 test files / 14 tests passed, native-host self-test ok |

## Residual Risks

- The extension currently returns the full visible-tab screenshot data URL to the page, but the SaaS UI only persists region coordinates and a summary. This is intentional for the first handoff slice, but crop storage/OCR remains unfinished.
- `captureVisibleTab` is scoped to the active capturable HTTP(S) tab and the configured SaaS origin workflow; broader external-page capture would need explicit permission and UX review.
- Selected region coordinates are viewport-relative. If the underlying image/document is scrolled or transformed after capture, the user must review the summary before saving.
- Automatic crop OCR and scanned-PDF rasterization are still separate slices.
- Browser UI verification was limited to unit/release gates in this slice; no Playwright click-through was run for the temporary extension overlay.

## Next Candidate Slice

1. Chrome Web Store/native-host signing readiness gate.
2. PDF rasterizer + Tesseract scanned PDF OCR provider.
3. Persist selected-region screenshot crop and optionally run provider OCR over it.
4. Dedicated chunk table + pgvector/vector rerank for file analysis evidence.
