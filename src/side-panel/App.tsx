import { useEffect, useMemo, useRef, useState } from "react";
import {
  OFFICIAL_LAW_API_DOCS_URL,
  OFFICIAL_LAW_PROVIDER_NAME,
  officialLawSourceToEvidence,
  verifyOfficialLawEvidence,
  type OfficialLawVerificationReport,
} from "../legal/official-law-api";
import { appendVerificationRecordToAnswer, buildTaskResultVerification } from "../legal/task-result-verification";
import { LocalRuntimeClient } from "../runtime/local-runtime-client";
import { createAssistantRuntime } from "../runtime/runtime-factory";
import type { AssistantRuntimeStatus, AssistantRuntimeOutput } from "../runtime/ArchitectLocalAssistantRuntime";
import {
  normalizeSidePanelContextBroadcastMessage,
  type SidePanelContextSnapshot,
  type SidePanelLaunchContext,
} from "../runtime/side-panel-contract";
import {
  createTask,
  getReviewSession,
  listExternalEvidence,
  listReviewSessions,
  listTasks,
  retrieveEvidence,
  runTaskReview,
  saveAssistantActionAudit,
  saveExternalEvidence,
  saveReviewSession,
  saveWorkSummaryDraft,
  updateTask,
} from "../saas/client";
import type {
  AssistantEvidence,
  AssistantEvidenceKind,
  AssistantActionAuditSummary,
  AssistantReviewSessionDetail,
  AssistantReviewSessionItem,
  AssistantTaskContext,
  DraftSummary,
  ExternalEvidenceRecord,
  ExternalEvidenceSourceType,
  RetrieveResponse,
  TaskRecord,
  TaskResultVerification,
} from "../saas/contracts";
import { readSafeSetting, writeSafeSetting } from "../storage/safe-storage";

type DetectedTaskContext = {
  taskId: string;
  projectId?: string;
  displayId?: string;
  title?: string;
  status?: string;
  url: string;
  route?: string;
  selectedAt?: string;
  sourceTabId?: number;
};

type PanelState =
  | { state: "idle" }
  | { state: "loading"; label: string }
  | { state: "ready"; task: DetectedTaskContext }
  | { state: "error"; message: string };

type ActiveTabSource = {
  title: string;
  url: string;
  capturedAt: string;
};

type RuntimeMode = "mock" | "local-chatgpt-codex" | "saas-api";
type AssistantPanelMode = "basic" | "advanced";
type SummarySaveState = "approved" | "deferred";

type SavedRecordConfidence = {
  score: number;
  reason: string;
};

type LocalCodexDiagnostics = {
  checkedAt: string;
  status: AssistantRuntimeStatus;
  capabilities: string[];
};

type LoadedEvidence = {
  taskContext: AssistantTaskContext;
  evidence: AssistantEvidence[];
  officialLawReport: OfficialLawVerificationReport;
  legalEvidence?: AssistantEvidence[];
  projectContextChunks?: NonNullable<RetrieveResponse["projectContextChunks"]>;
  projectContextTrace?: RetrieveResponse["projectContextTrace"];
  evidenceReadinessWarnings?: NonNullable<RetrieveResponse["evidenceReadinessWarnings"]>;
};

type TaskUpdateProposal = {
  nextStatus: string;
  statusChanged: boolean;
  alreadyRecorded: boolean;
  decisionAppend: string;
  nextDecision: string;
};

type FollowUpTaskProposal = {
  issueTitle: string;
  issueDetailNote: string;
  requestBody: Partial<TaskRecord> & {
    issueTitle: string;
    issueDetailNote: string;
    status: string;
    decision: string;
    parentTaskId: string;
  };
};

type IncomingQuestion = { hasQuestion: true; value: string } | { hasQuestion: false };
const defaultExternalSourceType: ExternalEvidenceSourceType = "web_page";
const defaultExternalToolName = "Architect Browser Assistant";

const externalSourceOptions: Array<{ value: ExternalEvidenceSourceType; label: string }> = [
  { value: "web_page", label: "Web page" },
  { value: "skill_output", label: "Skill output" },
  { value: "external_document", label: "External document" },
  { value: "manufacturer_doc", label: "Manufacturer doc" },
  { value: "public_standard", label: "Public standard" },
];

const TASK_ASSISTANT_DEFAULT_REVIEW_INSTRUCTION_VERSION = 1;
const TASK_ASSISTANT_DEFAULT_REVIEW_INSTRUCTION = [
  `Task Assistant default review instruction v${TASK_ASSISTANT_DEFAULT_REVIEW_INSTRUCTION_VERSION}`,
  "결론은 공식 법령, 내부 approved WIKI, 기존 검토기록/관련 task, 프로젝트 문서 근거를 한 답변 안에서 통합해 작성한다.",
  "근거와 출처 섹션은 official law, WIKI, prior records/task, project documents, external evidence를 구분해 표시한다.",
  "공식 법령은 applicability.officialVerified를 확정 근거로 다루고, applicability.candidates는 관련 후보 또는 추가 확인 대상으로 분리한다.",
  "관련 candidate가 high-risk 개념을 포함하고 누락 사실 때문에 결론이 바뀔 수 있으면 최종 verdict는 반드시 추가확인필요로 둔다.",
  "검토 결과 저장, WIKI 후보 생성, 승인 처리는 사용자가 검토기록저장을 명시적으로 실행하기 전에는 수행하지 않는다.",
].join("\n");

function HelpHint({ text }: { text: string }) {
  return (
    <details className="help-popover">
      <summary aria-label="도움말">?</summary>
      <p>{text}</p>
    </details>
  );
}

