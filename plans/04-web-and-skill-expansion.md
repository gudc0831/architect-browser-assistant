# 04. Web And Skill Expansion PRD

작성일: 2026-05-08
상위 문서: `../PLAN.md`
현재 상태: `implemented`

## Goal

사용자가 명시적으로 허용한 웹 검색, 외부 문서 열람, Codex skill 실행 결과를 task assistant의 근거 후보로 저장한다. 승인 전에는 공식 지식이나 법규 판단으로 쓰지 않고, 출처/실행 주체/사용자 승인 여부를 분리해 기록한다.

실행 goal:

```text
Make 04 Web And Skill Expansion implementation-ready.
```

## Implementation Status

현재 구현 상태: `implemented`

| 항목 | 상태 | 관련 commit | worklog | 검증 |
| --- | --- | --- | --- | --- |
| 04 PRD 구체화 | 완료 | documented | `docs/worklogs/2026-05-08-0940-web-skill-expansion-prd.md` | 문서 검토 |
| SaaS evidence contract 정의 | 완료 | documented | 같은 worklog | 기존 `AssistantEvidence` 호환성 확인 |
| 사용자 명시 허용 UX 정의 | 완료 | documented | 같은 worklog | `/daily` assistant popup 범위 기준 |
| browser/SaaS 책임 경계 정의 | 완료 | documented | 같은 worklog | `PLAN.md` cross-repo 규칙 대조 |
| 첫 구현 단위와 검증 기준 확정 | 완료 | documented | 같은 worklog | 성공 기준 작성 |
| SaaS 저장 API 구현 | 완료 | this slice | `docs/worklogs/2026-05-08-1048-external-evidence-retrieval.md` | `npm run typecheck`, `npm run lint`, `npm run build`, in-app browser |
| `/daily` retrieval 연결 | 완료 | this slice | `docs/worklogs/2026-05-08-1048-external-evidence-retrieval.md` | `web_or_skill` evidence 확인 |
| Knowledge admin source 표시 | 완료 | this slice | `docs/worklogs/2026-05-08-1048-external-evidence-retrieval.md` | source URL/tool name 확인 |
| browser assistant 실행 결과 전달 | 완료 | pending | `docs/worklogs/2026-05-08-1024-browser-external-evidence-handoff.md` | `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` |

## 사용자 문제

건축 task 검토 중에는 프로젝트 내부 기록만으로 부족한 경우가 많다. 사용자는 제조사 문서, 발주처 지침, 공개 법규 페이지, 기존 Codex skill 결과를 참고할 수 있지만, 그 근거가 task 기록에 남지 않으면 재검토와 관리자 승인 과정에서 추적하기 어렵다.

특히 외부 페이지나 skill 결과는 신뢰도와 출처가 내부 task 기록보다 약하다. 따라서 이 slice는 외부 근거를 바로 공식 지식으로 쓰지 않고, 사용자가 허용한 경우에만 traceable evidence 후보로 저장하는 안전한 루프를 만든다.

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

## User Stories

1. As a task user, I want to explicitly allow web/skill evidence for a selected task, so that external context is not captured without my intent.
2. As a task user, I want to paste or send a specific external source result into the assistant, so that the assistant can use it as a review lead.
3. As a task user, I want the assistant to show external evidence as less authoritative than official knowledge, so that I do not confuse it with approved standards.
4. As a task user, I want saved web/skill evidence to include source URL and capture time, so that I can re-check it later.
5. As a Knowledge admin, I want external evidence to remain visible in candidate review, so that I can approve, edit, or reject it with source context.
6. As a system admin, I want the browser assistant to send evidence through a SaaS API contract, so that extension code does not depend on DB internals.

## UX Contract

`/daily` assistant popup에 다음 최소 UX를 추가한다.

- `외부 웹/스킬 근거 사용` toggle 또는 checkbox
- `출처 URL` input
- `근거 제목` input
- `근거 요약/인용 내용` textarea
- `근거 종류` selector: `web_page`, `skill_output`, `external_document`, `manufacturer_doc`, `public_standard`
- `웹/스킬 근거 저장` button

사용자 동의 규칙:

- toggle이 꺼져 있으면 저장 button은 disabled 상태다.
- 사용자가 URL 또는 skill output을 직접 입력하거나 browser assistant가 결과를 전달할 때, 저장 전에 사용자 확인 상태를 `user_approved`로 기록한다.
- 외부 근거는 assistant 답변에서 “외부 근거 후보”로 표시하고, 최종 법규/인허가 판단은 공식 기준 확인 후 하도록 안내한다.

## SaaS API Contract

첫 구현 단위는 SaaS에 아래 API를 추가한다.

```text
GET  /api/assistant/external-evidence?taskId=:taskId
POST /api/assistant/external-evidence
```

POST request:

