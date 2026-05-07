# 01. Task Assistant Core Loop PRD

작성일: 2026-05-07
상위 문서: `../PLAN.md`
범위: 첫 구현 가능한 vertical slice

## Problem Statement

건축 업무 SaaS의 task에는 검토 내용, 첨부파일, 댓글, 결정 사항, 과거 검토 맥락이 흩어져 있다. 사용자는 특정 task를 검토할 때 이전 판단, 조직 공통 실무 지식, 법규 근거, 프로젝트 문서를 다시 찾아야 하며, 답변이나 결론이 개인 대화나 임시 메모로 흩어져 조직 지식으로 축적되지 않는다.

Architect Browser Assistant의 첫 vertical slice는 이 문제를 task 하나의 실제 사용 흐름에서 검증한다. 사용자는 SaaS task 화면에서 assistant side panel을 열고 질문한다. assistant는 SaaS DB에서 근거를 검색하고, Architect 전용 local ChatGPT/Codex runtime으로 답변을 생성하며, 답변과 근거를 task assistant 기록에 자동 저장한다. 사용자는 AI가 제안한 작업 기록 정리 초안을 승인하거나 수정한다.

이 slice는 mock 답변만으로 끝나면 안 된다. 제품의 핵심 가치가 "SaaS DB 근거 + 사용자 local ChatGPT/Codex 실행"이므로, 첫 slice에 local runtime adapter를 포함해야 실제 기능 검증이 가능하다.

## Solution

첫 PRD는 `Task Assistant Core Loop`를 구현한다.

핵심 흐름:

```text
SaaS task 화면
  -> browser assistant side panel
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
- The first slice includes local ChatGPT/Codex runtime support because real feature validation requires actual answer generation.
- A mock runtime is also required for development and automated testing.
- Chromex is not a runtime integration target. It is a reference and possible code source.
- If Chromex code is copied, MIT license and attribution must be preserved.
- Copied Chromex code must be adapted into Architect Browser Assistant-owned modules rather than used as a live upstream dependency.
- The extension must call SaaS APIs and must not connect directly to the production DB.
- SaaS retrieval is responsible for permission checks and returning evidence.
- The extension/local runtime is responsible for answer generation using retrieved evidence.
- The SaaS must store task assistant records, answer text, source metadata, confidence score, and cleanup state.
- Assistant records are separate from ordinary task comments.
- The core runtime interface should be a narrow adapter.

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

SaaS retrieval contract should support the current search priority:

1. Central official knowledge
2. Regulation DB and official sources
3. Current task and same-project work data
4. Project criteria and extracted attachment text
5. User-approved web/skill results if present

The first slice does not need full Admin WIKI UI. It only needs enough candidate metadata so a later Knowledge Admin WIKI can consume it.

## Testing Decisions

Tests should focus on external behavior, not implementation details.

Required testable modules:

- Task context detection contract
- SaaS retrieval request/response contract
- Assistant runtime adapter behavior
- Mock runtime behavior
- Task assistant record persistence
- Confidence score display data
- Work-record cleanup draft save flow
- Permission failure behavior
- Runtime unavailable behavior

Good tests for this slice:

- Given a selected task, the extension sends the correct task ID/project ID to SaaS retrieval.
- Given retrieval evidence, the runtime receives the evidence in priority order.
- Given a runtime answer, the SaaS stores answer text, source metadata, confidence score, user ID, task ID, and execution mode.
- Given no local runtime, the UI shows evidence and disables generation rather than failing silently.
- Given mock runtime, the side panel can complete the full save flow in automated tests.
- Given a user-edited cleanup draft, the saved task summary differs from the AI draft and preserves audit metadata.
- Given insufficient evidence, the confidence explanation indicates limits instead of overclaiming.

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
