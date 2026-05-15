# Slice Roadmap

Current implementation goal (2026-05-15): `Slice 468 implemented: crop artifact preview/download UI for persisted image-region file evidence.`

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
Slice 127 added Knowledge approval decision note context chips.
Slice 128 added Knowledge copy approval decision note action.
Slice 129 added Knowledge decision note blocker details.
Slice 130 added Knowledge decision note ready summary.
Slice 131 added Knowledge rejection reason presets.
Slice 132 added Knowledge apply rejection preset.
Slice 133 added Knowledge rejection reason draft status.
Slice 134 added Knowledge copy rejection reason.
Slice 135 added Knowledge approval submit blocker count.
Slice 136 added Knowledge approval submit caution guidance.
Slice 137 added Knowledge copy approval blockers.
Slice 138 added Knowledge approval button warning context.
Slice 139 added Knowledge approval package summary.
Slice 140 added Knowledge copy approval package.
Slice 141 added Knowledge approval package draft section.
Slice 142 added Knowledge approval package evidence section.
Slice 143 added Knowledge approval package quality summary.
Slice 144 added Knowledge package quality detail checks.
Slice 145 added Knowledge copy package quality report.
Slice 146 added Knowledge package quality missing guidance.
Slice 147 added Knowledge final review closeout summary.
Slice 148 added Knowledge final review next action.
Slice 149 added Knowledge copy final review closeout.
Slice 150 added Knowledge closeout readiness handoff.
Slice 151 added approved WIKI items API readback.
Slice 152 added approved WIKI load state.
Slice 153 added approved WIKI item counts.
Slice 154 added approved WIKI scope counts.
Slice 155 added approved WIKI source coverage.
Slice 156 added approved WIKI tag index.
Slice 157 added approved WIKI search.
Slice 158 added approved WIKI scope filter.
Slice 159 added approved WIKI tag filter.
Slice 160 added approved WIKI source filter.
Slice 161 added approved WIKI sort controls.
Slice 162 added approved WIKI active filter chips.
Slice 163 added approved WIKI clear filters.
Slice 164 added approved WIKI refresh action.
Slice 165 added approved WIKI visible list.
Slice 166 added approved WIKI selection state.
Slice 167 added approved WIKI row metadata.
Slice 168 added approved WIKI empty state.
Slice 169 added approved WIKI detail panel.
Slice 170 added approved WIKI tag chips.
Slice 171 added approved WIKI quality checks.
Slice 172 added approved WIKI quality summary.
Slice 173 added approved WIKI Markdown preview.
Slice 174 added approved WIKI preview density.
Slice 175 added copy approved WIKI Markdown.
Slice 176 added copy approved item handoff.
Slice 177 added copy approved search handoff.
Slice 178 added approved WIKI source package.
Slice 179 added copy approved source package.
Slice 180 added copy approved index package.
Slice 181 added approved WIKI source reference list.
Slice 182 added approved WIKI unsourced warning.
Slice 183 added approved WIKI lineage readback.
Slice 184 added approved WIKI reuse handoff.
Slice 185 added approved WIKI search result index.
Slice 186 added approved WIKI retrieval tags.
Slice 187 added approved WIKI source priority readback.
Slice 188 added approved WIKI source URL readback.
Slice 189 added approved WIKI body length check.
Slice 190 added approved WIKI metadata quality check.
Slice 191 added approved WIKI user guide.
Slice 192 added approved WIKI SaaS worklog.
Slice 193 added approved WIKI planning worklog.
Slice 194 added approved WIKI API validation.
Slice 195 added approved WIKI typecheck.
Slice 196 added approved WIKI lint.
Slice 197 added approved WIKI browser UI validation.
Slice 198 added approved WIKI commit boundary.
Slice 199 added approved WIKI next candidate.
Slice 200 added approved WIKI closeout report.
Slice 201 added approved WIKI export scope state.
Slice 202 added approved WIKI export format state.
Slice 203 added approved WIKI sync target profile.
Slice 204 added approved WIKI export item selection.
Slice 205 added approved WIKI export stats.
Slice 206 added approved WIKI export file preview.
Slice 207 added approved WIKI export readiness checks.
Slice 208 added approved WIKI export readiness summary.
Slice 209 added copy approved WIKI sync manifest.
Slice 210 added copy approved WIKI export checklist.
Slice 211 added download approved WIKI JSON package.
Slice 212 added download approved WIKI Markdown package.
Slice 213 added approved WIKI export filter scope.
Slice 214 added approved WIKI export generated timestamp.
Slice 215 added approved WIKI export stats payload.
Slice 216 added approved WIKI export source lineage.
Slice 217 added approved WIKI export tag and scope fields.
Slice 218 added approved WIKI Markdown export sections.
Slice 219 added approved WIKI Markdown source rows.
Slice 220 added approved WIKI sync target guidance.
Slice 221 added approved WIKI selected export scope.
Slice 222 added approved WIKI visible export scope.
Slice 223 added approved WIKI empty export disabled state.
Slice 224 added approved WIKI export unsourced warning.
Slice 225 added approved WIKI export tag coverage.
Slice 226 added approved WIKI export body content check.
Slice 227 added approved WIKI portable archive target.
Slice 228 added approved WIKI Obsidian target.
Slice 229 added approved WIKI Notion target.
Slice 230 added approved WIKI assistant retrieval target.
Slice 231 added approved WIKI export toolbar layout.
Slice 232 added approved WIKI export mobile layout.
Slice 233 added approved WIKI export download status.
Slice 234 added approved WIKI export clipboard status.
Slice 235 added approved WIKI sync manifest item list.
Slice 236 added approved WIKI export checklist item list.
Slice 237 added approved WIKI export stat chips.
Slice 238 added approved WIKI selected export filename.
Slice 239 added approved WIKI visible export filename.
Slice 240 added approved WIKI JSON MIME download.
Slice 241 added approved WIKI Markdown MIME download.
Slice 242 added approved WIKI export URL cleanup.
Slice 243 added approved WIKI export no server write.
Slice 244 added approved WIKI export preserves readback API.
Slice 245 added approved WIKI export user guide.
Slice 246 added approved WIKI export SaaS worklog.
Slice 247 added approved WIKI export planning worklog.
Slice 248 added approved WIKI export API validation.
Slice 249 added approved WIKI export typecheck.
Slice 250 added approved WIKI export lint.
Slice 251 added approved WIKI export panel browser validation.
Slice 252 added approved WIKI sync target browser validation.
Slice 253 added approved WIKI format browser validation.
Slice 254 added approved WIKI scope browser validation.
Slice 255 added approved WIKI manifest browser validation.
Slice 256 added approved WIKI checklist browser validation.
Slice 257 added approved WIKI download browser validation.
Slice 258 added approved WIKI export decision record.
Slice 259 added approved WIKI README goal update.
Slice 260 added approved WIKI next candidate.
Slice 261 added approved WIKI package type.
Slice 262 added approved WIKI item id map.
Slice 263 added approved WIKI approval metadata.
Slice 264 added approved WIKI summary body pair.
Slice 265 added approved WIKI source reference payload.
Slice 266 added approved WIKI filter reproduction.
Slice 267 added approved WIKI target labels.
Slice 268 added approved WIKI format labels.
Slice 269 added approved WIKI scope labels.
Slice 270 added approved WIKI retrieval readiness.
Slice 271 added approved WIKI Obsidian readiness.
Slice 272 added approved WIKI Notion readiness.
Slice 273 added approved WIKI archive readiness.
Slice 274 added approved WIKI selected export empty guidance.
Slice 275 added approved WIKI visible export empty guidance.
Slice 276 added approved WIKI export readiness no mutation.
Slice 277 added approved WIKI export status no API error.
Slice 278 added approved WIKI filename target segment.
Slice 279 added approved WIKI filename scope segment.
Slice 280 added approved WIKI filename count segment.
Slice 281 added approved WIKI manifest ready count.
Slice 282 added approved WIKI checklist stats.
Slice 283 added approved WIKI export UI grouping.
Slice 284 added approved WIKI export quality inheritance.
Slice 285 added approved WIKI export source count chip.
Slice 286 added approved WIKI export tag count chip.
Slice 287 added approved WIKI export body count chip.
Slice 288 added approved WIKI export ready warning chip.
Slice 289 added approved WIKI package reproducibility.
Slice 290 added approved WIKI future sync boundary.
Slice 291 added approved WIKI export roadmap summary.
Slice 292 added approved WIKI plan file coverage.
Slice 293 added approved WIKI export verification log.
Slice 294 added approved WIKI export SaaS commit.
Slice 295 added approved WIKI export planning commit.
Slice 296 added approved WIKI PLAN unchanged.
Slice 297 added approved WIKI browser clean tree.
Slice 298 added approved WIKI SaaS clean tree.
Slice 299 added approved WIKI export goal closeout.
Slice 300 added approved WIKI export completion report.
Slice 301 added an approved WIKI sync history model.
Slice 302 added browser-side guarded sync history loading.
Slice 303 added browser-side guarded sync history persistence.
Slice 304 reused approved WIKI package filenames for export and sync history.
Slice 305 added guarded sync dry-run warning generation.
Slice 306 added the `SYNC_APPROVED_WIKI` confirmation phrase.
Slice 307 added a readiness and confirmation gate for guarded sync.
Slice 308 added a dry-run preview history action.
Slice 309 added blocked guarded-sync history records.
Slice 310 added simulated guarded-sync history records.
Slice 311 added sync status feedback for dry-run, blocked, and simulated attempts.
Slice 312 added guarded sync history count chips.
Slice 313 added last-run status chips.
Slice 314 added a local guarded sync history list.
Slice 315 added package stats to guarded sync history rows.
Slice 316 added readiness stats to guarded sync history rows.
Slice 317 added target, format, and scope fields to copied sync history reports.
Slice 318 added a copyable guarded sync history report.
Slice 319 added a clear-local-history action.
Slice 320 added explicit external-provider simulation guidance.
Slice 321 added Obsidian JSON conversion warning guidance.
Slice 322 linked unsourced item warnings into guarded sync dry-runs.
Slice 323 linked export readiness blockers into guarded sync dry-runs.
Slice 324 documented the no-server-write sync history decision.
Slice 325 updated the user guide for guarded sync history.
Slice 326 added a SaaS worklog for guarded sync history.
Slice 327 added a planning worklog for guarded sync history.
Slice 328 validated Knowledge admin API readback.
Slice 329 validated SaaS typecheck.
Slice 330 validated SaaS lint.
Slice 331 validated Browser UI export panel rendering.
Slice 332 validated Browser UI dry-run history creation.
Slice 333 validated Browser UI confirmation gating.
Slice 334 validated Browser UI guarded sync simulation.
Slice 335 validated Browser UI copied history report availability.
Slice 336 updated this roadmap with the implemented slice batch.
Slice 337 left the next goal candidate for persisted audit and provider sync.
Slice 338 kept `PLAN.md` unchanged as product direction.
Slice 339 separated SaaS and browser-assistant commit boundaries.
Slice 340 checked the SaaS working tree after implementation.
Slice 341 checked the browser-assistant working tree after planning updates.
Slice 342 closed the active goal after verification and commits.
Slice 343 preserved approved WIKI readback API contracts.
Slice 344 preserved browser-side export package generation.
Slice 345 preserved source lineage metadata in sync history.
Slice 346 preserved package readiness metadata in sync history.
Slice 347 preserved target selection metadata in sync history.
Slice 348 preserved local-only sync execution semantics.
Slice 349 captured residual risk for server audit persistence.
Slice 350 captured completion decisions for the next slice handoff.
Slice 351 added persisted Knowledge export audit records and provider-configuration guarded sync status.
Slice 352 added provider target configuration APIs.
Slice 353 added provider target configuration UI controls.
Slice 354 added provider-ready audit status derived from target configuration.
Slice 355 added provider preview adapter API.
Slice 356 added provider preview UI.
Slice 357 added copyable provider preview reports.
Slice 358 added append-only provider config audit history.
Slice 359 updated user guidance for provider config and previews.
Slice 360 verified provider config and preview behavior.
Slice 361 recorded the next provider adapter candidate.
Slice 362 added provider credential boundaries and a guarded portable archive execution adapter.
Slice 363 added provider-specific secret metadata and a guarded Obsidian execution adapter.
Slice 364 added server-side provider credential registry metadata and remote write readiness controls.
Slice 365 added an Obsidian dry-run reconciliation package with planned Markdown paths and create intents.
Slice 366 added a sanitized read-only Obsidian inventory manifest contract and create/update/delete/noop reconciliation comparison.
Slice 367 added a default-disabled Obsidian live-write feature flag and rollback preflight execution artifact.
Slice 368 added immutable provider execution package export/download for preflight and rollback evidence review.
Slice 369 added provider execution package retention metadata and review-history filtering.
Slice 370 added append-only provider execution package review notes tied to execution ids and package digests.
Slice 371 added a filtered provider execution package review-note report.
Slice 372 added provider execution package review-note CSV export.
Slice 373 added provider execution package review summary metrics.
Slice 374 added provider execution package review coverage rows.
Slice 375 added provider execution package review coverage presets.
Slice 376 added stale-unreviewed provider execution package alerts.
Slice 377 added provider execution package reviewer rollup quick filters.
Slice 378 added a copyable provider execution package review handoff.
Slice 379 added controlled provider execution package review filters for category, reviewer, stale threshold, coverage, and digest.
Slice 380 added provider execution package digest quick filters and note-category summary chips.
Slice 381 added provider execution package review reset chips for digest, note-category, and reviewer shortcut filters.
Slice 382 added a read-only active provider execution package review handoff preview before copy.
Slice 383 added provider execution package review coverage queue group totals for the active filtered scope.
Slice 384 added provider execution package review coverage group shortcuts.
Slice 385 added provider execution package review coverage queue grouping.
Slice 386 added provider execution package review coverage group row chips.
Slice 387 added provider execution package review coverage queue density controls.
Slice 388 added provider execution package review coverage empty-state guidance.
Slice 389 added provider execution package review coverage group summary copy.
Slice 390 added provider execution package review coverage group summary preview.
Slice 391 added provider execution package review coverage group summary filter chips.
Slice 392 added provider execution package review coverage group summary count chips.
Slice 393 adds provider execution package review coverage group summary Markdown download.
Slice 394 adds provider execution package review coverage group summary download status chip.
Slice 395 adds provider execution package review coverage group summary copy status chip.
Slice 396 adds provider execution package review coverage group summary local action reset.
Slice 397 adds provider execution package review coverage group summary generated-at chip.
Slice 398 adds provider execution package review coverage group summary Markdown size chips.
Slice 399 adds provider execution package review coverage group summary dominant queue chip.
Slice 400 adds provider execution package review coverage group summary empty queue count chip.
Slice 401 adds provider execution package review coverage group summary review-needed chip.
Slice 402 adds provider execution package review coverage group summary stale priority chip.
Slice 403 adds provider execution package review coverage group summary local-only handoff chip.
Slice 414 adds provider execution package review coverage group summary next download filename chip.
Slice 415 adds provider execution package review coverage group summary filename copy action.
Slice 416 adds provider execution package review coverage group summary reset explanation chip.
Slice 417 adds provider execution package review coverage group summary reset confirmation chip.
Slice 418 adds provider execution package review coverage group summary reset confirmation copy handoff.
Slice 419 adds provider execution package review coverage group summary reset confirmation copied-at chip.
Slice 420 adds provider execution package review coverage group summary reset confirmation freshness chip.
Slice 421 adds provider execution package review coverage group summary reset confirmation freshness tooltip.
Slice 422 polishes provider execution package review coverage group summary reset confirmation action order.
Slice 423 labels provider execution package review coverage group summary local handoff actions separately from density controls.
Slice 424 adds provider execution package review coverage summary local handoff action group tooltip.
Slice 425 clarifies provider execution package review coverage summary copied-state reset note.
Slice 426 adds provider execution package review coverage summary reset explanation tooltip.
Slice 427 adds provider execution package review coverage summary reset confirmation copied-at tooltip.
Slice 428 adds provider execution package review coverage summary reset confirmation copy status tooltip.
Slice 429 adds provider execution package review coverage summary reset confirmation chip tooltip.
Slice 430 adds provider execution package review coverage summary generated-at chip tooltip.
Slice 431 adds provider execution package review coverage summary next filename chip tooltip.
Slice 432 adds provider execution package review coverage summary Markdown size chip tooltip.
Slice 433 adds provider execution package review coverage summary dominant queue chip tooltip.
Slice 434 adds provider execution package review coverage summary empty queue count chip tooltip.
Slice 435 adds provider execution package review coverage summary review-needed chip tooltip.
Slice 436 adds provider execution package review coverage summary stale priority chip tooltip.
Slice 437 adds provider execution package review coverage summary local-only handoff chip tooltip.
Slice 438 adds provider execution package review coverage summary filter chips tooltip.
Slice 439 adds provider execution package review coverage summary count chips tooltip.
Slice 440 adds provider execution package review coverage summary download status chip tooltip.
Slice 441 adds provider execution package review coverage summary copy status chip tooltip.
Slice 442 adds provider execution package review coverage summary filename copy status chip tooltip.
Slice 443 adds provider execution package review coverage queue density controls tooltip.
Slice 444 adds provider execution package review coverage grouped queue container tooltip.
Slice 445 adds provider execution package review coverage grouped queue empty-state tooltip.
Slice 446 adds provider execution package review coverage grouped queue section tooltip.
Slice 447 adds provider execution package review coverage grouped queue count tooltip.
Slice 448 adds provider execution package review coverage grouped queue rows tooltip.
Slice 449 adds provider execution package review coverage grouped queue row tooltip.
Slice 450 adds provider execution package review coverage grouped queue row status tooltip.
Slice 451 adds provider execution package review coverage grouped queue row filename tooltip.
Slice 452 adds provider execution package review coverage grouped queue row chips tooltip.
Slice 453 adds provider execution package review coverage grouped queue row focus digest tooltip.
Slice 454 adds automatic TXT/CSV/XLSX/DOCX/text-PDF file text extraction into task file analysis evidence and resets the roadmap toward core MVP gap closure.
Slice 455 adds the Browser Assistant release gate script and CI workflow for typecheck, lint, tests, build, and native-host self-test.
Slice 456 connects approved WIKI metadata to assistant retrieval as `central_knowledge` evidence.
Slice 457 separates Knowledge admin authorization into an explicit SaaS guard while preserving the MVP global-admin mapping.
Slice 458 extends assistant retrieval to project-wide file analysis evidence so uploaded 기준/법규-like project documents can be ranked beyond the current task attachment list.
Slice 459 lets extension packages use a production SaaS origin through `ARCHITECT_SAAS_ORIGIN` while preserving localhost fallback for development.
Slice 460 adds a local regulation seed/import contract, dry-run validation, fixed evaluation questions, and first assistant retrieval connection for `regulation` evidence.
Slice 461 adds Postgres FTS + lexical rerank for approved WIKI and project document retrieval, with the 460 regulation fixture reused as a hybrid quality baseline.
Slice 462 adds OCR provider contract, user-reviewed OCR/selected-region evidence storage, optional Tesseract CLI gate, and `/daily` OCR/region controls.

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
| 127 | [127-knowledge-approval-decision-note-context.md](127-knowledge-approval-decision-note-context.md) | `implemented` | Knowledge approval decision note context chips | `architect-saas`, `architect-browser-assistant` |
| 128 | [128-knowledge-copy-approval-decision-note.md](128-knowledge-copy-approval-decision-note.md) | `implemented` | Knowledge copy approval decision note | `architect-saas`, `architect-browser-assistant` |
| 129 | [129-knowledge-decision-note-blocker-details.md](129-knowledge-decision-note-blocker-details.md) | `implemented` | Knowledge decision note blocker details | `architect-saas`, `architect-browser-assistant` |
| 130 | [130-knowledge-decision-note-ready-summary.md](130-knowledge-decision-note-ready-summary.md) | `implemented` | Knowledge decision note ready summary | `architect-saas`, `architect-browser-assistant` |
| 131 | [131-knowledge-rejection-reason-presets.md](131-knowledge-rejection-reason-presets.md) | `implemented` | Knowledge rejection reason presets | `architect-saas`, `architect-browser-assistant` |
| 132 | [132-knowledge-apply-rejection-preset.md](132-knowledge-apply-rejection-preset.md) | `implemented` | Knowledge apply rejection preset | `architect-saas`, `architect-browser-assistant` |
| 133 | [133-knowledge-rejection-reason-draft-status.md](133-knowledge-rejection-reason-draft-status.md) | `implemented` | Knowledge rejection reason draft status | `architect-saas`, `architect-browser-assistant` |
| 134 | [134-knowledge-copy-rejection-reason.md](134-knowledge-copy-rejection-reason.md) | `implemented` | Knowledge copy rejection reason | `architect-saas`, `architect-browser-assistant` |
| 135 | [135-knowledge-approval-submit-blocker-count.md](135-knowledge-approval-submit-blocker-count.md) | `implemented` | Knowledge approval submit blocker count | `architect-saas`, `architect-browser-assistant` |
| 136 | [136-knowledge-approval-submit-caution-guidance.md](136-knowledge-approval-submit-caution-guidance.md) | `implemented` | Knowledge approval submit caution guidance | `architect-saas`, `architect-browser-assistant` |
| 137 | [137-knowledge-copy-approval-blockers.md](137-knowledge-copy-approval-blockers.md) | `implemented` | Knowledge copy approval blockers | `architect-saas`, `architect-browser-assistant` |
| 138 | [138-knowledge-approval-button-warning-context.md](138-knowledge-approval-button-warning-context.md) | `implemented` | Knowledge approval button warning context | `architect-saas`, `architect-browser-assistant` |
| 139 | [139-knowledge-approval-package-summary.md](139-knowledge-approval-package-summary.md) | `implemented` | Knowledge approval package summary | `architect-saas`, `architect-browser-assistant` |
| 140 | [140-knowledge-copy-approval-package.md](140-knowledge-copy-approval-package.md) | `implemented` | Knowledge copy approval package | `architect-saas`, `architect-browser-assistant` |
| 141 | [141-knowledge-approval-package-draft-section.md](141-knowledge-approval-package-draft-section.md) | `implemented` | Knowledge approval package draft section | `architect-saas`, `architect-browser-assistant` |
| 142 | [142-knowledge-approval-package-evidence-section.md](142-knowledge-approval-package-evidence-section.md) | `implemented` | Knowledge approval package evidence section | `architect-saas`, `architect-browser-assistant` |
| 143 | [143-knowledge-approval-package-quality-summary.md](143-knowledge-approval-package-quality-summary.md) | `implemented` | Knowledge approval package quality summary | `architect-saas`, `architect-browser-assistant` |
| 144 | [144-knowledge-package-quality-detail-checks.md](144-knowledge-package-quality-detail-checks.md) | `implemented` | Knowledge package quality detail checks | `architect-saas`, `architect-browser-assistant` |
| 145 | [145-knowledge-copy-package-quality-report.md](145-knowledge-copy-package-quality-report.md) | `implemented` | Knowledge copy package quality report | `architect-saas`, `architect-browser-assistant` |
| 146 | [146-knowledge-package-quality-missing-guidance.md](146-knowledge-package-quality-missing-guidance.md) | `implemented` | Knowledge package quality missing guidance | `architect-saas`, `architect-browser-assistant` |
| 147 | [147-knowledge-final-review-closeout-summary.md](147-knowledge-final-review-closeout-summary.md) | `implemented` | Knowledge final review closeout summary | `architect-saas`, `architect-browser-assistant` |
| 148 | [148-knowledge-final-review-next-action.md](148-knowledge-final-review-next-action.md) | `implemented` | Knowledge final review next action | `architect-saas`, `architect-browser-assistant` |
| 149 | [149-knowledge-copy-final-review-closeout.md](149-knowledge-copy-final-review-closeout.md) | `implemented` | Knowledge copy final review closeout | `architect-saas`, `architect-browser-assistant` |
| 150 | [150-knowledge-closeout-readiness-handoff.md](150-knowledge-closeout-readiness-handoff.md) | `implemented` | Knowledge closeout readiness handoff | `architect-saas`, `architect-browser-assistant` |
| 151 | [151-knowledge-approved-items-api-readback.md](151-knowledge-approved-items-api-readback.md) | `implemented` | Approved WIKI items API readback | `architect-saas`, `architect-browser-assistant` |
| 152 | [152-knowledge-approved-items-load-state.md](152-knowledge-approved-items-load-state.md) | `implemented` | Approved WIKI load state | `architect-saas`, `architect-browser-assistant` |
| 153 | [153-knowledge-approved-item-counts.md](153-knowledge-approved-item-counts.md) | `implemented` | Approved WIKI item counts | `architect-saas`, `architect-browser-assistant` |
| 154 | [154-knowledge-approved-scope-counts.md](154-knowledge-approved-scope-counts.md) | `implemented` | Approved WIKI scope counts | `architect-saas`, `architect-browser-assistant` |
| 155 | [155-knowledge-approved-source-coverage.md](155-knowledge-approved-source-coverage.md) | `implemented` | Approved WIKI source coverage | `architect-saas`, `architect-browser-assistant` |
| 156 | [156-knowledge-approved-tag-index.md](156-knowledge-approved-tag-index.md) | `implemented` | Approved WIKI tag index | `architect-saas`, `architect-browser-assistant` |
| 157 | [157-knowledge-approved-search.md](157-knowledge-approved-search.md) | `implemented` | Approved WIKI search | `architect-saas`, `architect-browser-assistant` |
| 158 | [158-knowledge-approved-scope-filter.md](158-knowledge-approved-scope-filter.md) | `implemented` | Approved WIKI scope filter | `architect-saas`, `architect-browser-assistant` |
| 159 | [159-knowledge-approved-tag-filter.md](159-knowledge-approved-tag-filter.md) | `implemented` | Approved WIKI tag filter | `architect-saas`, `architect-browser-assistant` |
| 160 | [160-knowledge-approved-source-filter.md](160-knowledge-approved-source-filter.md) | `implemented` | Approved WIKI source filter | `architect-saas`, `architect-browser-assistant` |
| 161 | [161-knowledge-approved-sort-controls.md](161-knowledge-approved-sort-controls.md) | `implemented` | Approved WIKI sort controls | `architect-saas`, `architect-browser-assistant` |
| 162 | [162-knowledge-approved-active-filter-chips.md](162-knowledge-approved-active-filter-chips.md) | `implemented` | Approved WIKI active filter chips | `architect-saas`, `architect-browser-assistant` |
| 163 | [163-knowledge-approved-clear-filters.md](163-knowledge-approved-clear-filters.md) | `implemented` | Approved WIKI clear filters | `architect-saas`, `architect-browser-assistant` |
| 164 | [164-knowledge-approved-refresh-action.md](164-knowledge-approved-refresh-action.md) | `implemented` | Approved WIKI refresh action | `architect-saas`, `architect-browser-assistant` |
| 165 | [165-knowledge-approved-visible-list.md](165-knowledge-approved-visible-list.md) | `implemented` | Approved WIKI visible list | `architect-saas`, `architect-browser-assistant` |
| 166 | [166-knowledge-approved-selection-state.md](166-knowledge-approved-selection-state.md) | `implemented` | Approved WIKI selection state | `architect-saas`, `architect-browser-assistant` |
| 167 | [167-knowledge-approved-row-metadata.md](167-knowledge-approved-row-metadata.md) | `implemented` | Approved WIKI row metadata | `architect-saas`, `architect-browser-assistant` |
| 168 | [168-knowledge-approved-empty-state.md](168-knowledge-approved-empty-state.md) | `implemented` | Approved WIKI empty state | `architect-saas`, `architect-browser-assistant` |
| 169 | [169-knowledge-approved-detail-panel.md](169-knowledge-approved-detail-panel.md) | `implemented` | Approved WIKI detail panel | `architect-saas`, `architect-browser-assistant` |
| 170 | [170-knowledge-approved-tag-chips.md](170-knowledge-approved-tag-chips.md) | `implemented` | Approved WIKI tag chips | `architect-saas`, `architect-browser-assistant` |
| 171 | [171-knowledge-approved-quality-checks.md](171-knowledge-approved-quality-checks.md) | `implemented` | Approved WIKI quality checks | `architect-saas`, `architect-browser-assistant` |
| 172 | [172-knowledge-approved-quality-summary.md](172-knowledge-approved-quality-summary.md) | `implemented` | Approved WIKI quality summary | `architect-saas`, `architect-browser-assistant` |
| 173 | [173-knowledge-approved-markdown-preview.md](173-knowledge-approved-markdown-preview.md) | `implemented` | Approved WIKI Markdown preview | `architect-saas`, `architect-browser-assistant` |
| 174 | [174-knowledge-approved-preview-density.md](174-knowledge-approved-preview-density.md) | `implemented` | Approved WIKI preview density | `architect-saas`, `architect-browser-assistant` |
| 175 | [175-knowledge-copy-approved-markdown.md](175-knowledge-copy-approved-markdown.md) | `implemented` | Copy approved WIKI Markdown | `architect-saas`, `architect-browser-assistant` |
| 176 | [176-knowledge-copy-approved-item-handoff.md](176-knowledge-copy-approved-item-handoff.md) | `implemented` | Copy approved item handoff | `architect-saas`, `architect-browser-assistant` |
| 177 | [177-knowledge-copy-approved-search-handoff.md](177-knowledge-copy-approved-search-handoff.md) | `implemented` | Copy approved search handoff | `architect-saas`, `architect-browser-assistant` |
| 178 | [178-knowledge-approved-source-package.md](178-knowledge-approved-source-package.md) | `implemented` | Approved WIKI source package | `architect-saas`, `architect-browser-assistant` |
| 179 | [179-knowledge-copy-approved-source-package.md](179-knowledge-copy-approved-source-package.md) | `implemented` | Copy approved source package | `architect-saas`, `architect-browser-assistant` |
| 180 | [180-knowledge-copy-approved-index-package.md](180-knowledge-copy-approved-index-package.md) | `implemented` | Copy approved index package | `architect-saas`, `architect-browser-assistant` |
| 181 | [181-knowledge-approved-source-reference-list.md](181-knowledge-approved-source-reference-list.md) | `implemented` | Approved WIKI source reference list | `architect-saas`, `architect-browser-assistant` |
| 182 | [182-knowledge-approved-unsourced-warning.md](182-knowledge-approved-unsourced-warning.md) | `implemented` | Approved WIKI unsourced warning | `architect-saas`, `architect-browser-assistant` |
| 183 | [183-knowledge-approved-lineage-readback.md](183-knowledge-approved-lineage-readback.md) | `implemented` | Approved WIKI lineage readback | `architect-saas`, `architect-browser-assistant` |
| 184 | [184-knowledge-approved-reuse-handoff.md](184-knowledge-approved-reuse-handoff.md) | `implemented` | Approved WIKI reuse handoff | `architect-saas`, `architect-browser-assistant` |
| 185 | [185-knowledge-approved-search-result-index.md](185-knowledge-approved-search-result-index.md) | `implemented` | Approved WIKI search result index | `architect-saas`, `architect-browser-assistant` |
| 186 | [186-knowledge-approved-retrieval-tags.md](186-knowledge-approved-retrieval-tags.md) | `implemented` | Approved WIKI retrieval tags | `architect-saas`, `architect-browser-assistant` |
| 187 | [187-knowledge-approved-source-priority-readback.md](187-knowledge-approved-source-priority-readback.md) | `implemented` | Approved WIKI source priority readback | `architect-saas`, `architect-browser-assistant` |
| 188 | [188-knowledge-approved-source-url-readback.md](188-knowledge-approved-source-url-readback.md) | `implemented` | Approved WIKI source URL readback | `architect-saas`, `architect-browser-assistant` |
| 189 | [189-knowledge-approved-body-length-check.md](189-knowledge-approved-body-length-check.md) | `implemented` | Approved WIKI body length check | `architect-saas`, `architect-browser-assistant` |
| 190 | [190-knowledge-approved-metadata-quality-check.md](190-knowledge-approved-metadata-quality-check.md) | `implemented` | Approved WIKI metadata quality check | `architect-saas`, `architect-browser-assistant` |
| 191 | [191-knowledge-approved-readback-user-guide.md](191-knowledge-approved-readback-user-guide.md) | `implemented` | Approved WIKI user guide | `architect-saas`, `architect-browser-assistant` |
| 192 | [192-knowledge-approved-saas-worklog.md](192-knowledge-approved-saas-worklog.md) | `implemented` | Approved WIKI SaaS worklog | `architect-saas`, `architect-browser-assistant` |
| 193 | [193-knowledge-approved-browser-worklog.md](193-knowledge-approved-browser-worklog.md) | `implemented` | Approved WIKI planning worklog | `architect-saas`, `architect-browser-assistant` |
| 194 | [194-knowledge-approved-api-validation.md](194-knowledge-approved-api-validation.md) | `implemented` | Approved WIKI API validation | `architect-saas`, `architect-browser-assistant` |
| 195 | [195-knowledge-approved-typecheck.md](195-knowledge-approved-typecheck.md) | `implemented` | Approved WIKI typecheck | `architect-saas`, `architect-browser-assistant` |
| 196 | [196-knowledge-approved-lint.md](196-knowledge-approved-lint.md) | `implemented` | Approved WIKI lint | `architect-saas`, `architect-browser-assistant` |
| 197 | [197-knowledge-approved-browser-ui-validation.md](197-knowledge-approved-browser-ui-validation.md) | `implemented` | Approved WIKI browser UI validation | `architect-saas`, `architect-browser-assistant` |
| 198 | [198-knowledge-approved-commit-boundary.md](198-knowledge-approved-commit-boundary.md) | `implemented` | Approved WIKI commit boundary | `architect-saas`, `architect-browser-assistant` |
| 199 | [199-knowledge-approved-next-candidate.md](199-knowledge-approved-next-candidate.md) | `implemented` | Approved WIKI next candidate | `architect-saas`, `architect-browser-assistant` |
| 200 | [200-knowledge-approved-closeout-report.md](200-knowledge-approved-closeout-report.md) | `implemented` | Approved WIKI closeout report | `architect-saas`, `architect-browser-assistant` |
| 201 | [201-knowledge-export-scope-state.md](201-knowledge-export-scope-state.md) | `implemented` | Approved WIKI export scope state | `architect-saas`, `architect-browser-assistant` |
| 202 | [202-knowledge-export-format-state.md](202-knowledge-export-format-state.md) | `implemented` | Approved WIKI export format state | `architect-saas`, `architect-browser-assistant` |
| 203 | [203-knowledge-sync-target-profile.md](203-knowledge-sync-target-profile.md) | `implemented` | Approved WIKI sync target profile | `architect-saas`, `architect-browser-assistant` |
| 204 | [204-knowledge-export-item-selection.md](204-knowledge-export-item-selection.md) | `implemented` | Approved WIKI export item selection | `architect-saas`, `architect-browser-assistant` |
| 205 | [205-knowledge-export-stats.md](205-knowledge-export-stats.md) | `implemented` | Approved WIKI export stats | `architect-saas`, `architect-browser-assistant` |
| 206 | [206-knowledge-export-file-preview.md](206-knowledge-export-file-preview.md) | `implemented` | Approved WIKI export file preview | `architect-saas`, `architect-browser-assistant` |
| 207 | [207-knowledge-export-readiness-checks.md](207-knowledge-export-readiness-checks.md) | `implemented` | Approved WIKI export readiness checks | `architect-saas`, `architect-browser-assistant` |
| 208 | [208-knowledge-export-readiness-summary.md](208-knowledge-export-readiness-summary.md) | `implemented` | Approved WIKI export readiness summary | `architect-saas`, `architect-browser-assistant` |
| 209 | [209-knowledge-copy-sync-manifest.md](209-knowledge-copy-sync-manifest.md) | `implemented` | Copy approved WIKI sync manifest | `architect-saas`, `architect-browser-assistant` |
| 210 | [210-knowledge-copy-export-checklist.md](210-knowledge-copy-export-checklist.md) | `implemented` | Copy approved WIKI export checklist | `architect-saas`, `architect-browser-assistant` |
| 211 | [211-knowledge-download-json-package.md](211-knowledge-download-json-package.md) | `implemented` | Download approved WIKI JSON package | `architect-saas`, `architect-browser-assistant` |
| 212 | [212-knowledge-download-markdown-package.md](212-knowledge-download-markdown-package.md) | `implemented` | Download approved WIKI Markdown package | `architect-saas`, `architect-browser-assistant` |
| 213 | [213-knowledge-export-filter-scope.md](213-knowledge-export-filter-scope.md) | `implemented` | Approved WIKI export filter scope | `architect-saas`, `architect-browser-assistant` |
| 214 | [214-knowledge-export-generated-at.md](214-knowledge-export-generated-at.md) | `implemented` | Approved WIKI export generated timestamp | `architect-saas`, `architect-browser-assistant` |
| 215 | [215-knowledge-export-stats-payload.md](215-knowledge-export-stats-payload.md) | `implemented` | Approved WIKI export stats payload | `architect-saas`, `architect-browser-assistant` |
| 216 | [216-knowledge-export-source-lineage.md](216-knowledge-export-source-lineage.md) | `implemented` | Approved WIKI export source lineage | `architect-saas`, `architect-browser-assistant` |
| 217 | [217-knowledge-export-tag-scope-fields.md](217-knowledge-export-tag-scope-fields.md) | `implemented` | Approved WIKI export tag and scope fields | `architect-saas`, `architect-browser-assistant` |
| 218 | [218-knowledge-export-markdown-sections.md](218-knowledge-export-markdown-sections.md) | `implemented` | Approved WIKI Markdown export sections | `architect-saas`, `architect-browser-assistant` |
| 219 | [219-knowledge-export-markdown-sources.md](219-knowledge-export-markdown-sources.md) | `implemented` | Approved WIKI Markdown source rows | `architect-saas`, `architect-browser-assistant` |
| 220 | [220-knowledge-sync-target-guidance.md](220-knowledge-sync-target-guidance.md) | `implemented` | Approved WIKI sync target guidance | `architect-saas`, `architect-browser-assistant` |
| 221 | [221-knowledge-export-selected-scope.md](221-knowledge-export-selected-scope.md) | `implemented` | Approved WIKI selected export scope | `architect-saas`, `architect-browser-assistant` |
| 222 | [222-knowledge-export-visible-scope.md](222-knowledge-export-visible-scope.md) | `implemented` | Approved WIKI visible export scope | `architect-saas`, `architect-browser-assistant` |
| 223 | [223-knowledge-export-disabled-empty.md](223-knowledge-export-disabled-empty.md) | `implemented` | Approved WIKI empty export disabled state | `architect-saas`, `architect-browser-assistant` |
| 224 | [224-knowledge-export-unsourced-warning.md](224-knowledge-export-unsourced-warning.md) | `implemented` | Approved WIKI export unsourced warning | `architect-saas`, `architect-browser-assistant` |
| 225 | [225-knowledge-export-tag-coverage.md](225-knowledge-export-tag-coverage.md) | `implemented` | Approved WIKI export tag coverage | `architect-saas`, `architect-browser-assistant` |
| 226 | [226-knowledge-export-body-content-check.md](226-knowledge-export-body-content-check.md) | `implemented` | Approved WIKI export body content check | `architect-saas`, `architect-browser-assistant` |
| 227 | [227-knowledge-sync-portable-archive.md](227-knowledge-sync-portable-archive.md) | `implemented` | Approved WIKI portable archive target | `architect-saas`, `architect-browser-assistant` |
| 228 | [228-knowledge-sync-obsidian-target.md](228-knowledge-sync-obsidian-target.md) | `implemented` | Approved WIKI Obsidian target | `architect-saas`, `architect-browser-assistant` |
| 229 | [229-knowledge-sync-notion-target.md](229-knowledge-sync-notion-target.md) | `implemented` | Approved WIKI Notion target | `architect-saas`, `architect-browser-assistant` |
| 230 | [230-knowledge-sync-assistant-retrieval-target.md](230-knowledge-sync-assistant-retrieval-target.md) | `implemented` | Approved WIKI assistant retrieval target | `architect-saas`, `architect-browser-assistant` |
| 231 | [231-knowledge-export-toolbar-layout.md](231-knowledge-export-toolbar-layout.md) | `implemented` | Approved WIKI export toolbar layout | `architect-saas`, `architect-browser-assistant` |
| 232 | [232-knowledge-export-mobile-layout.md](232-knowledge-export-mobile-layout.md) | `implemented` | Approved WIKI export mobile layout | `architect-saas`, `architect-browser-assistant` |
| 233 | [233-knowledge-export-download-status.md](233-knowledge-export-download-status.md) | `implemented` | Approved WIKI export download status | `architect-saas`, `architect-browser-assistant` |
| 234 | [234-knowledge-export-clipboard-status.md](234-knowledge-export-clipboard-status.md) | `implemented` | Approved WIKI export clipboard status | `architect-saas`, `architect-browser-assistant` |
| 235 | [235-knowledge-sync-manifest-item-list.md](235-knowledge-sync-manifest-item-list.md) | `implemented` | Approved WIKI sync manifest item list | `architect-saas`, `architect-browser-assistant` |
| 236 | [236-knowledge-export-checklist-item-list.md](236-knowledge-export-checklist-item-list.md) | `implemented` | Approved WIKI export checklist item list | `architect-saas`, `architect-browser-assistant` |
| 237 | [237-knowledge-export-stat-chips.md](237-knowledge-export-stat-chips.md) | `implemented` | Approved WIKI export stat chips | `architect-saas`, `architect-browser-assistant` |
| 238 | [238-knowledge-export-selected-filename.md](238-knowledge-export-selected-filename.md) | `implemented` | Approved WIKI selected export filename | `architect-saas`, `architect-browser-assistant` |
| 239 | [239-knowledge-export-visible-filename.md](239-knowledge-export-visible-filename.md) | `implemented` | Approved WIKI visible export filename | `architect-saas`, `architect-browser-assistant` |
| 240 | [240-knowledge-export-json-mime.md](240-knowledge-export-json-mime.md) | `implemented` | Approved WIKI JSON MIME download | `architect-saas`, `architect-browser-assistant` |
| 241 | [241-knowledge-export-markdown-mime.md](241-knowledge-export-markdown-mime.md) | `implemented` | Approved WIKI Markdown MIME download | `architect-saas`, `architect-browser-assistant` |
| 242 | [242-knowledge-export-url-revoke.md](242-knowledge-export-url-revoke.md) | `implemented` | Approved WIKI export URL cleanup | `architect-saas`, `architect-browser-assistant` |
| 243 | [243-knowledge-export-no-server-write.md](243-knowledge-export-no-server-write.md) | `implemented` | Approved WIKI export no server write | `architect-saas`, `architect-browser-assistant` |
| 244 | [244-knowledge-export-preserve-readback-api.md](244-knowledge-export-preserve-readback-api.md) | `implemented` | Approved WIKI export preserves readback API | `architect-saas`, `architect-browser-assistant` |
| 245 | [245-knowledge-export-user-guide.md](245-knowledge-export-user-guide.md) | `implemented` | Approved WIKI export user guide | `architect-saas`, `architect-browser-assistant` |
| 246 | [246-knowledge-export-saas-worklog.md](246-knowledge-export-saas-worklog.md) | `implemented` | Approved WIKI export SaaS worklog | `architect-saas`, `architect-browser-assistant` |
| 247 | [247-knowledge-export-browser-worklog.md](247-knowledge-export-browser-worklog.md) | `implemented` | Approved WIKI export planning worklog | `architect-saas`, `architect-browser-assistant` |
| 248 | [248-knowledge-export-api-validation.md](248-knowledge-export-api-validation.md) | `implemented` | Approved WIKI export API validation | `architect-saas`, `architect-browser-assistant` |
| 249 | [249-knowledge-export-typecheck.md](249-knowledge-export-typecheck.md) | `implemented` | Approved WIKI export typecheck | `architect-saas`, `architect-browser-assistant` |
| 250 | [250-knowledge-export-lint.md](250-knowledge-export-lint.md) | `implemented` | Approved WIKI export lint | `architect-saas`, `architect-browser-assistant` |
| 251 | [251-knowledge-export-browser-panel-validation.md](251-knowledge-export-browser-panel-validation.md) | `implemented` | Approved WIKI export panel browser validation | `architect-saas`, `architect-browser-assistant` |
| 252 | [252-knowledge-export-browser-target-validation.md](252-knowledge-export-browser-target-validation.md) | `implemented` | Approved WIKI sync target browser validation | `architect-saas`, `architect-browser-assistant` |
| 253 | [253-knowledge-export-browser-format-validation.md](253-knowledge-export-browser-format-validation.md) | `implemented` | Approved WIKI format browser validation | `architect-saas`, `architect-browser-assistant` |
| 254 | [254-knowledge-export-browser-scope-validation.md](254-knowledge-export-browser-scope-validation.md) | `implemented` | Approved WIKI scope browser validation | `architect-saas`, `architect-browser-assistant` |
| 255 | [255-knowledge-export-browser-manifest-validation.md](255-knowledge-export-browser-manifest-validation.md) | `implemented` | Approved WIKI manifest browser validation | `architect-saas`, `architect-browser-assistant` |
| 256 | [256-knowledge-export-browser-checklist-validation.md](256-knowledge-export-browser-checklist-validation.md) | `implemented` | Approved WIKI checklist browser validation | `architect-saas`, `architect-browser-assistant` |
| 257 | [257-knowledge-export-browser-download-validation.md](257-knowledge-export-browser-download-validation.md) | `implemented` | Approved WIKI download browser validation | `architect-saas`, `architect-browser-assistant` |
| 258 | [258-knowledge-export-decision-record.md](258-knowledge-export-decision-record.md) | `implemented` | Approved WIKI export decision record | `architect-saas`, `architect-browser-assistant` |
| 259 | [259-knowledge-export-readme-goal-update.md](259-knowledge-export-readme-goal-update.md) | `implemented` | Approved WIKI README goal update | `architect-saas`, `architect-browser-assistant` |
| 260 | [260-knowledge-export-next-candidate.md](260-knowledge-export-next-candidate.md) | `implemented` | Approved WIKI next candidate | `architect-saas`, `architect-browser-assistant` |
| 261 | [261-knowledge-export-package-type.md](261-knowledge-export-package-type.md) | `implemented` | Approved WIKI package type | `architect-saas`, `architect-browser-assistant` |
| 262 | [262-knowledge-export-item-id-map.md](262-knowledge-export-item-id-map.md) | `implemented` | Approved WIKI item id map | `architect-saas`, `architect-browser-assistant` |
| 263 | [263-knowledge-export-approval-metadata.md](263-knowledge-export-approval-metadata.md) | `implemented` | Approved WIKI approval metadata | `architect-saas`, `architect-browser-assistant` |
| 264 | [264-knowledge-export-summary-body-pair.md](264-knowledge-export-summary-body-pair.md) | `implemented` | Approved WIKI summary body pair | `architect-saas`, `architect-browser-assistant` |
| 265 | [265-knowledge-export-source-reference-payload.md](265-knowledge-export-source-reference-payload.md) | `implemented` | Approved WIKI source reference payload | `architect-saas`, `architect-browser-assistant` |
| 266 | [266-knowledge-export-filter-reproduction.md](266-knowledge-export-filter-reproduction.md) | `implemented` | Approved WIKI filter reproduction | `architect-saas`, `architect-browser-assistant` |
| 267 | [267-knowledge-export-target-labels.md](267-knowledge-export-target-labels.md) | `implemented` | Approved WIKI target labels | `architect-saas`, `architect-browser-assistant` |
| 268 | [268-knowledge-export-format-labels.md](268-knowledge-export-format-labels.md) | `implemented` | Approved WIKI format labels | `architect-saas`, `architect-browser-assistant` |
| 269 | [269-knowledge-export-scope-labels.md](269-knowledge-export-scope-labels.md) | `implemented` | Approved WIKI scope labels | `architect-saas`, `architect-browser-assistant` |
| 270 | [270-knowledge-export-retrieval-readiness.md](270-knowledge-export-retrieval-readiness.md) | `implemented` | Approved WIKI retrieval readiness | `architect-saas`, `architect-browser-assistant` |
| 271 | [271-knowledge-export-obsidian-readiness.md](271-knowledge-export-obsidian-readiness.md) | `implemented` | Approved WIKI Obsidian readiness | `architect-saas`, `architect-browser-assistant` |
| 272 | [272-knowledge-export-notion-readiness.md](272-knowledge-export-notion-readiness.md) | `implemented` | Approved WIKI Notion readiness | `architect-saas`, `architect-browser-assistant` |
| 273 | [273-knowledge-export-archive-readiness.md](273-knowledge-export-archive-readiness.md) | `implemented` | Approved WIKI archive readiness | `architect-saas`, `architect-browser-assistant` |
| 274 | [274-knowledge-export-selected-empty-guidance.md](274-knowledge-export-selected-empty-guidance.md) | `implemented` | Approved WIKI selected export empty guidance | `architect-saas`, `architect-browser-assistant` |
| 275 | [275-knowledge-export-visible-empty-guidance.md](275-knowledge-export-visible-empty-guidance.md) | `implemented` | Approved WIKI visible export empty guidance | `architect-saas`, `architect-browser-assistant` |
| 276 | [276-knowledge-export-readiness-no-mutation.md](276-knowledge-export-readiness-no-mutation.md) | `implemented` | Approved WIKI export readiness no mutation | `architect-saas`, `architect-browser-assistant` |
| 277 | [277-knowledge-export-status-no-api-error.md](277-knowledge-export-status-no-api-error.md) | `implemented` | Approved WIKI export status no API error | `architect-saas`, `architect-browser-assistant` |
| 278 | [278-knowledge-export-download-filename-target.md](278-knowledge-export-download-filename-target.md) | `implemented` | Approved WIKI filename target segment | `architect-saas`, `architect-browser-assistant` |
| 279 | [279-knowledge-export-download-filename-scope.md](279-knowledge-export-download-filename-scope.md) | `implemented` | Approved WIKI filename scope segment | `architect-saas`, `architect-browser-assistant` |
| 280 | [280-knowledge-export-download-filename-count.md](280-knowledge-export-download-filename-count.md) | `implemented` | Approved WIKI filename count segment | `architect-saas`, `architect-browser-assistant` |
| 281 | [281-knowledge-export-copy-manifest-ready-count.md](281-knowledge-export-copy-manifest-ready-count.md) | `implemented` | Approved WIKI manifest ready count | `architect-saas`, `architect-browser-assistant` |
| 282 | [282-knowledge-export-copy-checklist-stats.md](282-knowledge-export-copy-checklist-stats.md) | `implemented` | Approved WIKI checklist stats | `architect-saas`, `architect-browser-assistant` |
| 283 | [283-knowledge-export-ui-grouping.md](283-knowledge-export-ui-grouping.md) | `implemented` | Approved WIKI export UI grouping | `architect-saas`, `architect-browser-assistant` |
| 284 | [284-knowledge-export-quality-inheritance.md](284-knowledge-export-quality-inheritance.md) | `implemented` | Approved WIKI export quality inheritance | `architect-saas`, `architect-browser-assistant` |
| 285 | [285-knowledge-export-source-count-chip.md](285-knowledge-export-source-count-chip.md) | `implemented` | Approved WIKI export source count chip | `architect-saas`, `architect-browser-assistant` |
| 286 | [286-knowledge-export-tag-count-chip.md](286-knowledge-export-tag-count-chip.md) | `implemented` | Approved WIKI export tag count chip | `architect-saas`, `architect-browser-assistant` |
| 287 | [287-knowledge-export-body-count-chip.md](287-knowledge-export-body-count-chip.md) | `implemented` | Approved WIKI export body count chip | `architect-saas`, `architect-browser-assistant` |
| 288 | [288-knowledge-export-ready-warning-chip.md](288-knowledge-export-ready-warning-chip.md) | `implemented` | Approved WIKI export ready warning chip | `architect-saas`, `architect-browser-assistant` |
| 289 | [289-knowledge-export-package-reproducibility.md](289-knowledge-export-package-reproducibility.md) | `implemented` | Approved WIKI package reproducibility | `architect-saas`, `architect-browser-assistant` |
| 290 | [290-knowledge-export-future-sync-boundary.md](290-knowledge-export-future-sync-boundary.md) | `implemented` | Approved WIKI future sync boundary | `architect-saas`, `architect-browser-assistant` |
| 291 | [291-knowledge-export-roadmap-summary.md](291-knowledge-export-roadmap-summary.md) | `implemented` | Approved WIKI export roadmap summary | `architect-saas`, `architect-browser-assistant` |
| 292 | [292-knowledge-export-plan-file-coverage.md](292-knowledge-export-plan-file-coverage.md) | `implemented` | Approved WIKI plan file coverage | `architect-saas`, `architect-browser-assistant` |
| 293 | [293-knowledge-export-verification-log.md](293-knowledge-export-verification-log.md) | `implemented` | Approved WIKI export verification log | `architect-saas`, `architect-browser-assistant` |
| 294 | [294-knowledge-export-commit-saas.md](294-knowledge-export-commit-saas.md) | `implemented` | Approved WIKI export SaaS commit | `architect-saas`, `architect-browser-assistant` |
| 295 | [295-knowledge-export-commit-browser.md](295-knowledge-export-commit-browser.md) | `implemented` | Approved WIKI export planning commit | `architect-saas`, `architect-browser-assistant` |
| 296 | [296-knowledge-export-plan-unchanged.md](296-knowledge-export-plan-unchanged.md) | `implemented` | Approved WIKI PLAN unchanged | `architect-saas`, `architect-browser-assistant` |
| 297 | [297-knowledge-export-browser-clean-tree.md](297-knowledge-export-browser-clean-tree.md) | `implemented` | Approved WIKI browser clean tree | `architect-saas`, `architect-browser-assistant` |
| 298 | [298-knowledge-export-saas-clean-tree.md](298-knowledge-export-saas-clean-tree.md) | `implemented` | Approved WIKI SaaS clean tree | `architect-saas`, `architect-browser-assistant` |
| 299 | [299-knowledge-export-goal-closeout.md](299-knowledge-export-goal-closeout.md) | `implemented` | Approved WIKI export goal closeout | `architect-saas`, `architect-browser-assistant` |
| 300 | [300-knowledge-export-completion-report.md](300-knowledge-export-completion-report.md) | `implemented` | Approved WIKI export completion report | `architect-saas`, `architect-browser-assistant` |

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
130. `Implement and verify 127 Knowledge approval decision note context chips.`
131. `Implement and verify 128 Knowledge copy approval decision note.`
132. `Implement and verify 129 Knowledge decision note blocker details.`
133. `Implement and verify 130 Knowledge decision note ready summary.`
134. `Implement and verify 131 Knowledge rejection reason presets.`
135. `Implement and verify 132 Knowledge apply rejection preset.`
136. `Implement and verify 133 Knowledge rejection reason draft status.`
137. `Implement and verify 134 Knowledge copy rejection reason.`
138. `Implement and verify 135 Knowledge approval submit blocker count.`
139. `Implement and verify 136 Knowledge approval submit caution guidance.`
140. `Implement and verify 137 Knowledge copy approval blockers.`
141. `Implement and verify 138 Knowledge approval button warning context.`
142. `Implement and verify 139 Knowledge approval package summary.`
143. `Implement and verify 140 Knowledge copy approval package.`
144. `Implement and verify 141 Knowledge approval package draft section.`
145. `Implement and verify 142 Knowledge approval package evidence section.`
146. `Implement and verify 143 Knowledge approval package quality summary.`
147. `Implement and verify 144 Knowledge package quality detail checks.`
148. `Implement and verify 145 Knowledge copy package quality report.`
149. `Implement and verify 146 Knowledge package quality missing guidance.`
150. `Implement and verify 147 Knowledge final review closeout summary.`
151. `Implement and verify 148 Knowledge final review next action.`
152. `Implement and verify 149 Knowledge copy final review closeout.`
153. `Implement and verify 150 Knowledge closeout readiness handoff.`
154. `Implement and verify 151 Approved WIKI items API readback.`
155. `Implement and verify 152 Approved WIKI load state.`
156. `Implement and verify 153 Approved WIKI item counts.`
157. `Implement and verify 154 Approved WIKI scope counts.`
158. `Implement and verify 155 Approved WIKI source coverage.`
159. `Implement and verify 156 Approved WIKI tag index.`
160. `Implement and verify 157 Approved WIKI search.`
161. `Implement and verify 158 Approved WIKI scope filter.`
162. `Implement and verify 159 Approved WIKI tag filter.`
163. `Implement and verify 160 Approved WIKI source filter.`
164. `Implement and verify 161 Approved WIKI sort controls.`
165. `Implement and verify 162 Approved WIKI active filter chips.`
166. `Implement and verify 163 Approved WIKI clear filters.`
167. `Implement and verify 164 Approved WIKI refresh action.`
168. `Implement and verify 165 Approved WIKI visible list.`
169. `Implement and verify 166 Approved WIKI selection state.`
170. `Implement and verify 167 Approved WIKI row metadata.`
171. `Implement and verify 168 Approved WIKI empty state.`
172. `Implement and verify 169 Approved WIKI detail panel.`
173. `Implement and verify 170 Approved WIKI tag chips.`
174. `Implement and verify 171 Approved WIKI quality checks.`
175. `Implement and verify 172 Approved WIKI quality summary.`
176. `Implement and verify 173 Approved WIKI Markdown preview.`
177. `Implement and verify 174 Approved WIKI preview density.`
178. `Implement and verify 175 Copy approved WIKI Markdown.`
179. `Implement and verify 176 Copy approved item handoff.`
180. `Implement and verify 177 Copy approved search handoff.`
181. `Implement and verify 178 Approved WIKI source package.`
182. `Implement and verify 179 Copy approved source package.`
183. `Implement and verify 180 Copy approved index package.`
184. `Implement and verify 181 Approved WIKI source reference list.`
185. `Implement and verify 182 Approved WIKI unsourced warning.`
186. `Implement and verify 183 Approved WIKI lineage readback.`
187. `Implement and verify 184 Approved WIKI reuse handoff.`
188. `Implement and verify 185 Approved WIKI search result index.`
189. `Implement and verify 186 Approved WIKI retrieval tags.`
190. `Implement and verify 187 Approved WIKI source priority readback.`
191. `Implement and verify 188 Approved WIKI source URL readback.`
192. `Implement and verify 189 Approved WIKI body length check.`
193. `Implement and verify 190 Approved WIKI metadata quality check.`
194. `Implement and verify 191 Approved WIKI user guide.`
195. `Implement and verify 192 Approved WIKI SaaS worklog.`
196. `Implement and verify 193 Approved WIKI planning worklog.`
197. `Implement and verify 194 Approved WIKI API validation.`
198. `Implement and verify 195 Approved WIKI typecheck.`
199. `Implement and verify 196 Approved WIKI lint.`
200. `Implement and verify 197 Approved WIKI browser UI validation.`
201. `Implement and verify 198 Approved WIKI commit boundary.`
202. `Implement and verify 199 Approved WIKI next candidate.`
203. `Implement and verify 200 Approved WIKI closeout report.`
204. `Implement and verify 201 Approved WIKI export scope state.`
205. `Implement and verify 202 Approved WIKI export format state.`
206. `Implement and verify 203 Approved WIKI sync target profile.`
207. `Implement and verify 204 Approved WIKI export item selection.`
208. `Implement and verify 205 Approved WIKI export stats.`
209. `Implement and verify 206 Approved WIKI export file preview.`
210. `Implement and verify 207 Approved WIKI export readiness checks.`
211. `Implement and verify 208 Approved WIKI export readiness summary.`
212. `Implement and verify 209 Copy approved WIKI sync manifest.`
213. `Implement and verify 210 Copy approved WIKI export checklist.`
214. `Implement and verify 211 Download approved WIKI JSON package.`
215. `Implement and verify 212 Download approved WIKI Markdown package.`
216. `Implement and verify 213 Approved WIKI export filter scope.`
217. `Implement and verify 214 Approved WIKI export generated timestamp.`
218. `Implement and verify 215 Approved WIKI export stats payload.`
219. `Implement and verify 216 Approved WIKI export source lineage.`
220. `Implement and verify 217 Approved WIKI export tag and scope fields.`
221. `Implement and verify 218 Approved WIKI Markdown export sections.`
222. `Implement and verify 219 Approved WIKI Markdown source rows.`
223. `Implement and verify 220 Approved WIKI sync target guidance.`
224. `Implement and verify 221 Approved WIKI selected export scope.`
225. `Implement and verify 222 Approved WIKI visible export scope.`
226. `Implement and verify 223 Approved WIKI empty export disabled state.`
227. `Implement and verify 224 Approved WIKI export unsourced warning.`
228. `Implement and verify 225 Approved WIKI export tag coverage.`
229. `Implement and verify 226 Approved WIKI export body content check.`
230. `Implement and verify 227 Approved WIKI portable archive target.`
231. `Implement and verify 228 Approved WIKI Obsidian target.`
232. `Implement and verify 229 Approved WIKI Notion target.`
233. `Implement and verify 230 Approved WIKI assistant retrieval target.`
234. `Implement and verify 231 Approved WIKI export toolbar layout.`
235. `Implement and verify 232 Approved WIKI export mobile layout.`
236. `Implement and verify 233 Approved WIKI export download status.`
237. `Implement and verify 234 Approved WIKI export clipboard status.`
238. `Implement and verify 235 Approved WIKI sync manifest item list.`
239. `Implement and verify 236 Approved WIKI export checklist item list.`
240. `Implement and verify 237 Approved WIKI export stat chips.`
241. `Implement and verify 238 Approved WIKI selected export filename.`
242. `Implement and verify 239 Approved WIKI visible export filename.`
243. `Implement and verify 240 Approved WIKI JSON MIME download.`
244. `Implement and verify 241 Approved WIKI Markdown MIME download.`
245. `Implement and verify 242 Approved WIKI export URL cleanup.`
246. `Implement and verify 243 Approved WIKI export no server write.`
247. `Implement and verify 244 Approved WIKI export preserves readback API.`
248. `Implement and verify 245 Approved WIKI export user guide.`
249. `Implement and verify 246 Approved WIKI export SaaS worklog.`
250. `Implement and verify 247 Approved WIKI export planning worklog.`
251. `Implement and verify 248 Approved WIKI export API validation.`
252. `Implement and verify 249 Approved WIKI export typecheck.`
253. `Implement and verify 250 Approved WIKI export lint.`
254. `Implement and verify 251 Approved WIKI export panel browser validation.`
255. `Implement and verify 252 Approved WIKI sync target browser validation.`
256. `Implement and verify 253 Approved WIKI format browser validation.`
257. `Implement and verify 254 Approved WIKI scope browser validation.`
258. `Implement and verify 255 Approved WIKI manifest browser validation.`
259. `Implement and verify 256 Approved WIKI checklist browser validation.`
260. `Implement and verify 257 Approved WIKI download browser validation.`
261. `Implement and verify 258 Approved WIKI export decision record.`
262. `Implement and verify 259 Approved WIKI README goal update.`
263. `Implement and verify 260 Approved WIKI next candidate.`
264. `Implement and verify 261 Approved WIKI package type.`
265. `Implement and verify 262 Approved WIKI item id map.`
266. `Implement and verify 263 Approved WIKI approval metadata.`
267. `Implement and verify 264 Approved WIKI summary body pair.`
268. `Implement and verify 265 Approved WIKI source reference payload.`
269. `Implement and verify 266 Approved WIKI filter reproduction.`
270. `Implement and verify 267 Approved WIKI target labels.`
271. `Implement and verify 268 Approved WIKI format labels.`
272. `Implement and verify 269 Approved WIKI scope labels.`
273. `Implement and verify 270 Approved WIKI retrieval readiness.`
274. `Implement and verify 271 Approved WIKI Obsidian readiness.`
275. `Implement and verify 272 Approved WIKI Notion readiness.`
276. `Implement and verify 273 Approved WIKI archive readiness.`
277. `Implement and verify 274 Approved WIKI selected export empty guidance.`
278. `Implement and verify 275 Approved WIKI visible export empty guidance.`
279. `Implement and verify 276 Approved WIKI export readiness no mutation.`
280. `Implement and verify 277 Approved WIKI export status no API error.`
281. `Implement and verify 278 Approved WIKI filename target segment.`
282. `Implement and verify 279 Approved WIKI filename scope segment.`
283. `Implement and verify 280 Approved WIKI filename count segment.`
284. `Implement and verify 281 Approved WIKI manifest ready count.`
285. `Implement and verify 282 Approved WIKI checklist stats.`
286. `Implement and verify 283 Approved WIKI export UI grouping.`
287. `Implement and verify 284 Approved WIKI export quality inheritance.`
288. `Implement and verify 285 Approved WIKI export source count chip.`
289. `Implement and verify 286 Approved WIKI export tag count chip.`
290. `Implement and verify 287 Approved WIKI export body count chip.`
291. `Implement and verify 288 Approved WIKI export ready warning chip.`
292. `Implement and verify 289 Approved WIKI package reproducibility.`
293. `Implement and verify 290 Approved WIKI future sync boundary.`
294. `Implement and verify 291 Approved WIKI export roadmap summary.`
295. `Implement and verify 292 Approved WIKI plan file coverage.`
296. `Implement and verify 293 Approved WIKI export verification log.`
297. `Implement and verify 294 Approved WIKI export SaaS commit.`
298. `Implement and verify 295 Approved WIKI export planning commit.`
299. `Implement and verify 296 Approved WIKI PLAN unchanged.`
300. `Implement and verify 297 Approved WIKI browser clean tree.`
301. `Implement and verify 298 Approved WIKI SaaS clean tree.`
302. `Implement and verify 299 Approved WIKI export goal closeout.`
303. `Implement and verify 300 Approved WIKI export completion report.`
304. `Implement and verify 301 Approved WIKI sync history model.`
305. `Implement and verify 302 Approved WIKI sync history load.`
306. `Implement and verify 303 Approved WIKI sync history persistence.`
307. `Implement and verify 304 Approved WIKI sync package filename reuse.`
308. `Implement and verify 305 Approved WIKI sync dry-run warnings.`
309. `Implement and verify 306 Approved WIKI sync confirmation phrase.`
310. `Implement and verify 307 Approved WIKI guarded sync readiness gate.`
311. `Implement and verify 308 Approved WIKI sync dry-run action.`
312. `Implement and verify 309 Approved WIKI blocked sync history record.`
313. `Implement and verify 310 Approved WIKI simulated sync history record.`
314. `Implement and verify 311 Approved WIKI guarded sync status feedback.`
315. `Implement and verify 312 Approved WIKI sync history count chip.`
316. `Implement and verify 313 Approved WIKI last sync status chip.`
317. `Implement and verify 314 Approved WIKI sync history list.`
318. `Implement and verify 315 Approved WIKI sync history package stats.`
319. `Implement and verify 316 Approved WIKI sync history readiness stats.`
320. `Implement and verify 317 Approved WIKI sync history target fields.`
321. `Implement and verify 318 Approved WIKI copy sync history report.`
322. `Implement and verify 319 Approved WIKI clear local sync history.`
323. `Implement and verify 320 Approved WIKI external target simulation note.`
324. `Implement and verify 321 Approved WIKI Obsidian conversion warning.`
325. `Implement and verify 322 Approved WIKI unsourced dry-run linkage.`
326. `Implement and verify 323 Approved WIKI readiness dry-run linkage.`
327. `Implement and verify 324 Approved WIKI sync no-server-write decision.`
328. `Implement and verify 325 Approved WIKI guarded sync user guide.`
329. `Implement and verify 326 Approved WIKI guarded sync SaaS worklog.`
330. `Implement and verify 327 Approved WIKI guarded sync planning worklog.`
331. `Implement and verify 328 Approved WIKI guarded sync API validation.`
332. `Implement and verify 329 Approved WIKI guarded sync typecheck.`
333. `Implement and verify 330 Approved WIKI guarded sync lint.`
334. `Implement and verify 331 Approved WIKI guarded sync panel browser validation.`
335. `Implement and verify 332 Approved WIKI guarded sync dry-run browser validation.`
336. `Implement and verify 333 Approved WIKI guarded sync confirmation browser validation.`
337. `Implement and verify 334 Approved WIKI guarded sync simulation browser validation.`
338. `Implement and verify 335 Approved WIKI sync history report browser validation.`
339. `Implement and verify 336 Approved WIKI guarded sync README update.`
340. `Implement and verify 337 Approved WIKI persisted audit next candidate.`
341. `Implement and verify 338 Approved WIKI guarded sync PLAN unchanged.`
342. `Implement and verify 339 Approved WIKI guarded sync commit boundary.`
343. `Implement and verify 340 Approved WIKI guarded sync SaaS clean tree.`
344. `Implement and verify 341 Approved WIKI guarded sync browser clean tree.`
345. `Implement and verify 342 Approved WIKI guarded sync goal closeout.`
346. `Implement and verify 343 Approved WIKI readback API contract preservation.`
347. `Implement and verify 344 Approved WIKI browser export preservation.`
348. `Implement and verify 345 Approved WIKI sync source lineage preservation.`
349. `Implement and verify 346 Approved WIKI sync readiness preservation.`
350. `Implement and verify 347 Approved WIKI sync target preservation.`
351. `Implement and verify 348 Approved WIKI local-only sync semantics.`
352. `Implement and verify 349 Approved WIKI server audit residual risk.`
353. `Implement and verify 350 Approved WIKI guarded sync completion report.`
354. `Implement and verify 351 Persisted Knowledge export audit.`
355. `Implement and verify 352 Provider target configuration.`
356. `Implement and verify 353 Provider target config UI.`
357. `Implement and verify 354 Provider-ready audit status.`
358. `Implement and verify 355 Provider preview adapter API.`
359. `Implement and verify 356 Provider preview UI.`
360. `Implement and verify 357 Provider preview report.`
361. `Implement and verify 358 Provider config audit history.`
362. `Implement and verify 359 Provider config user guide.`
363. `Implement and verify 360 Provider config validation.`
364. `Implement and verify 361 Provider adapter next candidate.`
365. `Implement and verify 362 Provider credential boundary and portable archive adapter.`
366. `Implement and verify 363 Provider secret metadata and Obsidian adapter.`
367. `Implement and verify 364 Provider credential registry readiness controls.`
368. `Implement and verify 365 Obsidian reconciliation package.`
369. `Implement and verify 366 Obsidian inventory import contract.`
370. `Implement and verify 367 Obsidian live-write preflight.`
371. `Implement and verify 368 Provider execution package export.`
372. `Implement and verify 369 Provider execution package review history.`
373. `Implement and verify 370 Provider execution package review notes.`
374. `Implement and verify 371 Provider execution package review note report.`
375. `Implement and verify 372 Provider execution package review note CSV.`
376. `Implement and verify 373 Provider execution package review summary.`
377. `Implement and verify 374 Provider execution package review coverage.`
378. `Implement and verify 375 Provider execution package review presets.`
379. `Implement and verify 376 Provider execution package stale alerts.`
380. `Implement and verify 377 Provider execution package reviewer rollup.`
381. `Implement and verify 378 Provider execution package review handoff.`
382. `Implement and verify 379 Provider execution package active review filters.`
383. `Implement and verify 380 Provider execution package digest and category quick filters.`
384. `Implement and verify 381 Provider execution package review filter reset chips.`
385. `Implement and verify 382 Provider execution package review handoff preview.`
386. `Implement and verify 383 Provider execution package review coverage group totals.`
387. `Implement and verify 384 Provider execution package review coverage group shortcuts.`
388. `Implement and verify 385 Provider execution package review coverage queue grouping.`
389. `Implement and verify 386 Provider execution package review coverage group row chips.`
390. `Implement and verify 387 Provider execution package review coverage queue density controls.`
391. `Implement and verify 388 Provider execution package review coverage empty-state guidance.`
392. `Implement and verify 389 Provider execution package review coverage group summary copy.`
393. `Implement and verify 390 Provider execution package review coverage group summary preview.`
394. `Implement and verify 391 Provider execution package review coverage group summary filter chips.`
395. `Implement and verify 392 Provider execution package review coverage group summary count chips.`
396. `Implement and verify 393 Provider execution package review coverage group summary Markdown download.`
397. `Implement and verify 394 Provider execution package review coverage group summary download status chip.`
398. `Implement and verify 395 Provider execution package review coverage group summary copy status chip.`
399. `Implement and verify 396 Provider execution package review coverage group summary local action reset.`
400. `Implement and verify 397 Provider execution package review coverage group summary generated-at chip.`
401. `Implement and verify 398 Provider execution package review coverage group summary Markdown size chips.`
402. `Implement and verify 399 Provider execution package review coverage group summary dominant queue chip.`
403. `Implement and verify 400 Provider execution package review coverage group summary empty queue count chip.`
404. `Implement and verify 401 Provider execution package review coverage group summary review-needed chip.`
405. `Implement and verify 402 Provider execution package review coverage group summary stale priority chip.`
406. `Implement and verify 403 Provider execution package review coverage group summary local-only handoff chip.`
407. `Implement and verify 414 Provider execution package review coverage group summary next download filename chip.`
408. `Implement and verify 415 Provider execution package review coverage group summary filename copy action.`
409. `Implement and verify 416 Provider execution package review coverage group summary reset explanation chip.`
410. `Implement and verify 417 Provider execution package review coverage group summary reset confirmation chip.`
411. `Implement and verify 418 Provider execution package review coverage group summary reset confirmation copy handoff.`
412. `Implement and verify 419 Provider execution package review coverage group summary reset confirmation copied-at chip.`
413. `Implement and verify 420 Provider execution package review coverage group summary reset confirmation freshness chip.`
414. `Implement and verify 421 Provider execution package review coverage group summary reset confirmation freshness tooltip.`
415. `Implement and verify 422 Provider execution package review coverage group summary reset confirmation action order.`
416. `Implement and verify 423 Provider execution package review coverage summary local handoff action group label.`
417. `Implement and verify 424 Provider execution package review coverage summary local handoff action group tooltip.`
418. `Implement and verify 425 Provider execution package review coverage summary local handoff copied-state reset note.`
419. `Implement and verify 426 Provider execution package review coverage summary reset explanation tooltip.`
420. `Implement and verify 427 Provider execution package review coverage summary reset confirmation copied-at tooltip.`
421. `Implement and verify 428 Provider execution package review coverage summary reset confirmation copy status tooltip.`
422. `Implement and verify 429 Provider execution package review coverage summary reset confirmation chip tooltip.`
423. `Implement and verify 430 Provider execution package review coverage summary generated-at chip tooltip.`
424. `Implement and verify 431 Provider execution package review coverage summary next filename chip tooltip.`
425. `Implement and verify 432 Provider execution package review coverage summary Markdown size chip tooltip.`
426. `Implement and verify 433 Provider execution package review coverage summary dominant queue chip tooltip.`
427. `Implement and verify 434 Provider execution package review coverage summary empty queue count chip tooltip.`
428. `Implement and verify 435 Provider execution package review coverage summary review-needed chip tooltip.`
429. `Implement and verify 436 Provider execution package review coverage summary stale priority chip tooltip.`
430. `Implement and verify 437 Provider execution package review coverage summary local-only handoff chip tooltip.`
431. `Implement and verify 438 Provider execution package review coverage summary filter chips tooltip.`
432. `Implement and verify 439 Provider execution package review coverage summary count chips tooltip.`
433. `Implement and verify 440 Provider execution package review coverage summary download status chip tooltip.`
434. `Implement and verify 441 Provider execution package review coverage summary copy status chip tooltip.`
435. `Implement and verify 442 Provider execution package review coverage summary filename copy status chip tooltip.`
436. `Implement and verify 443 Provider execution package review coverage queue density controls tooltip.`
437. `Implement and verify 444 Provider execution package review coverage grouped queue container tooltip.`
438. `Implement and verify 445 Provider execution package review coverage grouped queue empty-state tooltip.`
439. `Implement and verify 446 Provider execution package review coverage grouped queue section tooltip.`
440. `Implement and verify 447 Provider execution package review coverage grouped queue count tooltip.`
441. `Implement and verify 448 Provider execution package review coverage grouped queue rows tooltip.`
442. `Implement and verify 449 Provider execution package review coverage grouped queue row tooltip.`
443. `Implement and verify 450 Provider execution package review coverage grouped queue row status tooltip.`
444. `Implement and verify 451 Provider execution package review coverage grouped queue row filename tooltip.`
445. `Implement and verify 452 Provider execution package review coverage grouped queue row chips tooltip.`
446. `Implement and verify 453 Provider execution package review coverage grouped queue row focus digest tooltip.`
447. `Implement and verify 454 File auto text extraction for TXT, CSV, XLSX, DOCX, and text PDF.`
448. `Implement and verify 455 MVP release readiness gate.`
449. `Implement and verify 456 Approved WIKI retrieval as central_knowledge evidence.`
450. `Implement and verify 457 Knowledge admin RBAC guard mapping.`
451. `Implement and verify 458 Project document retrieval ranking.`
452. `Implement and verify 459 Production SaaS origin packaging.`
453. `Implement and verify 460 Regulation knowledge foundation.`
454. `Implement and verify 461 Postgres hybrid retrieval indexing.`
455. `Implement and verify 462 OCR provider and image region analysis.`
456. `Implement and verify 463 Browser selected-region capture handoff.`
457. `Implement and verify 464 Release signing readiness gate.`
458. `Implement and verify 465 PDF raster and crop OCR.`
459. `Implement and verify 466 File analysis chunk vector rerank.`
460. `Implement and verify 467 Legal source governance refresh.`
461. `Implement and verify 468 Crop artifact preview/download UI.`

