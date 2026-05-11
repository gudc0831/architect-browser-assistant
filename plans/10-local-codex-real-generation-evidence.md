# 10. Local Codex Real Generation Evidence PRD

Created: 2026-05-11
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 10 Local Codex real generation evidence flow and update the continuation roadmap.
Worklogs:
- [../docs/worklogs/2026-05-11-1349-local-codex-real-generation-evidence.md](../docs/worklogs/2026-05-11-1349-local-codex-real-generation-evidence.md)
- [../docs/worklogs/2026-05-11-1402-local-codex-real-generation-evidence-complete.md](../docs/worklogs/2026-05-11-1402-local-codex-real-generation-evidence-complete.md)

## Problem Statement

Slice 09 proved that the installed extension/native-host/Codex CLI path is present, but the product still needs a repeatable evidence flow showing that native host `generate` can produce an architecture task answer through real Codex before the next UI slice records `/daily` browser generation.

## Solution

Add a native-host generation verifier:

```powershell
npm run native-host:verify-generation -- --json --mock --strict
npm run native-host:verify-generation -- --json --allow-external --strict
```

The verifier sends a bounded architecture task payload to the same native host `generate` handler used by the extension bridge and reports:

1. real or mock generation mode
2. pass/fail state
3. elapsed time
4. answer preview
5. draft summary conclusion/scope/tags

Real generation requires `--allow-external` because the prompt is sent through the user's Codex CLI. Mock mode remains the deterministic default for protocol checks and does not invoke Codex.

## User Stories

1. As an operator, I can prove local Codex can produce a grounded answer before asking the user to test `/daily`.
2. As a developer, I can run mock generation for deterministic protocol checks and real generation for local auth checks.
3. As a product owner, I can keep the continuation roadmap honest by separating native generation proof from the next browser UI proof.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 10 PRD and active goal documentation | done | df7d65f | this worklog | Document updated |
| `native-host:verify-generation` command | done | df7d65f | this worklog | Mock verifier passed |
| Real Codex generation evidence | done | pending | completion worklog | Passed after explicit user approval |
| Browser README verifier instructions | done | df7d65f | this worklog | Document updated |
| `/daily` browser generation evidence | deferred | - | - | Next slice |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-11 | Goal creation | Active goal created in Codex goal tool |
| 2026-05-11 | Mock native-host generation verifier | Passed with `npm run native-host:verify-generation -- --json --mock --strict` |
| 2026-05-11 | Real native-host generation guard | Passed: `npm run native-host:verify-generation -- --json --strict` stops before Codex CLI unless `--allow-external` is supplied |
| 2026-05-11 | Safe repo verification | Passed `npm run native-host:self-test`, `npm run typecheck`, `npm run test`, `npm run lint`, and `npm run build` |
| 2026-05-11 | Real native-host generation verifier | Blocked pending explicit approval because it sends the verification prompt through Codex CLI |
| 2026-05-11 | Real verifier execution request | Not run: external Codex/OpenAI data transfer still needs explicit user approval after disclosure |
| 2026-05-11 | Real native-host generation verifier | Passed after explicit approval with `npm run native-host:verify-generation -- --json --allow-external --strict`; mode `real`, elapsed `14879ms`, draft summary returned |

## Implementation Decisions

- Reuse `handleRequest({ type: "generate" })` from the native host to avoid duplicating generation behavior.
- Keep generated evidence bounded: report only preview and draft summary, not a large transcript.
- Keep `/daily` browser execution as the next slice because it requires extension reload and UI interaction evidence.

## Testing Decisions

- Run mock generation verifier first for deterministic protocol validation.
- Run real generation verifier with `--allow-external --strict` only after explicit approval to prove Codex CLI can answer.
- Run native host self-test, typecheck, test, lint, and build for the browser assistant repo.
- SaaS verification is not required for this slice unless the SaaS guide or `/daily` implementation changes.

## Out of Scope

- Browser automation of Chrome extension reload.
- Saving an assistant record in SaaS.
- Mobile Local Codex UX.
- Storing or printing credentials.

## Residual Risks

- Real native generation does not prove the content script is active on the currently open `/daily` page; the next slice must record `/daily` UI evidence.
- The Codex CLI may require network/auth state in the user's Windows profile.
- The real generation output is command-level evidence from the native host handler, not browser UI evidence from the `/daily` popup.

## Next Slice Candidate

Reload the unpacked extension, run `/daily` `Check bridge`, generate through `Local Codex (extension)`, and confirm a saved assistant record with execution mode `local-chatgpt-codex`.
