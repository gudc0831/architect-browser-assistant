Req: Plan Slices 110-113 for Knowledge publication scope review tools.
Diff: Added Slice 110-113 PRDs and roadmap entries for scope guardrails, scope preview, copy scope handoff, and scope-change guardrail; no browser extension code changed.
Why: Continue Knowledge Admin governance from tag quality into publication audience control.
Verify/Time: 2026-05-13 09:41 KST; SaaS `npm run typecheck`; SaaS `npm run lint` with 7 pre-existing task Hook warnings; `GET /api/admin/knowledge/candidates` 200; Playwright browser UI verified scope preview, organization/restricted scope guardrails, scope changed/unchanged states, copy scope handoff, and mobile layout; browser repo `npm run typecheck`; browser repo `npm run lint`.
