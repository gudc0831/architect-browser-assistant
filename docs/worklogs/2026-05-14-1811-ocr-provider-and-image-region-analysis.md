Req: Document and track the OCR provider and selected-region image analysis slice for the active Architect Browser Assistant completion goal.
Diff: Added `plans/462-ocr-provider-and-image-region-analysis.md`, updated roadmap status, and recorded the cross-repo implementation boundary.
Why: Concrete OCR implementation and verification details belong in slice docs/worklogs while `PLAN.md` stays a stable product-direction document.
Verify/Time: 2026-05-14 18:13 KST. SaaS `npm run ocr:provider:validate`, `npm run typecheck`, `npm run lint`, and `npm run build` passed. Browser Assistant `npm run release:check` passed.
