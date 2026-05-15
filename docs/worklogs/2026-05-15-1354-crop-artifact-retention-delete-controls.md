Req: Implement Slice 473 crop artifact retention/delete controls after committing the previous post-468 work.
Diff: Added the Slice 473 plan for editor-only crop artifact deletion, retention boundaries, verification expectations, and next candidates. Updated the roadmap in the same slice once implementation verification is complete.
Why: Slice 468 intentionally left crop artifact deletion and retention as a residual risk; this slice makes that follow-up explicit and reviewable.
Verify/Time: 2026-05-15 14:00 KST; `architect-saas` passed `npm run typecheck`, `npm run lint`, `NEXT_DIST_DIR=.next-build npm run build`, and local HTTP DELETE returned 401 without auth; `architect-browser-assistant` passed `npm run release:check`.
