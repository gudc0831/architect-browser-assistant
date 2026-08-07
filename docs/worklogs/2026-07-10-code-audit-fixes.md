Req: Fix the code-audit finding where one verified regulation allowed unrelated unverified legal evidence to pass the Browser Assistant gate.
Diff: Added a mixed verified/unverified regression case and now require every extracted law locator to match verified official evidence before returning `verified`.
Failure: `verifyOfficialLawEvidence` returned `verified` for unverified 건축법 제49조 when unrelated 주차장법 제6조 evidence was verified.
Cause: The verifier checked only whether the verified-source list was non-empty and fell back to all verified evidence when no locator matched.
Fix: Removed the fallback and added an all-locators-covered condition.
Evidence: `npm.cmd run release:check` passed on 2026-07-10 KST with typecheck, lint, 73 Vitest tests, 32 Node tests, build, readiness, and native-host self-test.
Prevention: Keep a mixed-law partial-verification fixture in the official-law verifier suite.