## Next Goal Candidate

`Add admin governance UI for legal-source refresh, create an embedding provider/backfill plan for file_analysis_chunks, or add crop artifact retention/delete controls.`

Success criteria:

1. TXT/CSV/XLSX/DOCX/text-PDF uploads can be auto-extracted from `/daily` assistant file evidence controls.
2. Extracted text is saved as `project_document` evidence with unverified confidence.
3. Approved WIKI items can appear in assistant retrieval as `central_knowledge` evidence.
4. Knowledge admin routes use an explicit guard mapped to existing SaaS RBAC.
5. Project-wide file analysis can appear in assistant retrieval as `project_document` evidence.
6. Browser Assistant release candidates run `npm run release:check` locally and in CI.
7. Extension packages can target production SaaS origin via `ARCHITECT_SAAS_ORIGIN`.
8. Local regulation seed questions return `regulation` evidence without network calls.
9. Postgres cloud retrieval uses FTS + deterministic lexical rerank for approved WIKI and project document evidence, with a fixed 6-query quality baseline.
10. OCR and selected image-region evidence can be saved as `project_document` file analysis, with provider metadata and low-confidence review status.
11. The extension can capture a user-selected browser region and hand normalized coordinates into SaaS `image_region` file evidence controls.
12. Public release candidates run an automated readiness validator for MV3 manifest scope, SaaS origin alignment, native-host installer/template guardrails, and production signing metadata.
13. Selected browser regions are persisted as crop artifacts and can be sent to OCR; scanned PDF OCR can rasterize a selected page through `pdftoppm` before Tesseract.
14. Project document retrieval has a dedicated Postgres chunk table with FTS now and pgvector-ready rerank when embeddings are populated.
15. Regulation seed packages have an offline governance manifest and refresh validation gate for official source coverage, Knowledge admin promotion blocking, and scheduled review dates.
16. Persisted image-region crop artifacts can be previewed and downloaded from the `/daily` file evidence controls without exposing storage object paths to the browser.
