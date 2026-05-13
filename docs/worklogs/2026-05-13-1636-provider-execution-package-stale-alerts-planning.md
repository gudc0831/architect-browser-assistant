Req: Implement Slice 376 provider execution package stale alerts.
Diff: Added Slice 376 PRD for stale-days threshold and stale-unreviewed package status.
Why: Unreviewed provider execution evidence becomes higher risk as it ages.
Verify/Time: 2026-05-13 16:36 KST; `npm run typecheck` passed in architect-saas after stale alert implementation.
