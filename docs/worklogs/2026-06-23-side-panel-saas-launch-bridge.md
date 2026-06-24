# 2026-06-23 Side panel SaaS launch bridge

Req: Support the SaaS `/daily` assistant opening the existing Chrome extension side panel without removing the SaaS in-page fallback.

Diff: Added a side-panel launch contract, content-script request/response forwarding from both the explicit page bridge and the marked SaaS button click, service-worker `chrome.sidePanel.open` handling, and side-panel startup context hydration so the panel can start with the task/question sent from SaaS.

Why: Extension-installed users can use the right-side Chrome panel for longer assistant work, while users without the extension keep the SaaS panel unchanged.

Verify: `npm run typecheck`; `npx vitest run src/content/content-script.test.ts src/side-panel/App.test.tsx`.

Boundary: No extension package, Chrome profile reload, native-host install, push, or deployment was performed.