```json
{
  "taskId": "task-id",
  "sourceType": "web_page",
  "title": "Manufacturer installation note",
  "excerpt": "Short evidence text or summarized skill output.",
  "sourceUrl": "https://example.com/source",
  "toolName": "browser-use",
  "permissionState": "user_approved",
  "capturedAt": "2026-05-08T00:40:00.000Z"
}
```

POST response:

```json
{
  "data": {
    "evidence": {
      "id": "external-evidence-id",
      "kind": "web_or_skill",
      "priority": 5,
      "title": "Manufacturer installation note",
      "excerpt": "Short evidence text or summarized skill output.",
      "sourceUrl": "https://example.com/source",
      "recordId": "external-evidence-id",
      "confidenceWeight": 0.28
    }
  }
}
```

## Data Model Decision

첫 구현은 새 테이블 대신 assistant record와 별도 local/cloud repository가 공유할 수 있는 `ExternalEvidenceRecord` repository contract를 둔다. 이후 사용량과 검색 요구가 커지면 dedicated table로 승격한다.

권장 타입:

```ts
type ExternalEvidenceSourceType =
  | "web_page"
  | "skill_output"
  | "external_document"
  | "manufacturer_doc"
  | "public_standard";

type ExternalEvidencePermissionState = "user_approved" | "revoked";

type ExternalEvidenceRecord = {
  id: string;
  projectId: string;
  taskId: string;
  sourceType: ExternalEvidenceSourceType;
  title: string;
  excerpt: string;
  sourceUrl: string | null;
  toolName: string | null;
  permissionState: ExternalEvidencePermissionState;
  capturedAt: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};
```

Assistant evidence 변환:

- `kind`: `web_or_skill`
- `priority`: 5
- `confidenceWeight`: 기본 0.28, `public_standard`라도 admin 승인 전에는 0.4 이하
- `recordId`: external evidence id
- `sourceUrl`: source URL이 있을 때만 포함

## SaaS 책임

- external evidence 저장/조회 API를 제공한다.
- task/project access와 editor 권한을 검사한다.
- assistant retrieval에서 선택 task의 external evidence를 `web_or_skill`로 포함한다.
- assistant record 저장 시 external evidence가 evidence 배열에 그대로 보존되도록 한다.
- Knowledge admin 후보 화면에서 source URL과 tool name을 표시한다.

## Browser Assistant 책임

- 사용자가 허용한 웹/스킬 실행만 SaaS API로 전달한다.
- 브라우저 페이지 내용, skill 출력, 캡처 시간, 사용자의 명시적 허용 상태를 분리해 전달한다.
- 민감정보, 로그인 세션, 비공개 문서 전송은 action-time 확인을 거친다.
- DB schema에 직접 의존하지 않고 SaaS API contract만 사용한다.

## Data Policy

- 사용자 허용 없는 외부 탐색 결과는 저장하지 않는다.
- 페이지/문서 내용은 untrusted source로 취급한다.
- 외부 출처는 `web_or_skill`로 시작하며, Knowledge admin 승인 후에만 공식 지식 후보가 될 수 있다.
- 민감정보, 로그인 세션, 비공개 문서 전송은 별도 사용자 확인이 필요하다.
- 외부 페이지 원문 전체를 장문 저장하지 않는다. excerpt는 검토에 필요한 짧은 요약 중심으로 제한한다.

## 완료된 첫 구현 Goal

```text
Implement and verify 04 external evidence storage and assistant retrieval for /daily.
```

성공 기준:

1. `/daily` assistant 팝업에서 사용자가 외부 웹/스킬 근거 사용을 명시적으로 허용할 수 있다.
2. 허용된 external evidence를 선택 task에 저장할 수 있다.
3. 저장된 external evidence가 `/api/assistant/retrieve` 결과에 `web_or_skill` evidence로 포함된다.
4. assistant 답변과 저장 record가 external evidence 출처를 보존한다.
5. Knowledge admin 후보 검토 화면에서 external evidence 출처 URL 또는 tool name이 확인된다.
6. typecheck/lint/build와 in-app browser `/daily` 수동 검증을 통과한다.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- in-app browser:
  - `/daily` 접속
  - task 선택
  - assistant popup 열기
  - 외부 근거 사용 허용
  - URL/title/excerpt 저장
  - `근거 조회 + 의견 생성`
  - evidence 목록과 답변에 `web_or_skill` 반영 확인
  - `/admin/knowledge`에서 candidate source reference 표시 확인

## Residual Risks

- 현재 browser handoff는 사용자가 승인한 title/URL/excerpt 또는 skill output 요약을 전송하는 첫 경로다. 전체 페이지 자동 수집, 임의 외부 사이트 text extraction, 민감정보 분류는 후속 확장이다.
- 외부 웹 결과의 신뢰도 ranking은 초기에 보수적으로 낮게 둔다.
- 저작권/민감정보 저장 정책은 organization policy가 생기면 더 좁게 조정해야 한다.
