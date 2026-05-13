Req: Plan Slice 114 Knowledge queue layout stability.
Diff: Added the Slice 114 PRD and roadmap entry for fixing stretched Knowledge Admin queue counter rows; no browser extension code changed.
Why: Browser UI verification found a desktop layout issue that should be tracked as a slice before continuing higher-level approval risk summaries.
Verify/Time: 2026-05-13 09:41 KST; SaaS `npm run typecheck`; SaaS `npm run lint` with 7 pre-existing task Hook warnings; Playwright browser UI verified candidate state/risk count chips stay compact at 31px height and mobile remains single-column; browser repo `npm run typecheck`; browser repo `npm run lint`.
