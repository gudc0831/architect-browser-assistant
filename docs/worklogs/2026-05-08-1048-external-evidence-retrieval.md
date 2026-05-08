Req: 04 Web And Skill Expansion의 다음 작업 goal로, SaaS `/daily` PC 팝업에서 사용자 승인 외부 웹/스킬 근거를 저장하고 retrieval에 연결한다.
Diff: cross-repo 문서 기준은 `plans/04-web-and-skill-expansion.md`의 첫 구현 goal을 따른다. 실제 구현은 `architect-saas`에 `ExternalEvidenceRecord`, `/api/assistant/external-evidence`, `/daily` 팝업 저장 UX, retrieval `web_or_skill` 병합, Knowledge admin source 표시로 들어갔다.
Why: browser assistant가 이후 웹/스킬 실행 결과를 SaaS API로 넘기기 전에, SaaS 쪽에 안전한 저장/검토/출처 보존 계약이 먼저 필요하다.
Verify/Time: 2026-05-08 10:48 KST. SaaS `npm run typecheck`, `npm run lint`, `npm run build` 통과. in-app browser에서 `/daily` 외부 근거 저장, retrieval `web_or_skill`, assistant 답변 source 보존, `/admin/knowledge` source 표시를 확인했다. Browser extension의 자동 전달 구현은 다음 slice로 남긴다.
