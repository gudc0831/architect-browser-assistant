Req: Implement and verify 06 Local Codex bridge packaging and extension install foundation.
Diff: Added slice 06 PRD, MV3 native messaging permission, service worker native bridge routes, LocalRuntimeClient implementation, side-panel runtime selector, Node native host, Windows install script, bridge tests, README install guidance, and roadmap updates.
Why: The product plan requires local ChatGPT/Codex execution from the task-reactive PC assistant without storing user credentials in the extension or SaaS.
Verify/Time: `npm run typecheck`, `npm run test`, `npm run native-host:self-test`, `npm run lint`, `npm run build` | 2026-05-11-1050
