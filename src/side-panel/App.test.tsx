import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE } from "../runtime/side-panel-contract";
import { App } from "./App";

const mocks = vi.hoisted(() => ({
  createAssistantRuntime: vi.fn(),
  createTask: vi.fn(),
  getReviewSession: vi.fn(),
  listExternalEvidence: vi.fn(),
  listReviewSessions: vi.fn(),
  listTasks: vi.fn(),
  localRuntimeIsAvailable: vi.fn(),
  localRuntimeListCapabilities: vi.fn(),
  readSafeSetting: vi.fn(),
  retrieveEvidence: vi.fn(),
  runTaskReview: vi.fn(),
  runtimeGenerateAnswer: vi.fn(),
  saveAssistantActionAudit: vi.fn(),
  saveExternalEvidence: vi.fn(),
  saveReviewSession: vi.fn(),
  saveWorkSummaryDraft: vi.fn(),
  updateTask: vi.fn(),
  writeSafeSetting: vi.fn(),
}));

vi.mock("../runtime/runtime-factory", () => ({
  createAssistantRuntime: mocks.createAssistantRuntime,
}));

vi.mock("../runtime/local-runtime-client", () => ({
  LocalRuntimeClient: vi.fn(function LocalRuntimeClient() {
    return {
    isAvailable: mocks.localRuntimeIsAvailable,
    listCapabilities: mocks.localRuntimeListCapabilities,
    };
  }),
}));

vi.mock("../saas/client", () => ({
  createTask: mocks.createTask,
  getReviewSession: mocks.getReviewSession,
  listExternalEvidence: mocks.listExternalEvidence,
  listReviewSessions: mocks.listReviewSessions,
  listTasks: mocks.listTasks,
  retrieveEvidence: mocks.retrieveEvidence,
  runTaskReview: mocks.runTaskReview,
  saveAssistantActionAudit: mocks.saveAssistantActionAudit,
  saveExternalEvidence: mocks.saveExternalEvidence,
  saveReviewSession: mocks.saveReviewSession,
  saveWorkSummaryDraft: mocks.saveWorkSummaryDraft,
  updateTask: mocks.updateTask,
}));

vi.mock("../storage/safe-storage", () => ({
  readSafeSetting: mocks.readSafeSetting,
  writeSafeSetting: mocks.writeSafeSetting,
}));

vi.mock("../runtime/side-panel-contract", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../runtime/side-panel-contract")>();
  return {
    ...actual,
    normalizeSidePanelContextBroadcastMessage: vi.fn((message: unknown) => {
      if (
        typeof message === "object" &&
        message !== null &&
        "__normalizedForAppTest" in message &&
        (message as NormalizedBroadcastTestMessage).__normalizedForAppTest === true
      ) {
        return {
          type: actual.SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE,
          context: (message as NormalizedBroadcastTestMessage).context,
        };
      }

      return actual.normalizeSidePanelContextBroadcastMessage(message);
    }),
  };
});

type RuntimeMessageListener = (message: unknown) => void;

type NormalizedBroadcastTestMessage = {
  __normalizedForAppTest: true;
  context: import("../runtime/side-panel-contract").SidePanelContextSnapshot;
};

let runtimeMessageListeners: RuntimeMessageListener[] = [];

const defaultTaskContext = {
  taskId: "task-1",
  projectId: "project-1",
  title: "피난 계단 검토",
  url: "http://localhost:3000/daily?taskId=task-1",
};

const defaultTaskRecord = {
  id: "task-1",
  projectId: "project-1",
  taskNumber: 100,
  actionId: 100,
  issueId: "ARCH-100",
  parentTaskId: null,
  rootTaskId: "task-1",
  depth: 0,
  siblingOrder: 0,
  dueDate: "",
  workType: "coordination",
  coordinationScope: "architecture",
  ownerDiscipline: "",
  requestedBy: "PM",
  relatedDisciplines: "MEP",
  assignee: "Reviewer",
  assigneeProfileId: null,
  issueTitle: "피난 계단 검토",
  reviewedAt: "",
  createdAt: "2026-06-24T00:00:00.000Z",
  createdBy: "user-1",
  isDaily: true,
  locationRef: "A-101",
  calendarLinked: false,
  issueDetailNote: "피난 계단 폭 검토",
  status: "new",
  statusHistory: "",
  decision: "",
  completedAt: null,
  version: 3,
  updatedAt: "2026-06-24T00:00:00.000Z",
  updatedBy: "user-1",
  deletedAt: null,
  purgedAt: null,
};

