import type {
  ArchitectLocalAssistantRuntime,
  AssistantRuntimeOutput,
  AssistantRuntimeStatus,
} from "./ArchitectLocalAssistantRuntime";

export class LocalRuntimeClient implements ArchitectLocalAssistantRuntime {
  async isAvailable(): Promise<AssistantRuntimeStatus> {
    return {
      available: false,
      mode: "local-chatgpt-codex",
      reason: "Real local ChatGPT/Codex bridge is pending runtime discovery.",
    };
  }

  async listCapabilities() {
    return [];
  }

  async generateAnswer(): Promise<AssistantRuntimeOutput> {
    throw new Error("Real local ChatGPT/Codex runtime is not configured yet.");
  }
}
