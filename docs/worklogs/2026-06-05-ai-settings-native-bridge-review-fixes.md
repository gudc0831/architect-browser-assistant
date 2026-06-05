# 2026-06-05 AI Settings Native Bridge Review Fixes

## Request

- Support the SaaS `/ai-settings` review fixes from the browser-assistant worktree.
- Use multi-agent review and `harness-engineering`.
- Keep SaaS secrets, prompts, answers, transcripts, raw logs, and local session paths out of the bridge summary.

## Changes

- Added sanitized `codexOptions` forwarding for status, generate, and usage-summary bridge requests.
- Preserved `serviceTier` as a DTO field without adding unsupported native Codex CLI args.
- Added metadata-only local Codex usage summary handling with bounded scan limits.
- Marked usage summary as `partial` and added a `file_count_limit` warning when the max-file scan limit is reached.
- Added tests for top-level generate options, usage-summary sanitization, native request conversion, max-file partial scans, and privacy filtering.

## Multi-Agent Notes

- Worker agent `019e9731-ae61-76a0-8df3-4240fda3f599` implemented the native bridge fixes in this worktree.
- Review agent `019e9738-3cd1-70e1-9614-4b64ea51a2e9` found no browser-assistant blocking issue after the fixes.

## Verification

- `npm run typecheck` passed.
- `npx vitest run src/content/content-script.test.ts src/runtime/local-runtime-client.test.ts` passed, 10 tests.
- `node --test native-host/codex-bridge-host.node-test.mjs` passed, 11 tests.
- `npm run release:check` passed with local-dev and production-promotion warnings only, 0 failures.
- `git diff --check` passed; only Git line-ending warnings were printed.

## Remaining Risks

- No commit or push was made.
- Production release still requires production extension metadata, signing or waiver metadata, and production SaaS origin configuration.
