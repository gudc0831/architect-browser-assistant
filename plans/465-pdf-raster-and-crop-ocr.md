# 465. PDF Raster And Crop OCR

Created: 2026-05-14
Parent: `../PLAN.md`
Related: `03-file-and-image-analysis.md`, `462-ocr-provider-and-image-region-analysis.md`, `463-browser-region-capture-handoff.md`
Status: `implemented_verified`

## Goal

Close the remaining OCR/image-analysis risk by adding two missing hardening paths: scanned-PDF rasterization before Tesseract OCR, and persisted selected-region crop artifacts that can be saved with `image_region` file analysis and used as crop OCR input.

## Why This Slice

Slices 462 and 463 made OCR metadata and browser region selection real, but two gaps remained:

1. Scanned PDFs still stopped at `FILE_OCR_PDF_RASTERIZER_REQUIRED`.
2. The extension returned a visible-tab screenshot, but SaaS did not persist the selected crop or send the crop to OCR.

This slice keeps the existing provider model conservative. It does not invent OCR output: Tesseract still requires `FILE_OCR_PROVIDER=tesseract_cli`, and PDF rasterization requires `FILE_PDF_RASTERIZER=pdftoppm`.

## Scope

1. Browser Assistant crops the selected visible-tab region with canvas and returns `cropDataUrl`.
2. SaaS `/daily` stores crop payload state after `select-region`.
3. `saveSelectedFileAnalysis()` sends crop data through the existing `ocr_extract` route when image-region evidence has a captured crop.
4. `ocrExtractSelectedFileAnalysis()` sends crop data to provider OCR when available.
5. SaaS uploads the crop as an analysis artifact in storage and records an artifact reference in `File.metadata.analysis`.
6. PDF OCR supports `FILE_PDF_RASTERIZER=pdftoppm`, `PDF_RASTERIZER_CMD`, and `FILE_PDF_RASTER_DPI`.
7. PDF page selection uses `region.pageNumber` when present, defaulting to page 1.

## Out Of Scope

- Bundling Poppler or Tesseract.
- OCR confidence calibration beyond existing low-confidence caps.
- UI thumbnail preview/download for crop artifacts.
- Browser automation click-through of the extension overlay.
- Multi-page PDF OCR batching.

## Implementation Status

| Item | Status | Repo | Verification |
| --- | --- | --- | --- |
| content-script crop data URL | implemented | `architect-browser-assistant` | targeted test passed |
| SaaS crop payload handoff | implemented | `architect-saas` | `npm run typecheck` passed |
| crop artifact metadata | implemented | `architect-saas` | `npm run typecheck` passed |
| crop artifact storage upload | implemented | `architect-saas` | `npm run typecheck` passed |
| crop OCR input path | implemented | `architect-saas` | `npm run ocr:provider:validate` passed |
| PDF rasterizer + Tesseract path | implemented | `architect-saas` | compile/path validation passed |
| roadmap/worklogs | implemented | both | this document plus worklogs updated after full gates |

## Route / Service / Repository Check

- Extension contract: `architect-browser-assistant/src/runtime/browser-capture-contract.ts` now includes `cropDataUrl`.
- Extension bridge: `architect-browser-assistant/src/content/content-script.ts` crops the selected viewport rectangle before posting the page-local response.
- SaaS UI: `architect-saas/src/components/tasks/task-assistant-panel.tsx` stores the crop payload and sends it to `/api/files/:fileId/analysis`.
- Route: `architect-saas/src/app/api/files/[fileId]/analysis/route.ts` passes `sourceImageDataUrl`, source URL/title, and capture time to `runOcrFileAnalysis()`.
- Service: `architect-saas/src/use-cases/file-service.ts` uploads crop artifacts and attaches the artifact reference to `saveFileAnalysis()`.
- Domain: `architect-saas/src/domains/file/ocr.ts` rasterizes PDF pages through `pdftoppm` before Tesseract when configured.

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-14 | SaaS compile | `npm run typecheck` passed |
| 2026-05-14 | Browser Assistant compile | `npm run typecheck` passed |
| 2026-05-14 | Browser content-script bridge | `npm run test -- src/content/content-script.test.ts` passed |
| 2026-05-14 | OCR contract validator | `npm run ocr:provider:validate` passed |
| 2026-05-14 | SaaS full gates | `npm run lint` passed with existing hook warnings; `npm run build` passed with one existing Turbopack trace warning |
| 2026-05-14 | Browser Assistant release gate | `npm run release:check` passed |

## Residual Risks

- Runtime PDF OCR still depends on Poppler `pdftoppm` and Tesseract being installed on the server.
- Crop artifact storage preview/download was completed later in slice 468; deletion/retention controls remain separate.
- If provider OCR is requested without configured Tesseract, the route fails as before.
- Browser crop is viewport-relative; users still need to review evidence before relying on it.

## Next Candidate Slice

1. Crop artifact retention/delete controls.
2. Multi-page PDF OCR batching.
3. Runtime provider install/runbook for Poppler and Tesseract.
