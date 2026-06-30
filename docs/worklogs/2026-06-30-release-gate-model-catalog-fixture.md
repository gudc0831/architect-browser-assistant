Req: Restore the latest Browser Assistant release gate so the current `main` commit can be treated as deployable.
Cause: The native-host model catalog test expected a local Codex CLI model list, but GitHub Actions runners do not expose `codex debug models`, so the test fell back to `fallback-catalog`.
Diff: Added a per-test fake Codex CLI that returns deterministic `--version` and `debug models` responses, keeping the fallback-path test separate.
Verify: `node --test native-host/codex-bridge-host.node-test.mjs`; `npm run release:check`.
Risk: This validates the release gate and local extension build only; Chrome Web Store upload/signing remains outside this Preview/default release boundary.
