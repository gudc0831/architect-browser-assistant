Req: Plan Slices 106-109 for Knowledge draft tag quality tools.
Diff: Added Slice 106-109 PRDs and roadmap entries for tag coverage guardrail, tag preview, copy tag handoff, and duplicate-tag guardrail; no browser extension code changed.
Why: Continue the Knowledge Admin WIKI review flow from Markdown structure into retrieval and WIKI grouping metadata quality.
Verify/Time: 2026-05-13 09:31 KST; SaaS `npm run typecheck`; SaaS `npm run lint` with 7 pre-existing task Hook warnings; `GET /api/admin/knowledge/candidates` 200; Playwright browser UI verified tag coverage, duplicate-tag guardrails, tag preview, copy draft tags, and mobile layout; browser repo `npm run typecheck`; browser repo `npm run lint`.
