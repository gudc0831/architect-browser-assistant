import { detectTaskContext } from "./task-context-detector";
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
import type { LocalRuntimeExtensionMessage, LocalRuntimeExtensionResponse } from "../runtime/native-bridge-contract";

type PageLocalRuntimeRequest = {
  type: "architect:page-local-runtime-request";
  requestId?: unknown;
  command?: unknown;
  input?: unknown;
};

type PageLocalRuntimeResponse = {
  type: "architect:page-local-runtime-response";
  requestId: string;
} & LocalRuntimeExtensionResponse<unknown | BrowserCapturePayload>;

type ExtensionBackgroundMessage =
  | LocalRuntimeExtensionMessage
  | BrowserCaptureExtensionMessage
  | OfficialLawVerificationExtensionMessage;

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
  if (event.source !== window || event.origin !== window.location.origin || !isPageLocalRuntimeRequest(event.data)) {
    return;
  }

  void handlePageLocalRuntimeRequest(event.data);
});

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

async function withOfficialLawVerification(
  message: Extract<LocalRuntimeExtensionMessage, { type: "architect:local-runtime-generate" }>,
): Promise<Extract<LocalRuntimeExtensionMessage, { type: "architect:local-runtime-generate" }> | { ok: false; error: string }> {
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

function isPageLocalRuntimeRequest(value: unknown): value is PageLocalRuntimeRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as PageLocalRuntimeRequest;
  return (
    message.type === "architect:page-local-runtime-request" &&
    typeof message.requestId === "string" &&
    (message.command === "status" || message.command === "generate" || message.command === "select-region")
  );
}

function toExtensionRuntimeMessage(request: PageLocalRuntimeRequest): LocalRuntimeExtensionMessage | null {
  if (request.command === "status") {
    return { type: "architect:local-runtime-status" };
  }

  if (request.command === "generate") {
    const input = normalizeGenerateInput(request.input);
    if (!input) {
      return null;
    }

    return {
      type: "architect:local-runtime-generate",
      input,
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
    taskContext,
    evidence,
  };
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
    chrome.runtime.sendMessage(message, (response?: LocalRuntimeExtensionResponse<unknown | BrowserCapturePayload>) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        resolve({ ok: false, error: lastError.message ?? "Chrome extension runtime failed." });
        return;
      }

      resolve(response ?? { ok: false, error: "Chrome extension runtime returned no response." });
    });
  });
}

function postPageLocalRuntimeResponse(response: PageLocalRuntimeResponse) {
  window.postMessage(response, window.location.origin);
}
