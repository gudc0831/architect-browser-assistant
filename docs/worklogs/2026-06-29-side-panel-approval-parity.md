# 2026-06-29 Side Panel Approval Parity

Diff: Chrome side panel approval UX now follows the SaaS panel by removing the visible `보류 저장` action from the normal approval flow, keeping the acknowledgement gate for `작업 기록 승인`, and updating the action hint so the next step is approval rather than approve-or-defer.

Verification: `npm run typecheck`; `.\\node_modules\\.bin\\vitest.cmd run src/side-panel/App.test.tsx`; `npm run lint`; `npm run build`; `git diff --check`; `npm run release:readiness -- --strict` passed on 2026-06-29 KST. Release readiness reported 14 pass, 4 warn, 0 fail; warnings are local-dev origin and production-promotion metadata, outside this Preview parity change. Commit and push are pending in this rollout.
