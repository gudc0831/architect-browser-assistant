# 04. Web And Skill Expansion PRD

작성일: 2026-05-08
상위 문서: `../PLAN.md`
현재 상태: `planning`

## Goal

사용자가 명시적으로 허용한 웹 검색, 외부 문서 열람, Codex skill 실행 결과를 task assistant의 근거 후보로 저장한다. 승인 전에는 공식 지식이나 법규 판단으로 쓰지 않고, 출처/실행 주체/사용자 승인 여부를 분리해 기록한다.

## 사용자 문제

건축 task 검토 중에는 프로젝트 내부 기록만으로 부족한 경우가 많다. 사용자는 제조사 문서, 발주처 지침, 공개 법규 페이지, 기존 Codex skill 결과를 참고할 수 있지만, 그 근거가 task 기록에 남지 않으면 재검토와 관리자 승인 과정에서 추적하기 어렵다.

## Dependency

- 01 Task Assistant Core Loop
- 02 Knowledge Admin WIKI
- 03 File And Image Analysis

## First Scope

1. assistant 팝업에서 웹/스킬 근거 사용 여부를 사용자가 명시적으로 선택한다.
2. 허용된 실행만 `web_or_skill` evidence 후보로 저장한다.
3. evidence에는 title, excerpt, sourceUrl, tool/skill name, capturedAt, userId를 남긴다.
4. 저장된 웹/스킬 evidence는 assistant record와 Knowledge admin 후보 검토 화면에서 출처로 표시된다.
5. 관리자 승인 전에는 central knowledge나 regulation evidence로 승격하지 않는다.

## 비범위

- 자동 웹 크롤링
- 무제한 도메인 탐색
- 로그인 필요한 외부 사이트 자동 조작
- 외부 웹 결과를 법규 DB로 자동 편입
- 사용자 확인 없는 Knowledge WIKI 자동 승인

## SaaS 책임

- 웹/스킬 evidence 저장 API와 metadata schema를 제공한다.
- assistant record와 Knowledge admin 후보에서 출처 추적 정보를 보존한다.
- 관리자 승인 전 evidence kind와 confidence를 낮게 유지한다.

## Browser Assistant 책임

- 사용자가 허용한 웹/스킬 실행을 수행한다.
- 실행 결과를 SaaS API contract에 맞춰 저장한다.
- 브라우저 페이지 내용, skill 출력, 캡처 시간, 사용자의 명시적 허용 상태를 분리해 전달한다.

## Data Policy

- 사용자 허용 없는 외부 탐색 결과는 저장하지 않는다.
- 페이지/문서 내용은 untrusted source로 취급한다.
- 외부 출처는 `web_or_skill`로 시작하며, Knowledge admin 승인 후에만 공식 지식 후보가 될 수 있다.
- 민감정보, 로그인 세션, 비공개 문서 전송은 별도 사용자 확인이 필요하다.

## 다음 구현 후보

실행 목표 후보:

```text
Make 04 Web And Skill Expansion implementation-ready.
```

성공 기준 후보:

1. SaaS API contract와 evidence metadata schema가 확정된다.
2. assistant 팝업에서 웹/스킬 근거 사용 동의 UX가 정의된다.
3. browser assistant와 SaaS 책임 경계가 문서화된다.
4. 첫 구현 단위와 검증 기준이 확정된다.
5. PRD/worklog/commit이 완료된다.
