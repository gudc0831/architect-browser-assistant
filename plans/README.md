# Slice Roadmap

Current implementation goal (2026-05-11): `Slice 17 implemented; next candidate is admin assistant audit export or governance drill-down.`

Slice 16 moved assistant-origin task-change provenance from text-marker-only detection to structured assistant action audit records while preserving the text marker fallback for older data.
Slice 17 added an admin-facing assistant action audit review surface with filters and `/daily` task-detail links.

## Operating Rules

- Keep `PLAN.md` as the stable product-direction document.
- Track concrete implementation in `plans/NN-short-name.md`.
- Record code and documentation work in `docs/worklogs/YYYY-MM-DD-HHMM-short-name.md`.
- When a slice spans repos, write a worklog in each changed repo and keep the browser/SaaS boundary explicit.

## Slice Sequence

| Slice | Document | Status | Purpose | Main repo |
| --- | --- | --- | --- | --- |
| 01 | [01-task-assistant-core-loop.md](01-task-assistant-core-loop.md) | `implemented` | `/daily` task-reactive assistant core loop, retrieval, record save, summary approve foundation | `architect-saas`, `architect-browser-assistant` |
| 02 | [02-knowledge-admin-wiki.md](02-knowledge-admin-wiki.md) | `implemented` | Review assistant records into Admin WIKI candidates | `architect-saas` |
| 03 | [03-file-and-image-analysis.md](03-file-and-image-analysis.md) | `implemented` | Store file/image analysis as `project_document` assistant evidence | `architect-saas`, `architect-browser-assistant` |
| 04 | [04-web-and-skill-expansion.md](04-web-and-skill-expansion.md) | `implemented` | Store user-approved web/skill evidence as task evidence | `architect-browser-assistant`, `architect-saas` |
| 05 | [05-saas-api-mode.md](05-saas-api-mode.md) | `implemented` | SaaS API mode, policy, usage ledger, live provider adapter, admin reporting | `architect-saas` |
| 06 | [06-local-codex-bridge-packaging.md](06-local-codex-bridge-packaging.md) | `implemented` | Chrome native messaging bridge, local Codex host, Windows install foundation, side-panel diagnostics | `architect-browser-assistant` |
| 07 | [07-in-page-local-codex-bridge.md](07-in-page-local-codex-bridge.md) | `implemented` | Use the Local Codex bridge from the default `/daily` in-page assistant popup | `architect-browser-assistant`, `architect-saas` |
| 08 | [08-local-codex-health-checklist.md](08-local-codex-health-checklist.md) | `implemented` | Add an in-page Local Codex bridge health checklist before real installed-extension generation | `architect-browser-assistant`, `architect-saas` |
| 09 | [09-local-codex-installed-path-verifier.md](09-local-codex-installed-path-verifier.md) | `implemented` | Verify extension manifest, HKCU registry, native host launcher, mock status, and Codex CLI status from one command | `architect-browser-assistant`, `architect-saas` |
| 10 | [10-local-codex-real-generation-evidence.md](10-local-codex-real-generation-evidence.md) | `implemented` | Prove the native host `generate` path can produce a grounded Local Codex answer before `/daily` browser proof | `architect-browser-assistant` |
| 11 | [11-daily-installed-extension-local-codex-proof.md](11-daily-installed-extension-local-codex-proof.md) | `implemented` | Run installed-extension Local Codex proof from the default `/daily` in-page assistant popup | `architect-browser-assistant`, `architect-saas` |
| 12 | [12-local-codex-run-history-diagnostics.md](12-local-codex-run-history-diagnostics.md) | `implemented` | Show Local Codex run history and diagnostics in the default `/daily` in-page assistant popup | `architect-saas`, `architect-browser-assistant` |
| 13 | [13-assistant-closure-gate.md](13-assistant-closure-gate.md) | `implemented` | Gate assistant-backed work-summary approval with explicit closure requirements | `architect-saas`, `architect-browser-assistant` |
| 14 | [14-work-summary-task-proposals.md](14-work-summary-task-proposals.md) | `implemented` | Turn approved work summaries into optional task update and follow-up task proposals | `architect-saas`, `architect-browser-assistant` |
| 15 | [15-assistant-origin-audit-indicators.md](15-assistant-origin-audit-indicators.md) | `implemented` | Show assistant-origin task change provenance in task detail/history | `architect-saas`, `architect-browser-assistant` |
| 16 | [16-structured-assistant-action-audit.md](16-structured-assistant-action-audit.md) | `implemented` | Persist structured assistant task-update and follow-up creation audit records | `architect-saas`, `architect-browser-assistant` |
| 17 | [17-admin-action-audit-review.md](17-admin-action-audit-review.md) | `implemented` | Admin review surface for assistant action audits with filters and `/daily` task links | `architect-saas`, `architect-browser-assistant` |

## Completed Goal Log

1. `Implement and verify 01 Task Assistant Core Loop foundation across architect-browser-assistant and architect-saas.`
2. `Implement file analysis metadata storage and assistant evidence retrieval for the /daily PC popup.`
3. `Implement and verify 04 external evidence storage and assistant retrieval for /daily.`
4. `Implement browser assistant external evidence handoff to the SaaS external-evidence API.`
5. `Write and approve 05 SaaS API Mode PRD.`
6. `Implement SaaS API Mode policy and usage ledger foundation without live provider calls.`
7. `Implement SaaS API Mode live provider adapter and admin reporting.`
8. `Implement and verify 06 Local Codex bridge packaging and extension install foundation.`
9. `Make the SaaS /daily in-page popup the default assistant UI while the Chrome side panel remains manual.`
10. `Implement and verify 07 in-page Local Codex bridge for the /daily assistant popup.`
11. `Implement and verify 08 Local Codex bridge health checklist for the /daily in-page assistant popup.`
12. `Implement and verify 09 Local Codex installed-path verifier for the /daily bridge.`
13. `Implement and verify 10 Local Codex real generation evidence flow and update the continuation roadmap.`
14. `Implement and verify 11 /daily installed-extension Local Codex browser proof.`
15. `Implement and verify 12 Local Codex run history and diagnostics display in the /daily in-page assistant popup.`
16. `Implement and verify 13 assistant-backed task closure and work-summary approval flow for the /daily in-page assistant popup.`
17. `Implement and verify 14 approved work-summary task update suggestions and follow-up task proposals for the /daily in-page assistant popup.`
18. `Implement and verify 15 assistant-origin audit indicators in task detail/history for approved assistant summary task changes.`
19. `Implement and verify 16 structured assistant-action audit persistence for approved assistant task changes.`
20. `Implement and verify 17 admin-facing assistant action audit review surface with filters and task links.`

## Next Goal Candidate

`Add admin assistant action audit export or governance drill-down for operational review.`

Success criteria:

1. Admin users can export filtered assistant action audit records or open a richer per-record review view.
2. Export/drill-down preserves task links, assistant record ids, actor ids, and summary metadata.
3. The feature remains read-only for audit integrity.
