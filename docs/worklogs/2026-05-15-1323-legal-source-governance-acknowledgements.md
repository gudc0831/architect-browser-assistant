Req: Check the next additional Architect slice and implement it after Slice 470.
Diff: Added `plans/471-legal-source-governance-acknowledgement-records.md` and updated the roadmap for persisted legal-source governance acknowledgement records. Browser extension code was not changed.
Why: Slice 470 surfaced governance status but left reviewer acknowledgement as an explicit residual risk.
Verify/Time: 2026-05-15 13:30 KST; SaaS `npm run typecheck`, `npm run lint`, `npm run regulation:governance:validate`, direct `getRegulationGovernanceReport()` check, `NEXT_DIST_DIR=.next-build npm run build`, and local unauthenticated acknowledgement API GET/POST checks passed. Browser assistant `npm run release:check` passed with expected local-origin/signing metadata warnings only.
