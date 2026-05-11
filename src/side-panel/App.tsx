import { useEffect, useMemo, useState } from "react";
import { createAssistantRuntime } from "../runtime/runtime-factory";
import type { AssistantRuntimeStatus, AssistantRuntimeOutput } from "../runtime/ArchitectLocalAssistantRuntime";
import { retrieveEvidence, saveAssistantRecord, saveExternalEvidence, saveWorkSummaryDraft } from "../saas/client";
import type { AssistantEvidence, AssistantTaskContext, ExternalEvidenceSourceType } from "../saas/contracts";
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
  const [summaryStatus, setSummaryStatus] = useState<string>("");
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

  const canGenerate = useMemo(() => Boolean(taskContext && question.trim() && runtimeStatus?.available), [question, runtimeStatus, taskContext]);
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
    setSummaryStatus("");
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
      setEvidence(result.evidence);
      setPanelState({ state: "ready", task: panelState.task });
    } catch (error) {
      setPanelState({ state: "error", message: error instanceof Error ? error.message : "SaaS retrieval failed" });
    }
  }

  async function handleGenerateAndSave() {
    if (!taskContext || !canGenerate) {
      return;
    }

    const runtime = await createAssistantRuntime();
    setSummaryStatus("Generating answer...");
    try {
      const generated = await runtime.generateAnswer({ question, taskContext, evidence });
      setOutput(generated);
      const saved = await saveAssistantRecord({
        taskId: taskContext.taskId,
        question,
        answer: generated.answer,
        evidence,
        executionMode: runtimeStatus?.mode ?? "mock",
        runtimeMode: runtimeStatus?.mode ?? "mock",
        draftSummary: generated.draftSummary,
      });
      setRecordId(saved.id);
      setSummaryStatus(`Saved record with confidence ${saved.confidenceScore}%`);
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

  return (
    <main className="panel-shell">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Architect Assistant</p>
          <h1>{taskTitle}</h1>
        </div>
        <button type="button" className="icon-button" title="Refresh task context" onClick={refreshTaskContext}>
          ↻
        </button>
      </header>

      <section className="status-strip">
        <div>
          <span>{runtimeStatus?.available ? "Runtime ready" : "Runtime unavailable"}</span>
          {runtimeStatus?.reason ? <small>{runtimeStatus.reason}</small> : null}
        </div>
        <label className="mode-select">
          <span>Mode</span>
          <select
            value={runtimeMode}
            onChange={(event) => void handleRuntimeModeChange(event.target.value as RuntimeMode)}
          >
            <option value="mock">Mock</option>
            <option value="local-chatgpt-codex">Local Codex</option>
          </select>
        </label>
      </section>

      {panelState.state === "error" ? <p className="error-text">{panelState.message}</p> : null}
      {panelState.state === "loading" ? <p className="muted">Loading {panelState.label}...</p> : null}

      <section className="composer">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="이 task에 대해 검토할 질문을 입력하세요."
        />
        <div className="button-row">
          <button type="button" onClick={handleRetrieve} disabled={panelState.state !== "ready" || !question.trim()}>
            Retrieve
          </button>
          <button type="button" onClick={handleGenerateAndSave} disabled={!canGenerate}>
            Generate
          </button>
        </div>
      </section>

      <section className="external-evidence-block">
        <div className="section-heading">
          <h2>External Evidence</h2>
          <span>{externalAllowed ? "user approved" : "off"}</span>
        </div>
        <label className="check-row">
          <input
            type="checkbox"
            checked={externalAllowed}
            onChange={(event) => setExternalAllowed(event.target.checked)}
          />
          <span>Save this as user-approved web/skill evidence for the selected task</span>
        </label>
        <div className="field-grid">
          <label>
            <span>Source type</span>
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
            <span>Title</span>
            <input
              value={externalTitle}
              onChange={(event) => setExternalTitle(event.target.value)}
              disabled={!externalAllowed}
              placeholder="Source title or skill result name"
            />
          </label>
          <label>
            <span>Source URL</span>
            <input
              value={externalUrl}
              onChange={(event) => setExternalUrl(event.target.value)}
              disabled={!externalAllowed}
              placeholder="https://..."
            />
          </label>
          <label>
            <span>Tool / skill</span>
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
          placeholder="Paste the short evidence excerpt or summarized skill output. Do not paste private pages or full documents."
        />
        <div className="button-row">
          <button type="button" onClick={handleCaptureActiveTab} disabled={!externalAllowed}>
            Capture tab
          </button>
          <button type="button" onClick={handleSaveExternalEvidence} disabled={!canSaveExternalEvidence}>
            Save evidence
          </button>
        </div>
        {externalStatus ? <p className="muted">{externalStatus}</p> : null}
      </section>

      <section className="evidence-list">
        <h2>Evidence</h2>
        {evidence.length === 0 ? <p className="muted">Retrieved SaaS evidence will appear here.</p> : null}
        {evidence.map((item) => (
          <article key={item.id} className="evidence-item">
            <div>
              <strong>{item.title}</strong>
              <span>{item.kind}</span>
            </div>
            <p>{item.excerpt}</p>
            {item.sourceUrl ? (
              <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                Source
              </a>
            ) : null}
          </article>
        ))}
      </section>

      {output ? (
        <section className="answer-block">
          <h2>Answer</h2>
          <p>{output.answer}</p>
          {output.draftSummary ? (
            <div className="summary-editor">
              <h2>Work Summary</h2>
              <p>{output.draftSummary.conclusion}</p>
              <small>{output.draftSummary.scope}</small>
              <div className="button-row">
                <button type="button" onClick={() => handleSaveSummary("approved")}>
                  Approve
                </button>
                <button type="button" onClick={() => handleSaveSummary("deferred")}>
                  Later
                </button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {summaryStatus ? <p className="save-state">{summaryStatus}</p> : null}
    </main>
  );
}
