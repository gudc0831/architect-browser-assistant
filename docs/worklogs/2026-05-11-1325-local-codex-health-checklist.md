Req: Start the next goal after slice 07: implement a `/daily` in-page Local Codex bridge health checklist.
Diff: Added `plans/08-local-codex-health-checklist.md`; updated `plans/README.md`; cross-repo SaaS change added the in-page `Check bridge` checklist and updated the user guide.
Why: Users need a visible diagnostic path inside the default SaaS popup before trying real Local Codex generation; the Chrome side panel should remain secondary.
Verify/Time: `architect-browser-assistant` `npm run typecheck`, `npm run test`, and `npm run build` passed; SaaS typecheck/lint/build and `/daily` HTTP 200 verification passed in the cross-repo worklog | 2026-05-11 13:25-13:32 KST.
