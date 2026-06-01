import { useEffect, useMemo, useState } from "react";
import {
  officialLawSourceToEvidence,
  verifyOfficialLawEvidence,
  type OfficialLawVerificationReport,
} from "../legal/official-law-api";
import { appendVerificationRecordToAnswer, buildTaskResultVerification } from "../legal/task-result-verification";
import { createAssistantRuntime } from "../runtime/runtime-factory";
import type { AssistantRuntimeStatus, AssistantRuntimeOutput } from "../runtime/ArchitectLocalAssistantRuntime";
import { retrieveEvidence, saveAssistantRecord, saveExternalEvidence, saveWorkSummaryDraft } from "../saas/client";
import type {
  AssistantEvidence,
  AssistantEvidenceKind,
  AssistantTaskContext,
  ExternalEvidenceSourceType,
  TaskResultVerification,
} from "../saas/contracts";
import { readSafeSetting, writeSafeSetting } from "../storage/safe-storage";

type DetectedTaskContext = {
  taskId: string;
  projectId?: string;
  title?: string;
  url: string;
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

type RuntimeMode = "mock" | "local-chatgpt-codex";

type SavedRecordConfidence = {
  score: number;
  reason: string;
};

const externalSourceOptions: Array<{ value: ExternalEvidenceSourceType; label: string }> = [
  { value: "web_page", label: "Web page" },
  { value: "skill_output", label: "Skill output" },
  { value: "external_document", label: "External document" },
  { value: "manufacturer_doc", label: "Manufacturer doc" },
  { value: "public_standard", label: "Public standard" },
];

export function App() {
  const [panelState, setPanelState] = useState<PanelState>({ state: "idle" });
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
  const [unavailableEvidenceKinds, setUnavailableEvidenceKinds] = useState<AssistantEvidenceKind[]>([]);
  const [externalExpanded, setExternalExpanded] = useState(false);
  const [externalAllowed, setExternalAllowed] = useState(false);
  const [externalSourceType, setExternalSourceType] = useState<ExternalEvidenceSourceType>("web_page");
  const [externalTitle, setExternalTitle] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [externalToolName, setExternalToolName] = useState("Architect Browser Assistant");
  const [externalExcerpt, setExternalExcerpt] = useState("");
  const [externalStatus, setExternalStatus] = useState("");

  useEffect(() => {
    void refreshTaskContext();
    void refreshRuntimeStatus();
  }, []);

  const legalVerificationFailed = legalSourceVerification?.status === "failed";
  const canGenerate = useMemo(
    () => Boolean(taskContext && question.trim() && runtimeStatus?.available && !legalVerificationFailed),
    [legalVerificationFailed, question, runtimeStatus, taskContext],
  );
  const generateBlockReason = useMemo(() => {
    if (!question.trim()) {
      return "검토 질문을 먼저 입력하세요.";
    }
    if (!runtimeStatus?.available) {
      return "실행 환경을 사용할 수 없습니다. 모드와 Local Codex 설치 상태를 확인하세요.";
    }
    if (!taskContext) {
      return "근거를 먼저 불러와 선택된 작업 맥락을 확인하세요.";
    }
    if (legalVerificationFailed) {
      return "공식 법령 출처 검증이 실패해 생성을 막았습니다.";
    }
    return "";
  }, [legalVerificationFailed, question, runtimeStatus, taskContext]);
  const activeTaskId = taskContext?.taskId || (panelState.state === "ready" ? panelState.task.taskId : "");
  const canSaveExternalEvidence = Boolean(
    activeTaskId &&
      externalAllowed &&
      externalTitle.trim() &&
      externalExcerpt.trim() &&
      (externalUrl.trim() || externalToolName.trim()),
  );

  async function refreshTaskContext() {
    setPanelState({ state: "loading", label: "task context" });
    const response = await chrome.runtime.sendMessage({ type: "architect:get-task-context" });
    if (!response?.ok) {
      const lastTaskId = await readSafeSetting("lastTaskId", "" as string);
      if (lastTaskId) {
        setPanelState({
          state: "ready",
          task: {
            taskId: lastTaskId,
            title: `Last selected task ${lastTaskId.slice(0, 8)}`,
            url: "",
          },
        });
        setExternalStatus("Using the last selected SaaS task. Open /daily and select a task to change the target.");
        return;
      }

      setPanelState({ state: "error", message: response?.error ?? "Task context unavailable" });
      return;
    }

    await writeSafeSetting("lastTaskId", response.data.taskId);
    setPanelState({ state: "ready", task: response.data });
  }

  async function refreshRuntimeStatus() {
    const mode = await readSafeSetting<RuntimeMode>("runtimeMode", "mock");
    setRuntimeMode(mode);
    const runtime = await createAssistantRuntime();
    setRuntimeStatus(await runtime.isAvailable());
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
    setUnavailableEvidenceKinds([]);
    await writeSafeSetting("runtimeMode", nextMode);
    await refreshRuntimeStatus();
  }

  async function handleRetrieve() {
    if (panelState.state !== "ready") {
      return;
    }

    setPanelState({ state: "loading", label: "SaaS evidence" });
    try {
      const result = await retrieveEvidence({ taskId: panelState.task.taskId, question });
      setTaskContext(result.taskContext);
      setOutput(null);
      setRecordId(null);
      setSavedConfidence(null);
      setTaskResultVerification(null);
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
      setEvidence([...officialEvidence, ...result.evidence]);
      setPanelState({ state: "ready", task: panelState.task });
    } catch (error) {
      setPanelState({ state: "error", message: error instanceof Error ? error.message : "SaaS retrieval failed" });
      setVerificationStatus("");
      setUnavailableEvidenceKinds([]);
    }
  }

  async function handleGenerateAndSave() {
    if (!taskContext || !canGenerate) {
      return;
    }

    const runtime = await createAssistantRuntime();
    setSummaryStatus("Generating answer...");
    setRecordId(null);
    setSavedConfidence(null);
    try {
      const generated = await runtime.generateAnswer({ question, taskContext, evidence });
      const verification = buildTaskResultVerification({
        question,
        answer: generated.answer,
        evidence,
        officialLawReport: legalSourceVerification,
      });
      const verifiedOutput = {
        ...generated,
        answer: appendVerificationRecordToAnswer(generated.answer, verification),
      };
      setOutput(verifiedOutput);
      setTaskResultVerification(verification);
      const saved = await saveAssistantRecord({
        taskId: taskContext.taskId,
        question,
        answer: verifiedOutput.answer,
        evidence,
        executionMode: runtimeStatus?.mode ?? "mock",
        runtimeMode: runtimeStatus?.mode ?? "mock",
        draftSummary: verifiedOutput.draftSummary,
      });
      setRecordId(saved.id);
      setSavedConfidence({ score: saved.confidenceScore, reason: saved.confidenceReason });
      setSummaryStatus("Answer saved. Review confidence and draft summary before closing the task.");
    } catch (error) {
      setSummaryStatus(error instanceof Error ? error.message : "Answer generation failed");
    }
  }

  async function handleSaveSummary(status: "approved" | "deferred") {
    if (!taskContext || !recordId || !output?.draftSummary) {
      return;
    }

    const saved = await saveWorkSummaryDraft({
      taskId: taskContext.taskId,
      recordId,
      ...output.draftSummary,
      status,
    });
    setSummaryStatus(`Summary ${saved.status}`);
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
      setExternalTitle("");
      setExternalExcerpt("");
      setExternalStatus("External evidence saved to the selected task.");
    } catch (error) {
      setExternalStatus(error instanceof Error ? error.message : "External evidence save failed");
    }
  }

  const taskTitle =
    taskContext?.title || (panelState.state === "ready" ? panelState.task.title : "") || "No task selected";
  const taskId = taskContext?.taskId || (panelState.state === "ready" ? panelState.task.taskId : "");
  const runtimeReady = Boolean(runtimeStatus?.available);
  const runtimeLabel = runtimeMode === "local-chatgpt-codex" ? "Local Codex" : "Mock";
  const taskStateLabel = taskId ? "Task selected" : "No task";
  const retrieveComplete = Boolean(taskContext);
  const generatedComplete = Boolean(output);
  const summaryComplete = summaryStatus.startsWith("Summary approved");

  return (
    <main className="panel-shell">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Architect Assistant</p>
          <h1>{taskTitle}</h1>
          {taskId ? <p className="task-meta">{taskId}</p> : null}
        </div>
        <button type="button" className="icon-button" title="작업 다시 확인" onClick={refreshTaskContext}>
          새로고침
        </button>
      </header>

      <section className="status-strip">
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
            <option value="mock">Mock</option>
            <option value="local-chatgpt-codex">Local Codex</option>
          </select>
        </label>
      </section>

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
          Loading {panelState.label}...
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
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="이 작업을 닫기 전에 확인해야 할 내용을 입력하세요."
        />
        <div className="button-row">
          <button
            type="button"
            className="button-secondary"
            onClick={handleRetrieve}
            disabled={panelState.state !== "ready" || !question.trim()}
          >
            근거 불러오기
          </button>
          <button type="button" className="button-primary" onClick={handleGenerateAndSave} disabled={!canGenerate}>
            검토안 생성
          </button>
        </div>
        {generateBlockReason ? <p className="action-hint">{generateBlockReason}</p> : null}
      </section>

      <section className="external-evidence-block panel-section">
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
            {externalExpanded ? "닫기" : "추가"}
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
        {externalStatus ? <p className="muted" aria-live="polite">{externalStatus}</p> : null}
      </section>

      {legalSourceVerification ? (
        <section className="verification-block panel-section" aria-label="Official law source verification">
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

      <section className="evidence-list panel-section">
        <div className="section-heading">
          <div>
            <h2>근거</h2>
            <p>
              {evidence.length > 0
                ? `${evidence.length}개 출처를 불러왔습니다.`
                : "아직 불러온 출처가 없습니다."}
            </p>
          </div>
        </div>
        {unavailableEvidenceKinds.length > 0 ? (
          <div className="missing-evidence" role="status">
            <strong>사용할 수 없는 근거</strong>
            <p>{unavailableEvidenceKinds.map(formatEvidenceKind).join(", ")}</p>
          </div>
        ) : null}
        {evidence.length === 0 ? <p className="muted">SaaS에서 불러온 근거가 여기에 표시됩니다.</p> : null}
        {evidence.map((item) => (
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
        ))}
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
          {output.draftSummary ? (
            <div className="summary-editor">
              <h2>작업 요약</h2>
              <p>{output.draftSummary.conclusion}</p>
              <small>{output.draftSummary.scope}</small>
              <div className="button-row">
                <button type="button" className="button-primary" onClick={() => handleSaveSummary("approved")}>
                  승인
                </button>
                <button type="button" className="button-secondary" onClick={() => handleSaveSummary("deferred")}>
                  나중에
                </button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {summaryStatus ? <p className="save-state" aria-live="polite">{summaryStatus}</p> : null}
    </main>
  );
}

function formatOfficialLawVerificationStatus(report: OfficialLawVerificationReport) {
  if (report.status === "not_required") {
    return "No official law source verification was required for this task.";
  }

  const verifiedCount = report.sources.filter((source) => source.status === "verified").length;
  if (report.status === "verified") {
    return `${verifiedCount} official law source${verifiedCount === 1 ? "" : "s"} verified at ${report.checkedAt}.`;
  }

  return `Official law source verification failed at ${report.checkedAt}.`;
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
