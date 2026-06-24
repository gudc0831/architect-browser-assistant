import { detectTaskContext } from "./task-context-detector";
import { requiresOfficialLawVerification } from "../legal/official-law-api";
import type { AssistantRuntimeInput } from "../runtime/ArchitectLocalAssistantRuntime";
import type { AssistantEvidenceKind } from "../saas/contracts";
import type {
  BrowserCaptureExtensionMessage,
  BrowserCapturePayload,
  BrowserCaptureRegion,
  BrowserCaptureViewport,
} from "../runtime/browser-capture-contract";
import type {
  OfficialLawVerificationExtensionData,
  OfficialLawVerificationExtensionMessage,
} from "../runtime/legal-verification-contract";
import {
  BRIDGE_SCHEMA_VERSION,
  normalizeCodexOptions,
  normalizeUsageRangeDays,
  type LocalRuntimeExtensionMessage,
  type LocalRuntimeExtensionResponse,
} from "../runtime/native-bridge-contract";
import {
  SIDE_PANEL_CONTEXT_UPDATED_EVENT,
  UPDATE_SIDE_PANEL_CONTEXT_MESSAGE,
  normalizeSidePanelContextSnapshot,
  normalizeSidePanelLaunchContext,
  type SidePanelContextUpdateExtensionMessage,
  type SidePanelOpenExtensionMessage,
} from "../runtime/side-panel-contract";

type PageLocalRuntimeRequest = {
  type: "architect:page-local-runtime-request";
  requestId?: unknown;
  command?: unknown;
  input?: unknown;
  codexOptions?: unknown;
};

type PageLocalRuntimeResponse = {
  type: "architect:page-local-runtime-response";
  requestId: string;
} & LocalRuntimeExtensionResponse<unknown | BrowserCapturePayload>;

type PageLocalRuntimeReadyEvent = {
  type: "architect:page-local-runtime-ready";
  bridgeSchemaVersion: number;
  extensionId: string;
  origin: string;
  injectedAt: string;
};

type PageSidePanelRequest = {
  type: "architect:page-side-panel-request";
  requestId?: unknown;
  input?: unknown;
};

type PageSidePanelResponse = {
  type: "architect:page-side-panel-response";
  requestId: string;
} & LocalRuntimeExtensionResponse<unknown>;

type ExtensionBackgroundMessage =
  | LocalRuntimeExtensionMessage
  | BrowserCaptureExtensionMessage
  | OfficialLawVerificationExtensionMessage
  | SidePanelOpenExtensionMessage
  | SidePanelContextUpdateExtensionMessage;

const PAGE_LOCAL_RUNTIME_READY = "architect:page-local-runtime-ready";
const EXTENSION_CONTEXT_INVALIDATED_ERROR_CODE = "extension_context_invalidated";
const EXTENSION_CONTEXT_INVALIDATED_MESSAGE =
  "Chrome 확장이 새로 로드되었습니다. /daily 탭을 새로고침한 뒤 오른쪽 패널을 다시 여세요.";

const assistantEvidenceKinds = new Set<AssistantEvidenceKind>([
  "central_knowledge",
  "regulation",
  "task",
  "project_document",
  "web_or_skill",
]);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "architect:detect-task-context") {
    return false;
  }

  const context = detectTaskContext(window.location.href, document);
  sendResponse(context ? { ok: true, data: context } : { ok: false, error: "Current page is not a supported task view" });
  return false;
});

window.addEventListener("message", (event) => {
  if (event.source !== window || event.origin !== window.location.origin) {
    return;
  }

  if (isPageLocalRuntimeRequest(event.data)) {
    void handlePageLocalRuntimeRequest(event.data);
    return;
  }

  if (isPageSidePanelRequest(event.data)) {
    void handlePageSidePanelRequest(event.data);
  }
});

