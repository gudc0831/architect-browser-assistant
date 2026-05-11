Req: Fix Chrome side panel task detection on the SaaS `/daily` task grid.
Diff: Updated the content script to mark extension-installed pages, taught the detector to read selected SaaS rows via `data-task-row-id` and `aria-selected`, and added detector tests.
Why: The SaaS daily grid exposes selected rows as `data-task-row-id`, while the extension only looked for `[data-task-id]`, causing "Current page is not a supported task view".
Verify/Time: `npm run typecheck`, `npm run test`, `npm run lint`, `npm run build` | 2026-05-11-1126
