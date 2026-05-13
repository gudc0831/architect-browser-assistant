# Slice Roadmap

Current implementation goal (2026-05-13): `Slices 123-126 implemented; next candidate is Knowledge approval decision note template.`

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
Slice 76 added Knowledge show selected candidate action.
Slice 77 added Knowledge candidate queue density controls.
Slice 78 added Knowledge candidate filter handoff copy action.
Slice 79 added Knowledge candidate risk totals.
Slice 80 added Knowledge visible candidate risk totals.
Slice 81 added Knowledge evidence priority rollup.
Slice 82 added Knowledge evidence priority chips.
Slice 83 added Knowledge evidence source coverage.
Slice 84 added Knowledge unsourced evidence guardrail.
Slice 85 added Knowledge high-priority evidence guardrail.
Slice 86 added Knowledge evidence source filters.
Slice 87 added Knowledge evidence priority filters.
Slice 88 added Knowledge active evidence filter chips.
Slice 89 added Knowledge clear evidence filters action.
Slice 90 added Knowledge evidence filter handoff copy action.
Slice 91 added Knowledge visible evidence summary.
Slice 92 added Knowledge evidence empty-state guidance.
Slice 93 added Knowledge draft dirty-state indicators.
Slice 94 added Knowledge dirty-draft reset warning.
Slice 95 added Knowledge dirty-draft approval guardrail.
Slice 96 added Knowledge copy dirty-draft summary action.
Slice 97 added Knowledge Markdown outline preview.
Slice 98 added Knowledge copy Markdown outline action.
Slice 99 added Knowledge Markdown heading guardrail.
Slice 100 added Knowledge Markdown structure summary.
Slice 101 added Knowledge Markdown list guardrail.
Slice 102 added Knowledge copy Markdown structure summary.
Slice 103 added Knowledge Markdown WIKI link preview.
Slice 104 added Knowledge Markdown WIKI link guardrail.
Slice 105 added Knowledge copy WIKI link handoff.
Slice 106 added Knowledge tag coverage guardrail.
Slice 107 added Knowledge draft tag preview.
Slice 108 added Knowledge copy draft tag handoff.
Slice 109 added Knowledge duplicate tag guardrail.
Slice 110 added Knowledge scope review guardrail.
Slice 111 added Knowledge publication scope preview.
Slice 112 added Knowledge copy scope handoff.
Slice 113 added Knowledge scope change guardrail.
Slice 114 added Knowledge queue layout stability.
Slice 115 added Knowledge approval risk summary.
Slice 116 added Knowledge approval risk group details.
Slice 117 added Knowledge copy approval risk summary.
Slice 118 added Knowledge risk group count chip.
Slice 119 added Knowledge approval risk filter shortcuts.
Slice 120 added Knowledge active risk filter chips.
Slice 121 added Knowledge clear risk filter action.
Slice 122 added Knowledge copy risk filter handoff.
Slice 123 added Knowledge approval risk empty-state guidance.
Slice 124 added Knowledge approval risk warning item previews.
Slice 125 added Knowledge approval risk ready item previews.
Slice 126 added Knowledge copy risk filter details.

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
| 76 | [76-knowledge-show-selected-candidate.md](76-knowledge-show-selected-candidate.md) | `implemented` | Knowledge show selected candidate action | `architect-saas`, `architect-browser-assistant` |
| 77 | [77-knowledge-candidate-queue-density.md](77-knowledge-candidate-queue-density.md) | `implemented` | Knowledge candidate queue density controls | `architect-saas`, `architect-browser-assistant` |
| 78 | [78-knowledge-candidate-filter-handoff.md](78-knowledge-candidate-filter-handoff.md) | `implemented` | Knowledge candidate filter handoff copy action | `architect-saas`, `architect-browser-assistant` |
| 79 | [79-knowledge-candidate-risk-totals.md](79-knowledge-candidate-risk-totals.md) | `implemented` | Knowledge candidate risk totals | `architect-saas`, `architect-browser-assistant` |
| 80 | [80-knowledge-visible-candidate-risk-totals.md](80-knowledge-visible-candidate-risk-totals.md) | `implemented` | Knowledge visible candidate risk totals | `architect-saas`, `architect-browser-assistant` |
| 81 | [81-knowledge-evidence-priority-rollup.md](81-knowledge-evidence-priority-rollup.md) | `implemented` | Knowledge evidence priority rollup | `architect-saas`, `architect-browser-assistant` |
| 82 | [82-knowledge-evidence-priority-chips.md](82-knowledge-evidence-priority-chips.md) | `implemented` | Knowledge evidence priority chips | `architect-saas`, `architect-browser-assistant` |
| 83 | [83-knowledge-evidence-source-coverage.md](83-knowledge-evidence-source-coverage.md) | `implemented` | Knowledge evidence source coverage | `architect-saas`, `architect-browser-assistant` |
| 84 | [84-knowledge-unsourced-evidence-guardrail.md](84-knowledge-unsourced-evidence-guardrail.md) | `implemented` | Knowledge unsourced evidence guardrail | `architect-saas`, `architect-browser-assistant` |
| 85 | [85-knowledge-high-priority-evidence-guardrail.md](85-knowledge-high-priority-evidence-guardrail.md) | `implemented` | Knowledge high-priority evidence guardrail | `architect-saas`, `architect-browser-assistant` |
| 86 | [86-knowledge-evidence-source-filter.md](86-knowledge-evidence-source-filter.md) | `implemented` | Knowledge evidence source filters | `architect-saas`, `architect-browser-assistant` |
| 87 | [87-knowledge-evidence-priority-filter.md](87-knowledge-evidence-priority-filter.md) | `implemented` | Knowledge evidence priority filters | `architect-saas`, `architect-browser-assistant` |
| 88 | [88-knowledge-active-evidence-filter-chips.md](88-knowledge-active-evidence-filter-chips.md) | `implemented` | Knowledge active evidence filter chips | `architect-saas`, `architect-browser-assistant` |
| 89 | [89-knowledge-clear-evidence-filters.md](89-knowledge-clear-evidence-filters.md) | `implemented` | Knowledge clear evidence filters action | `architect-saas`, `architect-browser-assistant` |
| 90 | [90-knowledge-evidence-filter-handoff.md](90-knowledge-evidence-filter-handoff.md) | `implemented` | Knowledge evidence filter handoff copy action | `architect-saas`, `architect-browser-assistant` |
| 91 | [91-knowledge-visible-evidence-summary.md](91-knowledge-visible-evidence-summary.md) | `implemented` | Knowledge visible evidence summary | `architect-saas`, `architect-browser-assistant` |
| 92 | [92-knowledge-evidence-empty-state-guidance.md](92-knowledge-evidence-empty-state-guidance.md) | `implemented` | Knowledge evidence empty-state guidance | `architect-saas`, `architect-browser-assistant` |
| 93 | [93-knowledge-draft-dirty-state-indicators.md](93-knowledge-draft-dirty-state-indicators.md) | `implemented` | Knowledge draft dirty-state indicators | `architect-saas`, `architect-browser-assistant` |
| 94 | [94-knowledge-dirty-draft-reset-warning.md](94-knowledge-dirty-draft-reset-warning.md) | `implemented` | Knowledge dirty-draft reset warning | `architect-saas`, `architect-browser-assistant` |
| 95 | [95-knowledge-dirty-draft-approval-guardrail.md](95-knowledge-dirty-draft-approval-guardrail.md) | `implemented` | Knowledge dirty-draft approval guardrail | `architect-saas`, `architect-browser-assistant` |
| 96 | [96-knowledge-copy-dirty-draft-summary.md](96-knowledge-copy-dirty-draft-summary.md) | `implemented` | Knowledge copy dirty-draft summary action | `architect-saas`, `architect-browser-assistant` |
| 97 | [97-knowledge-markdown-outline-preview.md](97-knowledge-markdown-outline-preview.md) | `implemented` | Knowledge Markdown outline preview | `architect-saas`, `architect-browser-assistant` |
| 98 | [98-knowledge-copy-markdown-outline.md](98-knowledge-copy-markdown-outline.md) | `implemented` | Knowledge copy Markdown outline action | `architect-saas`, `architect-browser-assistant` |
| 99 | [99-knowledge-markdown-heading-guardrail.md](99-knowledge-markdown-heading-guardrail.md) | `implemented` | Knowledge Markdown heading guardrail | `architect-saas`, `architect-browser-assistant` |
| 100 | [100-knowledge-markdown-structure-summary.md](100-knowledge-markdown-structure-summary.md) | `implemented` | Knowledge Markdown structure summary | `architect-saas`, `architect-browser-assistant` |
| 101 | [101-knowledge-markdown-list-guardrail.md](101-knowledge-markdown-list-guardrail.md) | `implemented` | Knowledge Markdown list guardrail | `architect-saas`, `architect-browser-assistant` |
| 102 | [102-knowledge-copy-markdown-structure-summary.md](102-knowledge-copy-markdown-structure-summary.md) | `implemented` | Knowledge copy Markdown structure summary | `architect-saas`, `architect-browser-assistant` |
| 103 | [103-knowledge-markdown-wiki-link-preview.md](103-knowledge-markdown-wiki-link-preview.md) | `implemented` | Knowledge Markdown WIKI link preview | `architect-saas`, `architect-browser-assistant` |
| 104 | [104-knowledge-markdown-wiki-link-guardrail.md](104-knowledge-markdown-wiki-link-guardrail.md) | `implemented` | Knowledge Markdown WIKI link guardrail | `architect-saas`, `architect-browser-assistant` |
| 105 | [105-knowledge-copy-wiki-link-handoff.md](105-knowledge-copy-wiki-link-handoff.md) | `implemented` | Knowledge copy WIKI link handoff | `architect-saas`, `architect-browser-assistant` |
| 106 | [106-knowledge-tag-coverage-guardrail.md](106-knowledge-tag-coverage-guardrail.md) | `implemented` | Knowledge tag coverage guardrail | `architect-saas`, `architect-browser-assistant` |
| 107 | [107-knowledge-draft-tag-preview.md](107-knowledge-draft-tag-preview.md) | `implemented` | Knowledge draft tag preview | `architect-saas`, `architect-browser-assistant` |
| 108 | [108-knowledge-copy-draft-tag-handoff.md](108-knowledge-copy-draft-tag-handoff.md) | `implemented` | Knowledge copy draft tag handoff | `architect-saas`, `architect-browser-assistant` |
| 109 | [109-knowledge-duplicate-tag-guardrail.md](109-knowledge-duplicate-tag-guardrail.md) | `implemented` | Knowledge duplicate tag guardrail | `architect-saas`, `architect-browser-assistant` |
| 110 | [110-knowledge-scope-review-guardrail.md](110-knowledge-scope-review-guardrail.md) | `implemented` | Knowledge scope review guardrail | `architect-saas`, `architect-browser-assistant` |
| 111 | [111-knowledge-publication-scope-preview.md](111-knowledge-publication-scope-preview.md) | `implemented` | Knowledge publication scope preview | `architect-saas`, `architect-browser-assistant` |
| 112 | [112-knowledge-copy-scope-handoff.md](112-knowledge-copy-scope-handoff.md) | `implemented` | Knowledge copy scope handoff | `architect-saas`, `architect-browser-assistant` |
| 113 | [113-knowledge-scope-change-guardrail.md](113-knowledge-scope-change-guardrail.md) | `implemented` | Knowledge scope change guardrail | `architect-saas`, `architect-browser-assistant` |
| 114 | [114-knowledge-queue-layout-stability.md](114-knowledge-queue-layout-stability.md) | `implemented` | Knowledge queue layout stability | `architect-saas`, `architect-browser-assistant` |
| 115 | [115-knowledge-approval-risk-summary.md](115-knowledge-approval-risk-summary.md) | `implemented` | Knowledge approval risk summary | `architect-saas`, `architect-browser-assistant` |
| 116 | [116-knowledge-approval-risk-group-details.md](116-knowledge-approval-risk-group-details.md) | `implemented` | Knowledge approval risk group details | `architect-saas`, `architect-browser-assistant` |
| 117 | [117-knowledge-copy-approval-risk-summary.md](117-knowledge-copy-approval-risk-summary.md) | `implemented` | Knowledge copy approval risk summary | `architect-saas`, `architect-browser-assistant` |
| 118 | [118-knowledge-risk-group-count-chip.md](118-knowledge-risk-group-count-chip.md) | `implemented` | Knowledge risk group count chip | `architect-saas`, `architect-browser-assistant` |
| 119 | [119-knowledge-approval-risk-filter-shortcuts.md](119-knowledge-approval-risk-filter-shortcuts.md) | `implemented` | Knowledge approval risk filter shortcuts | `architect-saas`, `architect-browser-assistant` |
| 120 | [120-knowledge-active-risk-filter-chips.md](120-knowledge-active-risk-filter-chips.md) | `implemented` | Knowledge active risk filter chips | `architect-saas`, `architect-browser-assistant` |
| 121 | [121-knowledge-clear-risk-filter.md](121-knowledge-clear-risk-filter.md) | `implemented` | Knowledge clear risk filter action | `architect-saas`, `architect-browser-assistant` |
| 122 | [122-knowledge-copy-risk-filter-handoff.md](122-knowledge-copy-risk-filter-handoff.md) | `implemented` | Knowledge copy risk filter handoff | `architect-saas`, `architect-browser-assistant` |
| 123 | [123-knowledge-approval-risk-empty-state-guidance.md](123-knowledge-approval-risk-empty-state-guidance.md) | `implemented` | Knowledge approval risk empty-state guidance | `architect-saas`, `architect-browser-assistant` |
| 124 | [124-knowledge-approval-risk-warning-item-preview.md](124-knowledge-approval-risk-warning-item-preview.md) | `implemented` | Knowledge approval risk warning item preview | `architect-saas`, `architect-browser-assistant` |
| 125 | [125-knowledge-approval-risk-ready-item-preview.md](125-knowledge-approval-risk-ready-item-preview.md) | `implemented` | Knowledge approval risk ready item preview | `architect-saas`, `architect-browser-assistant` |
| 126 | [126-knowledge-copy-risk-filter-details.md](126-knowledge-copy-risk-filter-details.md) | `implemented` | Knowledge copy risk filter details | `architect-saas`, `architect-browser-assistant` |

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
79. `Implement and verify 76 Knowledge show selected candidate action.`
80. `Implement and verify 77 Knowledge candidate queue density controls.`
81. `Implement and verify 78 Knowledge candidate filter handoff copy action.`
82. `Implement and verify 79 Knowledge candidate risk totals.`
83. `Implement and verify 80 Knowledge visible candidate risk totals.`
84. `Implement and verify 81 Knowledge evidence priority rollup.`
85. `Implement and verify 82 Knowledge evidence priority chips.`
86. `Implement and verify 83 Knowledge evidence source coverage.`
87. `Implement and verify 84 Knowledge unsourced evidence guardrail.`
88. `Implement and verify 85 Knowledge high-priority evidence guardrail.`
89. `Implement and verify 86 Knowledge evidence source filters.`
90. `Implement and verify 87 Knowledge evidence priority filters.`
91. `Implement and verify 88 Knowledge active evidence filter chips.`
92. `Implement and verify 89 Knowledge clear evidence filters action.`
93. `Implement and verify 90 Knowledge evidence filter handoff copy action.`
94. `Implement and verify 91 Knowledge visible evidence summary.`
95. `Implement and verify 92 Knowledge evidence empty-state guidance.`
96. `Implement and verify 93 Knowledge draft dirty-state indicators.`
97. `Implement and verify 94 Knowledge dirty-draft reset warning.`
98. `Implement and verify 95 Knowledge dirty-draft approval guardrail.`
99. `Implement and verify 96 Knowledge copy dirty-draft summary action.`
100. `Implement and verify 97 Knowledge Markdown outline preview.`
101. `Implement and verify 98 Knowledge copy Markdown outline action.`
102. `Implement and verify 99 Knowledge Markdown heading guardrail.`
103. `Implement and verify 100 Knowledge Markdown structure summary.`
104. `Implement and verify 101 Knowledge Markdown list guardrail.`
105. `Implement and verify 102 Knowledge copy Markdown structure summary.`
106. `Implement and verify 103 Knowledge Markdown WIKI link preview.`
107. `Implement and verify 104 Knowledge Markdown WIKI link guardrail.`
108. `Implement and verify 105 Knowledge copy WIKI link handoff.`
109. `Implement and verify 106 Knowledge tag coverage guardrail.`
110. `Implement and verify 107 Knowledge draft tag preview.`
111. `Implement and verify 108 Knowledge copy draft tag handoff.`
112. `Implement and verify 109 Knowledge duplicate tag guardrail.`
113. `Implement and verify 110 Knowledge scope review guardrail.`
114. `Implement and verify 111 Knowledge publication scope preview.`
115. `Implement and verify 112 Knowledge copy scope handoff.`
116. `Implement and verify 113 Knowledge scope change guardrail.`
117. `Implement and verify 114 Knowledge queue layout stability.`
118. `Implement and verify 115 Knowledge approval risk summary.`
119. `Implement and verify 116 Knowledge approval risk group details.`
120. `Implement and verify 117 Knowledge copy approval risk summary.`
121. `Implement and verify 118 Knowledge risk group count chip.`
122. `Implement and verify 119 Knowledge approval risk filter shortcuts.`
123. `Implement and verify 120 Knowledge active risk filter chips.`
124. `Implement and verify 121 Knowledge clear risk filter action.`
125. `Implement and verify 122 Knowledge copy risk filter handoff.`
126. `Implement and verify 123 Knowledge approval risk empty-state guidance.`
127. `Implement and verify 124 Knowledge approval risk warning item preview.`
128. `Implement and verify 125 Knowledge approval risk ready item preview.`
129. `Implement and verify 126 Knowledge copy risk filter details.`

## Next Goal Candidate

`Add Knowledge approval decision note template so admins can copy a final approve/reject decision context after reviewing risk groups.`

Success criteria:

1. The decision note template includes candidate, task, active scope, warnings, and ready checks.
2. The template distinguishes approve-ready and rejection/blocker contexts.
3. The next slice PRD captures the decision-note handoff scope before implementation.