window.addEventListener(SIDE_PANEL_CONTEXT_UPDATED_EVENT, (event) => {
  if (!(event instanceof CustomEvent)) {
    return;
  }

  const context = normalizeSidePanelContextSnapshot(event.detail);
  if (!context) {
    return;
  }

  void sendBackgroundMessage({
    type: UPDATE_SIDE_PANEL_CONTEXT_MESSAGE,
    input: context,
  });
});

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element
    ? event.target.closest<HTMLElement>("[data-architect-side-panel-launch='true']")
    : null;
  if (!target) {
    return;
  }

  const requestId = target.dataset.architectSidePanelRequestId || `architect-side-panel-${Date.now()}`;
  void handlePageSidePanelRequest({
    type: "architect:page-side-panel-request",
    requestId,
    input: {
      taskId: target.dataset.architectSidePanelTaskId,
      projectId: target.dataset.architectSidePanelProjectId,
      title: target.dataset.architectSidePanelTitle,
      question: target.dataset.architectSidePanelQuestion,
      url: window.location.href,
    },
  });
}, true);

postPageLocalRuntimeReady();

async function handlePageLocalRuntimeRequest(request: PageLocalRuntimeRequest) {
  const requestId = String(request.requestId);

  try {
    if (request.command === "select-region") {
      const selection = await selectBrowserRegion();
      const response = await sendBackgroundMessage({
        type: "architect:capture-visible-tab",
        input: selection,
      });
      const responseWithCrop =
        response.ok && isBrowserCapturePayload(response.data)
          ? {
              ...response,
              data: {
                ...response.data,
                cropDataUrl: await cropCaptureImage(response.data.dataUrl, selection.pixelRegion, selection.viewport),
              },
            }
          : response;
      postPageLocalRuntimeResponse({
        type: "architect:page-local-runtime-response",
        requestId,
        ...responseWithCrop,
      });
      return;
    }

    if (request.command === "verify-official-law") {
      const input = normalizeGenerateInput(request.input);
      if (!input) {
        postPageLocalRuntimeResponse({
          type: "architect:page-local-runtime-response",
          requestId,
          ok: false,
          error: "Invalid official law verification payload.",
        });
        return;
      }

      const response = await sendBackgroundMessage({
        type: "architect:verify-official-law-evidence",
        input,
      });
      postPageLocalRuntimeResponse({
        type: "architect:page-local-runtime-response",
        requestId,
        ...response,
      });
      return;
    }

    const message = toExtensionRuntimeMessage(request);
    if (!message) {
      postPageLocalRuntimeResponse({
        type: "architect:page-local-runtime-response",
        requestId,
        ok: false,
        error:
          request.command === "generate"
            ? "Invalid local runtime generate payload."
            : "Unsupported local runtime bridge command.",
      });
      return;
    }

    const checkedMessage =
      message.type === "architect:local-runtime-generate" ? await withOfficialLawVerification(message) : message;
    if (isBridgeFailure(checkedMessage)) {
      postPageLocalRuntimeResponse({
        type: "architect:page-local-runtime-response",
        requestId,
        ...checkedMessage,
      });
      return;
    }

    const response = await sendBackgroundMessage(checkedMessage);
    postPageLocalRuntimeResponse({
      type: "architect:page-local-runtime-response",
      requestId,
      ...response,
    });
  } catch (error) {
    postPageLocalRuntimeResponse({
      type: "architect:page-local-runtime-response",
      requestId,
      ok: false,
      error: error instanceof Error ? error.message : "Browser capture failed.",
    });
  }
}

async function handlePageSidePanelRequest(request: PageSidePanelRequest) {
  const requestId = String(request.requestId);
  const input = normalizeSidePanelLaunchContext(request.input);
  if (!input) {
    postPageSidePanelResponse({
      type: "architect:page-side-panel-response",
      requestId,
      ok: false,
      error: "Invalid side panel launch payload.",
    });
    return;
  }

  try {
    const response = await sendBackgroundMessage({
      type: "architect:open-side-panel",
      input,
    });
    postPageSidePanelResponse({
      type: "architect:page-side-panel-response",
      requestId,
      ...response,
    });
  } catch (error) {
    postPageSidePanelResponse({
      type: "architect:page-side-panel-response",
      requestId,
      ok: false,
      error: error instanceof Error ? error.message : "Side panel launch failed.",
    });
  }
}

