# Slice Roadmap

Current implementation goal (2026-05-12): `Slice 75 implemented; next candidate is Knowledge candidate out-of-filter jump action.`

Slice 16 moved assistant-origin task-change provenance from text-marker-only detection to structured assistant action audit records while preserving the text marker fallback for older data.
Slice 17 added an admin-facing assistant action audit review surface with filters and `/daily` task-detail links.
Slice 18 added a read-only CSV export for filtered admin assistant action audit records.
Slice 19 added a read-only governance drill-down for individual assistant action audit records.
Slice 20 added append-only governance review notes to the assistant action audit drill-down.
Slice 21 added a read-only per-record Markdown evidence package export from the assistant action audit drill-down.
Slice 22 added filtered cross-audit governance note reporting and CSV export.
Slice 23 added read-only assistant audit retention preview and JSON archive preview export.
Slice 24 added guarded assistant audit cleanup execution requiring a matching archive preview token and explicit confirmation.
Slice 25 added assistant audit cleanup history reporting and CSV export.
Slice 26 added read-only assistant audit cleanup dry-run comparison and JSON export.
Slice 27 added assistant audit cleanup detail drill-down and Markdown evidence package export.
Slice 28 added append-only assistant audit cleanup review notes and package inclusion.
Slice 29 added filtered cleanup review-note reporting and CSV export.
Slice 30 added cleanup review-note summary metrics for category, reviewer, and reviewed/unreviewed coverage.
Slice 31 added cleanup reviewed/unreviewed coverage CSV export.
Slice 32 added an on-screen cleanup reviewed/unreviewed coverage dashboard.
Slice 33 added cleanup coverage JSON export with filters, summary counts, and coverage rows.
Slice 34 added stale cleanup review alerts for aged unreviewed cleanup runs.
Slice 35 added cleanup reviewer rollup Markdown package export.
Slice 36 added cleanup review coverage presets for all, reviewed, and stale unreviewed cleanup runs.
Slice 37 added a copyable cleanup review coverage filter handoff string.
Slice 38 added reviewer-count quick filters for cleanup review coverage.
Slice 39 added archive preview token quick filters for cleanup coverage rows.
Slice 40 added cleanup-id quick filters for cleanup coverage rows.
Slice 41 added stale-threshold preset buttons for cleanup coverage.
Slice 42 added a clear-filter action for cleanup review coverage filters.
Slice 43 added active filter summary chips for cleanup review coverage.
Slice 44 added a stale-unreviewed cleanup coverage shortcut.
Slice 45 added a reviewed cleanup coverage shortcut.
Slice 46 added cleanup governance queue grouping.
Slice 47 added cleanup governance queue metrics.
Slice 48 added cleanup governance queue shortcuts.
Slice 49 added cleanup governance queue row chips.
Slice 50 added cleanup governance queue density controls.
Slice 51 added Knowledge candidate queue counts.
Slice 52 added Knowledge candidate quick filters.
Slice 53 added Knowledge candidate search.
Slice 54 added Knowledge draft readiness chips.
Slice 55 added Knowledge draft Markdown preview.
Slice 56 added Knowledge draft source-reference chips.
Slice 57 added Knowledge draft freshness chips.
Slice 58 added Knowledge draft approval summary chips.
Slice 59 added Knowledge evidence-kind rollup chips.
Slice 60 added Knowledge draft length counters.
Slice 61 added Knowledge clear search action.
Slice 62 added Knowledge reset draft action.
Slice 63 added Knowledge copy Markdown action.
Slice 64 added Knowledge copy source handoff action.
Slice 65 added Knowledge preview density toggle.
Slice 66 added Knowledge approval guardrail notes.
Slice 67 added Knowledge guardrail summary chips.
Slice 68 added Knowledge copy approval checklist action.
Slice 69 added Knowledge review status banner.
Slice 70 added Knowledge candidate row risk chips.
Slice 71 added Knowledge candidate risk quick filters.
Slice 72 added Knowledge active candidate filter chips.
Slice 73 added Knowledge clear candidate filters action.
Slice 74 added Knowledge candidate sort controls.
Slice 75 added Knowledge candidate selection summary.

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
| 18 | [18-admin-action-audit-export.md](18-admin-action-audit-export.md) | `implemented` | Read-only CSV export for filtered admin assistant action audit review records | `architect-saas`, `architect-browser-assistant` |
| 19 | [19-assistant-audit-governance-drill-down.md](19-assistant-audit-governance-drill-down.md) | `implemented` | Read-only per-record governance drill-down for assistant action audits | `architect-saas`, `architect-browser-assistant` |
| 20 | [20-assistant-audit-governance-note-capture.md](20-assistant-audit-governance-note-capture.md) | `implemented` | Append-only governance notes in assistant action audit drill-down | `architect-saas`, `architect-browser-assistant` |
| 21 | [21-assistant-audit-evidence-package-export.md](21-assistant-audit-evidence-package-export.md) | `implemented` | Read-only per-record assistant action audit evidence package export | `architect-saas`, `architect-browser-assistant` |
| 22 | [22-filtered-governance-note-export-reporting.md](22-filtered-governance-note-export-reporting.md) | `implemented` | Filtered cross-audit governance note report and CSV export | `architect-saas`, `architect-browser-assistant` |
| 23 | [23-assistant-audit-retention-archive-preview.md](23-assistant-audit-retention-archive-preview.md) | `implemented` | Read-only assistant audit retention preview and archive export | `architect-saas`, `architect-browser-assistant` |
| 24 | [24-guarded-assistant-audit-cleanup-execution.md](24-guarded-assistant-audit-cleanup-execution.md) | `implemented` | Guarded assistant audit cleanup execution after matching preview token | `architect-saas`, `architect-browser-assistant` |
| 25 | [25-assistant-audit-cleanup-history-reporting.md](25-assistant-audit-cleanup-history-reporting.md) | `implemented` | Assistant audit cleanup history reporting and CSV export | `architect-saas`, `architect-browser-assistant` |
| 26 | [26-assistant-audit-cleanup-dry-run-comparison.md](26-assistant-audit-cleanup-dry-run-comparison.md) | `implemented` | Read-only cleanup dry-run comparison against current retention preview | `architect-saas`, `architect-browser-assistant` |
| 27 | [27-assistant-audit-cleanup-detail-package.md](27-assistant-audit-cleanup-detail-package.md) | `implemented` | Cleanup detail drill-down and Markdown evidence package export | `architect-saas`, `architect-browser-assistant` |
| 28 | [28-assistant-audit-cleanup-review-notes.md](28-assistant-audit-cleanup-review-notes.md) | `implemented` | Append-only cleanup review notes in cleanup detail/package | `architect-saas`, `architect-browser-assistant` |
| 29 | [29-assistant-audit-cleanup-note-report.md](29-assistant-audit-cleanup-note-report.md) | `implemented` | Filtered cleanup review-note reporting and CSV export | `architect-saas`, `architect-browser-assistant` |
| 30 | [30-assistant-audit-cleanup-note-summary.md](30-assistant-audit-cleanup-note-summary.md) | `implemented` | Cleanup review-note category/reviewer and reviewed/unreviewed coverage summary | `architect-saas`, `architect-browser-assistant` |
| 31 | [31-assistant-audit-cleanup-coverage-export.md](31-assistant-audit-cleanup-coverage-export.md) | `implemented` | Cleanup reviewed/unreviewed coverage CSV export | `architect-saas`, `architect-browser-assistant` |
| 32 | [32-assistant-audit-cleanup-coverage-dashboard.md](32-assistant-audit-cleanup-coverage-dashboard.md) | `implemented` | On-screen cleanup reviewed/unreviewed coverage dashboard | `architect-saas`, `architect-browser-assistant` |
| 33 | [33-assistant-audit-cleanup-coverage-json.md](33-assistant-audit-cleanup-coverage-json.md) | `implemented` | Cleanup reviewed/unreviewed coverage JSON export | `architect-saas`, `architect-browser-assistant` |
| 34 | [34-assistant-audit-cleanup-stale-alerts.md](34-assistant-audit-cleanup-stale-alerts.md) | `implemented` | Stale cleanup review alerts for aged unreviewed cleanup runs | `architect-saas`, `architect-browser-assistant` |
| 35 | [35-assistant-audit-cleanup-rollup-package.md](35-assistant-audit-cleanup-rollup-package.md) | `implemented` | Cleanup reviewer rollup Markdown package export | `architect-saas`, `architect-browser-assistant` |
| 36 | [36-assistant-audit-cleanup-coverage-presets.md](36-assistant-audit-cleanup-coverage-presets.md) | `implemented` | Cleanup coverage presets for all, reviewed, and stale unreviewed runs | `architect-saas`, `architect-browser-assistant` |
| 37 | [37-assistant-audit-cleanup-filter-handoff.md](37-assistant-audit-cleanup-filter-handoff.md) | `implemented` | Copyable cleanup coverage filter handoff string | `architect-saas`, `architect-browser-assistant` |
| 38 | [38-assistant-audit-cleanup-reviewer-quick-filter.md](38-assistant-audit-cleanup-reviewer-quick-filter.md) | `implemented` | Reviewer-count quick filters for cleanup coverage | `architect-saas`, `architect-browser-assistant` |
| 39 | [39-assistant-audit-cleanup-token-quick-filter.md](39-assistant-audit-cleanup-token-quick-filter.md) | `implemented` | Archive preview token quick filters for cleanup coverage rows | `architect-saas`, `architect-browser-assistant` |
| 40 | [40-assistant-audit-cleanup-id-quick-filter.md](40-assistant-audit-cleanup-id-quick-filter.md) | `implemented` | Cleanup-id quick filters for cleanup coverage rows | `architect-saas`, `architect-browser-assistant` |
| 41 | [41-assistant-audit-cleanup-stale-threshold-presets.md](41-assistant-audit-cleanup-stale-threshold-presets.md) | `implemented` | Stale-threshold preset buttons for cleanup coverage | `architect-saas`, `architect-browser-assistant` |
| 42 | [42-assistant-audit-cleanup-clear-filters.md](42-assistant-audit-cleanup-clear-filters.md) | `implemented` | Clear-filter action for cleanup review coverage filters | `architect-saas`, `architect-browser-assistant` |
| 43 | [43-assistant-audit-cleanup-active-filter-chips.md](43-assistant-audit-cleanup-active-filter-chips.md) | `implemented` | Active filter summary chips for cleanup review coverage | `architect-saas`, `architect-browser-assistant` |
| 44 | [44-assistant-audit-cleanup-stale-unreviewed-shortcut.md](44-assistant-audit-cleanup-stale-unreviewed-shortcut.md) | `implemented` | Stale-unreviewed cleanup coverage shortcut | `architect-saas`, `architect-browser-assistant` |
| 45 | [45-assistant-audit-cleanup-reviewed-shortcut.md](45-assistant-audit-cleanup-reviewed-shortcut.md) | `implemented` | Reviewed cleanup coverage shortcut | `architect-saas`, `architect-browser-assistant` |
| 46 | [46-assistant-audit-cleanup-queue-grouping.md](46-assistant-audit-cleanup-queue-grouping.md) | `implemented` | Cleanup governance queue grouping | `architect-saas`, `architect-browser-assistant` |
| 47 | [47-assistant-audit-cleanup-queue-metrics.md](47-assistant-audit-cleanup-queue-metrics.md) | `implemented` | Cleanup governance queue metrics | `architect-saas`, `architect-browser-assistant` |
| 48 | [48-assistant-audit-cleanup-queue-shortcuts.md](48-assistant-audit-cleanup-queue-shortcuts.md) | `implemented` | Cleanup governance queue shortcuts | `architect-saas`, `architect-browser-assistant` |
| 49 | [49-assistant-audit-cleanup-row-chips.md](49-assistant-audit-cleanup-row-chips.md) | `implemented` | Cleanup governance queue row chips | `architect-saas`, `architect-browser-assistant` |
| 50 | [50-assistant-audit-cleanup-queue-density.md](50-assistant-audit-cleanup-queue-density.md) | `implemented` | Cleanup governance queue density controls | `architect-saas`, `architect-browser-assistant` |
| 51 | [51-knowledge-candidate-queue-counts.md](51-knowledge-candidate-queue-counts.md) | `implemented` | Knowledge candidate queue counts | `architect-saas`, `architect-browser-assistant` |
| 52 | [52-knowledge-candidate-quick-filters.md](52-knowledge-candidate-quick-filters.md) | `implemented` | Knowledge candidate quick filters | `architect-saas`, `architect-browser-assistant` |
| 53 | [53-knowledge-candidate-search.md](53-knowledge-candidate-search.md) | `implemented` | Knowledge candidate search | `architect-saas`, `architect-browser-assistant` |
| 54 | [54-knowledge-draft-readiness.md](54-knowledge-draft-readiness.md) | `implemented` | Knowledge draft readiness checklist | `architect-saas`, `architect-browser-assistant` |
| 55 | [55-knowledge-draft-markdown-preview.md](55-knowledge-draft-markdown-preview.md) | `implemented` | Knowledge draft Markdown preview | `architect-saas`, `architect-browser-assistant` |
| 56 | [56-knowledge-draft-source-chips.md](56-knowledge-draft-source-chips.md) | `implemented` | Knowledge draft source-reference chips | `architect-saas`, `architect-browser-assistant` |
| 57 | [57-knowledge-draft-freshness-chips.md](57-knowledge-draft-freshness-chips.md) | `implemented` | Knowledge draft freshness chips | `architect-saas`, `architect-browser-assistant` |
| 58 | [58-knowledge-draft-approval-summary.md](58-knowledge-draft-approval-summary.md) | `implemented` | Knowledge draft approval summary chips | `architect-saas`, `architect-browser-assistant` |
| 59 | [59-knowledge-evidence-kind-rollup.md](59-knowledge-evidence-kind-rollup.md) | `implemented` | Knowledge evidence-kind rollup chips | `architect-saas`, `architect-browser-assistant` |
| 60 | [60-knowledge-draft-length-counters.md](60-knowledge-draft-length-counters.md) | `implemented` | Knowledge draft length counters | `architect-saas`, `architect-browser-assistant` |
| 61 | [61-knowledge-clear-search.md](61-knowledge-clear-search.md) | `implemented` | Knowledge clear search action | `architect-saas`, `architect-browser-assistant` |
| 62 | [62-knowledge-reset-draft.md](62-knowledge-reset-draft.md) | `implemented` | Knowledge reset draft action | `architect-saas`, `architect-browser-assistant` |
| 63 | [63-knowledge-copy-markdown.md](63-knowledge-copy-markdown.md) | `implemented` | Knowledge copy Markdown action | `architect-saas`, `architect-browser-assistant` |
| 64 | [64-knowledge-copy-source-handoff.md](64-knowledge-copy-source-handoff.md) | `implemented` | Knowledge copy source handoff action | `architect-saas`, `architect-browser-assistant` |
| 65 | [65-knowledge-preview-density.md](65-knowledge-preview-density.md) | `implemented` | Knowledge preview density toggle | `architect-saas`, `architect-browser-assistant` |
| 66 | [66-knowledge-approval-guardrail-notes.md](66-knowledge-approval-guardrail-notes.md) | `implemented` | Knowledge approval guardrail notes | `architect-saas`, `architect-browser-assistant` |
| 67 | [67-knowledge-guardrail-summary-chips.md](67-knowledge-guardrail-summary-chips.md) | `implemented` | Knowledge guardrail summary chips | `architect-saas`, `architect-browser-assistant` |
| 68 | [68-knowledge-copy-approval-checklist.md](68-knowledge-copy-approval-checklist.md) | `implemented` | Knowledge copy approval checklist action | `architect-saas`, `architect-browser-assistant` |
| 69 | [69-knowledge-review-status-banner.md](69-knowledge-review-status-banner.md) | `implemented` | Knowledge review status banner | `architect-saas`, `architect-browser-assistant` |
| 70 | [70-knowledge-candidate-row-risk-chips.md](70-knowledge-candidate-row-risk-chips.md) | `implemented` | Knowledge candidate row risk chips | `architect-saas`, `architect-browser-assistant` |
| 71 | [71-knowledge-candidate-risk-filters.md](71-knowledge-candidate-risk-filters.md) | `implemented` | Knowledge candidate risk quick filters | `architect-saas`, `architect-browser-assistant` |
| 72 | [72-knowledge-active-candidate-filter-chips.md](72-knowledge-active-candidate-filter-chips.md) | `implemented` | Knowledge active candidate filter chips | `architect-saas`, `architect-browser-assistant` |
| 73 | [73-knowledge-clear-candidate-filters.md](73-knowledge-clear-candidate-filters.md) | `implemented` | Knowledge clear candidate filters action | `architect-saas`, `architect-browser-assistant` |
| 74 | [74-knowledge-candidate-sort-controls.md](74-knowledge-candidate-sort-controls.md) | `implemented` | Knowledge candidate sort controls | `architect-saas`, `architect-browser-assistant` |
| 75 | [75-knowledge-candidate-selection-summary.md](75-knowledge-candidate-selection-summary.md) | `implemented` | Knowledge candidate selection summary | `architect-saas`, `architect-browser-assistant` |

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
21. `Implement and verify 18 admin assistant action audit CSV export for operational review.`
22. `Implement and verify 19 assistant audit governance drill-down for operational review.`
23. `Implement and verify 20 assistant audit governance note capture for operational review.`
24. `Implement and verify 21 assistant audit evidence package export for operational review.`
25. `Implement and verify 22 filtered governance note export/reporting across assistant action audits.`
26. `Implement and verify 23 assistant audit retention archive preview controls.`
27. `Implement and verify 24 guarded assistant audit cleanup execution.`
28. `Implement and verify 25 assistant audit cleanup history reporting and export.`
29. `Implement and verify 26 assistant audit cleanup dry-run comparison.`
30. `Implement and verify 27 assistant audit cleanup detail package export.`
31. `Implement and verify 28 assistant audit cleanup review notes.`
32. `Implement and verify 29 assistant audit cleanup review-note reporting and CSV export.`
33. `Implement and verify 30 assistant audit cleanup review-note summary metrics.`
34. `Implement and verify 31 assistant audit cleanup reviewed/unreviewed coverage CSV export.`
35. `Implement and verify 32 assistant audit cleanup reviewed/unreviewed coverage dashboard.`
36. `Implement and verify 33 assistant audit cleanup coverage JSON export.`
37. `Implement and verify 34 assistant audit cleanup stale review alerts.`
38. `Implement and verify 35 assistant audit cleanup reviewer rollup package export.`
39. `Implement and verify 36 assistant audit cleanup coverage filter presets.`
40. `Implement and verify 37 assistant audit cleanup coverage filter handoff.`
41. `Implement and verify 38 assistant audit cleanup reviewer quick filter.`
42. `Implement and verify 39 assistant audit cleanup token quick filter.`
43. `Implement and verify 40 assistant audit cleanup-id quick filter.`
44. `Implement and verify 41 assistant audit cleanup stale-threshold presets.`
45. `Implement and verify 42 assistant audit cleanup clear-filter action.`
46. `Implement and verify 43 assistant audit cleanup active filter chips.`
47. `Implement and verify 44 assistant audit cleanup stale-unreviewed shortcut.`
48. `Implement and verify 45 assistant audit cleanup reviewed shortcut.`
49. `Implement and verify 46 assistant audit cleanup governance queue grouping.`
50. `Implement and verify 47 assistant audit cleanup queue metrics.`
51. `Implement and verify 48 assistant audit cleanup queue shortcuts.`
52. `Implement and verify 49 assistant audit cleanup row chips.`
53. `Implement and verify 50 assistant audit cleanup queue density controls.`
54. `Implement and verify 51 Knowledge candidate queue counts.`
55. `Implement and verify 52 Knowledge candidate quick filters.`
56. `Implement and verify 53 Knowledge candidate search.`
57. `Implement and verify 54 Knowledge draft readiness checklist.`
58. `Implement and verify 55 Knowledge draft Markdown preview.`
59. `Implement and verify 56 Knowledge draft source-reference chips.`
60. `Implement and verify 57 Knowledge draft freshness chips.`
61. `Implement and verify 58 Knowledge draft approval summary chips.`
62. `Implement and verify 59 Knowledge evidence-kind rollup chips.`
63. `Implement and verify 60 Knowledge draft length counters.`
64. `Implement and verify 61 Knowledge clear search action.`
65. `Implement and verify 62 Knowledge reset draft action.`
66. `Implement and verify 63 Knowledge copy Markdown action.`
67. `Implement and verify 64 Knowledge copy source handoff action.`
68. `Implement and verify 65 Knowledge preview density toggle.`
69. `Implement and verify 66 Knowledge approval guardrail notes.`
70. `Implement and verify 67 Knowledge guardrail summary chips.`
71. `Implement and verify 68 Knowledge copy approval checklist action.`
72. `Implement and verify 69 Knowledge review status banner.`
73. `Implement and verify 70 Knowledge candidate row risk chips.`
74. `Implement and verify 71 Knowledge candidate risk quick filters.`
75. `Implement and verify 72 Knowledge active candidate filter chips.`
76. `Implement and verify 73 Knowledge clear candidate filters action.`
77. `Implement and verify 74 Knowledge candidate sort controls.`
78. `Implement and verify 75 Knowledge candidate selection summary.`

## Next Goal Candidate

`Add a Knowledge out-of-filter jump action so admins can return the queue filters to the selected candidate when it is hidden.`

Success criteria:

1. Candidate selection summary exposes an action when selected item is outside filters.
2. The action clears filters enough to reveal the selected candidate.
3. The out-of-filter action slice is documented in the next slice PRD.
