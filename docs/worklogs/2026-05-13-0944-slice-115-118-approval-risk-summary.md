Req: Plan Slices 115-118 for Knowledge approval risk summary.
Diff: Added Slice 115-118 PRDs and roadmap entries for risk summary chips, risk group details, copy risk summary, and risk group count chip; no browser extension code changed.
Why: Continue Knowledge Admin governance from individual guardrails into grouped approval triage.
Verify/Time: 2026-05-13 09:47 KST; SaaS `npm run typecheck`; SaaS `npm run lint` with 7 pre-existing task Hook warnings; `GET /api/admin/knowledge/candidates` 200; Playwright browser UI verified risk summary chips, risk group detail cards, copy risk summary, risk group count chip, and mobile layout; browser repo `npm run typecheck`; browser repo `npm run lint`.
