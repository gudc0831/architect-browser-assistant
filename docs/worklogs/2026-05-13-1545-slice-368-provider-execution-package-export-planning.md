Req: Set the next goal and implement Slice 368 provider execution package export.
Diff: Added Slice 368 PRD for immutable provider execution package export/download tied to append-only execution audit records.
Why: Slice 367 records preflight evidence; admins need a stable export package for rollback and governance review without re-running execution.
Verify/Time: Planning update prepared before implementation verification on 2026-05-13 15:45 KST.
Verify/Time: Implementation verification completed with API, Browser UI, typecheck, and lint pass on 2026-05-13 15:45 KST; lint still reports 7 pre-existing React hook warnings outside this slice.
