Req: Implement the next core completion slice for Architect Browser Assistant: Postgres hybrid retrieval indexing and quality validation.
Diff: Added `plans/461-postgres-hybrid-retrieval-indexing.md`, updated roadmap status, and documented the SaaS retrieval implementation/worklog link.
Why: The top-level plan keeps product direction only; the concrete implementation, verification, residual risks, and next slice candidates belong in per-slice docs and worklogs.
Verify/Time: 2026-05-14 18:02 KST. SaaS `npm run retrieval:hybrid:validate`, `npm run regulation:seed:validate`, `npm run typecheck`, `npm run lint`, and `npm run build` passed. Browser Assistant `npm run release:check` passed.
