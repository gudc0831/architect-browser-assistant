import {
  BRIDGE_SCHEMA_VERSION,
  CODEX_NATIVE_HOST,
  makeNativeRequestId,
  normalizeCodexOptions,
  toNativeBridgeRequest,
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
import {
  SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE,
  UPDATE_SIDE_PANEL_CONTEXT_MESSAGE,
  normalizeSidePanelContextSnapshot,
  normalizeSidePanelLaunchContext,
  sidePanelContextSnapshotToLaunchContext,
  sidePanelLaunchContextToSnapshot,
  type SidePanelContextSnapshot,
  type SidePanelContextUpdateExtensionMessage,
  type SidePanelLaunchContext,
  type SidePanelOpenExtensionMessage,
  type SidePanelOpenResponse,
} from "../runtime/side-panel-contract";

let latestSidePanelLaunchContext: SidePanelLaunchContext | null = null;
const sidePanelContextByTabId = new Map<number, SidePanelContextSnapshot>();

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch((error) => {
    console.error("Failed to configure side panel", error);
  });
});

if (chrome.tabs?.onRemoved) {
  chrome.tabs.onRemoved.addListener((tabId) => {
    sidePanelContextByTabId.delete(tabId);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (isSidePanelOpenMessage(message)) {
    handleSidePanelOpenMessage(message, sender)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : "Side panel launch failed" });
      });
    return true;
  }

  if (isSidePanelContextUpdateMessage(message)) {
    handleSidePanelContextUpdateMessage(message, sender)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({ ok: false, error: error instanceof Error ? error.message : "Side panel context update failed" });
      });
    return true;
  }

  if (message?.type === "architect:get-side-panel-launch-context") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (typeof tab?.id === "number") {
        const activeContext = sidePanelContextByTabId.get(tab.id);
        sendResponse({
          ok: true,
          data: activeContext ? sidePanelContextSnapshotToLaunchContext(activeContext) : null,
        });
        return;
      }

      sendResponse({
        ok: true,
        data: latestSidePanelLaunchContext,
      });
    });
    return true;
  }

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

  const requestedSourceTabId =
    typeof (message as { sourceTabId?: unknown }).sourceTabId === "number"
      ? (message as { sourceTabId: number }).sourceTabId
      : undefined;
  if (typeof requestedSourceTabId === "number") {
    chrome.tabs.sendMessage(requestedSourceTabId, { type: "architect:detect-task-context" }, (response) => {
      const lastError = chrome.runtime.lastError;
      sendResponse(
        lastError
          ? { ok: false, error: lastError.message ?? "Task context unavailable" }
          : response ?? { ok: false, error: "No task context response" },
      );
    });
    return true;
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

async function handleSidePanelOpenMessage(
  message: SidePanelOpenExtensionMessage,
  sender: chrome.runtime.MessageSender,
): Promise<{ ok: true; data: SidePanelOpenResponse }> {
  const input = normalizeSidePanelLaunchContext(message.input);
  if (!input) {
    throw new Error("Invalid side panel launch payload.");
  }

  const openedAt = new Date().toISOString();
  const sourceTabId = typeof sender.tab?.id === "number" ? sender.tab.id : undefined;
  latestSidePanelLaunchContext = {
    ...input,
    openedAt,
    ...(typeof sourceTabId === "number" ? { sourceTabId } : {}),
  };
  const launchSnapshot = sidePanelLaunchContextToSnapshot(latestSidePanelLaunchContext, {
    pageUrl: input.url || sender.tab?.url,
    reason: "launch",
    selectedAt: openedAt,
    ...(typeof sourceTabId === "number" ? { sourceTabId } : {}),
  });
  if (launchSnapshot && typeof sourceTabId === "number") {
    sidePanelContextByTabId.set(sourceTabId, launchSnapshot);
  }

  if (typeof sender.tab?.id === "number") {
    await chrome.sidePanel.open({ tabId: sender.tab.id });
  } else if (typeof sender.tab?.windowId === "number") {
    await chrome.sidePanel.open({ windowId: sender.tab.windowId });
  } else {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (typeof activeTab?.id === "number") {
      await chrome.sidePanel.open({ tabId: activeTab.id });
    } else if (typeof activeTab?.windowId === "number") {
      await chrome.sidePanel.open({ windowId: activeTab.windowId });
    } else {
      throw new Error("No active tab is available for side panel launch.");
    }
  }

  return {
    ok: true,
    data: {
      opened: true,
      taskId: input.taskId,
      openedAt,
    },
  };
}

async function handleSidePanelContextUpdateMessage(
  message: SidePanelContextUpdateExtensionMessage,
  sender: chrome.runtime.MessageSender,
): Promise<{ ok: true; data: { taskId: string } }> {
  if (typeof sender.tab?.id !== "number") {
    throw new Error("Side panel context update requires a source tab.");
  }

  const sourceTabId = sender.tab.id;
  const input = isRecord(message.input) ? { ...message.input, sourceTabId } : message.input;
  const snapshot = normalizeSidePanelContextSnapshot(input);
  if (!snapshot) {
    throw new Error("Invalid side panel context update payload.");
  }

  sidePanelContextByTabId.set(sourceTabId, snapshot);
  broadcastSidePanelContext(snapshot);

  return {
    ok: true,
    data: {
      taskId: snapshot.task.taskId,
    },
  };
}

function broadcastSidePanelContext(context: SidePanelContextSnapshot) {
  try {
    const result = chrome.runtime.sendMessage({
      type: SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE,
      context,
    }) as unknown;
    if (result && typeof (result as { catch?: unknown }).catch === "function") {
      void (result as Promise<unknown>).catch(() => undefined);
    }
  } catch {
    // A missing side-panel listener should not make context storage fail.
  }
}

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
    type === "architect:local-runtime-model-catalog" ||
    type === "architect:local-runtime-usage-summary" ||
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

function isSidePanelOpenMessage(message: unknown): message is SidePanelOpenExtensionMessage {
  return Boolean(message && typeof message === "object" && (message as { type?: unknown }).type === "architect:open-side-panel");
}

function isSidePanelContextUpdateMessage(message: unknown): message is SidePanelContextUpdateExtensionMessage {
  return Boolean(
    message && typeof message === "object" && (message as { type?: unknown }).type === UPDATE_SIDE_PANEL_CONTEXT_MESSAGE,
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
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
  const request = toNativeBridgeRequest(
    {
      ...message,
      ...("codexOptions" in message ? { codexOptions: normalizeCodexOptions(message.codexOptions) } : {}),
    } as LocalRuntimeExtensionMessage,
    makeNativeRequestId(),
  );
  const requestCodexOptions = "codexOptions" in request ? request.codexOptions : undefined;

  if (message.type === "architect:local-runtime-status") {
    const response = await sendNativeBridgeRequest(request);
    if (!response.ok) {
      return {
        ok: true,
        data: {
          available: false,
          mode: "local-chatgpt-codex",
          reason: safeNativeErrorMessage(response.error.code),
          bridgeSchemaVersion: BRIDGE_SCHEMA_VERSION,
          ...(requestCodexOptions ? { codexOptions: requestCodexOptions } : {}),
        },
      };
    }

    return {
      ok: true,
      data: sanitizeRuntimeStatus(response.status, requestCodexOptions),
    };
  }

  if (message.type === "architect:local-runtime-usage-summary") {
    const response = await sendNativeBridgeRequest(request);
    return response.ok && response.usageSummary
      ? { ok: true, data: response.usageSummary }
      : { ok: false, error: response.ok ? "Native bridge returned no usage summary." : safeNativeErrorMessage(response.error.code) };
  }

  if (message.type === "architect:local-runtime-model-catalog") {
    const response = await sendNativeBridgeRequest(request);
    return response.ok && response.modelCatalog
      ? { ok: true, data: response.modelCatalog }
      : { ok: false, error: response.ok ? "Native bridge returned no model catalog." : safeNativeErrorMessage(response.error.code) };
  }

  if (message.type === "architect:local-runtime-capabilities") {
    const response = await sendNativeBridgeRequest(request);
    return response.ok
      ? { ok: true, data: response.capabilities ?? [] }
      : { ok: false, error: safeNativeErrorMessage(response.error.code) };
  }

  const response = await sendNativeBridgeRequest(request);

  return response.ok && response.output
    ? { ok: true, data: response.output }
    : { ok: false, error: response.ok ? "Native bridge returned no answer." : safeNativeErrorMessage(response.error.code) };
}

function sanitizeRuntimeStatus(
  status: Extract<NativeBridgeResponse, { ok: true }>["status"],
  codexOptions: Extract<NativeBridgeRequest, { type: "status" | "usageSummary" | "generate" }>["codexOptions"],
) {
  if (!status) {
    return {
      available: true,
      mode: "local-chatgpt-codex" as const,
      reason: "Native Codex bridge responded.",
      bridgeSchemaVersion: BRIDGE_SCHEMA_VERSION,
      ...(codexOptions ? { codexOptions } : {}),
    };
  }

  const statusCodexOptions = normalizeCodexOptions(status.codexOptions) ?? codexOptions;
  return {
    available: Boolean(status.available),
    mode: status.mode === "mock" ? ("mock" as const) : ("local-chatgpt-codex" as const),
    reason: safeStatusReason(status.reason, Boolean(status.available)),
    bridgeSchemaVersion:
      typeof status.bridgeSchemaVersion === "number" ? status.bridgeSchemaVersion : BRIDGE_SCHEMA_VERSION,
    ...(statusCodexOptions ? { codexOptions: statusCodexOptions } : {}),
  };
}

function safeStatusReason(value: unknown, available: boolean) {
  if (typeof value !== "string") {
    return available ? "Native Codex bridge responded." : "Codex CLI is unavailable. Run the local verifier for details.";
  }

  const reason = value.replaceAll("\0", "").trim();
  if (
    reason.length > 180 ||
    /[A-Za-z]:[\\/]/.test(reason) ||
    /[\\/](Users|home)[\\/]/i.test(reason) ||
    /\b[A-Z0-9_]*(TOKEN|KEY|SECRET|ENV|PATH)[A-Z0-9_]*\s*=/i.test(reason) ||
    /\bstderr\b/i.test(reason)
  ) {
    return available ? "Native Codex bridge responded." : "Codex CLI is unavailable. Run the local verifier for details.";
  }

  return reason;
}

function safeNativeErrorMessage(code: string) {
  if (code === "native_host_unavailable") {
    return "Native Codex bridge is not registered or could not be started.";
  }
  if (code === "codex_exec_failed") {
    return "Local Codex generation failed. Run the local verifier for details.";
  }
  return "Native Codex bridge failed. Run the local verifier for details.";
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
            message: "Native Codex bridge is not registered or could not be started.",
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
