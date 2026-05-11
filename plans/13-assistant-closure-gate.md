# 13. Assistant Closure Gate PRD

Created: 2026-05-11
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 13 assistant-backed task closure and work-summary approval flow for the `/daily` in-page assistant popup.
Worklog: [../docs/worklogs/2026-05-11-1508-assistant-closure-gate.md](../docs/worklogs/2026-05-11-1508-assistant-closure-gate.md)

## Problem Statement

The `/daily` assistant can now generate, save, and show Local Codex/SaaS/Mock records, but the work-summary approval action still behaves like a single immediate save. For assistant-backed tasks, the user needs an explicit closure gate before a generated draft becomes an approved task work summary.

## Solution

Make the `/daily` popup approval flow require visible review of the assistant draft:

1. Show an editable work-summary draft after generation.
2. Display a closure checklist for conclusion, scope, evidence, confidence, and follow-up action.
3. Require an explicit user acknowledgement before `approved` status can be saved.
4. Provide a `deferred` save path when the generated draft is not ready for closure.
5. Enforce the approved-summary minimum requirements in the SaaS use case, not only in the UI.

## User Stories

1. As an operator, I can edit the AI-generated conclusion, scope, tags, and follow-up action before approval.
2. As an operator, I can see why a summary cannot yet be approved.
3. As an operator, I can defer a summary when evidence or follow-up is incomplete.
4. As a reviewer, I can trust that approved assistant summaries include the minimum closure fields.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 13 PRD and active goal documentation | done | browser docs commit | this worklog | Document created |
| Editable work-summary draft UI | done | architect-saas `df3ffe8` | SaaS worklog | Browser showed editable conclusion, tags, scope, and follow-up fields |
| Closure checklist and acknowledgement gate | done | architect-saas `df3ffe8` | SaaS worklog | Browser showed approve disabled before acknowledgement and enabled after checklist/acknowledgement |
| Deferred summary save path | done | architect-saas `df3ffe8` | SaaS worklog | Browser showed `보류 저장` enabled after generation |
| Server-side approved-summary validation | done | architect-saas `df3ffe8` | SaaS worklog | API negative check returned HTTP 400 when approved summary omitted `followUpAction` |
| Browser verification on `/daily` | done | architect-saas `df3ffe8` | this worklog | Passed in Codex in-app browser against `http://localhost:3000/daily` |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-11 | Goal creation | Active goal created in Codex goal tool |
| 2026-05-11 | SaaS static checks | `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing hook dependency warnings outside Slice 13 |
| 2026-05-11 | `/daily` browser proof | Task 001 Mock generation showed editable closure draft, checklist, disabled approval before acknowledgement, enabled approval after acknowledgement, and successful approved save |
| 2026-05-11 | API validation proof | Approved summary without `followUpAction` returned HTTP 400 |

## Implementation Decisions

- Keep the default user surface as the SaaS `/daily` in-page assistant popup.
- Do not auto-complete or auto-close tasks; this slice only governs work-summary approval.
- Allow `deferred` saves without the final acknowledgement so incomplete generated drafts can be recorded honestly.
- Keep backend enforcement small: approved summaries require conclusion, scope, follow-up action, linked evidence, and a confidence reason.

## Testing Decisions

- Run SaaS `npm run typecheck` and `npm run lint`.
- Use browser verification on `/daily` to confirm approve remains disabled until the checklist and acknowledgement pass.
- Use API-level verification for the approved-summary validation path if practical.

## Out of Scope

- Changing task status to complete.
- Creating follow-up tasks automatically.
- Admin WIKI approval changes.
- Mobile assistant UX.

## Residual Risks

- Existing generated Korean strings in the local data may render with legacy mojibake in shell output, but browser UI should remain readable.
- This slice does not yet persist the user's acknowledgement as a structured audit field beyond the approved summary save.

## Next Slice Candidate

Turn approved work-summary data into optional task update suggestions and follow-up task creation proposals.
