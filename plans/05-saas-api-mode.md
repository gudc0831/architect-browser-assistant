# 05. SaaS API Mode PRD

작성일: 2026-05-07
상세화: 2026-05-08
상위 문서: [../PLAN.md](../PLAN.md)
현재 상태: implemented
문서 goal: Write and approve 05 SaaS API Mode PRD.
Worklog: [../docs/worklogs/2026-05-08-1058-saas-api-mode-prd.md](../docs/worklogs/2026-05-08-1058-saas-api-mode-prd.md)
구현 goal: Implement SaaS API Mode policy and usage ledger foundation without live provider calls.
구현 Worklog: [../docs/worklogs/2026-05-08-1106-saas-api-mode-foundation.md](../docs/worklogs/2026-05-08-1106-saas-api-mode-foundation.md)
구현 goal 2: Implement SaaS API Mode live provider adapter and admin reporting.
구현 Worklog 2: [../../architect-saas/docs/worklogs/2026-05-08-1821-saas-api-live-provider-admin-reporting.md](../../architect-saas/docs/worklogs/2026-05-08-1821-saas-api-live-provider-admin-reporting.md)
다음 구현 goal 후보: Implement local ChatGPT/Codex bridge packaging and extension install verification.

## 1. Purpose

건축 업무 조직 중 일부는 로컬 ChatGPT/Codex 실행, 브라우저 확장 내 로컬 런타임 호출, 사용자별 API 키 보관을 허용하지 않는다. 05 SaaS API Mode는 이런 조직을 위해 서버에서 통제되는 AI 실행 모드를 제공한다.

핵심은 "건축 task를 클릭하면 현재 task, WIKI 지식, 사용자가 승인한 외부 근거를 바탕으로 assistant가 답변/의견을 제시한다"는 기존 방향을 유지하되, 실행 위치를 로컬에서 SaaS 서버로 옮기는 것이다. 관리자 정책, 비용, 사용량, 감사 로그가 먼저 준비되어야 실제 모델 호출을 안전하게 붙일 수 있다.

## 2. Background

완료된 선행 slice는 다음 기능을 제공한다.

- 01 Task Assistant Core Loop: daily task 선택, assistant panel, draft/official summary, 근거 기반 답변 저장.
- 02 Knowledge Admin WIKI: 건축 지식 카드와 assistant retrieval 대상 관리.
- 04 Web And Skill Expansion: 웹/skill 근거를 사용자가 승인해서 SaaS에 저장하고 assistant 근거로 연결.

현재 구조는 브라우저 확장/패널이 task context를 가져와 답변을 생성하고 SaaS API에 record/evidence를 저장하는 형태다. 05는 이 구조에 `saas-api` 실행 모드를 추가하기 위한 제품, 데이터, API, 보안 기준을 확정한다.

## 3. Goals

- 조직/프로젝트 단위로 SaaS API 실행 모드를 켜고 끌 수 있다.
- 관리자만 모델 실행 정책, 예산, evidence 사용 범위, 보존 기간을 설정할 수 있다.
- 서버는 모델 호출 전 권한, 정책, 예산, rate limit을 검증한다.
- 모델 호출 사용량과 비용 추정치를 task/project/user 단위로 기록한다.
- assistant 답변 생성, evidence 사용, 정책 변경, 차단 이벤트를 감사 로그로 남긴다.
- 사용자 UI는 기존 PC 팝업/확장 흐름을 유지하되 실행 모드만 명확히 표시한다.
- 실제 LLM provider 연동 전에도 policy/usage/audit foundation을 검증할 수 있다.

## 4. Non-Goals

- 모바일 assistant 구현은 이번 PRD 범위가 아니다.
- Chrome 외 브라우저 확장은 이번 PRD 범위가 아니다.
- 사용자가 임의 웹페이지 전체를 자동 수집하는 기능은 포함하지 않는다.
- 조직 과금 결제, 세금계산서, 실제 billing provider 연동은 포함하지 않는다.
- AI 답변을 법적/인허가 최종 판단으로 자동 승격하지 않는다.
- provider API key를 브라우저 확장이나 클라이언트에 저장하지 않는다.
- multi-agent autonomous execution은 포함하지 않는다.

## 5. Personas And User Stories

### 5.1 Organization Admin

