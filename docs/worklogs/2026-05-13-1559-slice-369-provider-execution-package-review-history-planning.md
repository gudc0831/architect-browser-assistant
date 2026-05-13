Req: Set the next goal and implement Slice 369 provider execution package review history.
Diff: Added Slice 369 PRD for provider execution package retention metadata and review-history filtering.
Why: Slice 368 exports a single immutable execution package; admins need a browse/filter surface for prior package evidence without regenerating or mutating audit records.
Verify/Time: Planning update prepared before implementation verification on 2026-05-13 15:59 KST.
Verify/Time: Implementation verification completed with API, Browser UI, typecheck, and lint pass on 2026-05-13 15:59 KST; lint still reports 7 pre-existing React hook warnings outside this slice.
