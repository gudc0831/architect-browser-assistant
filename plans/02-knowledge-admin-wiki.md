# 02. Knowledge Admin WIKI PRD

작성일: 2026-05-07
상위 문서: `../PLAN.md`
이전 slice: `01-task-assistant-core-loop.md`
범위: task assistant 기록에서 생긴 후보를 관리자 검토를 거쳐 중앙 공식 지식/WIKI로 승격하는 첫 관리자 vertical slice
현재 상태: `implemented`

## 문서 운영

이 문서는 `PLAN.md`의 하위 실행 계획 문서다. `PLAN.md`에는 제품 방향과 책임 경계만 유지하고, Knowledge Admin WIKI의 요구사항, 구현 결정, 검증 기준, 구현 상태는 이 문서에 누적한다.

## Implementation Status

현재 구현 상태: `foundation_implemented`

| 항목 | 상태 | 관련 commit | worklog | 검증 |
| --- | --- | --- | --- | --- |
| 02 PRD 작성 | 완료 | `f5efca3` | `docs/worklogs/2026-05-07-1728-slice-roadmap-prd.md` | 문서 생성, roadmap 연결 |
| Knowledge candidate 목록 API | foundation 구현 | SaaS `26f58f0` | SaaS `docs/worklogs/2026-05-07-1735-knowledge-admin-wiki.md` | `/api/admin/knowledge/candidates` 200, build route 포함 |
| Knowledge candidate 상세 API | foundation 구현 | SaaS `26f58f0` | SaaS worklog | `/api/admin/knowledge/candidates/[recordId]`, Browser-use 상세 로딩 |
| Knowledge candidate 승인/수정/반려 API | foundation 구현 | SaaS `26f58f0` | SaaS worklog | Browser-use `WIKI 지식 승인`, 승인 상태 표시 |
| 중앙 공식 지식 최소 저장 구조 | foundation 구현 | SaaS `26f58f0` | SaaS worklog | assistant record `metadata.approvedKnowledgeItem`에 retrieval-ready WIKI draft 저장 |
| `/admin/knowledge` UI | foundation 구현 | SaaS `26f58f0` | SaaS worklog | 후보 목록, 상세, WIKI draft 편집, 승인/반려 footer 확인 |
| 감사/검토 이력 | foundation 구현 | SaaS `26f58f0` | SaaS worklog | `metadata.knowledgeReview`에 reviewer/status/reviewedAt/rejectionReason 저장 |

## Verification Log

| 날짜 | 범위 | 결과 |
| --- | --- | --- |
| 2026-05-07 | PRD 작성 | 01 slice의 `candidateState: candidate` metadata를 02 slice의 입력으로 명확히 연결함 |
| 2026-05-07 | 02 foundation 구현 검증 | SaaS `npm run typecheck`, `npm run lint`, `npm run build` 통과. Browser-use로 `/admin/knowledge` 후보 상세 로딩과 `WIKI 지식 승인` 확인. Console error/warn 없음 |

## Problem Statement

01 slice는 `/daily` task에서 assistant 답변과 작업 기록 정리 초안을 만들고 저장하는 core loop를 만들었다. 그러나 이 기록은 아직 task 안에 머문다. 반복 가치가 있는 검토 의견, 법규 해석, 프로젝트 기준, 실무 판단은 관리자 검토를 거쳐 조직의 중앙 공식 지식으로 승격되어야 이후 task 검토 품질을 높일 수 있다.

현재 필요한 것은 완전한 WIKI 제품이 아니라 첫 관리자 루프다. Knowledge admin이 후보를 보고, 원문과 근거를 확인하고, 필요한 경우 수정한 뒤 승인하거나 반려할 수 있어야 한다.

## Solution

02 slice는 `Knowledge Admin WIKI Candidate Review Loop`를 구현한다.

핵심 흐름:

```text
task assistant record / approved work summary
  -> candidate queue
  -> Knowledge admin reviews source, evidence, confidence, task context
  -> admin approves, edits and approves, or rejects
  -> approved item becomes central official knowledge / WIKI draft
  -> future retrieval can prioritize approved knowledge
```

첫 구현은 SaaS 관리자 모듈 안에서 시작한다.

```text
/admin/knowledge
```

이 slice의 화면은 PC 관리자 업무 화면으로 본다. 모바일 최적화는 후속 범위다.

## User Stories

1. As a Knowledge admin, I want to see assistant-generated candidate items, so that useful task insights can be reviewed.
2. As a Knowledge admin, I want to inspect the source task and project context, so that I can judge whether the item is reusable.
3. As a Knowledge admin, I want to see the assistant answer, user-approved work summary, evidence, confidence, and tags, so that I can validate the basis.
4. As a Knowledge admin, I want AI-suggested tags and related links to remain editable, so that the WIKI item reflects organization terminology.
5. As a Knowledge admin, I want to approve a candidate, so that it becomes central official knowledge.
6. As a Knowledge admin, I want to edit and approve a candidate, so that imperfect assistant drafts can still become useful WIKI material.
7. As a Knowledge admin, I want to reject a candidate with a reason, so that low-value or unsafe material does not keep resurfacing.
8. As a Knowledge admin, I want duplicate or related candidate hints, so that I do not create fragmented WIKI items.
9. As a project manager, I want approved WIKI items to preserve source references, so that the knowledge remains auditable.
10. As a system admin, I want review actions logged, so that official knowledge changes are traceable.

## Scope

MVP 포함:

