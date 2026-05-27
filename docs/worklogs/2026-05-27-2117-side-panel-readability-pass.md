Req: Make the browser assistant UI easier to read, then commit and push the changes.
Diff: Reworked the side-panel visual hierarchy with runtime/mode/task chips, selected task metadata, clearer section headings, fixed question placeholder copy, primary/secondary button styles, more scannable evidence rows, and separated answer/confidence/summary blocks.
Why: The previous side panel exposed the right functions but made status, evidence, and actions visually similar, which slowed diagnostic use and made the broken placeholder copy stand out.
Verify/Time: `npm test`, `npm run lint`, and `npm run release:check` passed | 2026-05-27 21:17 KST
