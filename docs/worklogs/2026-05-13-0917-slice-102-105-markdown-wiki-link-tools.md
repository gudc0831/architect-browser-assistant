Req: Plan Slices 102-105 for Markdown structure copy and WIKI link review tools.
Diff: Added Slice 102-105 PRDs and roadmap entries for structure-copy, WIKI link preview, WIKI link guardrail, and WIKI link handoff; no browser extension code changed.
Why: Keep detailed implementation planning in `plans/NN-*.md` while continuing the Knowledge Admin structured Markdown WIKI sequence.
Verify/Time: 2026-05-13 09:20 KST; SaaS `npm run typecheck`; SaaS `npm run lint` with 7 pre-existing task Hook warnings; `GET /api/admin/knowledge/candidates` 200; Playwright browser UI verified structure copy, WIKI link preview, WIKI link guardrail states, and WIKI link clipboard output; browser repo `npm run typecheck`; browser repo `npm run lint`.
