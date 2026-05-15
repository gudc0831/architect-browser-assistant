Req: Start the new hardening goal by closing OCR/image residual risks: scanned-PDF rasterization and selected-region crop persistence/OCR.
Diff: Added browser crop payload support, SaaS crop artifact upload metadata, crop OCR routing, PDF rasterization through `pdftoppm`, and slice 465 documentation.
Why: Region coordinates alone were not enough for auditability or provider OCR, and scanned PDFs needed an explicit raster step before Tesseract.
Verify/Time: 2026-05-14 18:49-19:05 KST. Browser/SaaS `npm run typecheck`, browser targeted content-script test, SaaS `npm run ocr:provider:validate`, SaaS `npm run lint`, SaaS `npm run build`, and Browser Assistant `npm run release:check` passed.
