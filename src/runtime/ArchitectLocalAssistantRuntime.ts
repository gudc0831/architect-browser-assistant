import type { AssistantEvidence, AssistantTaskContext } from "../saas/contracts";

export type AssistantRuntimeStatus = {
  available: boolean;
  mode: "local-chatgpt-codex" | "mock";
  reason?: string;
  bridgeSchemaVersion?: number;
  codexOptions?: CodexOptions;
};

export type CodexOptions = {
  model?: string;
  reasoningEffort?: "minimal" | "low" | "medium" | "high";
  serviceTier?: "auto" | "default" | "priority";
  sandboxMode?: "read-only";
};

export type AssistantRuntimeInput = {
  question: string;
  taskContext: AssistantTaskContext;
  evidence: AssistantEvidence[];
};

export type AssistantRuntimeOutput = {
  answer: string;
  draftSummary?: {
    conclusion: string;
    tags: string[];
    scope: string;
    followUpAction?: string;
  };
};

export interface ArchitectLocalAssistantRuntime {
  isAvailable(): Promise<AssistantRuntimeStatus>;
  listCapabilities(): Promise<string[]>;
  generateAnswer(input: AssistantRuntimeInput, codexOptions?: CodexOptions): Promise<AssistantRuntimeOutput>;
}
