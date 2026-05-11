import type {
  ArchitectLocalAssistantRuntime,
  AssistantRuntimeInput,
  AssistantRuntimeOutput,
  AssistantRuntimeStatus,
} from "./ArchitectLocalAssistantRuntime";
import type { LocalRuntimeExtensionMessage, LocalRuntimeExtensionResponse } from "./native-bridge-contract";

export class LocalRuntimeClient implements ArchitectLocalAssistantRuntime {
  async isAvailable(): Promise<AssistantRuntimeStatus> {
    const response = await sendBackgroundMessage<AssistantRuntimeStatus>({ type: "architect:local-runtime-status" });
    return response.ok
      ? response.data
      : {
          available: false,
          mode: "local-chatgpt-codex",
          reason: response.error,
        };
  }

  async listCapabilities() {
    const response = await sendBackgroundMessage<string[]>({ type: "architect:local-runtime-capabilities" });
    return response.ok ? response.data : [];
  }

  async generateAnswer(input: AssistantRuntimeInput): Promise<AssistantRuntimeOutput> {
    const response = await sendBackgroundMessage<AssistantRuntimeOutput>({
      type: "architect:local-runtime-generate",
      input,
    });
    if (!response.ok) {
      throw new Error(response.error);
    }

    return response.data;
  }
}

function sendBackgroundMessage<T>(
  message: LocalRuntimeExtensionMessage,
): Promise<LocalRuntimeExtensionResponse<T>> {
  return new Promise((resolve) => {
    if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
      resolve({ ok: false, error: "Chrome extension runtime is unavailable." });
      return;
    }

    chrome.runtime.sendMessage(message, (response?: LocalRuntimeExtensionResponse<T>) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        resolve({ ok: false, error: lastError.message ?? "Chrome extension runtime failed." });
        return;
      }

      resolve(response ?? { ok: false, error: "Chrome extension runtime returned no response." });
    });
  });
}
