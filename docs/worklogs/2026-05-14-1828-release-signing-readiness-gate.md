Req: Continue the active completion goal by hardening public deployment readiness for Chrome Web Store/native-host release.
Diff: Added `scripts/verify-release-readiness.mjs`, wired it into `npm run release:check`, added `release:readiness:production`, and documented the release/signing gate.
Why: Public MVP readiness needed an executable guard for MV3 manifest scope, SaaS origin alignment, native-host installer/template shape, and production signing metadata instead of a manual checklist.
Verify/Time: 2026-05-14 18:31 KST. `npm run release:readiness -- --strict` passed with 11 pass, 3 expected local-production warnings, and 0 failures. `npm run release:check` passed with typecheck, lint, 6 test files / 14 tests, build, readiness validation, and native-host self-test.
