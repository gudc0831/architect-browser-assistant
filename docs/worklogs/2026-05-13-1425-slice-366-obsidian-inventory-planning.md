Req: Set the next goal and implement Slice 366 Obsidian remote inventory import contract.
Diff: Added Slice 366 PRD for sanitized read-only Obsidian inventory manifests and reconciliation comparison.
Why: Slice 365 can only plan creates; inventory metadata is needed to distinguish create, update, delete, and noop before live writes.
Verify/Time: Planning update prepared before implementation verification on 2026-05-13 14:25 KST.
Verify/Time: Implementation verification completed with API, Browser UI, typecheck, and lint pass on 2026-05-13 14:25 KST; lint still reports 7 pre-existing React hook warnings outside this slice.