async function withOfficialLawVerification(
  message: Extract<LocalRuntimeExtensionMessage, { type: "architect:local-runtime-generate" }>,
): Promise<Extract<LocalRuntimeExtensionMessage, { type: "architect:local-runtime-generate" }> | { ok: false; error: string }> {
  if (!needsOfficialLawVerificationPreflight(message.input)) {
    return message;
  }

  const response = await sendBackgroundMessage({
    type: "architect:verify-official-law-evidence",
    input: message.input,
  });

  if (!response.ok) {
    return { ok: false, error: response.error };
  }

  if (!isOfficialLawVerificationData(response.data)) {
    return { ok: false, error: "Official law source verification returned an invalid response." };
  }

  if (response.data.report.status === "failed") {
    return {
      ok: false,
      error: [
        "Official law source verification failed.",
        ...response.data.report.failures,
        ...response.data.report.retry.map((item) => `Retry: ${item}`),
      ].join(" "),
    };
  }

  return {
    ...message,
    input: {
      ...message.input,
      evidence: response.data.evidence,
    },
  };
}

function needsOfficialLawVerificationPreflight(input: AssistantRuntimeInput): boolean {
  return requiresOfficialLawVerification(input.question, [...input.evidence, ...(input.legalEvidence ?? [])]);
}

function isPageLocalRuntimeRequest(value: unknown): value is PageLocalRuntimeRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as PageLocalRuntimeRequest;
  return (
    message.type === "architect:page-local-runtime-request" &&
    typeof message.requestId === "string" &&
    (message.command === "status" ||
      message.command === "usage-summary" ||
      message.command === "model-catalog" ||
      message.command === "generate" ||
      message.command === "select-region" ||
      message.command === "verify-official-law")
  );
}

function isPageSidePanelRequest(value: unknown): value is PageSidePanelRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as PageSidePanelRequest;
  return message.type === "architect:page-side-panel-request" && typeof message.requestId === "string";
}

function toExtensionRuntimeMessage(request: PageLocalRuntimeRequest): LocalRuntimeExtensionMessage | null {
  const codexOptions = normalizeCodexOptions(request.codexOptions);
  if (request.command === "status") {
    return { type: "architect:local-runtime-status", ...(codexOptions ? { codexOptions } : {}) };
  }

  if (request.command === "usage-summary") {
    const rangeDays = normalizeUsageRangeDays(
      request.input && typeof request.input === "object" ? (request.input as { rangeDays?: unknown }).rangeDays : undefined,
    );
    return {
      type: "architect:local-runtime-usage-summary",
      ...(typeof rangeDays === "number" ? { rangeDays } : {}),
      ...(codexOptions ? { codexOptions } : {}),
    };
  }

  if (request.command === "model-catalog") {
    const savedModel =
      request.input && typeof request.input === "object" && typeof (request.input as { savedModel?: unknown }).savedModel === "string"
        ? (request.input as { savedModel: string }).savedModel.trim()
        : undefined;
    return {
      type: "architect:local-runtime-model-catalog",
      ...(savedModel ? { savedModel } : {}),
    };
  }

  if (request.command === "generate") {
    const input = normalizeGenerateInput(request.input);
    if (!input) {
      return null;
    }

    return {
      type: "architect:local-runtime-generate",
      input,
      ...(codexOptions ? { codexOptions } : {}),
    };
  }

  return null;
}

function normalizeGenerateInput(value: unknown): AssistantRuntimeInput | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const input = value as Partial<AssistantRuntimeInput>;
  const question = normalizeRequiredText(input.question, 4000);
  const instruction = normalizeOptionalText(input.instruction, 2000);
  const taskContext = normalizeTaskContext(input.taskContext);
  if (!question || !taskContext || !Array.isArray(input.evidence)) {
    return null;
  }

  const evidence: AssistantRuntimeInput["evidence"] = [];
  for (const item of input.evidence.slice(0, 12)) {
    const normalized = normalizeEvidence(item);
    if (!normalized) {
      return null;
    }
    evidence.push(normalized);
  }

  return {
    question,
    ...(instruction ? { instruction } : {}),
    taskContext,
    evidence,
    legalEvidence: normalizeEvidenceArray(input.legalEvidence),
    projectContextChunks: normalizeProjectContextChunks(input.projectContextChunks),
    projectContextTrace: normalizeProjectContextTrace(input.projectContextTrace),
    evidenceReadinessWarnings: normalizeEvidenceReadinessWarnings(input.evidenceReadinessWarnings),
  };
}

function normalizeEvidenceArray(value: unknown): AssistantRuntimeInput["evidence"] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .slice(0, 12)
    .map(normalizeEvidence)
    .filter((item): item is AssistantRuntimeInput["evidence"][number] => Boolean(item));
}

