# 01. Task Assistant Core Loop PRD

작성일: 2026-05-07
상위 문서: `../PLAN.md`
범위: 첫 구현 가능한 vertical slice
현재 상태: `in_progress`

## 문서 운영

이 문서는 `PLAN.md`의 하위 실행 계획 문서다.

`PLAN.md`는 전체 제품 방향성과 아키텍처 원칙을 유지한다. 이 문서는 첫 vertical slice의 세부 요구사항, 구현 결정, 테스트 기준, 구현 상태, 검증 결과를 누적한다.

구현이 진행되면 아래 `Implementation Status`와 `Verification Log`를 갱신한다.

## Implementation Status

현재 구현 상태: `foundation_implemented`

| 항목 | 상태 | 관련 commit | worklog | 검증 |
| --- | --- | --- | --- | --- |
| Task Assistant Core Loop PRD 작성 | 완료 | `46c6361` | `docs/worklogs/2026-05-07-1522-planning-doc-operations.md` | 문서 검토, 미완성 토큰 검색, diff check |
| SaaS task context 인식 | foundation 구현 | SaaS `6702f16` | SaaS `docs/worklogs/2026-05-07-1559-task-assistant-core-loop.md` | `npm run typecheck`, `npm run build` |
| SaaS retrieval API contract | foundation 구현 | SaaS `6702f16` | SaaS `docs/worklogs/2026-05-07-1559-task-assistant-core-loop.md` | `docs/assistant-extension-contract.md`, `npm run build` |
| ArchitectLocalAssistantRuntime adapter | foundation 구현 | Browser `2872dd5` | `docs/worklogs/2026-05-07-1559-task-assistant-core-loop.md` | `npm run typecheck` |
| local runtime discovery/spike | 부분 완료 | Browser `2872dd5` | `docs/worklogs/2026-05-07-1559-task-assistant-core-loop.md` | real bridge 미정, stub unavailable |
| real local ChatGPT/Codex runtime path | 미구현 | - | - | runtime discovery 후 별도 구현 필요 |
| MockAssistantRuntime | foundation 구현 | Browser `2872dd5` | `docs/worklogs/2026-05-07-1559-task-assistant-core-loop.md` | `npm run test` |
| assistant 답변/근거 자동 저장 | foundation 구현 | Browser `2872dd5`, SaaS `6702f16` | SaaS/browser worklogs | `npm run typecheck`, `npm run build` |
| 신뢰도/출처 표시 | foundation 구현 | Browser `2872dd5`, SaaS `6702f16` | SaaS/browser worklogs | side panel build, SaaS confidence reason |
| 작업 기록 정리 초안 저장 | foundation 구현 | Browser `2872dd5`, SaaS `6702f16` | SaaS/browser worklogs | `/api/assistant/summaries`, side panel approve/defer flow |
| Knowledge admin 후보 큐 최소 연결 | 부분 구현 | SaaS `6702f16` | SaaS worklog | `candidateState: candidate`; Admin WIKI UI는 후속 slice |
| `/daily` task-reactive PC assistant panel | 구현/검증 완료 | SaaS `cc0b915` | Browser `docs/worklogs/2026-05-07-1657-task-reactive-assistant-plan.md`, SaaS `docs/worklogs/2026-05-07-1657-daily-task-assistant-panel.md` | Browser-use로 `/daily` task 선택, panel open, retrieve/generate/save, summary approve 검증 |

## Verification Log

| 날짜 | 범위 | 결과 |
| --- | --- | --- |
| 2026-05-07 | PRD 문서 작성 | 첫 vertical slice에 real local runtime과 mock runtime을 모두 포함하도록 문서화함 |
| 2026-05-07 | foundation 구현 검증 | SaaS `typecheck`, `lint`, `build` 통과. Browser assistant `typecheck`, `lint`, `test`, `build` 통과. Harness reviewer P1 findings 3건 수정. Real local ChatGPT/Codex bridge는 unavailable stub로 남김 |
| 2026-05-07 | 즉시 테스트 harness 추가 | SaaS `/assistant-test`에서 same-origin으로 retrieve, mock generate, record save, summary approve 흐름을 테스트할 수 있게 함 |
| 2026-05-07 | 제품 방향 전환 반영 | `/assistant-test`는 개발 harness로 유지하고, 실제 UX goal은 `/daily` task 클릭에 반응하는 PC 전용 assistant panel로 구체화함 |
| 2026-05-07 | `/daily` task-reactive panel 검증 | `npm run typecheck`, `npm run lint`, `npm run build` 통과. Browser-use로 `AI 검토 001`에서 근거 조회, 의견 저장, 작업 기록 승인까지 확인함 |

