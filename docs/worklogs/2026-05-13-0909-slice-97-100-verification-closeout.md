Req: Close verification for Knowledge Markdown outline, copy outline, heading guardrail, and structure summary slices 97-100.
Diff: Updated slice PRDs 97-100 with implementation commits and verification logs; no browser extension code changed.
Why: Keep planning docs synchronized with the completed SaaS Knowledge Admin Markdown UI work before selecting Slice 101.
Verify/Time: 2026-05-13 09:09 KST; `npm run typecheck`; `npm run lint`; SaaS `npm run typecheck`; SaaS `npm run lint` with 7 pre-existing task Hook warnings; `GET /api/admin/knowledge/candidates` 200; Playwright browser UI check confirmed outline, copy button, heading guardrail, and structure summary.