function normalizeProjectContextChunks(value: unknown): NonNullable<AssistantRuntimeInput["projectContextChunks"]> {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .slice(0, 5)
    .map((item): NonNullable<AssistantRuntimeInput["projectContextChunks"]>[number] | null => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const chunk = item as Record<string, unknown>;
      const chunkId = normalizeRequiredText(chunk.chunkId, 120);
      const sourceDocumentTitle = normalizeRequiredText(chunk.sourceDocumentTitle, 300);
      const normalizedText = normalizeRequiredText(chunk.normalizedText, 2000);
      const sourceQuote = normalizeRequiredText(chunk.sourceQuote, 1000);
      if (!chunkId || !sourceDocumentTitle || !normalizedText || !sourceQuote) {
        return null;
      }
      const normalizedChunk: NonNullable<AssistantRuntimeInput["projectContextChunks"]>[number] = {
        chunkId,
        ...(normalizeOptionalText(chunk.sourceId, 120) ? { sourceId: normalizeOptionalText(chunk.sourceId, 120) } : {}),
        ...(normalizeOptionalText(chunk.versionId, 120) ? { versionId: normalizeOptionalText(chunk.versionId, 120) } : {}),
        sourceDocumentTitle,
        normalizedText,
        sourceQuote,
        contextType: normalizeOptionalText(chunk.contextType, 120),
        chunkQualityScore: Number.isFinite(Number(chunk.chunkQualityScore)) ? Number(chunk.chunkQualityScore) : undefined,
        injectionRisk: normalizeOptionalText(chunk.injectionRisk, 80),
        score: Number.isFinite(Number(chunk.score)) ? Number(chunk.score) : undefined,
      };
      const location = normalizeProjectContextLocation(chunk.location);
      if (location) {
        normalizedChunk.location = location;
      }
      return normalizedChunk;
    })
    .filter((item): item is NonNullable<AssistantRuntimeInput["projectContextChunks"]>[number] => Boolean(item));
}

function normalizeProjectContextLocation(
  value: unknown,
): NonNullable<NonNullable<AssistantRuntimeInput["projectContextChunks"]>[number]["location"]> | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const location = value as Record<string, unknown>;
  const normalized: NonNullable<NonNullable<AssistantRuntimeInput["projectContextChunks"]>[number]["location"]> = {};
  const locationType = normalizeOptionalText(location.locationType, 80);
  const sectionLabel = normalizeOptionalText(location.sectionLabel, 160);
  const pageNumber = Number(location.pageNumber);
  const lineStart = Number(location.lineStart);
  const lineEnd = Number(location.lineEnd);
  if (locationType) {
    normalized.locationType = locationType;
  }
  if (Number.isInteger(pageNumber) && pageNumber > 0 && pageNumber <= 10000) {
    normalized.pageNumber = pageNumber;
  }
  if (Number.isInteger(lineStart) && lineStart > 0 && lineStart <= 1000000) {
    normalized.lineStart = lineStart;
  }
  if (Number.isInteger(lineEnd) && lineEnd > 0 && lineEnd <= 1000000) {
    normalized.lineEnd = lineEnd;
  }
  if (sectionLabel) {
    normalized.sectionLabel = sectionLabel;
  }
  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

function normalizeProjectContextTrace(value: unknown): AssistantRuntimeInput["projectContextTrace"] | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const trace = value as Record<string, unknown>;
  const status =
    trace.status === "chunks_found" ||
    trace.status === "active_corpus_missing" ||
    trace.status === "no_relevant_chunks" ||
    trace.status === "search_failed"
      ? trace.status
      : undefined;
  const fallbackMode = trace.fallbackMode === "legal_only_after_project_context_error" ? "legal_only_after_project_context_error" : "none";
  if (!status) {
    return undefined;
  }
  return {
    corpusType: trace.corpusType === "project_context" ? "project_context" : undefined,
    status,
    traceId: normalizeOptionalText(trace.traceId, 120) || null,
    fallbackMode,
    activeVersionIds: normalizeProjectContextIdList(trace.activeVersionIds),
    candidateChunkIds: normalizeProjectContextIdList(trace.candidateChunkIds),
    matchedChunkIds: normalizeProjectContextIdList(trace.matchedChunkIds),
    noRelevantChunkReason: normalizeOptionalText(trace.noRelevantChunkReason, 200) || null,
    searchErrorCode: normalizeOptionalText(trace.searchErrorCode, 120) || null,
    includedChunkIds: normalizeProjectContextIdList(trace.includedChunkIds),
  };
}