## Implementation Notes

2026-05-07 foundation 구현 내용:

- `architect-saas`:
  - `docs/assistant-extension-contract.md`에 extension API contract를 추가했다.
  - `/api/assistant/task-context`, `/api/assistant/retrieve`, `/api/assistant/records`, `/api/assistant/summaries`를 추가했다.
  - `src/use-cases/assistant-service.ts`에서 current project/task 권한 검증, task/project 기반 evidence retrieval, assistant record 저장, work summary draft 저장을 처리한다.
  - `assistant_task_records`, `assistant_work_summary_drafts` Prisma 모델과 migration을 추가했다.
  - assistant 신규 테이블에 RLS와 project/task/profile 기반 policy를 추가했다.
  - `ARCHITECT_ASSISTANT_EXTENSION_ORIGINS` 환경변수로 명시 등록된 Chrome extension origin만 mutation integrity guard를 통과하도록 했다.
  - local backend에서도 assistant records를 data-guard snapshot/write path로 저장하도록 `assistant` local store를 추가했다.
- `architect-browser-assistant`:
  - Chrome MV3, Vite, React 기반 side panel scaffold를 추가했다.
  - SaaS API client와 extension-owned contract 타입을 추가했다.
  - `ArchitectLocalAssistantRuntime` adapter, deterministic `MockAssistantRuntime`, unavailable `LocalRuntimeClient` stub를 추가했다.
  - `chrome.storage` safe wrapper가 credential-like key 저장을 차단한다.
- 즉시 테스트 경로:
  - `architect-saas`에 `/assistant-test` route를 추가해 Chrome extension 설치 전에도 same-origin API 흐름을 확인할 수 있게 했다.
  - workspace root에 `사용자 가이드.md`를 추가했다.

2026-05-07 방향 전환:

- `/assistant-test`는 구현 검증용 harness로만 둔다.
- 실제 사용자 UX는 기존 `/daily` 또는 `/board` 업무 화면에서 task를 클릭하면 assistant가 해당 task에 반응하는 방식으로 전환한다.
- 모바일 assistant는 후속 확장으로 남기고, 첫 구현 goal은 PC 전용 floating/docked panel이다.
- Chrome action popup은 장시간 task 검토에 적합하지 않으므로 기본 UX로 두지 않는다. Chrome 전용 제약이 필요할 경우에도 side panel 또는 SaaS 화면 안 panel을 우선한다.

남은 제한 사항:

- real local ChatGPT/Codex bridge는 아직 구현되지 않았고 `LocalRuntimeClient`가 unavailable 상태를 반환한다.
- Chrome extension origin은 SaaS `ARCHITECT_ASSISTANT_EXTENSION_ORIGINS` allowlist에 등록된 경우에만 mutation POST가 허용된다. 실제 배포 전 extension ID와 쿠키/SameSite 정책 검증이 필요하다.
- 중앙 공식 지식, 법규 DB, 파일 텍스트 추출 retrieval은 다음 slices에서 실제 데이터 소스를 추가해야 한다.
- Admin WIKI 후보 큐는 `candidateState` metadata 수준이며 UI는 아직 없다.

## Problem Statement

건축 업무 SaaS의 task에는 검토 내용, 첨부파일, 댓글, 결정 사항, 과거 검토 맥락이 흩어져 있다. 사용자는 특정 task를 검토할 때 이전 판단, 조직 공통 실무 지식, 법규 근거, 프로젝트 문서를 다시 찾아야 하며, 답변이나 결론이 개인 대화나 임시 메모로 흩어져 조직 지식으로 축적되지 않는다.

