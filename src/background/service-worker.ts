import {
  CODEX_NATIVE_HOST,
  makeNativeRequestId,
  type LocalRuntimeExtensionMessage,
  type NativeBridgeRequest,
  type NativeBridgeResponse,
} from "../runtime/native-bridge-contract";

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => {
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