function normalizeProjectContextIdList(value: unknown) {
  return Array.isArray(value)
    ? value.map((id) => normalizeOptionalText(id, 120)).filter(Boolean).slice(0, 12)
    : [];
}

function normalizeEvidenceReadinessWarnings(value: unknown): NonNullable<AssistantRuntimeInput["evidenceReadinessWarnings"]> {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .slice(0, 8)
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const warning = item as Record<string, unknown>;
      const code = normalizeRequiredText(warning.code, 120);
      const message = normalizeRequiredText(warning.message, 500);
      return code && message ? { code, message } : null;
    })
    .filter((item): item is NonNullable<AssistantRuntimeInput["evidenceReadinessWarnings"]>[number] => Boolean(item));
}

function normalizeTaskContext(value: unknown): AssistantRuntimeInput["taskContext"] | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const task = value as Partial<AssistantRuntimeInput["taskContext"]>;
  const taskId = normalizeRequiredText(task.taskId, 120);
  const projectId = normalizeRequiredText(task.projectId, 120);
  if (!taskId || !projectId) {
    return null;
  }

  return {
    taskId,
    projectId,
    title: normalizeOptionalText(task.title, 300),
    description: normalizeOptionalText(task.description, 2000),
    status: normalizeOptionalText(task.status, 80),
    issueId: normalizeOptionalText(task.issueId, 120),
    projectName: normalizeOptionalText(task.projectName, 300),
  };
}

function normalizeEvidence(value: unknown): AssistantRuntimeInput["evidence"][number] | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const evidence = value as Partial<AssistantRuntimeInput["evidence"][number]>;
  const id = normalizeRequiredText(evidence.id, 120);
  const kind = assistantEvidenceKinds.has(evidence.kind as AssistantEvidenceKind)
    ? (evidence.kind as AssistantEvidenceKind)
    : null;
  const title = normalizeRequiredText(evidence.title, 300);
  const excerpt = normalizeRequiredText(evidence.excerpt, 1800);
  if (!id || !kind || !title || !excerpt) {
    return null;
  }

  const priority = Number(evidence.priority);
  return {
    id,
    kind,
    priority: Number.isFinite(priority) ? priority : 99,
    title,
    excerpt,
    ...(normalizeOptionalText(evidence.sourceUrl, 500) ? { sourceUrl: normalizeOptionalText(evidence.sourceUrl, 500) } : {}),
    ...(normalizeOptionalText(evidence.recordId, 120) ? { recordId: normalizeOptionalText(evidence.recordId, 120) } : {}),
    ...(Number.isFinite(Number(evidence.confidenceWeight)) ? { confidenceWeight: Number(evidence.confidenceWeight) } : {}),
    ...(normalizeOptionalText(evidence.officialSourceName, 120)
      ? { officialSourceName: normalizeOptionalText(evidence.officialSourceName, 120) }
      : {}),
    ...(normalizeOptionalText(evidence.lawName, 200) ? { lawName: normalizeOptionalText(evidence.lawName, 200) } : {}),
    ...(normalizeOptionalText(evidence.articleLabel, 80)
      ? { articleLabel: normalizeOptionalText(evidence.articleLabel, 80) }
      : {}),
    ...(normalizeOptionalText(evidence.articleNumber, 20)
      ? { articleNumber: normalizeOptionalText(evidence.articleNumber, 20) }
      : {}),
    ...(normalizeOptionalText(evidence.effectiveDate, 40)
      ? { effectiveDate: normalizeOptionalText(evidence.effectiveDate, 40) }
      : {}),
    ...(normalizeOptionalText(evidence.checkedAt, 80) ? { checkedAt: normalizeOptionalText(evidence.checkedAt, 80) } : {}),
    ...(normalizeOptionalText(evidence.apiSourceUrl, 500)
      ? { apiSourceUrl: normalizeOptionalText(evidence.apiSourceUrl, 500) }
      : {}),
    ...(isVerificationStatus(evidence.verificationStatus)
      ? { verificationStatus: evidence.verificationStatus }
      : {}),
  };
}