Architect Browser Assistant의 첫 vertical slice는 이 문제를 task 하나의 실제 사용 흐름에서 검증한다. 사용자는 SaaS `/daily` 업무 화면에서 task row/card를 클릭하고, 같은 화면 안의 PC 전용 assistant panel을 켜서 질문한다. assistant는 선택된 task에 반응하고 SaaS DB에서 근거를 검색하며, Architect 전용 local ChatGPT/Codex runtime 또는 현재 slice의 mock runtime으로 답변을 생성한다. 답변과 근거는 task assistant 기록에 자동 저장된다. 사용자는 AI가 제안한 작업 기록 정리 초안을 승인하거나 수정한다.

이 slice는 mock 답변만으로 끝나면 안 된다. 제품의 핵심 가치가 "SaaS DB 근거 + 사용자 local ChatGPT/Codex 실행"이므로, 첫 slice에 local runtime adapter를 포함해야 실제 기능 검증이 가능하다.

## Solution

첫 PRD는 `Task Assistant Core Loop`를 구현한다.

핵심 흐름:

```text
SaaS /daily task 화면
  -> task row/card 클릭
  -> PC 전용 floating/docked assistant panel
  -> 현재 task context 인식
  -> SaaS retrieval API로 중앙 지식/법규/task/project 근거 검색
  -> ArchitectLocalAssistantRuntime으로 local ChatGPT/Codex 답변 생성
  -> 답변 원문과 근거 자동 저장
  -> 신뢰도와 출처 표시
  -> AI 작업 기록 정리 초안 생성
  -> 사용자가 승인/수정/나중에 처리
  -> Knowledge admin 후보 큐에 최소 상태로 연결
```

Chromex는 runtime dependency가 아니다.

Chromex는 reference implementation이자 필요 시 코드 출처다. 코드를 가져오는 경우 license와 attribution을 보존하고, Architect Browser Assistant의 local runtime/bridge 구조 안으로 편입한다. 이 PRD에서 만드는 runtime은 Architect Browser Assistant 전용 runtime이다.

이 첫 slice는 전체 MVP가 아니다. 전체 MVP는 `PLAN.md`의 여러 하위 실행 계획을 통해 완성된다. 이 문서는 local runtime, SaaS retrieval, task assistant 기록 저장, 작업 기록 정리의 핵심 루프를 먼저 검증한다.

## User Stories

1. As a task user, I want to open an assistant side panel from the current task, so that I can ask questions without leaving the task context.
2. As a task user, I want the assistant to know the current task title, description, status, and project, so that I do not need to re-enter context.
3. As a task user, I want the assistant to search approved central knowledge first, so that repeated review knowledge is reused.
4. As a task user, I want the assistant to search regulation documents and official sources, so that legal review opinions have visible grounds.
5. As a task user, I want the assistant to search the current project and task records, so that answers reflect project context.
6. As a task user, I want the assistant to generate an answer using my local ChatGPT/Codex runtime, so that the SaaS does not need to store my GPT credentials.
7. As a task user, I want to see whether the local runtime is connected, so that I know whether AI answer generation is available.
8. As a task user without a working local runtime, I want to see retrieved evidence and existing records, so that I can still use the SaaS knowledge features.
9. As a task user, I want generated answers to include sources, so that I can verify the basis of the answer.
10. As a task user, I want answers to show a confidence percentage, so that I can understand how strong the evidence is.
11. As a task user, I want the confidence percentage to include an explanation, so that I do not mistake it for a legal guarantee.
12. As a task user, I want all assistant answers and evidence to be saved automatically to the task assistant record, so that important work is not lost.
13. As a task user, I want assistant records to be separate from ordinary comments, so that AI evidence and metadata stay traceable.
14. As a task user, I want AI to draft a conclusion, tags, scope, and follow-up action, so that I can turn the answer into a clean task record quickly.
15. As a task user, I want to approve or edit the AI-drafted work summary, so that the task record reflects my actual judgment.
16. As a task user, I want the UI to frame this as task record cleanup, so that it feels useful rather than like submitting content to a central database.
17. As a task user, I want to defer the cleanup step, so that I can continue working without blocking every assistant interaction.
18. As a project manager, I want task assistant records to remain linked to the task, so that project review history is auditable.
19. As a Knowledge admin, I want cleaned task records to appear as candidate material, so that useful insights can be reviewed later.
20. As a Knowledge admin, I want the first slice to capture enough metadata for future approval workflows, so that later WIKI work does not need a data rewrite.
21. As a system admin, I want the SaaS to avoid storing local GPT/Codex credentials, so that the authentication boundary is clear.
22. As a developer, I want a runtime adapter interface, so that the extension does not hard-code one local runtime implementation.
23. As a developer, I want a mock assistant runtime, so that API, UI, and storage flows can be tested without requiring a live local runtime.
24. As a developer, I want the real local runtime included in the first slice, so that product-value testing is not limited to mocks.
25. As a developer, I want Chromex-derived code to be isolated and attributed, so that licensing and future maintenance are manageable.

