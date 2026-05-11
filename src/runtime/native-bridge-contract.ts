import type { AssistantRuntimeInput, AssistantRuntimeOutput, AssistantRuntimeStatus } from "./ArchitectLocalAssistantRuntime";

export const CODEX_NATIVE_HOST = "com.architect.browser_assistant.codex_bridge";

export type NativeBridgeRequest =
  | {
      type: "status";
      requestId: string;
    }
  | {
      type: "capabilities";
      requestId: string;
    }
  | {
      type: "generate";
      requestId: string;
      payload: AssistantRuntimeInput;
    };

export type NativeBridgeResponse =
  | {
      ok: true;
      requestId: string;
      status?: AssistantRuntimeStatus;
      capabilities?: string[];
      output?: AssistantRuntimeOutput;
    }
  | {
      ok: false;
      requestId?: string;
      error: {
        code: string;
        message: string;
      };
    };

export type LocalRuntimeExtensionMessage =
  | {
      type: "architect:local-runtime-status";
    }
  | {
      type: "architect:local-runtime-capabilities";
    }
  | {
      type: "architect:local-runtime-generate";
      input: AssistantRuntimeInput;
    };

export type LocalRuntimeExtensionResponse<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
    };

export function makeNativeRequestId() {
  return `architect-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