function isBridgeFailure(value: unknown): value is { ok: false; error: string } {
  return Boolean(value && typeof value === "object" && (value as { ok?: unknown }).ok === false);
}

function isOfficialLawVerificationData(value: unknown): value is OfficialLawVerificationExtensionData {
  return Boolean(
    value &&
      typeof value === "object" &&
      Array.isArray((value as OfficialLawVerificationExtensionData).evidence) &&
      typeof (value as OfficialLawVerificationExtensionData).report?.status === "string",
  );
}

function isVerificationStatus(value: unknown): value is NonNullable<AssistantRuntimeInput["evidence"][number]["verificationStatus"]> {
  return value === "verified" || value === "needs_review" || value === "failed";
}

function normalizeRequiredText(value: unknown, maxLength: number) {
  const normalized = normalizeOptionalText(value, maxLength);
  return normalized || null;
}

function normalizeOptionalText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.replaceAll("\0", "").trim().slice(0, maxLength) : "";
}

function selectBrowserRegion(): Promise<{
  region: BrowserCaptureRegion;
  pixelRegion: BrowserCaptureRegion;
  viewport: BrowserCaptureViewport;
}> {
  return new Promise((resolve, reject) => {
    const body = document.body;
    if (!body) {
      reject(new Error("Page is not ready for region selection."));
      return;
    }

    const overlay = document.createElement("div");
    overlay.dataset.architectRegionSelector = "overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483647",
      cursor: "crosshair",
      background: "rgba(15, 23, 42, 0.18)",
    });

    const selectionBox = document.createElement("div");
    selectionBox.dataset.architectRegionSelector = "box";
    Object.assign(selectionBox.style, {
      position: "fixed",
      display: "none",
      border: "2px solid #2563eb",
      background: "rgba(37, 99, 235, 0.18)",
      boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.28)",
      pointerEvents: "none",
    });

    const label = document.createElement("div");
    label.textContent = "Select region";
    Object.assign(label.style, {
      position: "fixed",
      top: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "6px 10px",
      borderRadius: "6px",
      background: "rgba(15, 23, 42, 0.9)",
      color: "#fff",
      font: "12px system-ui, sans-serif",
      pointerEvents: "none",
    });

    let startX = 0;
    let startY = 0;
    let dragging = false;

    function cleanup() {
      overlay.removeEventListener("pointerdown", handlePointerDown);
      overlay.removeEventListener("pointermove", handlePointerMove);
      overlay.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("keydown", handleKeyDown, true);
      overlay.remove();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      cleanup();
      reject(new Error("Region selection was cancelled."));
    }

    function handlePointerDown(event: PointerEvent) {
      event.preventDefault();
      dragging = true;
      startX = clamp(event.clientX, 0, window.innerWidth);
      startY = clamp(event.clientY, 0, window.innerHeight);
      selectionBox.style.display = "block";
      updateSelectionBox(startX, startY, startX, startY, selectionBox);
      if ("setPointerCapture" in overlay && typeof event.pointerId === "number") {
        overlay.setPointerCapture(event.pointerId);
      }
    }

    function handlePointerMove(event: PointerEvent) {
      if (!dragging) {
        return;
      }
      updateSelectionBox(startX, startY, event.clientX, event.clientY, selectionBox);
    }

    function handlePointerUp(event: PointerEvent) {
      if (!dragging) {
        return;
      }

      event.preventDefault();
      dragging = false;
      const pixelRegion = makePixelRegion(startX, startY, event.clientX, event.clientY);
      if (pixelRegion.width < 4 || pixelRegion.height < 4) {
        cleanup();
        reject(new Error("Selected region is too small."));
        return;
      }

      const viewport = getViewport();
      const region = {
        x: toPercent(pixelRegion.x, viewport.width),
        y: toPercent(pixelRegion.y, viewport.height),
        width: toPercent(pixelRegion.width, viewport.width),
        height: toPercent(pixelRegion.height, viewport.height),
        unit: "percent" as const,
      };

      cleanup();
      resolve({ region, pixelRegion, viewport });
    }

    overlay.append(selectionBox, label);
    body.append(overlay);
    overlay.addEventListener("pointerdown", handlePointerDown);
    overlay.addEventListener("pointermove", handlePointerMove);
    overlay.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("keydown", handleKeyDown, true);
  });
}