- 관리자로서 프로젝트별 SaaS API Mode를 활성화/비활성화하고 싶다.
- 관리자로서 월별 예산, 1회 요청 token 한도, 허용 모델을 제한하고 싶다.
- 관리자로서 정책 변경 이력을 확인하고 싶다.

### 5.2 Project Manager

- PM으로서 특정 프로젝트 task에서 assistant 사용량과 비용 추정치를 보고 싶다.
- PM으로서 비용 초과 또는 정책 차단으로 assistant가 동작하지 않을 때 이유를 알고 싶다.

### 5.3 Architect Task User

- 사용자는 daily task 목록에서 task를 클릭하고, 같은 화면의 assistant 팝업에서 질문과 의견을 받고 싶다.
- 사용자는 로컬 Codex/ChatGPT 실행이 막힌 환경에서도 서버 실행 모드로 답변을 받을 수 있어야 한다.
- 사용자는 답변에 사용된 WIKI/외부 근거를 확인하고 draft/official summary에 반영 여부를 판단하고 싶다.

### 5.4 Knowledge Admin

- WIKI 카드와 외부 근거가 어떤 assistant 답변에 사용되었는지 추적하고 싶다.
- 부정확하거나 오래된 근거가 반복 사용되면 개선 대상을 찾고 싶다.

### 5.5 Security/Finance Reviewer

- 보안 담당자는 어떤 task에서 어떤 evidence type이 사용되었는지 감사하고 싶다.
- 재무 담당자는 프로젝트/월 단위 assistant 비용 추정치를 확인하고 싶다.

## 6. Execution Modes

| Mode | Description | Owner | Status |
| --- | --- | --- | --- |
| `local-chatgpt-codex` | 사용자의 PC/브라우저 확장/로컬 에이전트가 답변 생성, SaaS는 기록 저장 | Extension | current |
| `mock` | 개발/테스트용 deterministic 응답 | SaaS/Extension | current |
| `unavailable` | 정책/권한/런타임 문제로 assistant 사용 불가 | SaaS/Extension | current |
| `saas-api` | SaaS 서버가 정책 검증 후 provider API를 호출하고 usage/audit를 기록 | SaaS | implemented |

`saas-api`는 기존 daily task 내 assistant 팝업 UX를 대체하지 않는다. 사용자는 task를 클릭하고 같은 화면에서 assistant panel을 연 뒤 질문/의견을 받는다. 차이는 실행 위치와 관리자 통제다.

## 7. UX Requirements

### 7.1 Daily Task Assistant Popup

- PC daily task 화면에서 task 선택 시 assistant panel이 현재 task를 기준으로 열린다.
- panel 상단에 실행 모드를 표시한다: `Local`, `SaaS API`, `Unavailable`, `Mock`.
- SaaS API Mode가 꺼져 있으면 차단 이유와 관리자에게 문의할 정책 이름을 보여준다.
- 사용자는 사용자가 승인한 external evidence만 요청에 포함할 수 있다.
- 답변에는 사용된 WIKI/external evidence 목록과 생성 시각을 보여준다.
- 답변 저장은 기존 assistant record 흐름을 따른다.
- official summary 반영은 사용자가 직접 수행한다.

### 7.2 Admin Policy Screen

초기 구현은 기존 `/admin` 또는 후속 `/admin/assistant` 화면에 다음 설정을 둔다.

- SaaS API Mode 활성화 여부.
- 적용 범위: 전체, 프로젝트, 역할, 사용자.
- 허용 모델/provider.
- 월 예산 한도.
- 1회 요청 input/output token 한도.
- external evidence 허용 여부.
- evidence source type 허용 목록.
- 감사 로그 보존 기간.
- usage export 또는 월별 조회.

### 7.3 Usage And Audit Views

- 월별 프로젝트 사용량: 요청 수, 성공/차단/실패 수, input/output token, 비용 추정.
- task별 최근 assistant 실행 이력.
- 정책 변경 audit log.
- 예산 초과/권한 부족/허용 evidence 위반 차단 이력.

## 8. Functional Requirements

### 8.1 Policy Enforcement

- 서버는 모든 `saas-api` 요청에서 세션과 프로젝트 권한을 재검증한다.
- 정책은 최소 project scope에서 시작하고, organization 모델이 생기면 상위 scope로 확장한다.
- 정책이 꺼져 있거나 예산을 초과하면 provider 호출 전에 차단한다.
- 허용되지 않은 evidence source type은 요청에서 제외하거나 요청 전체를 차단한다. 첫 구현은 차단이 기본이다.
- 관리자 정책 변경은 audit event로 기록한다.

