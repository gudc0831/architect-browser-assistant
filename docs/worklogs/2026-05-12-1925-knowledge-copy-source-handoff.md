Req: Implement Slice 64 Knowledge copy source handoff action.
Diff: Added `plans/64-knowledge-copy-source-handoff.md`, updated `plans/README.md`, and recorded the cross-repo slice boundary.
Why: Knowledge review handoffs should preserve the candidate provenance context without manual reconstruction from chips.
Verify/Time: 2026-05-12 19:45 KST; browser-assistant `npm run typecheck` and `npm run lint` passed; Slice 64 PRD records SaaS static, API, and Browser UI verification.