function updateSelectionBox(startX: number, startY: number, currentX: number, currentY: number, element: HTMLElement) {
  const region = makePixelRegion(startX, startY, currentX, currentY);
  Object.assign(element.style, {
    left: `${region.x}px`,
    top: `${region.y}px`,
    width: `${region.width}px`,
    height: `${region.height}px`,
  });
}

function makePixelRegion(startX: number, startY: number, currentX: number, currentY: number): BrowserCaptureRegion {
  const endX = clamp(currentX, 0, window.innerWidth);
  const endY = clamp(currentY, 0, window.innerHeight);
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(Math.abs(endX - startX)),
    height: Math.round(Math.abs(endY - startY)),
    unit: "px",
  };
}

function getViewport(): BrowserCaptureViewport {
  return {
    width: Math.max(1, window.innerWidth),
    height: Math.max(1, window.innerHeight),
    devicePixelRatio: window.devicePixelRatio || 1,
  };
}

function toPercent(value: number, total: number) {
  return Math.round((value / Math.max(1, total)) * 10000) / 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isBrowserCapturePayload(value: unknown): value is BrowserCapturePayload {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as BrowserCapturePayload).dataUrl === "string" &&
      typeof (value as BrowserCapturePayload).url === "string",
  );
}

async function cropCaptureImage(dataUrl: string, pixelRegion: BrowserCaptureRegion, viewport: BrowserCaptureViewport) {
  const canvas = document.createElement("canvas");
  const context = safeCanvasContext(canvas);
  if (!context) {
    return dataUrl;
  }

  const image = await loadImage(dataUrl);
  const scaleX = image.naturalWidth / Math.max(1, viewport.width);
  const scaleY = image.naturalHeight / Math.max(1, viewport.height);
  const sx = Math.round(pixelRegion.x * scaleX);
  const sy = Math.round(pixelRegion.y * scaleY);
  const sw = Math.max(1, Math.round(pixelRegion.width * scaleX));
  const sh = Math.max(1, Math.round(pixelRegion.height * scaleY));
  canvas.width = sw;
  canvas.height = sh;
  context.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
  return canvas.toDataURL("image/png");
}

function safeCanvasContext(canvas: HTMLCanvasElement) {
  try {
    if (navigator.userAgent.toLowerCase().includes("jsdom")) {
      return null;
    }
    return canvas.getContext("2d");
  } catch {
    return null;
  }
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Captured screenshot could not be decoded."));
    image.src = dataUrl;
  });
}

function sendBackgroundMessage(
  message: ExtensionBackgroundMessage,
): Promise<LocalRuntimeExtensionResponse<unknown | BrowserCapturePayload>> {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(message, (response?: LocalRuntimeExtensionResponse<unknown | BrowserCapturePayload>) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          resolve(toChromeRuntimeFailure(lastError.message ?? "Chrome extension runtime failed."));
          return;
        }

        resolve(response ?? { ok: false, error: "Chrome extension runtime returned no response." });
      });
    } catch (error) {
      resolve(toChromeRuntimeFailure(error));
    }
  });
}

function toChromeRuntimeFailure(error: unknown): LocalRuntimeExtensionResponse<unknown | BrowserCapturePayload> {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "Chrome extension runtime failed.";
  if (isExtensionContextInvalidatedMessage(message)) {
    return {
      ok: false,
      error: EXTENSION_CONTEXT_INVALIDATED_MESSAGE,
      errorCode: EXTENSION_CONTEXT_INVALIDATED_ERROR_CODE,
    };
  }

  return { ok: false, error: message };
}

function isExtensionContextInvalidatedMessage(message: string) {
  return message.toLowerCase().includes("extension context invalidated");
}

function postPageLocalRuntimeResponse(response: PageLocalRuntimeResponse) {
  window.postMessage(response, window.location.origin);
}

function postPageSidePanelResponse(response: PageSidePanelResponse) {
  window.postMessage(response, window.location.origin);
}

function postPageLocalRuntimeReady() {
  const readyEvent: PageLocalRuntimeReadyEvent = {
    type: PAGE_LOCAL_RUNTIME_READY,
    bridgeSchemaVersion: BRIDGE_SCHEMA_VERSION,
    extensionId: chrome.runtime.id,
    origin: window.location.origin,
    injectedAt: new Date().toISOString(),
  };
  window.postMessage(readyEvent, window.location.origin);
}