- Candidate queue list
- Candidate detail view
- Source task/project metadata
- Assistant answer and work summary preview
- Evidence/source list
- Confidence score and explanation
- Editable title, summary, tags, body, publication scope
- Approve, edit-and-approve, reject
- Review history/audit minimum
- Approved central knowledge/WIKI item minimum structure
- Retrieval-ready approved state marker

MVP 제외:

- Obsidian export
- Notion sync
- Graph view
- user-facing WIKI screen
- automatic duplicate merge
- automatic regulation crawling
- full role management UI for Knowledge admin
- cross-organization knowledge sharing

## Data Model Decisions

02 slice should not make the browser extension depend on database internals. SaaS owns all knowledge data and review APIs.

Minimum candidate fields:

- `id`
- `sourceType`: `assistant_record` or `work_summary`
- `sourceRecordId`
- `taskId`
- `projectId`
- `title`
- `summary`
- `body`
- `tags`
- `evidence`
- `confidenceScore`
- `confidenceReason`
- `status`: `candidate`, `approved`, `rejected`
- `reviewerId`
- `reviewedAt`
- `rejectionReason`
- `createdAt`
- `updatedAt`

Minimum approved knowledge fields:

- `id`
- `title`
- `bodyMarkdown`
- `summary`
- `tags`
- `scope`
- `sourceCandidateId`
- `sourceTaskId`
- `sourceProjectId`
- `sourceReferences`
- `approvalState`: `approved`
- `approvedBy`
- `approvedAt`
- `createdAt`
- `updatedAt`

If the existing SaaS assistant summary metadata already contains candidate data, the first implementation may derive the candidate queue from those records before adding a larger dedicated candidate table. If approval persistence needs a stable official knowledge target, add a minimal repository/API boundary in SaaS.

## API Decisions

The first API surface should stay under SaaS ownership.

Recommended endpoints:

```text
GET /api/admin/knowledge/candidates
GET /api/admin/knowledge/candidates/:id
POST /api/admin/knowledge/candidates/:id/approve
POST /api/admin/knowledge/candidates/:id/reject
GET /api/admin/knowledge/items
GET /api/admin/knowledge/items/:id
```

Every endpoint must re-check the current user and project/organization access server-side. If the SaaS does not yet have a separate Knowledge admin role, map it conservatively to existing admin/global admin capabilities and document the temporary mapping.

## UI Decisions

The first `/admin/knowledge` UI should be work-focused and dense, not a marketing page.

Required regions:

- candidate queue list
- status filter
- selected candidate detail
- source and evidence section
- editable WIKI draft section
- review action footer

The UI should make the following clear:

- candidate material is not official knowledge yet
- approval makes it reusable in future retrieval
- source task/project links remain part of the official item
- confidence is a review aid, not legal certainty

## Testing Decisions

Required verification:

- candidate list returns only authorized candidates
- candidate detail includes source task/project metadata
- approve creates or updates an approved knowledge item
- edit-and-approve preserves admin edits
- reject records a reason and removes the candidate from active queue
- approved item preserves source references
- unauthorized users cannot approve/reject
- `/admin/knowledge` manual flow works in browser

Recommended commands:

```powershell
npm run typecheck
npm run lint
npm run build
```

Manual browser flow:

1. Open `http://localhost:3000/admin/knowledge`.
2. Confirm candidate list loads.
3. Select a candidate generated from `/daily` assistant work.
4. Review source task, evidence, confidence, and WIKI draft.
5. Edit title/body/tags.
6. Approve.
7. Confirm the item moves to approved knowledge.
8. Reject another candidate with a reason.
9. Confirm no console error/warn appears.

## Dependencies

- 01 slice assistant records and work summary drafts
- SaaS current project/user permission model
- Existing admin routing/layout conventions
- Existing repository pattern for local/cloud backends

## Open Questions

- Whether Knowledge admin should be mapped to global admin only for MVP or a project manager role can review project-scoped candidates.
- Whether approved knowledge should be globally organization-scoped by default or start as project-scoped.
- Whether candidate queue should be a dedicated table immediately or derived from assistant summary metadata for the first implementation.

## Success Criteria

02 is implemented when a Knowledge admin can review an assistant-generated candidate from `/daily`, approve or reject it, and see the approved item stored as retrieval-ready official knowledge with source references and review metadata.

## Implementation Notes

2026-05-07 foundation 구현:

- `architect-saas`에 `/admin/knowledge` route와 `KnowledgeAdminShell`을 추가했다.
- `GET /api/admin/knowledge/candidates`, `GET /api/admin/knowledge/candidates/:recordId`, `POST approve`, `POST reject`, `GET /api/admin/knowledge/items`를 추가했다.
- 별도 중앙 WIKI 테이블을 만들기 전 단계로 기존 assistant record의 `candidateState`와 `metadata`를 사용한다.
- 승인된 WIKI draft는 `metadata.approvedKnowledgeItem`에 저장하고, 검토 이력은 `metadata.knowledgeReview`에 저장한다.
- 이 방식은 첫 관리자 loop 검증용 foundation이다. 후속 slice에서 중앙 공식 지식 테이블, 검색 인덱스, 사용자용 WIKI 화면으로 분리할 수 있다.

남은 제한 사항:

- Knowledge admin 권한은 MVP에서 기존 global admin으로 임시 매핑했다.
- 승인된 지식은 아직 별도 knowledge table이 아니라 assistant record metadata에 저장된다.
- 자동 중복 병합, 관련 WIKI 링크 제안, 사용자용 WIKI 화면은 후속 구현이다.
