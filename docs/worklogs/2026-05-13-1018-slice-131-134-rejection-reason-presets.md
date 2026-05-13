Req: Plan Slices 131-134 for Knowledge rejection reason presets.
Diff: Added Slice 131-134 PRDs and roadmap entries for warning-derived presets, applying presets, draft status chips, and copy rejection reason; no browser extension code changed.
Why: Continue the Knowledge approval decision flow into consistent rejection reason drafting and handoff.
Verify/Time: 2026-05-13 10:24 KST; SaaS `npm run typecheck`; SaaS `npm run lint` with 7 pre-existing task Hook warnings; `GET /api/admin/knowledge/candidates` 200; Playwright browser UI verified rejection presets, preset application, draft status chips, copy rejection reason, and mobile layout; browser repo `npm run typecheck`; browser repo `npm run lint`. Known unrelated `/api/project/changes` returned 500 during page load.