### 8.2 Request Generation

- 입력은 task, user question, WIKI evidence, external evidence summary/excerpt, optional project context로 제한한다.
- 브라우저 URL 전체 본문이나 비승인 페이지 내용을 자동 포함하지 않는다.
- prompt assembly는 서버에서 수행한다.
- request payload에는 provider key가 포함되지 않는다.
- 응답은 answer, suggested summary, citations, usage estimate, confidence note를 포함한다.

### 8.3 Record Persistence

- 생성 결과는 기존 assistant record contract와 호환되어야 한다.
- draft summary와 official summary의 구분을 유지한다.
- model answer를 official summary로 자동 승격하지 않는다.
- record에는 execution mode와 policy snapshot id를 연결한다.

### 8.4 Usage Ledger

- 모든 시도는 usage event로 기록한다.
- provider 호출 전 차단도 usage/audit에 남긴다.
- 성공 요청은 input/output token, provider, model, estimated cost를 기록한다.
- 실패 요청은 error code와 safe failure reason을 기록한다.
- usage log에는 full prompt를 중복 저장하지 않는다. 필요한 경우 request hash와 evidence id list를 저장한다.

### 8.5 Audit Trail

- 정책 생성/수정/비활성화.
- SaaS API Mode 요청 승인/차단/실패.
- budget threshold 초과.
- assistant answer 저장.
- external evidence 사용.

## 9. Proposed API Contract

### 9.1 Admin Policy

`GET /api/admin/assistant/policy`

Response:

```json
{
  "enabled": true,
  "scopeType": "project",
  "projectId": "project-id",
  "provider": "openai",
  "model": "gpt-5.4-mini",
  "monthlyBudgetCents": 50000,
  "maxInputTokens": 12000,
  "maxOutputTokens": 2000,
  "externalEvidenceAllowed": true,
  "allowedEvidenceSourceTypes": ["web", "skill", "document"],
  "retentionDays": 365
}
```

`PUT /api/admin/assistant/policy`

- Admin-only.
- Writes audit event.
- Returns updated policy.

### 9.2 Usage

`GET /api/admin/assistant/usage?projectId={id}&month=2026-05`

Response:

```json
{
  "projectId": "project-id",
  "month": "2026-05",
  "requestCount": 42,
  "successCount": 37,
  "blockedCount": 3,
  "failedCount": 2,
  "inputTokens": 184000,
  "outputTokens": 42000,
  "estimatedCostCents": 11800
}
```

### 9.3 Generate

`POST /api/assistant/generate`

Request:

```json
{
  "runtimeMode": "saas-api",
  "taskId": "task-id",
  "question": "이 task에서 구조 협의 전에 확인할 리스크는?",
  "instruction": "건축 실무 PM 관점으로 답변해줘.",
  "wikiEvidenceIds": ["wiki-id"],
  "externalEvidenceIds": ["evidence-id"]
}
```

Response:

```json
{
  "answer": "구조 검토 전에는 ...",
  "suggestedDraftSummary": "구조 검토 전 확인 항목: ...",
  "citations": [
    {
      "sourceType": "wiki",
      "sourceId": "wiki-id",
      "title": "철근콘크리트 검토 기준"
    }
  ],
  "usage": {
    "inputTokens": 3200,
    "outputTokens": 720,
    "estimatedCostCents": 86
  },
  "executionMode": "saas-api",
  "policyDecision": "allowed"
}
```

첫 foundation 구현에서는 provider 호출 없이 `policyDecision`, usage ledger, audit event, deterministic placeholder response를 검증할 수 있다. 실제 provider 연동은 별도 slice로 둔다.

## 10. Data Model Proposal

### 10.1 AssistantRunPolicy

- `id`
- `scopeType`: `global | project | profile`
- `projectId?`
- `profileId?`
- `enabled`
- `provider`
- `model`
- `monthlyBudgetCents`
- `maxInputTokens`
- `maxOutputTokens`
- `externalEvidenceAllowed`
- `allowedEvidenceSourceTypes`
- `retentionDays`
- `createdByProfileId`
- `updatedByProfileId`
- `createdAt`
- `updatedAt`

### 10.2 AssistantUsageEvent

