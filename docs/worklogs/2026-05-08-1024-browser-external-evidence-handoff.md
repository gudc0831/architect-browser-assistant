Req: 04 Web And Skill Expansion의 후속 goal로 browser assistant side panel에서 사용자 승인 외부 웹/스킬 근거를 SaaS `/api/assistant/external-evidence` API로 전달한다.
Diff: side panel에 External Evidence 섹션을 추가하고, 현재 활성 탭 title/URL 캡처, source type/title/source URL/tool/excerpt 입력, user-approved 저장 버튼, 저장 후 `web_or_skill` evidence 목록 반영을 구현했다. SaaS client와 contract에 external evidence 저장 타입/API를 추가했고 background service worker에 활성 탭 source 조회 메시지를 추가했다. 외부 탭에서 task detector가 실패해도 마지막 선택 task를 fallback으로 사용할 수 있게 했다.
Why: SaaS 쪽 저장/retrieval 계약이 준비됐으므로 extension이 DB internals에 의존하지 않고 사용자 승인 근거만 안전하게 전달하는 첫 handoff 경로가 필요하다.
Verify/Time: 2026-05-08 10:26 KST. `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` 통과. `npm run test`는 sandbox의 esbuild spawn EPERM 때문에 권한 상승으로 재실행했다.