describe("App", () => {
  let root: Root | null = null;
  let rootElement: HTMLDivElement | null = null;

  beforeEach(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    document.body.innerHTML = "";
    rootElement = document.createElement("div");
    document.body.append(rootElement);
    root = createRoot(rootElement);

    const safeSettings = new Map<string, unknown>();
    mocks.readSafeSetting.mockImplementation(async (key: string, fallback: unknown) =>
      safeSettings.has(key) ? safeSettings.get(key) : fallback,
    );
    mocks.writeSafeSetting.mockImplementation(async (key: string, value: unknown) => {
      safeSettings.set(key, value);
    });
    mocks.listReviewSessions.mockResolvedValue([]);
    mocks.getReviewSession.mockResolvedValue({
      id: "session-1",
      taskId: "task-1",
      title: "저장된 검토 기록",
      question: "이전 질문",
      answerPreview: "이전 검토 답변 미리보기",
      answer: "이전 검토 답변 전문",
      verdict: "조건부",
      conclusionMayChange: true,
      savedAt: "2026-06-24T00:00:00.000Z",
      updatedAt: "2026-06-24T00:00:00.000Z",
      savedRecord: {
        id: "record-history-1",
        confidenceScore: 88,
        confidenceReason: "기록 신뢰도",
        draftSummary: {
          conclusion: "이전 결론",
          tags: ["assistant"],
          scope: "ARCH-100",
        },
      },
      savedEvidenceSnapshot: [{ id: "saved-1", kind: "central_knowledge", priority: 1, title: "저장 근거", excerpt: "" }],
      latestEvidenceSnapshot: [{ id: "latest-1", kind: "central_knowledge", priority: 1, title: "최신 근거", excerpt: "" }],
      savedWikiEvidence: [],
      latestWikiEvidence: [],
      savedHistoryEvidence: [],
      latestHistoryEvidence: [],
    });
    mocks.listExternalEvidence.mockResolvedValue([]);
    mocks.listTasks.mockResolvedValue([defaultTaskRecord]);
    mocks.localRuntimeIsAvailable.mockResolvedValue({
      available: true,
      mode: "local-chatgpt-codex",
      reason: "Native bridge ready",
      bridgeSchemaVersion: 3,
    });
    mocks.localRuntimeListCapabilities.mockResolvedValue(["generate", "usage-summary"]);
    mocks.updateTask.mockResolvedValue({ ...defaultTaskRecord, status: "in_review", decision: "updated decision", version: 4 });
    mocks.createTask.mockResolvedValue({ ...defaultTaskRecord, id: "task-follow-up", issueId: "ARCH-101", taskNumber: 101, parentTaskId: "task-1" });
    mocks.saveAssistantActionAudit.mockResolvedValue({
      id: "audit-1",
      action: "task_update_applied",
      projectId: "project-1",
      sourceTaskId: "task-1",
      targetTaskId: "task-1",
      createdTaskId: null,
      assistantRecordId: "record-1",
      summary: null,
      statusFrom: "new",
      statusTo: "in_review",
      decisionMarker: "[Assistant approved summary record-1]",
      createdBy: "user-1",
      createdAt: "2026-06-24T00:00:00.000Z",
    });
    mocks.runtimeGenerateAnswer.mockResolvedValue({
        answer: "검토 답변입니다.",
        draftSummary: {
          conclusion: "검토 요약입니다.",
          tags: ["assistant"],
          scope: "ARCH-100",
          followUpAction: "도면 기준을 추가 확인한다.",
        },
      });
    mocks.createAssistantRuntime.mockResolvedValue({
      generateAnswer: mocks.runtimeGenerateAnswer,
      isAvailable: vi.fn(async () => ({
        available: true,
        mode: "mock",
        reason: "Development mock runtime",
      })),
      listCapabilities: vi.fn(async () => ["confidence-explanation"]),
    });
    mocks.retrieveEvidence.mockResolvedValue({
      taskContext: {
        taskId: "task-1",
        projectId: "project-1",
        title: "피난 계단 검토",
        description: "피난 계단 폭 검토",
        status: "in_review",
        issueId: "ARCH-100",
        projectName: "Architect Start",
      },
      evidence: [
        {
          id: "knowledge-1",
          kind: "central_knowledge",
          priority: 1,
          title: "Approved WIKI guidance",
          excerpt: "중앙 지식 근거입니다.",
        },
        {
          id: "project-doc-1",
          kind: "project_document",
          priority: 2,
          title: "피난 계획서",
          excerpt: "프로젝트 문서 근거입니다.",
          sourceUrl: "https://example.com/project-doc",
        },
      ],
      unavailableEvidenceKinds: [],
      legalEvidence: [],
      projectContextChunks: [
        {
          chunkId: "chunk-1",
          sourceDocumentTitle: "피난 계획서",
          normalizedText: "프로젝트 문서 근거입니다.",
          sourceQuote: "프로젝트 문서 근거입니다.",
        },
      ],
      projectContextTrace: {
        corpusType: "project_context",
        status: "chunks_found",
        fallbackMode: "none",
        matchedChunkIds: ["chunk-1"],
        includedChunkIds: ["chunk-1"],
      },
      evidenceReadinessWarnings: [{ code: "PROJECT_CONTEXT_INCLUDED", message: "Project document evidence included." }],
    });
    mocks.runTaskReview.mockResolvedValue({
      status: "generated",
      reason: "generated",
      taskContext: {
        taskId: "task-1",
        projectId: "project-1",
        title: "피난 계단 검토",
        description: "피난 계단 폭 검토",
        status: "in_review",
        issueId: "ARCH-100",
        projectName: "Architect Start",
      },
      retrievedEvidence: {
        count: 1,
        regulationCount: 0,
        unavailableEvidenceKinds: [],
      },
      officialLawVerification: {
        status: "not_required",
        checkedAt: "2026-06-24T00:00:00.000Z",
        failures: [],
        retry: [],
      },
      evidence: [
        {
          id: "saas-evidence-1",
          kind: "central_knowledge",
          priority: 1,
          title: "SaaS API evidence",
          excerpt: "서버 검토 근거입니다.",
        },
      ],
      evidenceReadiness: [],
      generated: {
        answer: "SaaS API 검토 답변입니다.",
        suggestedDraftSummary: {
          conclusion: "SaaS API 요약입니다.",
          tags: ["assistant", "saas-api"],
          scope: "ARCH-100",
        },
        citations: [],
        usage: {
          inputTokens: 10,
          outputTokens: 5,
          estimatedCostCents: 1,
        },
        executionMode: "saas-api",
        provider: {
          provider: "mock",
          model: "mock-model",
          callMode: "mock",
          requestId: null,
        },
      },
      savedRecord: null,
    });
    mocks.saveReviewSession.mockResolvedValue({
      id: "record-1",
      taskId: "task-1",
      title: "검토해줘",
      question: "검토해줘",
      answerPreview: "검토 답변입니다.",
      verdict: null,
      conclusionMayChange: false,
      savedAt: "2026-06-24T00:00:00.000Z",
      updatedAt: "2026-06-24T00:00:00.000Z",
      savedRecord: {
        id: "record-1",
        confidenceScore: 76,
        confidenceReason: "Central knowledge matched, but regulation evidence is still missing.",
      },
    });
    mocks.saveWorkSummaryDraft.mockResolvedValue({ id: "summary-1", status: "approved" });

    runtimeMessageListeners = [];
    stubChromeRuntime();
  });

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root?.unmount();
      });
    }
    root = null;
    rootElement = null;
    runtimeMessageListeners = [];
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("shows the saved confidence score and reason after saving a generated review record", async () => {
    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);

    await act(async () => {
      const textarea = rootElement?.querySelector("textarea");
      if (!textarea) {
        throw new Error("Composer textarea was not rendered");
      }
      setTextareaValue(textarea, "검토해줘");
    });
    await waitFor(() => getButton("근거 조회 + 의견 생성").disabled === false);

    await act(async () => {
      getButton("근거 조회 + 의견 생성").click();
    });
    await waitFor(() => rootElement?.textContent?.includes("검토 답변입니다.") === true);
    expect(rootElement?.textContent).toContain("Approved WIKI guidance");
    expect(rootElement?.textContent).toContain("피난 계획서");
    expect(rootElement?.textContent).toContain("출처 열기");
    expect(rootElement?.textContent).not.toContain("중앙 지식 근거입니다.");
    expect(mocks.runtimeGenerateAnswer).toHaveBeenCalledWith(expect.objectContaining({
      projectContextChunks: expect.arrayContaining([expect.objectContaining({ chunkId: "chunk-1" })]),
      projectContextTrace: expect.objectContaining({ status: "chunks_found" }),
      evidenceReadinessWarnings: expect.arrayContaining([expect.objectContaining({ code: "PROJECT_CONTEXT_INCLUDED" })]),
    }));
    await act(async () => {
      getButton("고급 모드").click();
    });
    expect(rootElement?.textContent).toContain("파일 근거");
    expect(rootElement?.textContent).toContain("피난 계획서");
    expect(mocks.saveReviewSession).not.toHaveBeenCalled();

    await act(async () => {
      getButton("검토기록저장").click();
    });
    await waitFor(() => rootElement?.textContent?.includes("신뢰도 76%") === true);

    expect(rootElement?.textContent).toContain("신뢰도 76%");
    expect(rootElement?.textContent).toContain("Central knowledge matched, but regulation evidence is still missing.");
    expect(getButton("작업 기록 승인").disabled).toBe(true);
    expect(getButton("보류 저장").disabled).toBe(false);

    await act(async () => {
      getSummaryApprovalCheckbox().click();
    });

    expect(getButton("작업 기록 승인").disabled).toBe(false);

    await act(async () => {
      getButton("작업 기록 승인").click();
    });
    await waitFor(() => rootElement?.textContent?.includes("작업 기록에 승인 요약 반영") === true);

    await act(async () => {
      getButton("선택 반영").click();
    });
    expect(mocks.updateTask).toHaveBeenCalledWith("task-1", expect.objectContaining({
      version: 3,
      status: "in_review",
    }));
    expect(mocks.saveAssistantActionAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "task_update_applied",
      sourceTaskId: "task-1",
      targetTaskId: "task-1",
      assistantRecordId: "record-1",
    }));

    await act(async () => {
      getButton("후속 작업 생성").click();
    });
    expect(mocks.createTask).toHaveBeenCalledWith(expect.objectContaining({
      parentTaskId: "task-1",
      issueTitle: expect.stringContaining("Follow-up:"),
    }));
  });

  it("uses the SaaS launch context question when opened from /daily", async () => {
    const sendMessage = vi.fn(async (message: { type?: string }) => {
      if (message.type === "architect:get-side-panel-launch-context") {
        return {
          ok: true,
          data: {
            taskId: "task-1",
            projectId: "project-1",
            title: "피난 계단 검토",
            url: "http://localhost:3000/daily",
            question: "SaaS 패널에서 작성한 질문",
          },
        };
      }

      if (message.type === "architect:get-task-context") {
        return {
          ok: true,
          data: {
            taskId: "task-1",
            projectId: "project-1",
            title: "피난 계단 검토",
            url: "http://localhost:3000/daily?taskId=task-1",
          },
        };
      }

      return { ok: false, error: "Unexpected message" };
    });
    stubChromeRuntime(sendMessage);

    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);

    expect(rootElement?.querySelector("textarea")?.value).toBe("SaaS 패널에서 작성한 질문");
  });

  it("applies a different-task broadcast and clears stale evidence and output", async () => {
    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);

    await act(async () => {
      setTextareaValue(getComposerTextarea(), "기존 질문");
    });
    await waitFor(() => getButton("근거 조회 + 의견 생성").disabled === false);

    await act(async () => {
      getButton("근거 조회 + 의견 생성").click();
    });
    await waitFor(() => rootElement?.textContent?.includes("검토 답변입니다.") === true);

    await emitBroadcast(
      buildBroadcast({
        taskId: "task-2",
        projectId: "project-2",
        displayId: "ARCH-200",
        title: "창호 결로 검토",
        status: "todo",
        question: "새 작업 질문",
        url: "http://localhost:3000/daily?taskId=task-2",
      }),
    );

    expect(rootElement?.textContent).toContain("창호 결로 검토");
    expect(rootElement?.textContent).toContain("ARCH-200");
    expect(getComposerTextarea().value).toBe("새 작업 질문");
    expect(rootElement?.textContent).not.toContain("Approved WIKI guidance");
    expect(rootElement?.textContent).not.toContain("검토 답변입니다.");
  });

  it("keeps a manually edited same-task question when a broadcast arrives", async () => {
    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);

    await act(async () => {
      setTextareaValue(getComposerTextarea(), "사용자가 고친 질문");
    });

    await emitBroadcast(
      buildBroadcast({
        taskId: "task-1",
        projectId: "project-1",
        displayId: "ARCH-101",
        title: "피난 계단 검토 업데이트",
        status: "in_progress",
        question: "SaaS에서 바뀐 질문",
      }),
    );

    expect(rootElement?.textContent).toContain("피난 계단 검토 업데이트");
    expect(rootElement?.textContent).toContain("작업 정보가 갱신되었습니다. 작성 중인 질문은 유지했습니다.");
    expect(getComposerTextarea().value).toBe("사용자가 고친 질문");
  });

  it("updates a clean same-task question from normalized broadcasts and ignores raw question text dropped by normalization", async () => {
    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);

    const rawQuestion = `  SaaS\0 normalized question ${"x".repeat(2200)}  `;
    const normalizedQuestion = rawQuestion.replaceAll("\0", "").trim().slice(0, 2000);

    await emitBroadcast(
      buildBroadcast({
        taskId: "task-1",
        projectId: "project-1",
        title: "피난 계단 검토",
        question: rawQuestion,
      }),
    );

    expect(getComposerTextarea().value).toBe(normalizedQuestion);

    await emitBroadcast(
      buildBroadcast({
        taskId: "task-1",
        projectId: "project-1",
        title: "피난 계단 검토",
        question: " \0 ",
      }),
    );

    expect(getComposerTextarea().value).toBe(normalizedQuestion);
  });

  it("clears a clean same-task question when normalized broadcast context carries an explicit empty string", async () => {
    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);

    await emitBroadcast(
      buildBroadcast({
        taskId: "task-1",
        projectId: "project-1",
        title: "피난 계단 검토",
        question: "SaaS에서 동기화된 질문",
      }),
    );
    expect(getComposerTextarea().value).toBe("SaaS에서 동기화된 질문");

    await emitBroadcast(
      buildNormalizedBroadcast({
        taskId: "task-1",
        projectId: "project-1",
        title: "피난 계단 검토",
        question: "",
      }),
    );

    expect(getComposerTextarea().value).toBe("");
  });

  it("syncs the basic or advanced panel mode from SaaS broadcasts", async () => {
    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);

    expect(rootElement?.textContent).not.toContain("기본 검토지침");

    await emitBroadcast(
      buildBroadcast({
        taskId: "task-1",
        projectId: "project-1",
        title: "피난 계단 검토",
        question: "SaaS 고급 질문",
        assistantMode: "advanced",
      }),
    );

    expect(rootElement?.textContent).toContain("기본 검토지침");
    expect(getButton("고급 모드").getAttribute("aria-pressed")).toBe("true");
    expect(mocks.writeSafeSetting).toHaveBeenCalledWith("assistantPanelMode", "advanced");
  });

  it("hydrates and persists the assistant display mode preference", async () => {
    mocks.readSafeSetting.mockImplementation(async (key: string, fallback: unknown) =>
      key === "assistantPanelMode" ? "advanced" : fallback,
    );

    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("기본 검토지침") === true);
    expect(getButton("고급 모드").getAttribute("aria-pressed")).toBe("true");

    await act(async () => {
      getButton("기본 모드").click();
    });
    expect(mocks.writeSafeSetting).toHaveBeenCalledWith("assistantPanelMode", "basic");
  });

  it("shows recent review history and existing external evidence in advanced mode", async () => {
    mocks.listReviewSessions.mockResolvedValue([
      {
        id: "session-1",
        taskId: "task-1",
        title: "저장된 검토 기록",
        question: "이전 질문",
        answerPreview: "이전 검토 답변 미리보기",
        verdict: "조건부",
        conclusionMayChange: true,
        savedAt: "2026-06-24T00:00:00.000Z",
        updatedAt: "2026-06-24T00:00:00.000Z",
        savedRecord: {
          id: "record-history-1",
          confidenceScore: 88,
          confidenceReason: "기록 신뢰도",
        },
      },
    ]);
    mocks.listExternalEvidence.mockResolvedValue([
      {
        id: "external-1",
        projectId: "project-1",
        taskId: "task-1",
        sourceType: "web_page",
        title: "제조사 시방서",
        excerpt: "외부 근거 요약",
        sourceUrl: "https://example.com/spec",
        permissionState: "user_approved",
        capturedAt: "2026-06-24T00:00:00.000Z",
        createdBy: "user-1",
        createdAt: "2026-06-24T00:00:00.000Z",
        updatedAt: "2026-06-24T00:00:00.000Z",
      },
    ]);

    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);

    await act(async () => {
      getButton("고급 모드").click();
    });
    await waitFor(() => rootElement?.textContent?.includes("보기 1") === true);

    await act(async () => {
      getButton("보기 1").click();
    });
    expect(rootElement?.textContent).toContain("저장된 검토 기록");

    await act(async () => {
      getButton("상세 열기").click();
    });
    await waitFor(() => rootElement?.textContent?.includes("이전 검토 답변 전문") === true);
    expect(mocks.getReviewSession).toHaveBeenCalledWith("session-1");
    expect(rootElement?.textContent).toContain("저장 1");
    expect(rootElement?.textContent).toContain("최신 1");

    await act(async () => {
      getButton("추가 1").click();
    });
    expect(rootElement?.textContent).toContain("제조사 시방서");
  });

  it("checks local Codex diagnostics from advanced mode", async () => {
    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);

    await act(async () => {
      getButton("고급 모드").click();
    });

    expect(rootElement?.textContent).toContain("로컬 Codex 로그인");
    expect(rootElement?.textContent).toContain("실행 모드 Local Codex");
    expect(rootElement?.textContent).toContain("runtime 미확인");

    await act(async () => {
      getButton("상태 확인").click();
    });

    await waitFor(() => rootElement?.textContent?.includes("Native bridge ready") === true);
    expect(mocks.localRuntimeIsAvailable).toHaveBeenCalled();
    expect(mocks.localRuntimeListCapabilities).toHaveBeenCalled();
    expect(rootElement?.textContent).toContain("runtime 연결됨");
    expect(rootElement?.textContent).toContain("capability 2");
  });

  it("runs review generation through the SaaS API execution mode", async () => {
    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);

    await act(async () => {
      getButton("고급 모드").click();
    });
    await act(async () => {
      const select = rootElement?.querySelector(".mode-select select");
      if (!select) {
        throw new Error("Runtime mode select was not rendered");
      }
      setSelectValue(select as HTMLSelectElement, "saas-api");
    });
    await act(async () => {
      setTextareaValue(getComposerTextarea(), "SaaS API로 검토해줘");
    });
    await waitFor(() => getButton("근거 조회 + 의견 생성").disabled === false);

    await act(async () => {
      getButton("근거 조회 + 의견 생성").click();
    });
    await waitFor(() => rootElement?.textContent?.includes("SaaS API 검토 답변입니다.") === true);

    expect(mocks.runTaskReview).toHaveBeenCalledWith(expect.objectContaining({
      taskId: "task-1",
      question: "SaaS API로 검토해줘",
      mode: "generate",
      instruction: expect.stringContaining("Task Assistant default review instruction v1"),
    }));
    expect(mocks.retrieveEvidence).not.toHaveBeenCalled();
  });

  it("continues mock review generation with fallback evidence when SaaS retrieval is blocked", async () => {
    mocks.retrieveEvidence.mockRejectedValueOnce(new Error("Cross-site requests are not allowed."));

    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);

    await act(async () => {
      getButton("고급 모드").click();
    });
    await act(async () => {
      const select = rootElement?.querySelector(".mode-select select");
      if (!select) {
        throw new Error("Runtime mode select was not rendered");
      }
      setSelectValue(select as HTMLSelectElement, "mock");
    });
    await act(async () => {
      setTextareaValue(getComposerTextarea(), "Mock으로 검토해줘");
    });
    await waitFor(() => getButton("근거 조회 + 의견 생성").disabled === false);

    await act(async () => {
      getButton("근거 조회 + 의견 생성").click();
    });

    await waitFor(() => rootElement?.textContent?.includes("임시 검토 근거") === true);
    expect(rootElement?.textContent).toContain("임시 근거로 검토 의견 생성을 계속합니다.");
    expect(rootElement?.textContent).toContain("임시 근거로 생성한 검토안입니다.");
    expect(getButton("검토기록저장").disabled).toBe(true);
    expect(mocks.runtimeGenerateAnswer).toHaveBeenCalledWith(expect.objectContaining({
      evidence: expect.arrayContaining([expect.objectContaining({ id: "mock-fallback:task-1" })]),
      evidenceReadinessWarnings: expect.arrayContaining([expect.objectContaining({ code: "MOCK_FALLBACK_EVIDENCE" })]),
    }));
    expect(mocks.saveReviewSession).not.toHaveBeenCalled();
  });

  it("clears stale external evidence draft and approval on task switch", async () => {
    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);

    await act(async () => {
      getButton("고급 모드").click();
    });

    await act(async () => {
      getButton("추가 0").click();
    });

    await act(async () => {
      getExternalApprovalCheckbox().click();
    });

    await act(async () => {
      setInputValue(getExternalTextInputs()[0], "Task A external source");
      setTextareaValue(getExternalTextarea(), "Task A excerpt");
    });
    expect(getButton("근거 저장").disabled).toBe(false);

    await emitBroadcast(
      buildBroadcast({
        taskId: "task-2",
        projectId: "project-2",
        displayId: "ARCH-200",
        title: "창호 결로 검토",
        question: "새 작업 질문",
      }),
    );

    expect(rootElement?.textContent).toContain("작업이 변경되어 외부 근거 초안을 비웠습니다.");
    expect(queryButton("근거 저장")).toBeNull();

    await act(async () => {
      getButton("추가 0").click();
    });

    const textInputs = getExternalTextInputs();
    expect(getExternalApprovalCheckbox().checked).toBe(false);
    expect(textInputs[0].value).toBe("");
    expect(textInputs[1].value).toBe("");
    expect(textInputs[2].value).toBe("Architect Browser Assistant");
    expect(getExternalTextarea().value).toBe("");
    expect(getButton("근거 저장").disabled).toBe(true);
    expect(mocks.saveExternalEvidence).not.toHaveBeenCalled();
  });

  it("keeps manual refresh working when no broadcast is received", async () => {
    let launchContext: Record<string, string> | null = null;
    let detectedTask = { ...defaultTaskContext };
    const sendMessage = vi.fn(async (message: { type?: string }) => {
      if (message.type === "architect:get-side-panel-launch-context") {
        return {
          ok: true,
          data: launchContext,
        };
      }

      if (message.type === "architect:get-task-context") {
        return {
          ok: true,
          data: detectedTask,
        };
      }

      return { ok: false, error: "Unexpected message" };
    });
    stubChromeRuntime(sendMessage);

    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("피난 계단 검토") === true);

    launchContext = {
      taskId: "task-refresh",
      projectId: "project-refresh",
      title: "수동 새로고침 작업",
      url: "http://localhost:3000/daily?taskId=task-refresh",
      question: "수동 새로고침 질문",
    };
    detectedTask = {
      taskId: "task-refresh",
      projectId: "project-refresh",
      title: "수동 새로고침 작업",
      url: "http://localhost:3000/daily?taskId=task-refresh",
    };

    await act(async () => {
      getButton("새로고침").click();
    });
    await waitFor(() => getComposerTextarea().value === "수동 새로고침 질문");

    expect(rootElement?.textContent).toContain("수동 새로고침 작업");
    expect(runtimeMessageListeners).toHaveLength(1);
  });

  function getButton(label: string) {
    const button = queryButton(label);
    if (!button) {
      throw new Error(`Button not found: ${label}`);
    }
    return button as HTMLButtonElement;
  }

  function queryButton(label: string) {
    return Array.from(rootElement?.querySelectorAll("button") ?? []).find(
      (element) => element.textContent?.trim() === label,
    ) as HTMLButtonElement | undefined ?? null;
  }

  function getComposerTextarea() {
    const textarea = rootElement?.querySelector(".composer textarea");
    if (!textarea) {
      throw new Error("Composer textarea was not rendered");
    }
    return textarea as HTMLTextAreaElement;
  }

  function getExternalApprovalCheckbox() {
    const checkbox = rootElement?.querySelector(".external-evidence-block input[type='checkbox']");
    if (!checkbox) {
      throw new Error("External approval checkbox was not rendered");
    }
    return checkbox as HTMLInputElement;
  }

  function getSummaryApprovalCheckbox() {
    const checkbox = rootElement?.querySelector(".summary-editor input[type='checkbox']");
    if (!checkbox) {
      throw new Error("Summary approval checkbox was not rendered");
    }
    return checkbox as HTMLInputElement;
  }

  function getExternalTextInputs() {
    const inputs = Array.from(
      rootElement?.querySelectorAll(".external-evidence-block input:not([type='checkbox'])") ?? [],
    ) as HTMLInputElement[];
    if (inputs.length !== 3) {
      throw new Error(`Expected 3 external evidence text inputs, found ${inputs.length}`);
    }
    return inputs;
  }

  function getExternalTextarea() {
    const textarea = rootElement?.querySelector(".external-evidence-block textarea");
    if (!textarea) {
      throw new Error("External evidence textarea was not rendered");
    }
    return textarea as HTMLTextAreaElement;
  }
});