## Implementation Decisions

- The first implementation unit is `Task Assistant Core Loop`, not the entire product plan.
- The whole product direction stays in `PLAN.md`; this file is the first concrete PRD-style execution plan.
- The product UX target is not `/assistant-test`; that route remains a harness only.
- The first user-facing implementation target is a PC-only assistant panel that reacts to selected `/daily` tasks.
- Mobile assistant UX is explicitly out of scope for this slice.
- Chrome action popup is not the primary UX because it cannot stay open reliably beside the task list.
- The first slice includes local ChatGPT/Codex runtime support because real feature validation requires actual answer generation.
- A mock runtime is also required for development and automated testing.
- Chromex is not a runtime integration target. It is a reference and possible code source.
- If Chromex code is copied, MIT license and attribution must be preserved.
- Copied Chromex code must be adapted into Architect Browser Assistant-owned modules rather than used as a live upstream dependency.
- The extension must call SaaS APIs and must not connect directly to the production DB.
- The extension must not store ChatGPT/Codex credentials, SaaS service role keys, OpenAI API keys, or production DB credentials.
- SaaS APIs must re-check user, organization, project, and task permissions server-side.
- SaaS retrieval is responsible for permission checks and returning evidence.
- The extension/local runtime is responsible for answer generation using retrieved evidence.
- The SaaS must store task assistant records, answer text, source metadata, confidence score, and cleanup state.
- Assistant records are separate from ordinary task comments.
- The core runtime interface should be a narrow adapter.

Before implementation, run a local runtime discovery/spike.

The spike must answer:

- Which Chromex structures or files are useful as reference or import candidates?
- Which copied code would require MIT license and attribution preservation?
- Whether native messaging, local bridge, app-server, or another local runtime path is the right first implementation path
- How local ChatGPT/Codex availability is detected
- How the runtime receives SaaS evidence without leaking SaaS secrets
- What can be tested with mock runtime and what requires real runtime verification
- What browser extension permissions are minimally required

Runtime adapter decision:

```ts
type AssistantRuntimeStatus = {
  available: boolean;
  mode: "local-chatgpt-codex" | "mock";
  reason?: string;
};

type AssistantRuntimeInput = {
  question: string;
  taskContext: {
    taskId: string;
    projectId: string;
    title: string;
    description?: string;
  };
  evidence: Array<{
    id: string;
    kind: "central_knowledge" | "regulation" | "task" | "project_document" | "web_or_skill";
    title: string;
    excerpt: string;
    sourceUrl?: string;
    confidenceWeight?: number;
  }>;
};

type AssistantRuntimeOutput = {
  answer: string;
  draftSummary?: {
    conclusion: string;
    tags: string[];
    scope: string;
    followUpAction?: string;
  };
};

interface ArchitectLocalAssistantRuntime {
  isAvailable(): Promise<AssistantRuntimeStatus>;
  listCapabilities(): Promise<string[]>;
  generateAnswer(input: AssistantRuntimeInput): Promise<AssistantRuntimeOutput>;
}
```

The exact implementation of local ChatGPT/Codex bridge remains an implementation-planning item, but this PRD requires the adapter boundary and a working real-runtime path in the first vertical slice.

The local runtime discovery/spike is therefore the first implementation task inside this slice. If the spike shows that the real runtime cannot be completed safely inside the slice, the mock runtime may support UI/API work, but the slice remains unvalidated until real local runtime answer generation works end-to-end.

SaaS retrieval contract should support the current search priority:

