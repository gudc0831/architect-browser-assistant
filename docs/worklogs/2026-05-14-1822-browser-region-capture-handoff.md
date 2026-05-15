Req: Continue the active completion goal by implementing the browser-side selected-region handoff for OCR/image evidence.
Diff: Added extension region-selection bridge, background visible-tab capture handler, SaaS `/daily` image_region handoff button, and slice 463 documentation.
Why: Slice 462 made image-region evidence persistable, but users still needed a real browser selection workflow instead of manually entering coordinates.
Verify/Time: 2026-05-14 18:24 KST. Browser `npm run release:check` passed. SaaS `npm run typecheck`, `npm run lint`, and `npm run build` passed; lint still reports 7 pre-existing React Hook warnings.
