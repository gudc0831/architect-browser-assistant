import {
  CODEX_NATIVE_HOST,
  makeNativeRequestId,
  type LocalRuntimeExtensionMessage,
  type NativeBridgeRequest,
  type NativeBridgeResponse,
} from "../runtime/native-bridge-contract";
import type { BrowserCaptureExtensionMessage } from "../runtime/browser-capture-contract";
import {
  officialLawSourceToEvidence,
  verifyOfficialLawEvidence,
} from "../legal/official-law-api";
import type {
  OfficialLawVerificationExtensionData,
  OfficialLawVerificationExtensionMessage,
} from "../runtime/legal-verification-contract";

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch((error) => {
    console.error("Failed to configure side panel", error);
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (isLocalRuntimeMessage(message)) {
    handleLocalRuntimeMessage(message)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : "Local runtime failed" });
      });
    return true;
  }

  if (isBrowserCaptureMessage(message)) {
    handleBrowserCaptureMessage(message)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : "Browser capture failed" });
      });
    return true;
  }

  if (isOfficialLawVerificationMessage(message)) {
    handleOfficialLawVerificationMessage(message)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : "Official law source verification failed",
        });
      });
    return true;
  }

  if (message?.type === "architect:get-active-tab-source") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab?.url || !isHttpUrl(tab.url)) {
        sendResponse({ ok: false, error: "Active tab source is not an http(s) page" });
        return;
      }

      sendResponse({
        ok: true,
        data: {
          title: tab.title?.trim() || "Browser source",
          url: tab.url,
          capturedAt: new Date().toISOString(),
        },
      });
    });
    return true;
  }

  if (message?.type !== "architect:get-task-context") {
    return false;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
    if (!tab?.id) {
      sendResponse({ ok: false, error: "No active tab" });
      return;
    }

    try {
      const response = await chrome.tabs.sendMessage(tab.id, { type: "architect:detect-task-context" });
      sendResponse(response ?? { ok: false, error: "No task context response" });
    } catch (error) {
      sendResponse({ ok: false, error: error instanceof Error ? error.message : "Task context unavailable" });
    }
  });

  return true;
});

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isLocalRuntimeMessage(message: unknown): message is LocalRuntimeExtensionMessage {
  if (!message || typeof message !== "object") {
    return false;
  }

  const type = (message as { type?: unknown }).type;
  return (
    type === "architect:local-runtime-status" ||
    type === "architect:local-runtime-capabilities" ||
    type === "architect:local-runtime-generate"
  );
}

function isBrowserCaptureMessage(message: unknown): message is BrowserCaptureExtensionMessage {
  if (!message || typeof message !== "object") {
    return false;
  }

  return (message as { type?: unknown }).type === "architect:capture-visible-tab";
}

function isOfficialLawVerificationMessage(message: unknown): message is OfficialLawVerificationExtensionMessage {
  if (!message || typeof message !== "object") {
    return false;
  }

  return (message as { type?: unknown }).type === "architect:verify-official-law-evidence";
}

async function handleBrowserCaptureMessage(message: BrowserCaptureExtensionMessage) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url || !isHttpUrl(tab.url) || typeof tab.windowId !== "number") {
    return { ok: false, error: "Active tab is not a capturable http(s) page." };
  }

  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" });
  return {
    ok: true,
    data: {
      dataUrl,
      title: tab.title?.trim() || "Browser capture",
      url: tab.url,
      capturedAt: new Date().toISOString(),
      region: message.input.region,
      pixelRegion: message.input.pixelRegion,
      viewport: message.input.viewport,
    },
  };
}

async function handleOfficialLawVerificationMessage(
  message: OfficialLawVerificationExtensionMessage,
): Promise<{ ok: true; data: OfficialLawVerificationExtensionData }> {
  const report = await verifyOfficialLawEvidence({
    question: message.input.question,
    evidence: message.input.evidence,
  });
  const verifiedEvidence = report.sources
    .map(officialLawSourceToEvidence)
    .filter((item): item is OfficialLawVerificationExtensionData["evidence"][number] => Boolean(item));

  return {
    ok: true,
    data: {
      report,
      evidence: [...verifiedEvidence, ...message.input.evidence],
    },
  };
}

async function handleLocalRuntimeMessage(message: LocalRuntimeExtensionMessage) {
  if (message.type === "architect:local-runtime-status") {
    const response = await sendNativeBridgeRequest({ type: "status", requestId: makeNativeRequestId() });
    if (!response.ok) {
      return {
        ok: true,
        data: {
          available: false,
          mode: "local-chatgpt-codex",
          reason: response.error.message,
        },
      };
    }

    return {
      ok: true,
      data: response.status ?? {
        available: true,
        mode: "local-chatgpt-codex",
        reason: "Native Codex bridge responded.",
      },
    };
  }

  if (message.type === "architect:local-runtime-capabilities") {
    const response = await sendNativeBridgeRequest({ type: "capabilities", requestId: makeNativeRequestId() });
    return response.ok
      ? { ok: true, data: response.capabilities ?? [] }
      : { ok: false, error: response.error.message };
  }

  const response = await sendNativeBridgeRequest({
    type: "generate",
    requestId: makeNativeRequestId(),
    payload: message.input,
  });

  return response.ok && response.output
    ? { ok: true, data: response.output }
    : { ok: false, error: response.ok ? "Native bridge returned no answer." : response.error.message };
}

function sendNativeBridgeRequest(request: NativeBridgeRequest): Promise<NativeBridgeResponse> {
  return new Promise((resolve) => {
    chrome.runtime.sendNativeMessage(CODEX_NATIVE_HOST, request, (response?: NativeBridgeResponse) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        resolve({
          ok: false,
          requestId: request.requestId,
          error: {
            code: "native_host_unavailable",
            message: lastError.message ?? "Native Codex bridge is not registered or could not be started.",
          },
        });
        return;
      }

      if (!response) {
        resolve({
          ok: false,
          requestId: request.requestId,
          error: {
            code: "empty_native_response",
            message: "Native Codex bridge returned an empty response.",
          },
        });
        return;
      }

      resolve(response);
    });
  });
}
