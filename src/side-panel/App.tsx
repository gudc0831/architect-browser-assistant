import { useEffect, useMemo, useState } from "react";
import { createAssistantRuntime } from "../runtime/runtime-factory";
import type { AssistantRuntimeStatus, AssistantRuntimeOutput } from "../runtime/ArchitectLocalAssistantRuntime";
import { retrieveEvidence, saveAssistantRecord, saveWorkSummaryDraft } from "../saas/client";
import type { AssistantEvidence, AssistantTaskContext } from "../saas/contracts";
import { writeSafeSetting } from "../storage/safe-storage";

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

export function App() {
  const [panelState, setPanelState] = useState<PanelState>({ state: "idle" });
  const [runtimeStatus, setRuntimeStatus] = useState<AssistantRuntimeStatus | null>(null);
  const [question, setQuestion] = useState("");
  const [taskContext, setTaskContext] = useState<AssistantTaskContext | null>(null);
  const [evidence, setEvidence] = useState<AssistantEvidence[]>([]);
  const [output, setOutput] = useState<AssistantRuntimeOutput | null>(null);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [summaryStatus, setSummaryStatus] = useState<string>("");

  useEffect(() => {
    void refreshTaskContext();
    void refreshRuntimeStatus();
  }, []);

  const canGenerate = useMemo(() => Boolean(taskContext && question.trim() && runtimeStatus?.available), [question, runtimeStatus, taskContext]);

  async function refreshTaskContext() {
    setPanelState({ state: "loading", label: "task context" });
    const response = await chrome.runtime.sendMessage({ type: "architect:get-task-context" });
    if (!response?.ok) {
      setPanelState({ state: "error", message: response?.error ?? "Task context unavailable" });
      return;
    }

    await writeSafeSetting("lastTaskId", response.data.taskId);
    setPanelState({ state: "ready", task: response.data });
  }

  async function refreshRuntimeStatus() {
    const runtime = await createAssistantRuntime();
    setRuntimeStatus(await runtime.isAvailable());
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
        <span>{runtimeStatus?.available ? "Runtime ready" : "Runtime unavailable"}</span>
        <strong>{runtimeStatus?.mode ?? "checking"}</strong>
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