1. Central official knowledge
2. Regulation DB and official sources
3. Current task and same-project work data
4. Project criteria and extracted attachment text
5. User-approved web/skill results if present

The first slice does not need full Admin WIKI UI. It only needs enough candidate metadata so a later Knowledge Admin WIKI can consume it.

Cross-repo contract:

- `architect-browser-assistant` owns side panel UI, runtime adapter, extension context detection, and runtime invocation.
- `architect-saas` owns retrieval API, auth/RBAC checks, task assistant record persistence, confidence data persistence, and candidate metadata persistence.
- Changes in each repo must be committed with a matching worklog.
- Worklogs should cross-reference the related repo commit or plan when a slice spans both repos.
- The browser assistant must use SaaS API contracts and must not depend directly on Prisma schema or database internals.

Minimum E2E fixture set:

- One SaaS user with access to one project
- One project with at least one active task
- One central official knowledge item relevant to that task
- One regulation source or regulation document record
- One project/task record that can be retrieved as same-project context
- One assistant question that can use all three evidence classes
- One mock runtime response for automated tests
- One real local runtime path for product validation

## Testing Decisions

Tests should focus on external behavior, not implementation details.

Required testable modules:

- Task context detection contract
- SaaS retrieval request/response contract
- Assistant runtime adapter behavior
- Local runtime discovery output review
- Mock runtime behavior
- Task assistant record persistence
- Confidence score display data
- Work-record cleanup draft save flow
- Permission failure behavior
- Runtime unavailable behavior
- Extension credential-storage guardrails

Good tests for this slice:

- Given a selected task, the extension sends the correct task ID/project ID to SaaS retrieval.
- Given a selected `/daily` task, the PC assistant panel shows the selected task and sends that task ID to SaaS retrieval.
- Given retrieval evidence, the runtime receives the evidence in priority order.
- Given a runtime answer, the SaaS stores answer text, source metadata, confidence score, user ID, task ID, and execution mode.
- Given no local runtime, the UI shows evidence and disables generation rather than failing silently.
- Given mock runtime, the side panel can complete the full save flow in automated tests.
- Given a user-edited cleanup draft, the saved task summary differs from the AI draft and preserves audit metadata.
- Given insufficient evidence, the confidence explanation indicates limits instead of overclaiming.
- Given an unauthorized task/project, SaaS retrieval returns no protected evidence.
- Given extension storage inspection, no GPT/Codex token, service role key, OpenAI API key, or DB credential is stored.

Manual product verification for the first slice:

1. Open one SaaS task.
2. Open browser assistant side panel.
3. Ask one task-specific question.
4. Confirm SaaS retrieval returns evidence.
5. Confirm real local runtime generates an answer.
6. Confirm answer and evidence are automatically saved.
7. Confirm confidence score and sources are visible.
8. Edit and save the work-record cleanup draft.
9. Confirm the record is visible from the task.
10. Confirm candidate metadata exists for future Knowledge admin flow.
11. Confirm `architect-saas` and `architect-browser-assistant` worklogs cross-reference the slice if both repos changed.

## Out of Scope

This PRD does not include:

- Full Admin WIKI implementation
- Knowledge admin approve/edit/reject UI
- Obsidian export
- Notion sync
- Graph view
- SaaS API mode
- Cross-organization knowledge sharing
- Automatic regulation crawling
- Scheduled regulation updates
- Full drawing interpretation
- CAD/BIM parsing
- Scale-based compliance judgment
- External webpage task capture
- Full web/skill expansion beyond adapter metadata
- Production-grade OCR/file extraction pipeline

## Further Notes

This first slice intentionally includes real local runtime support because the product cannot be validated as a Chromex-inspired service without local answer generation.

However, the implementation must keep a narrow adapter boundary so the runtime can evolve after deeper Chromex code review and bridge design.

The slice should be considered successful only if it proves the full loop:

```text
task context
  -> SaaS evidence retrieval
  -> local answer generation
  -> automatic task assistant record
  -> user-approved work summary
  -> candidate-ready metadata
```

If the real local runtime is blocked during implementation, the mock runtime may keep development moving, but the slice should not be considered product-validated until a real local ChatGPT/Codex runtime path works end-to-end.