- `id`
- `projectId`
- `taskId?`
- `profileId`
- `assistantRecordId?`
- `executionMode`
- `runtimeMode`
- `provider?`
- `model?`
- `inputTokens`
- `outputTokens`
- `estimatedCostCents`
- `status`: `success | blocked | failed | cancelled`
- `policyDecision`: `allowed | disabled | budget_exceeded | evidence_disallowed | unauthorized | rate_limited`
- `requestHash?`
- `errorCode?`
- `createdAt`

### 10.3 AssistantAuditEvent

- `id`
- `projectId?`
- `profileId?`
- `eventType`
- `targetType`
- `targetId?`
- `metadata`
- `createdAt`

## 11. Security And Privacy Requirements

- Provider API key는 server-only secret으로 관리한다.
- 클라이언트와 브라우저 확장은 provider key를 받지 않는다.
- 서버는 client-provided project/task/evidence id를 신뢰하지 않고 권한을 재확인한다.
- external evidence는 사용자가 승인한 title, URL, excerpt, skill summary만 사용한다.
- usage/audit table은 full prompt를 반복 저장하지 않는다.
- prompt/evidence retention은 policy로 관리한다.
- admin policy mutation은 CSRF/session/RBAC를 통과해야 한다.
- budget/rate limit 차단은 provider 호출 전에 수행한다.
- 실패 응답은 provider secret, raw prompt, 내부 stack trace를 노출하지 않는다.

## 12. Acceptance Criteria

### PRD Acceptance

- SaaS API Mode의 목적, 범위, non-goals가 명확하다.
- 실행 모드와 기존 PC 팝업 assistant UX의 관계가 명확하다.
- admin policy, usage, audit 요구사항이 구현 가능한 수준으로 정의되어 있다.
- API/data model 초안이 실제 `architect-saas` 구조와 연결 가능하다.
- 다음 구현 goal이 명확하다.

### First Implementation Acceptance

- admin policy를 저장/조회할 수 있다.
- `saas-api` generate endpoint가 policy disabled/allowed를 구분한다.
- provider 호출 없이 deterministic response와 usage/audit event가 저장된다.
- budget/evidence disallowed 차단이 provider 호출 전에 기록된다.
- assistant panel은 `saas-api` 모드를 표시하고 차단 이유를 보여준다.
- lint/typecheck/build가 통과한다.
- 사용자 가이드에 SaaS API Mode가 추가된다.

### Live Provider And Reporting Acceptance

- `mock` provider는 서버 adapter를 통해 deterministic 응답과 token/cost estimate를 반환한다.
- `openai` provider는 서버 `OPENAI_API_KEY`가 있을 때 OpenAI Responses API를 호출하고, 없거나 실패하면 safe failure usage/audit를 남긴다.
- `/admin/assistant`에서 policy, 월별 usage summary, recent usage events, audit timeline을 확인할 수 있다.
- `/daily` PC popup의 SaaS API 실행 모드는 provider/model/call mode와 usage를 답변에 표시한다.
- 사용자 가이드와 API contract가 live provider/admin reporting 상태를 설명한다.

## 13. Slice Plan

| Slice | Goal | Output | Status |
| --- | --- | --- | --- |
| 05A | PRD 상세화와 승인 | 이 문서, roadmap/worklog 갱신 | done |
| 05B | Policy/usage/audit foundation | Prisma model, admin API, generate gate, usage summary, tests | done |
| 05C | Assistant panel SaaS mode UX | mode selector, enabled/disabled badge, generate call path | done |
| 05D | Provider adapter | server-only provider call, token/cost accounting | done |
| 05E | Admin reporting | usage table, audit timeline, budget warnings | done |

## 14. Open Questions

- organization 모델을 별도 추가할지, 초기에는 project scope로 충분한지 결정해야 한다. 현재 첫 구현은 project scope가 안전하다.
- 실제 provider/model 기본값은 운영 배포 전 확정해야 한다.
- 월 예산 기준은 calendar month인지 billing cycle인지 결정해야 한다. 첫 구현은 calendar month로 둔다.
- prompt/evidence retention 정책은 법무/보안 검토 후 기본값을 확정해야 한다. 첫 구현 기본값은 365일로 둔다.

## 15. Status

05A PRD는 승인 상태다. 05B foundation과 05C daily popup 연결은 구현/검증 완료했다. 05D/05E live provider adapter와 admin reporting도 구현/검증 대상으로 완료 처리한다. 다음 goal 후보는 `Implement local ChatGPT/Codex bridge packaging and extension install verification`이다.