function stubChromeRuntime(
  sendMessage: ReturnType<typeof vi.fn> = vi.fn(async (message: { type?: string }) => {
    if (message.type === "architect:get-side-panel-launch-context") {
      return {
        ok: true,
        data: null,
      };
    }

    if (message.type === "architect:get-task-context") {
      return {
        ok: true,
        data: defaultTaskContext,
      };
    }

    return { ok: false, error: "Unexpected message" };
  }),
) {
  vi.stubGlobal("chrome", {
    runtime: {
      sendMessage,
      onMessage: {
        addListener: vi.fn((listener: RuntimeMessageListener) => {
          runtimeMessageListeners.push(listener);
        }),
        removeListener: vi.fn((listener: RuntimeMessageListener) => {
          runtimeMessageListeners = runtimeMessageListeners.filter((item) => item !== listener);
        }),
      },
    },
  });
}

async function emitBroadcast(message: unknown) {
  await act(async () => {
    for (const listener of runtimeMessageListeners) {
      listener(message);
    }
  });
}

function buildBroadcast(input: {
  taskId: string;
  projectId?: string;
  displayId?: string;
  title?: string;
  status?: string;
  question: string;
  url?: string;
  assistantMode?: "basic" | "advanced";
}) {
  return {
    type: SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE,
    context: {
      task: {
        taskId: input.taskId,
        projectId: input.projectId,
        displayId: input.displayId,
        title: input.title,
        status: input.status,
      },
      review: {
        question: input.question,
        ...(input.assistantMode ? { assistantMode: input.assistantMode } : {}),
      },
      page: {
        url: input.url ?? `http://localhost:3000/daily?taskId=${input.taskId}`,
        route: "/daily",
      },
      reason: "selection-change",
      selectedAt: "2026-06-23T01:02:03.000Z",
      source: "architect-saas-daily",
    },
  };
}