export function App() {
  const [panelState, setPanelState] = useState<PanelState>({ state: "idle" });
  const [assistantPanelMode, setAssistantPanelMode] = useState<AssistantPanelMode>("basic");
  const [runtimeMode, setRuntimeMode] = useState<RuntimeMode>("mock");
  const [runtimeStatus, setRuntimeStatus] = useState<AssistantRuntimeStatus | null>(null);
  const [question, setQuestion] = useState("");
  const [taskContext, setTaskContext] = useState<AssistantTaskContext | null>(null);
  const [evidence, setEvidence] = useState<AssistantEvidence[]>([]);
  const [output, setOutput] = useState<AssistantRuntimeOutput | null>(null);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [savedConfidence, setSavedConfidence] = useState<SavedRecordConfidence | null>(null);
  const [legalSourceVerification, setLegalSourceVerification] = useState<OfficialLawVerificationReport | null>(null);
  const [taskResultVerification, setTaskResultVerification] = useState<TaskResultVerification | null>(null);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [summaryStatus, setSummaryStatus] = useState<string>("");
  const [reviewWarning, setReviewWarning] = useState("");
  const [mockFallbackReview, setMockFallbackReview] = useState(false);
  const [summarySaveState, setSummarySaveState] = useState<SummarySaveState | null>(null);
  const [summarySavePending, setSummarySavePending] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState<DraftSummary | null>(null);
  const [summaryTagsInput, setSummaryTagsInput] = useState("");
  const [summaryAcknowledged, setSummaryAcknowledged] = useState(false);
  const [taskRecord, setTaskRecord] = useState<TaskRecord | null>(null);
  const [proposalStatus, setProposalStatus] = useState("");
  const [taskUpdateApplied, setTaskUpdateApplied] = useState(false);
  const [followUpTaskCreated, setFollowUpTaskCreated] = useState(false);
  const [taskUpdatePending, setTaskUpdatePending] = useState(false);
  const [followUpTaskPending, setFollowUpTaskPending] = useState(false);
  const [unavailableEvidenceKinds, setUnavailableEvidenceKinds] = useState<AssistantEvidenceKind[]>([]);
  const [contextSyncStatus, setContextSyncStatus] = useState("");
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [reviewHistory, setReviewHistory] = useState<AssistantReviewSessionItem[]>([]);
  const [selectedReviewSession, setSelectedReviewSession] = useState<AssistantReviewSessionDetail | null>(null);
  const [reviewHistoryLoading, setReviewHistoryLoading] = useState(false);
  const [localCodexDiagnostics, setLocalCodexDiagnostics] = useState<LocalCodexDiagnostics | null>(null);
  const [localCodexDiagnosticsLoading, setLocalCodexDiagnosticsLoading] = useState(false);
  const [externalExpanded, setExternalExpanded] = useState(false);
  const [externalEvidenceRecords, setExternalEvidenceRecords] = useState<ExternalEvidenceRecord[]>([]);
  const [externalEvidenceLoading, setExternalEvidenceLoading] = useState(false);
  const [externalAllowed, setExternalAllowed] = useState(false);
  const [externalSourceType, setExternalSourceType] = useState<ExternalEvidenceSourceType>(defaultExternalSourceType);
  const [externalTitle, setExternalTitle] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [externalToolName, setExternalToolName] = useState(defaultExternalToolName);
  const [externalExcerpt, setExternalExcerpt] = useState("");
  const [externalStatus, setExternalStatus] = useState("");
  const selectedTaskIdRef = useRef("");
  const questionDirtyRef = useRef(false);

  useEffect(() => {
    void hydratePanelPreferences();
    void refreshTaskContext();
    void refreshRuntimeStatus();
    // The side panel should hydrate once on mount; later task changes arrive through broadcasts or manual refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const runtimeOnMessage = typeof chrome === "undefined" ? undefined : chrome.runtime?.onMessage;
    if (!runtimeOnMessage?.addListener || !runtimeOnMessage?.removeListener) {
      return;
    }

    const listener = (message: unknown) => {
      const normalized = normalizeSidePanelContextBroadcastMessage(message);
      if (!normalized) {
        return;
      }

      applyBroadcastContext(normalized.context);
    };

    runtimeOnMessage.addListener(listener);
    return () => {
      runtimeOnMessage.removeListener(listener);
    };
    // Register the runtime listener once; the handler writes through refs and React state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeTaskId = (panelState.state === "ready" ? panelState.task.taskId : "") || taskContext?.taskId || "";
  const canRunReview = useMemo(
    () => Boolean(panelState.state === "ready" && question.trim() && runtimeStatus?.available),
    [panelState.state, question, runtimeStatus],
  );
  const canSaveReviewRecord = Boolean(taskContext && output && !recordId && !mockFallbackReview);
  const canDeferSummary = Boolean(taskContext && recordId && summaryDraft && !mockFallbackReview && !summarySaveState && !summarySavePending);
  const canApproveSummary = canDeferSummary && summaryAcknowledged;
  const summaryTags = useMemo(() => parseSummaryTags(summaryTagsInput), [summaryTagsInput]);
  const taskUpdateProposal = useMemo(
    () =>
      summarySaveState === "approved" && taskRecord && summaryDraft && recordId
        ? buildTaskUpdateProposal(taskRecord, summaryDraft, summaryTags, recordId)
        : null,
    [recordId, summaryDraft, summarySaveState, summaryTags, taskRecord],
  );
  const followUpTaskProposal = useMemo(
    () =>
      summarySaveState === "approved" && taskRecord && summaryDraft && recordId
        ? buildFollowUpTaskProposal(taskRecord, summaryDraft, summaryTags)
        : null,
    [recordId, summaryDraft, summarySaveState, summaryTags, taskRecord],
  );
  const canApplyTaskUpdate = Boolean(
      taskUpdateProposal &&
      !taskUpdateApplied &&
      !taskUpdatePending &&
      !mockFallbackReview &&
      (!taskUpdateProposal.alreadyRecorded || taskUpdateProposal.statusChanged),
  );
  const canCreateFollowUpTask = Boolean(followUpTaskProposal && !followUpTaskCreated && !followUpTaskPending && !mockFallbackReview);
  const reviewActionHint = useMemo(() => {
    if (!activeTaskId) {
      return "SaaS 화면에서 작업을 선택하면 검토 흐름이 시작됩니다.";
    }
    if (!question.trim()) {
      return "검토 질문을 먼저 입력하세요.";
    }
    if (!runtimeStatus?.available) {
      return "실행 환경을 사용할 수 없습니다. 모드와 Local Codex 설치 상태를 확인하세요.";
    }
    if (!output) {
      return "근거 조회와 의견 생성을 한 번에 실행합니다.";
    }
    if (mockFallbackReview) {
      return "임시 근거로 생성한 검토안입니다. 저장과 승인 전에 확장 연결을 복구하세요.";
    }
    if (!recordId) {
      return "검토 의견을 생성했습니다. 검토기록저장을 눌러 최근 기록에 남기세요.";
    }
    if (!summarySaveState) {
      return summaryAcknowledged
        ? "검토 내용을 확인했습니다. 작업 기록을 승인하거나 보류하세요."
        : "검토내용을 확인하고 승인해주세요.";
    }
    return "검토 흐름이 처리되었습니다.";
  }, [activeTaskId, mockFallbackReview, output, question, recordId, runtimeStatus, summaryAcknowledged, summarySaveState]);
  const canSaveExternalEvidence = Boolean(
    activeTaskId &&
      externalAllowed &&
      externalTitle.trim() &&
      externalExcerpt.trim() &&
      (externalUrl.trim() || externalToolName.trim()),
  );

  useEffect(() => {
    if (!activeTaskId) {
      return;
    }

    let cancelled = false;

    listReviewSessions(activeTaskId)
      .then((items) => {
        if (!cancelled) {
          setReviewHistory(items);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setExternalStatus(error instanceof Error ? error.message : "Review history unavailable");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setReviewHistoryLoading(false);
        }
      });

    listExternalEvidence(activeTaskId)
      .then((items) => {
        if (!cancelled) {
          setExternalEvidenceRecords(items);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setExternalStatus(error instanceof Error ? error.message : "External evidence list unavailable");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setExternalEvidenceLoading(false);
        }
      });

    listTasks()
      .then((items) => {
        if (!cancelled) {
          setTaskRecord(items.find((item) => item.id === activeTaskId) ?? null);
        }
      })
      .catch((error) => {
        if (!cancelled) {
      setProposalStatus(error instanceof Error ? error.message : "작업 기록을 불러올 수 없습니다.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeTaskId]);

  function resetTaskSpecificState() {
    setTaskContext(null);
    setEvidence([]);
    setOutput(null);
    setRecordId(null);
    setSavedConfidence(null);
    setLegalSourceVerification(null);
    setTaskResultVerification(null);
    setVerificationStatus("");
    setSummaryStatus("");
    setReviewWarning("");
    setMockFallbackReview(false);
    setSummarySaveState(null);
    setSummarySavePending(false);
    setSummaryDraft(null);
    setSummaryTagsInput("");
    setSummaryAcknowledged(false);
    setTaskRecord(null);
    setProposalStatus("");
    setTaskUpdateApplied(false);
    setFollowUpTaskCreated(false);
    setTaskUpdatePending(false);
    setFollowUpTaskPending(false);
    setUnavailableEvidenceKinds([]);
    setSelectedReviewSession(null);
  }

  function resetExternalEvidenceState(status: string) {
    setExternalExpanded(false);
    setExternalAllowed(false);
    setExternalSourceType(defaultExternalSourceType);
    setExternalTitle("");
    setExternalUrl("");
    setExternalToolName(defaultExternalToolName);
    setExternalExcerpt("");
    setExternalStatus(status);
  }

  function applyDetectedTaskContext(
    task: DetectedTaskContext,
    incomingQuestion: IncomingQuestion,
    options: { status: string; writeLastTask?: boolean },
  ) {
    const previousTaskId = selectedTaskIdRef.current;
    const isDifferentTask = task.taskId !== previousTaskId;

    selectedTaskIdRef.current = task.taskId;
    setPanelState({ state: "ready", task });
    setContextSyncStatus(options.status);
    if (options.writeLastTask) {
      void writeSafeSetting("lastTaskId", task.taskId);
    }

    if (isDifferentTask) {
      resetTaskSpecificState();
      resetExternalEvidenceState("작업이 변경되어 외부 근거 초안을 비웠습니다.");
      questionDirtyRef.current = false;
      setQuestion(incomingQuestion.hasQuestion ? incomingQuestion.value : "");
      return;
    }

    if (!incomingQuestion.hasQuestion) {
      return;
    }

    if (questionDirtyRef.current) {
      setContextSyncStatus("작업 정보가 갱신되었습니다. 작성 중인 질문은 유지했습니다.");
      return;
    }

    questionDirtyRef.current = false;
    setQuestion(incomingQuestion.value);
  }

  function applyBroadcastContext(context: SidePanelContextSnapshot) {
    if (context.review?.assistantMode) {
      handleAssistantPanelModeChange(context.review.assistantMode);
    }
      applyDetectedTaskContext(snapshotToDetectedTask(context), readContextQuestion(context), {
      status: "작업 정보가 갱신되었습니다.",
      writeLastTask: true,
    });
  }

  async function hydratePanelPreferences() {
    const savedMode = await readSafeSetting<AssistantPanelMode>("assistantPanelMode", "basic");
    setAssistantPanelMode(savedMode === "advanced" ? "advanced" : "basic");
  }

  function handleAssistantPanelModeChange(nextMode: AssistantPanelMode) {
    setAssistantPanelMode(nextMode);
    void writeSafeSetting("assistantPanelMode", nextMode);
  }

  async function refreshTaskContext() {
    setPanelState({ state: "loading", label: "작업 정보" });
    const launchContext = await readSidePanelLaunchContext();
    const currentSourceTabId =
      panelState.state === "ready" && typeof panelState.task.sourceTabId === "number"
        ? panelState.task.sourceTabId
        : typeof launchContext?.sourceTabId === "number"
          ? launchContext.sourceTabId
          : undefined;
    const response = await chrome.runtime.sendMessage({
      type: "architect:get-task-context",
      ...(typeof currentSourceTabId === "number" ? { sourceTabId: currentSourceTabId } : {}),
    });
    if (!response?.ok) {
      if (launchContext) {
        applyDetectedTaskContext(launchContextToDetectedTask(launchContext), readLaunchContextQuestion(launchContext), {
          status: "SaaS 패널에서 보낸 작업을 사용 중입니다.",
          writeLastTask: true,
        });
        setExternalStatus("SaaS 패널에서 보낸 작업을 사용 중입니다.");
        return;
      }

      const lastTaskId = await readSafeSetting("lastTaskId", "" as string);
      if (lastTaskId) {
        applyDetectedTaskContext({
          taskId: lastTaskId,
          title: `마지막 선택 작업 ${lastTaskId.slice(0, 8)}`,
          url: "",
        }, { hasQuestion: false }, {
          status: "마지막 선택 작업을 사용 중입니다. 대상 변경은 SaaS 화면에서 작업을 다시 선택하세요.",
        });
        setExternalStatus("마지막 선택 작업을 사용 중입니다. 대상 변경은 SaaS 화면에서 작업을 다시 선택하세요.");
        return;
      }

      setPanelState({ state: "error", message: response?.error ?? "작업 정보를 확인할 수 없습니다." });
      return;
    }

    const detectedTask = response.data as DetectedTaskContext;
    const task =
      launchContext && launchContext.taskId === detectedTask.taskId
        ? {
            ...detectedTask,
            projectId: launchContext.projectId || detectedTask.projectId,
            title: launchContext.title || detectedTask.title,
            url: launchContext.url || detectedTask.url,
          }
        : detectedTask;
    applyDetectedTaskContext(task, launchContext?.taskId === task.taskId ? readLaunchContextQuestion(launchContext) : { hasQuestion: false }, {
      status: "작업 정보를 다시 확인했습니다.",
      writeLastTask: true,
    });
  }

  async function refreshRuntimeStatus() {
    const mode = await readSafeSetting<RuntimeMode>("runtimeMode", "local-chatgpt-codex");
    setRuntimeMode(mode);
    if (mode === "saas-api") {
      setRuntimeStatus({
        available: true,
        mode: "mock",
        reason: "SaaS API mode uses the server-managed assistant policy.",
      });
      return;
    }
    const runtime = await createAssistantRuntime();
    setRuntimeStatus(await runtime.isAvailable());
  }

  async function checkLocalCodexDiagnostics() {
    setLocalCodexDiagnosticsLoading(true);
    const localRuntime = new LocalRuntimeClient();
    try {
      const [status, capabilities] = await Promise.all([
        localRuntime.isAvailable(),
        localRuntime.listCapabilities().catch(() => []),
      ]);
      setLocalCodexDiagnostics({
        checkedAt: new Date().toISOString(),
        status,
        capabilities,
      });
    } catch (error) {
      setLocalCodexDiagnostics({
        checkedAt: new Date().toISOString(),
        status: {
          available: false,
          mode: "local-chatgpt-codex",
          reason: error instanceof Error ? error.message : "Local Codex status check failed.",
        },
        capabilities: [],
      });
    } finally {
      setLocalCodexDiagnosticsLoading(false);
    }
  }

  async function openReviewSession(session: AssistantReviewSessionItem) {
    setReviewHistoryLoading(true);
    try {
      const detail = await getReviewSession(session.id);
      const selectedTask = panelState.state === "ready" ? panelState.task : null;
      setTaskContext((current) => current ?? {
        taskId: detail.taskId,
        projectId: selectedTask?.projectId || "review-session",
        title: selectedTask?.title || detail.title,
        description: detail.question,
        status: selectedTask?.status || "reviewed",
        issueId: selectedTask?.displayId || detail.taskId,
        projectName: "Architect SaaS",
      });
      setSelectedReviewSession(detail);
      setOutput({
        answer: detail.answer,
        draftSummary: detail.savedRecord.draftSummary ?? undefined,
      });
      setRecordId(detail.savedRecord.id);
      setSavedConfidence({
        score: detail.savedRecord.confidenceScore,
        reason: detail.savedRecord.confidenceReason ?? "저장된 검토 기록입니다.",
      });
      setSummaryDraft(detail.savedRecord.draftSummary ?? null);
      setSummaryTagsInput(detail.savedRecord.draftSummary?.tags.join(", ") ?? "");
      setMockFallbackReview(false);
      setSummaryStatus("저장된 검토 기록을 열었습니다.");
    } catch (error) {
      setSummaryStatus(error instanceof Error ? error.message : "Review session detail unavailable");
    } finally {
      setReviewHistoryLoading(false);
    }
  }

  async function handleRuntimeModeChange(nextMode: RuntimeMode) {
    setRuntimeMode(nextMode);
    setOutput(null);
    setRecordId(null);
    setSavedConfidence(null);
    setLegalSourceVerification(null);
    setTaskResultVerification(null);
    setVerificationStatus("");
    setSummaryStatus("");
    setReviewWarning("");
    setMockFallbackReview(false);
    setSummarySaveState(null);
    setSummarySavePending(false);
    setSummaryDraft(null);
    setSummaryTagsInput("");
    setSummaryAcknowledged(false);
    setUnavailableEvidenceKinds([]);
    await writeSafeSetting("runtimeMode", nextMode);
    await refreshRuntimeStatus();
  }

  function handleQuestionChange(nextQuestion: string) {
    questionDirtyRef.current = true;
    setQuestion(nextQuestion);
  }

  async function loadEvidenceForCurrentTask(): Promise<LoadedEvidence | null> {
    if (panelState.state !== "ready") {
      return null;
    }

    const selectedTask = panelState.task;
    setPanelState({ state: "loading", label: "근거" });
    try {
      const result = await retrieveEvidence({ taskId: selectedTask.taskId, question });
      setTaskContext(result.taskContext);
      setOutput(null);
      setRecordId(null);
      setSavedConfidence(null);
      setTaskResultVerification(null);
      setMockFallbackReview(false);
      setReviewWarning("");
      setSummarySaveState(null);
      setSummarySavePending(false);
      setSummaryStatus("");
      setUnavailableEvidenceKinds(result.unavailableEvidenceKinds);

      setVerificationStatus("Checking official law sources...");
      const officialLawReport = await verifyOfficialLawEvidence({
        question,
        evidence: result.evidence,
      });
      const officialEvidence = officialLawReport.sources
        .map(officialLawSourceToEvidence)
        .filter((item): item is AssistantEvidence => Boolean(item));
      setLegalSourceVerification(officialLawReport);
      setVerificationStatus(formatOfficialLawVerificationStatus(officialLawReport));
      const nextEvidence = [...officialEvidence, ...result.evidence];
      setEvidence(nextEvidence);
      setPanelState({ state: "ready", task: selectedTask });
      return {
        taskContext: result.taskContext,
        evidence: nextEvidence,
        officialLawReport,
        legalEvidence: [...officialEvidence, ...(result.legalEvidence ?? [])],
        projectContextChunks: result.projectContextChunks,
        projectContextTrace: result.projectContextTrace,
        evidenceReadinessWarnings: result.evidenceReadinessWarnings,
      };
    } catch (error) {
      if (runtimeMode === "mock") {
        const fallback = buildMockFallbackEvidence(selectedTask, question, error);
        setTaskContext(fallback.taskContext);
        setEvidence(fallback.evidence);
        setLegalSourceVerification(fallback.officialLawReport);
        setTaskResultVerification(null);
        setMockFallbackReview(true);
        setUnavailableEvidenceKinds([]);
        setVerificationStatus("확장 연결 문제로 임시 근거를 사용했습니다.");
        setReviewWarning(formatSaasAccessFallbackMessage(error));
        setPanelState({ state: "ready", task: selectedTask });
        return fallback;
      }
      setPanelState({ state: "error", message: error instanceof Error ? error.message : "SaaS retrieval failed" });
      setVerificationStatus("");
      setUnavailableEvidenceKinds([]);
      return null;
    }
  }

  async function handleRunReview() {
    if (!canRunReview) {
      return;
    }

    if (runtimeMode === "saas-api") {
      await handleRunSaasApiReview();
      return;
    }

    const loaded = await loadEvidenceForCurrentTask();
    if (!loaded) {
      return;
    }

    if (loaded.officialLawReport.status === "failed") {
      setSummaryStatus("공식 법령 출처 검증이 실패해 생성을 막았습니다.");
      return;
    }

    await generateReviewDraft(loaded);
  }

  async function handleRunSaasApiReview() {
    if (panelState.state !== "ready") {
      return;
    }

    const selectedTask = panelState.task;
    setPanelState({ state: "loading", label: "검토 의견" });
    setOutput(null);
    setRecordId(null);
    setSavedConfidence(null);
    setTaskResultVerification(null);
    setSummarySaveState(null);
    setSummarySavePending(false);
    setSummaryDraft(null);
    setSummaryTagsInput("");
    setSummaryAcknowledged(false);
    setProposalStatus("");
    setTaskUpdateApplied(false);
    setFollowUpTaskCreated(false);
    setTaskUpdatePending(false);
    setFollowUpTaskPending(false);
    setSummaryStatus("근거를 조회하고 SaaS API 검토 의견을 생성하는 중입니다.");
    try {
      const review = await runTaskReview({
        taskId: selectedTask.taskId,
        question,
        instruction: TASK_ASSISTANT_DEFAULT_REVIEW_INSTRUCTION,
        mode: "generate",
      });
      if (review.taskContext.taskId !== selectedTask.taskId) {
        throw new Error("선택한 작업과 검토 결과가 일치하지 않습니다. 다시 실행하세요.");
      }
      setTaskContext(review.taskContext);
      setEvidence(review.evidence);
      setUnavailableEvidenceKinds(review.retrievedEvidence.unavailableEvidenceKinds);
      setVerificationStatus(
        review.officialLawVerification.status === "verified"
          ? "서버 중앙 verified legal evidence 검증이 통과했습니다."
          : review.officialLawVerification.status === "failed"
            ? review.officialLawVerification.failures.join(" / ") || "서버 법규 검증이 실패했습니다."
            : "이 질문과 근거는 중앙 verified legal evidence 검증이 필요하지 않습니다.",
      );

      if (review.status !== "generated" || !review.generated) {
        const readiness = review.evidenceReadiness
          .filter((item) => item.status === "missing")
          .map((item) => `${item.kind}: ${item.action}`)
          .join(" / ");
        throw new Error([review.reason, readiness].filter(Boolean).join(" / "));
      }

      const generatedOutput: AssistantRuntimeOutput = {
        answer: [
          review.generated.answer,
          "",
          `SaaS API mode: ${review.generated.provider.callMode} ${review.generated.provider.provider}/${review.generated.provider.model}`,
          `Usage: input ${review.generated.usage.inputTokens}, output ${review.generated.usage.outputTokens}, estimated ${review.generated.usage.estimatedCostCents} cents.`,
        ].join("\n"),
        draftSummary: review.generated.suggestedDraftSummary,
      };
      setOutput(generatedOutput);
      setSummaryDraft(generatedOutput.draftSummary ?? null);
      setSummaryTagsInput(generatedOutput.draftSummary?.tags.join(", ") ?? "");
      setProposalStatus("");
      setTaskUpdateApplied(false);
      setFollowUpTaskCreated(false);
      setTaskUpdatePending(false);
      setFollowUpTaskPending(false);
      setSummaryStatus("공식 법규 검증 경유 SaaS API 검토 의견을 생성했습니다. 검토기록저장을 눌러 최근 기록에 남기세요.");
      setPanelState({ state: "ready", task: selectedTask });
    } catch (error) {
      setPanelState({ state: "ready", task: selectedTask });
      setSummaryStatus(error instanceof Error ? error.message : "검토 의견 생성에 실패했습니다.");
    }
  }

  async function generateReviewDraft(loaded: LoadedEvidence) {
    const runtime = await createAssistantRuntime();
    setSummaryStatus("Generating answer...");
    setRecordId(null);
    setSavedConfidence(null);
    try {
      const generated = await runtime.generateAnswer({
        question,
        instruction: TASK_ASSISTANT_DEFAULT_REVIEW_INSTRUCTION,
        taskContext: loaded.taskContext,
        evidence: loaded.evidence,
        legalEvidence: loaded.legalEvidence,
        projectContextChunks: loaded.projectContextChunks,
        projectContextTrace: loaded.projectContextTrace,
        evidenceReadinessWarnings: loaded.evidenceReadinessWarnings,
      });
      const verification = buildTaskResultVerification({
        question,
        answer: generated.answer,
        evidence: loaded.evidence,
        officialLawReport: loaded.officialLawReport,
      });
      const verifiedOutput = {
        ...generated,
        answer: appendVerificationRecordToAnswer(generated.answer, verification),
      };
      setOutput(verifiedOutput);
      setSummaryDraft(verifiedOutput.draftSummary ?? null);
      setSummaryTagsInput(verifiedOutput.draftSummary?.tags.join(", ") ?? "");
      setSummaryAcknowledged(false);
      setProposalStatus("");
      setTaskUpdateApplied(false);
      setFollowUpTaskCreated(false);
      setTaskUpdatePending(false);
      setFollowUpTaskPending(false);
      setTaskResultVerification(verification);
      setSummaryStatus(
        isMockFallbackEvidence(loaded)
          ? "임시 근거로 검토 의견을 생성했습니다. 실제 저장/승인 전에는 확장 연결을 복구하세요."
          : "검토 의견을 생성했습니다. 검토기록저장을 눌러 최근 기록에 남기세요.",
      );
    } catch (error) {
      setSummaryStatus(error instanceof Error ? error.message : "Answer generation failed");
    }
  }

  async function handleSaveReviewRecord() {
    if (!taskContext || !output) {
      return;
    }
    if (mockFallbackReview) {
      setSummaryStatus("임시 근거 결과는 실제 검토기록으로 저장할 수 없습니다. 확장 연결을 복구한 뒤 다시 실행하세요.");
      return;
    }

    setSummaryStatus("검토기록을 저장하는 중입니다.");
    try {
      const saved = await saveReviewSession({
        taskId: taskContext.taskId,
        question,
        answer: output.answer,
        evidence,
        title: question,
        executionMode: runtimeMode === "saas-api" ? "saas-api" : runtimeStatus?.mode ?? "mock",
        runtimeMode: runtimeMode,
        draftSummary: summaryDraft ?? undefined,
        officialLawVerification: legalSourceVerification ?? undefined,
      });
      setRecordId(saved.savedRecord.id);
      setSavedConfidence({
        score: saved.savedRecord.confidenceScore,
        reason: saved.savedRecord.confidenceReason ?? "검토기록저장을 통해 assistant 기록에 반영되었습니다.",
      });
      setReviewHistory((items) => [saved, ...items.filter((item) => item.id !== saved.id)]);
      setSummaryStatus(`검토기록저장 완료. 신뢰도 ${saved.savedRecord.confidenceScore}%.`);
    } catch (error) {
      setSummaryStatus(error instanceof Error ? error.message : "Review record save failed");
    }
  }

  async function handleSaveSummary(status: "approved" | "deferred") {
    if (!taskContext || !recordId || !summaryDraft) {
      return;
    }
    if (mockFallbackReview) {
      setSummaryStatus("임시 근거 결과는 승인/보류 저장할 수 없습니다. 확장 연결을 복구한 뒤 다시 실행하세요.");
      return;
    }
    if (status === "approved" && !summaryAcknowledged) {
      setSummaryStatus("검토내용을 확인하고 승인해주세요.");
      return;
    }

    setSummaryStatus(status === "approved" ? "작업 기록을 승인하는 중입니다." : "보류 저장하는 중입니다.");
    setSummarySavePending(true);
    try {
      const saved = await saveWorkSummaryDraft({
        taskId: taskContext.taskId,
        recordId,
        ...summaryDraft,
        tags: summaryTags,
        status,
      });
      const savedStatus = saved.status === "approved" || saved.status === "deferred" ? saved.status : status;
      setSummarySaveState(savedStatus);
      setSummaryStatus(savedStatus === "approved" ? "작업 기록을 승인했습니다." : "보류 저장했습니다.");
    } catch (error) {
      setSummaryStatus(formatSaasAccessError(error));
    } finally {
      setSummarySavePending(false);
    }
  }

  async function handleApplyTaskUpdateProposal() {
    if (!taskRecord || !taskUpdateProposal || !recordId || !summaryDraft) {
      return;
    }
    if (mockFallbackReview) {
      setProposalStatus("임시 근거 결과는 작업 기록에 반영할 수 없습니다. 확장 연결을 복구한 뒤 다시 실행하세요.");
      return;
    }

    setProposalStatus("작업 기록을 업데이트하는 중입니다.");
    setTaskUpdatePending(true);
    try {
      const patchBody: { version: number; decision: string; status?: string } = {
        version: taskRecord.version,
        decision: taskUpdateProposal.nextDecision,
      };
      if (taskUpdateProposal.statusChanged) {
        patchBody.status = taskUpdateProposal.nextStatus;
      }

      const updated = await updateTask(taskRecord.id, patchBody);
      setTaskUpdateApplied(true);
      await saveAssistantActionAudit({
        action: "task_update_applied",
        sourceTaskId: taskRecord.id,
        targetTaskId: taskRecord.id,
        assistantRecordId: recordId,
        summary: buildActionAuditSummary(summaryDraft, summaryTags),
        statusFrom: taskRecord.status,
        statusTo: taskUpdateProposal.nextStatus,
        decisionMarker: `[Assistant approved summary ${recordId}]`,
      });
      setTaskRecord(updated);
      setProposalStatus(
        taskUpdateProposal.statusChanged
          ? `작업 기록을 업데이트하고 상태를 ${taskUpdateProposal.nextStatus}(으)로 변경했습니다.`
          : "승인된 assistant 요약으로 작업 기록을 업데이트했습니다.",
      );
    } catch (error) {
      setProposalStatus(formatTaskMutationError(error));
    } finally {
      setTaskUpdatePending(false);
    }
  }

  async function handleCreateFollowUpTaskProposal() {
    if (!taskRecord || !followUpTaskProposal || !recordId || !summaryDraft) {
      return;
    }
    if (mockFallbackReview) {
      setProposalStatus("임시 근거 결과로 후속 작업을 생성할 수 없습니다. 확장 연결을 복구한 뒤 다시 실행하세요.");
      return;
    }

    setProposalStatus("후속 작업을 생성하는 중입니다.");
    setFollowUpTaskPending(true);
    try {
      const created = await createTask({
        ...followUpTaskProposal.requestBody,
        clientMutationId: createClientMutationId(),
      });
      setFollowUpTaskCreated(true);
      await saveAssistantActionAudit({
        action: "follow_up_task_created",
        sourceTaskId: taskRecord.id,
        targetTaskId: created.id,
        createdTaskId: created.id,
        assistantRecordId: recordId,
        summary: buildActionAuditSummary(summaryDraft, summaryTags),
        statusTo: created.status,
        decisionMarker: `[Assistant approved summary ${recordId}]`,
      });
      setProposalStatus(`후속 작업 ${formatTaskDisplayId(created)}를 생성했습니다.`);
    } catch (error) {
      setProposalStatus(formatTaskMutationError(error));
    } finally {
      setFollowUpTaskPending(false);
    }
  }

  async function handleCaptureActiveTab() {
    setExternalStatus("Capturing current tab...");
    try {
      const response = (await chrome.runtime.sendMessage({ type: "architect:get-active-tab-source" })) as
        | { ok: true; data: ActiveTabSource }
        | { ok: false; error?: string };
      if (!response?.ok) {
        setExternalStatus(response?.error ?? "Active tab source unavailable");
        return;
      }

      setExternalTitle((current) => current || response.data.title);
      setExternalUrl(response.data.url);
      setExternalStatus("Captured current tab title and URL. Add the evidence excerpt before saving.");
    } catch (error) {
      setExternalStatus(error instanceof Error ? error.message : "Active tab source unavailable");
    }
  }

  async function handleSaveExternalEvidence() {
    if (!canSaveExternalEvidence || !activeTaskId) {
      setExternalStatus("Approve external evidence and fill title, excerpt, and source URL or tool name first.");
      return;
    }

    setExternalStatus("Saving external evidence...");
    try {
      const saved = await saveExternalEvidence({
        taskId: activeTaskId,
        sourceType: externalSourceType,
        title: externalTitle,
        excerpt: externalExcerpt,
        sourceUrl: externalUrl || undefined,
        toolName: externalToolName || undefined,
        permissionState: "user_approved",
        capturedAt: new Date().toISOString(),
      });
      setEvidence((items) => [saved.evidence, ...items.filter((item) => item.id !== saved.evidence.id)]);
      setExternalEvidenceRecords((items) => [
        saved.externalEvidence,
        ...items.filter((item) => item.id !== saved.externalEvidence.id),
      ]);
      setExternalTitle("");
      setExternalExcerpt("");
      setExternalStatus("선택한 작업에 외부 근거를 저장했습니다.");
    } catch (error) {
      setExternalStatus(error instanceof Error ? error.message : "External evidence save failed");
    }
  }

  const selectedTask = panelState.state === "ready" ? panelState.task : null;
  const taskTitle = selectedTask?.title || taskContext?.title || "작업 없음";
  const taskId = selectedTask?.taskId || taskContext?.taskId || "";
  const taskDisplayId = selectedTask?.displayId || taskContext?.issueId || "";
  const taskProjectId = selectedTask?.projectId || taskContext?.projectId || "";
  const taskStatus = selectedTask?.status || taskContext?.status || "";
  const taskUrl = selectedTask?.url || "";
  const taskRoute = selectedTask?.route || "";
  const runtimeReady = Boolean(runtimeStatus?.available);
  const runtimeLabel =
    runtimeMode === "local-chatgpt-codex" ? "Local Codex" : runtimeMode === "saas-api" ? "SaaS API" : "개발 모드";
  const taskStateLabel = taskId ? "작업 선택됨" : "작업 없음";
  const retrieveComplete = Boolean(taskContext);
  const generatedComplete = Boolean(output);
  const summaryComplete = summarySaveState === "approved" || summarySaveState === "deferred";
  const fileEvidence = evidence.filter((item) => item.kind === "project_document");

  return (
    <main className="panel-shell">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Architect Assistant</p>
          <h1>{taskTitle}</h1>
          {taskDisplayId ? <p className="task-meta">{taskDisplayId}</p> : null}
        </div>
        <button type="button" className="icon-button" title="작업 다시 확인" onClick={refreshTaskContext}>
          새로고침
        </button>
      </header>

      <section
        className={`task-identity panel-section ${assistantPanelMode === "basic" ? "task-identity--compact" : ""}`}
        aria-label="Selected SaaS task"
      >
        <div className="task-identity-main">
          <div>
            <span>작업</span>
            <strong>{taskDisplayId || taskTitle || "작업 없음"}</strong>
          </div>
          {taskStatus ? <span className="status-chip">{taskStatus}</span> : null}
        </div>
        {assistantPanelMode === "advanced" && taskId ? (
          <dl>
            {taskProjectId ? (
              <>
                <dt>Project</dt>
                <dd>{taskProjectId}</dd>
              </>
            ) : null}
            {taskRoute || taskUrl ? (
              <>
                <dt>Page</dt>
                <dd>{taskRoute || taskUrl}</dd>
              </>
            ) : null}
          </dl>
        ) : null}
        {contextSyncStatus ? (
          <p className="context-sync-status" aria-live="polite">
            {contextSyncStatus}
          </p>
        ) : null}
      </section>

      <section className="assistant-mode-switch" aria-label="AI 검토 표시 모드">
        <button
          aria-pressed={assistantPanelMode === "basic"}
          className={assistantPanelMode === "basic" ? "mode-button mode-button--active" : "mode-button"}
          onClick={() => handleAssistantPanelModeChange("basic")}
          type="button"
        >
          기본 모드
        </button>
        <button
          aria-pressed={assistantPanelMode === "advanced"}
          className={
            assistantPanelMode === "advanced"
              ? "mode-button mode-button--advanced mode-button--active"
              : "mode-button mode-button--advanced"
          }
          onClick={() => handleAssistantPanelModeChange("advanced")}
          type="button"
        >
          고급 모드
        </button>
      </section>

      {assistantPanelMode === "advanced" ? (
        <>
        <section className="review-history-block panel-section advanced-section advanced-section--history">
          <div className="section-heading">
            <div>
              <h2>최근 검토 기록</h2>
            </div>
            <div className="heading-actions">
              <HelpHint text="검토기록저장을 누른 항목만 최근 검토 기록에 표시됩니다." />
              <button
                type="button"
                className="text-toggle"
                aria-expanded={historyExpanded}
                onClick={() => setHistoryExpanded((current) => !current)}
              >
                {historyExpanded ? "접기" : reviewHistoryLoading ? "불러오는 중" : `보기 ${reviewHistory.length}`}
              </button>
            </div>
          </div>
          {historyExpanded ? (
            reviewHistory.length ? (
              <div className="history-list">
                {reviewHistory.slice(0, 6).map((item) => (
                  <article className="history-item" key={item.id}>
                    <header>
                      <strong>{item.title}</strong>
                      <span>{item.savedRecord.confidenceScore}%</span>
                    </header>
                    <small>
                      {formatDateLabel(item.savedAt)} / {item.verdict ?? "판정 없음"} /{" "}
                      {item.conclusionMayChange ? "추가확인필요 후보" : "후보 영향 낮음"}
                    </small>
                    <p>{item.answerPreview}</p>
                    <button type="button" className="text-toggle" onClick={() => void openReviewSession(item)}>
                      상세 열기
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted">{reviewHistoryLoading ? "검토 기록을 불러오는 중입니다." : "아직 이 작업에 저장된 검토 기록이 없습니다."}</p>
            )
          ) : null}
          {selectedReviewSession ? (
            <article className="history-detail">
              <header>
                <strong>{selectedReviewSession.title}</strong>
                <span className="status-chip">저장 {selectedReviewSession.savedEvidenceSnapshot.length}</span>
                <span className="status-chip">최신 {selectedReviewSession.latestEvidenceSnapshot.length}</span>
              </header>
              <p>질문: {selectedReviewSession.question}</p>
              <p>{selectedReviewSession.answer}</p>
            </article>
          ) : null}
        </section>

        <section className="status-strip advanced-section advanced-section--runtime">
          <div className="status-copy">
            <div className="chip-row" aria-label="Assistant status">
              <span className={`status-chip ${runtimeReady ? "status-chip--ready" : "status-chip--blocked"}`}>
                {runtimeReady ? "실행 가능" : "실행 불가"}
              </span>
              <span className="status-chip">{runtimeLabel}</span>
              <span className="status-chip">{taskId ? "작업 선택됨" : taskStateLabel}</span>
            </div>
            {runtimeStatus?.reason ? <small>{runtimeStatus.reason}</small> : null}
          </div>
          <label className="mode-select">
            <span>모드</span>
            <select
              value={runtimeMode}
              onChange={(event) => void handleRuntimeModeChange(event.target.value as RuntimeMode)}
            >
              <option value="mock">개발 모드</option>
              <option value="local-chatgpt-codex">Local Codex</option>
              <option value="saas-api">SaaS API</option>
            </select>
          </label>
        </section>
        <section className="panel-section advanced-section advanced-section--diagnostics local-codex-health">
          <div className="section-heading">
            <div>
              <h2>로컬 Codex 로그인</h2>
            </div>
            <div className="heading-actions">
              <HelpHint text="확장 패널에서 직접 확인 가능한 로컬 Codex 실행 상태입니다. 서버 내부 법령 사전 검증은 SaaS 패널에서 수행합니다." />
              <button type="button" className="text-toggle" onClick={checkLocalCodexDiagnostics}>
                {localCodexDiagnosticsLoading ? "확인 중" : "상태 확인"}
              </button>
            </div>
          </div>
          <div className="diagnostic-grid" aria-label="Local Codex diagnostics">
            <span className="status-chip status-chip--ready">확장 패널 연결됨</span>
            <span className={`status-chip ${runtimeMode === "local-chatgpt-codex" ? "status-chip--ready" : ""}`}>
              실행 모드 {runtimeLabel}
            </span>
            <span
              className={`status-chip ${
                localCodexDiagnostics
                  ? localCodexDiagnostics.status.available
                    ? "status-chip--ready"
                    : "status-chip--blocked"
                  : ""
              }`}
            >
              runtime{" "}
              {localCodexDiagnostics
                ? localCodexDiagnostics.status.available
                  ? "연결됨"
                  : "확인 필요"
                : "미확인"}
            </span>
            <span className="status-chip">capability {localCodexDiagnostics?.capabilities.length ?? 0}</span>
          </div>
          {localCodexDiagnostics?.status.reason ? <small>{localCodexDiagnostics.status.reason}</small> : null}
        </section>
        <section className="panel-section advanced-section advanced-section--settings">
          <div className="section-heading">
            <div>
              <h2>기본 검토지침</h2>
            </div>
            <div className="heading-actions">
              <HelpHint text="답변 기준은 서비스 기본 검토지침을 사용하며, 사용자는 질문만 조정합니다." />
              <span className="status-chip">서비스 고정</span>
            </div>
          </div>
        </section>
        </>
      ) : null}

      <section className="flow-steps panel-section" aria-label="검토 진행 단계">
        <ol>
          <li className={question.trim() ? "step-complete" : "step-active"}>
            <span>1</span>
            <p>질문 입력</p>
          </li>
          <li className={retrieveComplete ? "step-complete" : question.trim() ? "step-active" : ""}>
            <span>2</span>
            <p>근거 확인</p>
          </li>
          <li className={generatedComplete ? "step-complete" : retrieveComplete ? "step-active" : ""}>
            <span>3</span>
            <p>검토안 생성</p>
          </li>
          <li className={summaryComplete ? "step-complete" : generatedComplete ? "step-active" : ""}>
            <span>4</span>
            <p>요약 처리</p>
          </li>
        </ol>
      </section>

      {panelState.state === "error" ? (
        <p className="error-text" role="alert">
          {panelState.message}
        </p>
      ) : null}
      {panelState.state === "loading" ? (
        <p className="muted" aria-live="polite">
          {panelState.label} 불러오는 중...
        </p>
      ) : null}

      <section className="composer panel-section">
        <div className="section-heading">
          <div>
            <h2>검토 질문</h2>
            <p>작업 근거를 먼저 불러온 뒤 검토안을 생성합니다.</p>
          </div>
        </div>
        <textarea
          value={question}
          onChange={(event) => handleQuestionChange(event.target.value)}
          placeholder="이 작업을 닫기 전에 확인해야 할 내용을 입력하세요."
        />
        <div className="button-row review-actions">
          <button type="button" className="button-primary" onClick={handleRunReview} disabled={!canRunReview}>
            {panelState.state === "loading" ? "검토 중" : "근거 조회 + 의견 생성"}
          </button>
          <button type="button" className="button-secondary" onClick={handleSaveReviewRecord} disabled={!canSaveReviewRecord}>
            검토기록저장
          </button>
        </div>
        <p className="action-hint">{reviewActionHint}</p>
        {reviewWarning ? <p className="warning-text" role="status">{reviewWarning}</p> : null}
      </section>

      {assistantPanelMode === "advanced" ? (
        <section className="external-evidence-block panel-section advanced-section advanced-section--external">
        <div className="section-heading">
          <div>
            <h2>외부 근거</h2>
            <p>필요할 때만 승인된 출처 일부를 작업에 추가합니다.</p>
          </div>
          <button
            type="button"
            className="text-toggle"
            aria-expanded={externalExpanded}
            onClick={() => setExternalExpanded((current) => !current)}
          >
            {externalExpanded ? "접기" : externalEvidenceLoading ? "불러오는 중" : `추가 ${externalEvidenceRecords.length}`}
          </button>
        </div>
        {!externalExpanded ? (
          <p className="muted">일반 검토 흐름에서는 접어두고, 웹/스킬 결과를 명시적으로 저장할 때만 엽니다.</p>
        ) : (
          <div className="external-evidence-body">
            <span className={`status-chip ${externalAllowed ? "status-chip--ready" : ""}`}>
              {externalAllowed ? "사용자 승인" : "승인 전"}
            </span>
            <label className="check-row">
              <input
                type="checkbox"
                checked={externalAllowed}
                onChange={(event) => setExternalAllowed(event.target.checked)}
              />
              <span>선택된 작업에 사용자 승인 웹/스킬 근거로 저장합니다.</span>
            </label>
            <div className="field-grid">
              <label>
                <span>출처 유형</span>
                <select
                  value={externalSourceType}
                  onChange={(event) => setExternalSourceType(event.target.value as ExternalEvidenceSourceType)}
                  disabled={!externalAllowed}
                >
                  {externalSourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>제목</span>
                <input
                  value={externalTitle}
                  onChange={(event) => setExternalTitle(event.target.value)}
                  disabled={!externalAllowed}
                  placeholder="출처 제목 또는 스킬 결과 이름"
                />
              </label>
              <label>
                <span>출처 URL</span>
                <input
                  value={externalUrl}
                  onChange={(event) => setExternalUrl(event.target.value)}
                  disabled={!externalAllowed}
                  placeholder="https://..."
                />
              </label>
              <label>
                <span>도구 / 스킬</span>
                <input
                  value={externalToolName}
                  onChange={(event) => setExternalToolName(event.target.value)}
                  disabled={!externalAllowed}
                  placeholder="browser-use, manufacturer search, Codex skill"
                />
              </label>
            </div>
            <textarea
              value={externalExcerpt}
              onChange={(event) => setExternalExcerpt(event.target.value)}
              disabled={!externalAllowed}
              placeholder="짧은 근거 발췌 또는 요약된 스킬 결과를 붙여넣으세요. 비공개 페이지 전체나 문서 전문은 넣지 마세요."
            />
            <div className="button-row">
              <button type="button" className="button-secondary" onClick={handleCaptureActiveTab} disabled={!externalAllowed}>
                탭 정보 가져오기
              </button>
              <button type="button" className="button-primary" onClick={handleSaveExternalEvidence} disabled={!canSaveExternalEvidence}>
                근거 저장
              </button>
            </div>
          </div>
        )}
        {externalExpanded && externalEvidenceRecords.length ? (
          <div className="external-record-list">
            {externalEvidenceRecords.slice(0, 3).map((item) => (
              <article className="external-record-item" key={item.id}>
                <strong>{item.title}</strong>
                {item.sourceUrl ? (
                  <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                    출처 열기
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
        {externalStatus ? <p className="muted" aria-live="polite">{externalStatus}</p> : null}
      </section>
      ) : null}

      {assistantPanelMode === "advanced" ? (
        <section className="file-evidence-block panel-section advanced-section advanced-section--files">
          <div className="section-heading">
            <div>
              <h2>파일 근거</h2>
            </div>
            <div className="heading-actions">
              <HelpHint text="파일 OCR과 이미지 영역 crop은 제외하고, 서버 검색에 반영된 프로젝트 문서 근거만 표시합니다." />
              <span className="status-chip">보기 {fileEvidence.length}</span>
            </div>
          </div>
          {fileEvidence.length ? (
            <div className="external-record-list">
              {fileEvidence.slice(0, 4).map((item) => (
                <article className="external-record-item" key={item.id}>
                  <strong>{item.title}</strong>
                  {item.sourceUrl ? (
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                      출처 열기
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <p className="muted">근거 조회 후 서버에 반영된 프로젝트 문서 근거만 여기에 표시됩니다.</p>
          )}
        </section>
      ) : null}

      {assistantPanelMode === "advanced" && legalSourceVerification ? (
        <section className="verification-block panel-section advanced-section advanced-section--verification" aria-label="Official law source verification">
          <div className="section-heading">
            <div>
              <h2>출처 검증</h2>
              <p>{verificationStatus}</p>
            </div>
            <span
              className={`status-chip ${
                legalSourceVerification.status === "verified"
                  ? "status-chip--ready"
                  : legalSourceVerification.status === "failed"
                    ? "status-chip--blocked"
                    : ""
              }`}
            >
              {legalSourceVerification.status}
            </span>
          </div>
          {legalSourceVerification.sources.length > 0 ? (
            <div className="verification-list">
              {legalSourceVerification.sources.map((source) => (
                <article key={`${source.lawName}-${source.articleNumber || "all"}-${source.status}`}>
                  <strong>
                    {source.lawName || "법령명 미확인"}
                    {source.articleLabel ? ` ${source.articleLabel}` : ""}
                  </strong>
                  <span>{source.status}</span>
                  <p>{source.reason}</p>
                  <small>확인 시각 {source.checkedAt}</small>
                  {source.apiUrl ? (
                    <a href={source.apiUrl} target="_blank" rel="noreferrer">
                      API 출처
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
          {legalSourceVerification.failures.length > 0 ? (
            <p className="error-inline">{legalSourceVerification.failures.join(" ")}</p>
          ) : null}
          {legalSourceVerification.retry.length > 0 ? (
            <p className="muted">{legalSourceVerification.retry.join(" ")}</p>
          ) : null}
        </section>
      ) : null}

      <section className={`evidence-list panel-section ${assistantPanelMode === "advanced" ? "advanced-section advanced-section--evidence" : ""}`}>
        <div className="section-heading">
          <div>
            <h2>근거</h2>
            <p>
              {evidence.length > 0
                ? `${evidence.length}개 출처를 불러왔습니다.`
                : "아직 불러온 출처가 없습니다."}
            </p>
          </div>
          {assistantPanelMode === "basic" && evidence.length > 0 ? <span className="status-chip">보기 {evidence.length}</span> : null}
        </div>
        {unavailableEvidenceKinds.length > 0 ? (
          <div className="missing-evidence" role="status">
            <strong>사용할 수 없는 근거</strong>
            <p>{unavailableEvidenceKinds.map(formatEvidenceKind).join(", ")}</p>
          </div>
        ) : null}
        {evidence.length === 0 ? <p className="muted">SaaS에서 불러온 근거가 여기에 표시됩니다.</p> : null}
        {assistantPanelMode === "advanced" ? evidence.map((item) => (
          <article key={item.id} className="evidence-item">
            <div>
              <strong>{item.title}</strong>
              <span>{item.kind}</span>
            </div>
            <p>{item.excerpt}</p>
            {item.sourceUrl ? (
              <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                출처 열기
              </a>
            ) : null}
            {item.officialSourceName ? (
              <small>
                {item.officialSourceName}
                {item.articleLabel ? ` · ${item.articleLabel}` : ""}
                {item.checkedAt ? ` · ${item.checkedAt}` : ""}
              </small>
            ) : null}
          </article>
        )) : evidence.length > 0 ? (
          <div className="evidence-compact-list" aria-label="불러온 근거 요약">
            {evidence.slice(0, 5).map((item) => (
              <article className="evidence-compact-item" key={item.id}>
                <strong>{item.title}</strong>
                {item.sourceUrl ? (
                  <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                    출처 열기
                  </a>
                ) : null}
              </article>
            ))}
            {evidence.length > 5 ? <p className="muted">나머지 {evidence.length - 5}개 근거는 고급 모드에서 확인할 수 있습니다.</p> : null}
          </div>
        ) : null}
      </section>

      {output ? (
        <section className="answer-stack">
          <article className="answer-block panel-section">
            <h2>검토안</h2>
            <p>{output.answer}</p>
          </article>
          {savedConfidence ? (
            <aside className="confidence-block" aria-label="Assistant confidence">
              <strong>신뢰도 {savedConfidence.score}%</strong>
              <p>{savedConfidence.reason}</p>
            </aside>
          ) : null}
          {taskResultVerification && taskResultVerification.status !== "not_required" ? (
            <aside className="confidence-block" aria-label="Task result verification">
              <strong>검증 {taskResultVerification.status}</strong>
              <p>{taskResultVerification.basis.join("\n")}</p>
              {taskResultVerification.failures.length > 0 ? (
                <p>{taskResultVerification.failures.join("\n")}</p>
              ) : null}
            </aside>
          ) : null}
          {summaryDraft ? (
            <div className="summary-editor">
              <h2>작업 요약</h2>
              <label>
                <span>결론</span>
                <textarea
                  value={summaryDraft.conclusion}
                  onChange={(event) => setSummaryDraft((current) => current ? { ...current, conclusion: event.target.value } : current)}
                  rows={3}
                />
              </label>
              <label>
                <span>태그</span>
                <input value={summaryTagsInput} onChange={(event) => setSummaryTagsInput(event.target.value)} />
              </label>
              <label>
                <span>적용 범위</span>
                <textarea
                  value={summaryDraft.scope}
                  onChange={(event) => setSummaryDraft((current) => current ? { ...current, scope: event.target.value } : current)}
                  rows={2}
                />
              </label>
              <label>
                <span>후속 조치</span>
                <textarea
                  value={summaryDraft.followUpAction ?? ""}
                  onChange={(event) => setSummaryDraft((current) => current ? { ...current, followUpAction: event.target.value } : current)}
                  rows={2}
                />
              </label>
              <label className="check-row check-row--boxed">
                <input
                  type="checkbox"
                  checked={summaryAcknowledged}
                  onChange={(event) => setSummaryAcknowledged(event.target.checked)}
                />
                <span>검토내용을 확인하고 승인해주세요.</span>
              </label>
              <div className="button-row">
                <button type="button" className="button-primary" onClick={() => handleSaveSummary("approved")} disabled={!canApproveSummary}>
                  작업 기록 승인
                </button>
                <button type="button" className="button-secondary" onClick={() => handleSaveSummary("deferred")} disabled={!canDeferSummary}>
                  보류 저장
                </button>
              </div>
              {taskUpdateProposal || followUpTaskProposal ? (
                <section className="proposal-block" aria-label="승인 후 task 반영 제안">
                  <div className="proposal-block__heading">
                    <span className="status-chip status-chip--caution">선택 사항</span>
                    <p>아래 작업은 검토 승인과 별개로 실제 작업 기록을 변경합니다.</p>
                  </div>
                  {taskUpdateProposal ? (
                    <article className="proposal-item">
                      <strong>작업 기록에 승인 요약 반영</strong>
                      <p>{taskUpdateProposal.statusChanged ? `상태 변경: ${taskRecord?.status} -> ${taskUpdateProposal.nextStatus}` : "상태 변경 없이 승인 요약만 추가합니다."}</p>
                      <details className="proposal-detail">
                        <summary>반영 내용 보기</summary>
                        <p>{taskUpdateProposal.alreadyRecorded ? "이미 승인 요약이 기록되어 있습니다." : taskUpdateProposal.decisionAppend}</p>
                      </details>
                      <button type="button" className="button-secondary" onClick={handleApplyTaskUpdateProposal} disabled={!canApplyTaskUpdate}>
                        선택 반영
                      </button>
                    </article>
                  ) : null}
                  {followUpTaskProposal ? (
                    <article className="proposal-item">
                      <strong>후속 작업 생성</strong>
                      <p className="proposal-title">{followUpTaskProposal.issueTitle}</p>
                      <details className="proposal-detail">
                        <summary>생성 내용 보기</summary>
                        <p>{followUpTaskProposal.issueDetailNote}</p>
                      </details>
                      <button type="button" className="button-secondary" onClick={handleCreateFollowUpTaskProposal} disabled={!canCreateFollowUpTask}>
                        후속 작업 생성
                      </button>
                    </article>
                  ) : null}
                  {proposalStatus ? <p className="muted" aria-live="polite">{proposalStatus}</p> : null}
                </section>
              ) : proposalStatus ? (
                <p className="muted" aria-live="polite">{proposalStatus}</p>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {summaryStatus ? <p className="save-state" aria-live="polite">{summaryStatus}</p> : null}
    </main>
  );
}

function snapshotToDetectedTask(context: SidePanelContextSnapshot): DetectedTaskContext {
  return {
    taskId: context.task.taskId,
    projectId: context.task.projectId,
    displayId: context.task.displayId,
    title: context.task.title || context.task.displayId || `선택 작업 ${context.task.taskId.slice(0, 8)}`,
    status: context.task.status,
    url: context.page.url,
    route: context.page.route,
    selectedAt: context.selectedAt,
    sourceTabId: context.sourceTabId,
  };
}

function launchContextToDetectedTask(context: SidePanelLaunchContext): DetectedTaskContext {
  return {
    taskId: context.taskId,
    projectId: context.projectId,
    title: context.title || `선택 작업 ${context.taskId.slice(0, 8)}`,
    url: context.url || "",
    selectedAt: context.openedAt,
    sourceTabId: context.sourceTabId,
  };
}

function readContextQuestion(context: SidePanelContextSnapshot): IncomingQuestion {
  if (
    context.review &&
    hasOwn(context.review, "question") &&
    typeof context.review.question === "string"
  ) {
    return { hasQuestion: true, value: context.review.question };
  }

  return { hasQuestion: false };
}

function readLaunchContextQuestion(context: SidePanelLaunchContext): IncomingQuestion {
  if (hasOwn(context, "question") && typeof context.question === "string") {
    return { hasQuestion: true, value: context.question };
  }

  return { hasQuestion: false };
}

function hasOwn(record: object, key: string) {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function formatOfficialLawVerificationStatus(report: OfficialLawVerificationReport) {
  if (report.status === "not_required") {
    return "이 작업에는 공식 법령 출처 검증이 필요하지 않습니다.";
  }

  const verifiedCount = report.sources.filter((source) => source.status === "verified").length;
  if (report.status === "verified") {
    return `${verifiedCount} official law source${verifiedCount === 1 ? "" : "s"} verified at ${report.checkedAt}.`;
  }

  return `공식 법령 출처 검증이 실패했습니다. 확인 시각 ${report.checkedAt}.`;
}

function formatEvidenceKind(kind: AssistantEvidenceKind) {
  const labels: Record<AssistantEvidenceKind, string> = {
    central_knowledge: "승인 WIKI",
    regulation: "법령",
    task: "작업",
    project_document: "프로젝트 문서",
    web_or_skill: "웹/스킬",
  };
  return labels[kind];
}

function buildMockFallbackEvidence(
  task: DetectedTaskContext,
  question: string,
  error: unknown,
): LoadedEvidence {
  const now = new Date().toISOString();
  const taskContext: AssistantTaskContext = {
    taskId: task.taskId,
    projectId: task.projectId || "mock-project",
    title: task.title || task.displayId || `선택 작업 ${task.taskId.slice(0, 8)}`,
    description: question || "Mock mode fallback review",
    status: task.status || "mock",
    issueId: task.displayId || task.taskId,
    projectName: "Architect SaaS",
  };
  const evidence: AssistantEvidence[] = [
    {
      id: `mock-fallback:${task.taskId}`,
      kind: "task",
      priority: 1,
      title: "임시 검토 근거",
      excerpt: [
        "확장 패널이 선택된 작업의 서버 근거를 불러오지 못했습니다.",
        `원인: ${formatSaasAccessError(error)}`,
        "이 근거는 패널 동작 확인용이며 검토기록 저장이나 작업 반영 전에는 서버 근거 조회를 복구해야 합니다.",
      ].join("\n"),
      confidenceWeight: 0.1,
      checkedAt: now,
    },
  ];
  const officialLawReport: OfficialLawVerificationReport = {
    status: "not_required",
    checkedAt: now,
    provider: {
      name: OFFICIAL_LAW_PROVIDER_NAME,
      docsUrl: OFFICIAL_LAW_API_DOCS_URL,
    },
    locators: [],
    sources: [],
    failures: [],
    retry: [],
  };

  return {
    taskContext,
    evidence,
    officialLawReport,
    legalEvidence: [],
    projectContextChunks: [],
    projectContextTrace: {
      corpusType: "project_context",
      status: "search_failed",
      traceId: null,
      fallbackMode: "none",
      activeVersionIds: [],
      candidateChunkIds: [],
      matchedChunkIds: [],
      includedChunkIds: [],
      noRelevantChunkReason: null,
      searchErrorCode: "mock_fallback_after_saas_retrieve_error",
    },
    evidenceReadinessWarnings: [
      {
        code: "MOCK_FALLBACK_EVIDENCE",
        message: "SaaS retrieve failed; generated with mock fallback evidence only.",
      },
    ],
  };
}

function isMockFallbackEvidence(loaded: LoadedEvidence) {
  return (loaded.evidenceReadinessWarnings ?? []).some((warning) => warning.code === "MOCK_FALLBACK_EVIDENCE");
}

function formatSaasAccessFallbackMessage(error: unknown) {
  return `${formatSaasAccessError(error)} 임시 근거로 검토 의견 생성을 계속합니다. 실제 저장/승인 전에는 작업 선택, 로그인, 확장 연결 설정을 확인하세요.`;
}

function formatSaasAccessError(error: unknown) {
  const message = error instanceof Error ? error.message : "SaaS request failed";
  if (/Cross-site requests are not allowed|REQUEST_ORIGIN/i.test(message)) {
    return "SaaS가 현재 확장 패널 연결을 허용하지 않았습니다.";
  }
  if (/unauthorized|not authenticated|login|requireUser|401/i.test(message)) {
    return "SaaS 로그인 세션을 확인할 수 없습니다. /daily 탭에서 로그인 상태를 확인하세요.";
  }
  if (/project|access|forbidden|403/i.test(message)) {
    return "선택된 작업의 프로젝트 접근 권한을 확인할 수 없습니다.";
  }
  if (/Failed to fetch|NetworkError|ERR_CONNECTION_REFUSED|ECONNREFUSED/i.test(message)) {
    return "SaaS 서버에 연결할 수 없습니다. 로컬 서버 또는 Preview URL을 확인하세요.";
  }
  return message;
}

function parseSummaryTags(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function buildTaskUpdateProposal(
  task: TaskRecord,
  summary: DraftSummary,
  tags: string[],
  recordId: string,
): TaskUpdateProposal {
  const marker = `[Assistant approved summary ${recordId}]`;
  const decisionAppend = buildApprovedSummaryBlock(summary, tags, marker);
  const alreadyRecorded = task.decision.includes(marker);
  const nextStatus = suggestNextTaskStatus(task.status);
  const statusChanged = nextStatus !== task.status;
  const nextDecision = alreadyRecorded ? task.decision : [task.decision.trim(), decisionAppend].filter(Boolean).join("\n\n");

  return {
    nextStatus,
    statusChanged,
    alreadyRecorded,
    decisionAppend,
    nextDecision,
  };
}

function buildFollowUpTaskProposal(
  task: TaskRecord,
  summary: DraftSummary,
  tags: string[],
): FollowUpTaskProposal | null {
  const followUpAction = summary.followUpAction?.trim();
  if (!followUpAction) {
    return null;
  }

  const issueTitle = createFollowUpTitle(followUpAction);
  const issueDetailNote = [
    `상위 작업: ${formatTaskDisplayId(task)}`,
    `검토 결론: ${compactText(summary.conclusion)}`,
    `적용 범위: ${compactText(summary.scope)}`,
    `후속 조치: ${compactText(followUpAction)}`,
    tags.length ? `태그: ${tags.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    issueTitle,
    issueDetailNote,
    requestBody: {
      dueDate: "",
      workType: task.workType,
      coordinationScope: task.coordinationScope,
      requestedBy: task.requestedBy,
      relatedDisciplines: task.relatedDisciplines,
      assignee: task.assignee,
      assigneeProfileId: task.assigneeProfileId,
      reviewedAt: "",
      isDaily: true,
      locationRef: task.locationRef,
      calendarLinked: false,
      issueTitle,
      issueDetailNote,
      status: "new",
      decision: "",
      parentTaskId: task.id,
    },
  };
}

function buildApprovedSummaryBlock(summary: DraftSummary, tags: string[], marker: string) {
  return [
    marker,
    `결론: ${compactText(summary.conclusion)}`,
    `적용 범위: ${compactText(summary.scope)}`,
    summary.followUpAction?.trim() ? `후속 조치: ${compactText(summary.followUpAction)}` : null,
    tags.length ? `태그: ${tags.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildActionAuditSummary(summary: DraftSummary, tags: string[]): AssistantActionAuditSummary {
  return {
    conclusion: compactText(summary.conclusion),
    scope: compactText(summary.scope),
    followUpAction: compactText(summary.followUpAction ?? ""),
    tags,
  };
}

function suggestNextTaskStatus(status: string) {
  return status === "new" ? "in_review" : status;
}

function createFollowUpTitle(value: string) {
  return `Follow-up: ${truncateText(compactText(value), 84)}`;
}

function compactText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function truncateText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}

function formatTaskDisplayId(task: Pick<TaskRecord, "issueId" | "taskNumber">) {
  return task.issueId || `#${task.taskNumber}`;
}

function createClientMutationId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `assistant-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatTaskMutationError(error: unknown) {
  const message = error instanceof Error ? error.message : "Task mutation failed";
  if (message.includes("TASK_CELL_DOCUMENT_FIELD_DIRECT_WRITE_BLOCKED")) {
    return "현재 SaaS가 셀 문서 모드로 직접 수정을 막고 있습니다. 내부 패널에서 작업 기록 반영을 처리하세요.";
  }
  if (message.includes("TASK_VERSION_CONFLICT")) {
    return "작업이 다른 곳에서 먼저 수정되었습니다. SaaS 화면을 새로고침한 뒤 다시 시도하세요.";
  }
  return message;
}

function formatDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" });
}

async function readSidePanelLaunchContext(): Promise<SidePanelLaunchContext | null> {
  try {
    const response = (await chrome.runtime.sendMessage({ type: "architect:get-side-panel-launch-context" })) as
      | { ok: true; data: SidePanelLaunchContext | null }
      | { ok: false; error?: string }
      | undefined;
    return response?.ok ? response.data : null;
  } catch {
    return null;
  }
}
