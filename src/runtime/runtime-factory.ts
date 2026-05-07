import { readSafeSetting } from "../storage/safe-storage";
import type { ArchitectLocalAssistantRuntime } from "./ArchitectLocalAssistantRuntime";
import { LocalRuntimeClient } from "./local-runtime-client";
import { MockAssistantRuntime } from "./mock-runtime";

export async function createAssistantRuntime(): Promise<ArchitectLocalAssistantRuntime> {
  const mode = await readSafeSetting<"mock" | "local-chatgpt-codex">("runtimeMode", "mock");
  return mode === "local-chatgpt-codex" ? new LocalRuntimeClient() : new MockAssistantRuntime();
}