function buildNormalizedBroadcast(input: {
  taskId: string;
  projectId?: string;
  displayId?: string;
  title?: string;
  status?: string;
  question: string;
  url?: string;
}): NormalizedBroadcastTestMessage {
  return {
    __normalizedForAppTest: true,
    context: {
      task: {
        taskId: input.taskId,
        ...(input.projectId ? { projectId: input.projectId } : {}),
        ...(input.displayId ? { displayId: input.displayId } : {}),
        ...(input.title ? { title: input.title } : {}),
        ...(input.status ? { status: input.status } : {}),
      },
      review: {
        question: input.question,
      },
      page: {
        url: input.url ?? `http://localhost:3000/daily?taskId=${input.taskId}`,
        route: "/daily",
      },
      reason: "selection-change",
      selectedAt: "2026-06-23T01:02:03.000Z",
      source: "architect-saas-daily",
    },
  };
}

function setTextareaValue(textarea: HTMLTextAreaElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
  valueSetter?.call(textarea, value);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function setInputValue(input: HTMLInputElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  valueSetter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function setSelectValue(select: HTMLSelectElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set;
  valueSetter?.call(select, value);
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

async function waitFor(assertion: () => boolean, message = "Timed out waiting for condition") {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (assertion()) {
      return;
    }
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }

  throw new Error(message);
}
