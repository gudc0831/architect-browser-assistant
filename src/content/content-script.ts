import { detectTaskContext } from "./task-context-detector";
import type { AssistantRuntimeInput } from "../runtime/ArchitectLocalAssistantRuntime";
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
} & LocalRuntimeExtensionResponse<unknown>;

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
  const message = toExtensionRuntimeMessage(request);
  if (!message) {
    postPageLocalRuntimeResponse({
      type: "architect:page-local-runtime-response",
      requestId,
      ok: false,
      error: "Unsupported local runtime bridge command.",
    });
    return;
  }

  const response = await sendBackgroundMessage(message);
  postPageLocalRuntimeResponse({
    type: "architect:page-local-runtime-response",
    requestId,
    ...response,
  });
}

function isPageLocalRuntimeRequest(value: unknown): value is PageLocalRuntimeRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as PageLocalRuntimeRequest;
  return (
    message.type === "architect:page-local-runtime-request" &&
    typeof message.requestId === "string" &&
    (message.command === "status" || message.command === "generate")
  );
}

function toExtensionRuntimeMessage(request: PageLocalRuntimeRequest): LocalRuntimeExtensionMessage | null {
  if (request.command === "status") {
    return { type: "architect:local-runtime-status" };
  }

  if (request.command === "generate") {
    return {
      type: "architect:local-runtime-generate",
      input: request.input as AssistantRuntimeInput,
    };
  }

  return null;
}

function sendBackgroundMessage(message: LocalRuntimeExtensionMessage): Promise<LocalRuntimeExtensionResponse<unknown>> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response?: LocalRuntimeExtensionResponse<unknown>) => {
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
