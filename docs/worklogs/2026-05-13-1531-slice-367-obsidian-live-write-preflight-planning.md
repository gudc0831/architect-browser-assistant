Req: Set the next goal and implement Slice 367 Obsidian live-write feature flag and rollback preflight.
Diff: Added Slice 367 PRD for server-side live-write feature flag metadata, Obsidian execution preflight artifacts, and default audit-only behavior.
Why: Slice 366 can compare remote inventory and planned operations; the next safe step is a preflight evidence boundary before any future vault mutation adapter.
Verify/Time: Planning update prepared before implementation verification on 2026-05-13 15:31 KST.
Verify/Time: Implementation verification completed with API, Browser UI, typecheck, and lint pass on 2026-05-13 15:31 KST; lint still reports 7 pre-existing React hook warnings outside this slice.
