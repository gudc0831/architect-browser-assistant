import type {
  AssistantRuntimeInput,
  AssistantRuntimeOutput,
  AssistantRuntimeStatus,
  CodexOptions,
} from "./ArchitectLocalAssistantRuntime";

export const CODEX_NATIVE_HOST = "com.architect.browser_assistant.codex_bridge";
export const BRIDGE_SCHEMA_VERSION = 2;

const allowedReasoningEfforts = new Set<CodexOptions["reasoningEffort"]>(["minimal", "low", "medium", "high"]);
const allowedServiceTiers = new Set<CodexOptions["serviceTier"]>(["auto", "default", "priority"]);

export type NativeBridgeRequest =
  | {
      type: "status";
      requestId: string;
      codexOptions?: CodexOptions;
    }
  | {
      type: "capabilities";
      requestId: string;
    }
  | {
      type: "usageSummary";
      requestId: string;
      rangeDays?: 30 | 90 | 0;
      codexOptions?: CodexOptions;
    }
  | {
      type: "generate";
      requestId: string;
      payload: AssistantRuntimeInput;
      codexOptions?: CodexOptions;
    };

export type NativeBridgeUsageSummary = {
  bridgeSchemaVersion: number;
  scannedAt: string;
  source: "local-codex-session-metadata";
  metadataOnly: true;
  rangeDays: 30 | 90 | 0;
  status: "available" | "partial" | "unavailable";
  sessionFileCount: number;
  skippedSessionCount: number;
  totalSessionBytes: number;
  direct: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    entryCount: number;
  };
  uncertain: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    entryCount: number;
  };
  buckets: Array<{
    bucket: string;
    directInputTokens: number;
    directOutputTokens: number;
    directTotalTokens: number;
    directEntryCount: number;
    uncertainInputTokens: number;
    uncertainOutputTokens: number;
    uncertainTotalTokens: number;
    uncertainEntryCount: number;
  }>;
  oldestSessionUpdatedAt?: string;
  newestSessionUpdatedAt?: string;
  scanLimit: {
    maxFiles: number;
    maxDirectories: number;
    maxFileBytes: number;
    maxTotalBytes: number;
    limited: boolean;
  };
  warnings: Array<{
    code: string;
    label: string;
  }>;
  codexOptions?: CodexOptions;
};

export type NativeBridgeResponse =
  | {
      ok: true;
      requestId: string;
      status?: AssistantRuntimeStatus;
      capabilities?: string[];
      usageSummary?: NativeBridgeUsageSummary;
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
      codexOptions?: CodexOptions;
    }
  | {
      type: "architect:local-runtime-capabilities";
    }
  | {
      type: "architect:local-runtime-usage-summary";
      rangeDays?: 30 | 90 | 0;
      codexOptions?: CodexOptions;
    }
  | {
      type: "architect:local-runtime-generate";
      input: AssistantRuntimeInput;
      codexOptions?: CodexOptions;
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

export function normalizeCodexOptions(value: unknown): CodexOptions | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const raw = value as Partial<Record<keyof CodexOptions, unknown>>;
  const normalized: CodexOptions = {};
  if (typeof raw.model === "string") {
    const model = raw.model.trim();
    if (/^[A-Za-z0-9._-]{1,80}$/.test(model)) {
      normalized.model = model;
    }
  }

  if (allowedReasoningEfforts.has(raw.reasoningEffort as CodexOptions["reasoningEffort"])) {
    normalized.reasoningEffort = raw.reasoningEffort as CodexOptions["reasoningEffort"];
  }

  if (allowedServiceTiers.has(raw.serviceTier as CodexOptions["serviceTier"])) {
    normalized.serviceTier = raw.serviceTier as CodexOptions["serviceTier"];
  }

  if (raw.sandboxMode === "read-only") {
    normalized.sandboxMode = "read-only";
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

export function normalizeUsageRangeDays(value: unknown): 30 | 90 | 0 | undefined {
  return value === 30 || value === 90 || value === 0 ? value : undefined;
}

export function toNativeBridgeRequest(
  message: LocalRuntimeExtensionMessage,
  requestId: string,
): NativeBridgeRequest {
  if (message.type === "architect:local-runtime-status") {
    return {
      type: "status",
      requestId,
      ...(message.codexOptions ? { codexOptions: message.codexOptions } : {}),
    };
  }

  if (message.type === "architect:local-runtime-capabilities") {
    return { type: "capabilities", requestId };
  }

  if (message.type === "architect:local-runtime-usage-summary") {
    return {
      type: "usageSummary",
      requestId,
      ...(typeof message.rangeDays === "number" ? { rangeDays: message.rangeDays } : {}),
      ...(message.codexOptions ? { codexOptions: message.codexOptions } : {}),
    };
  }

  return {
    type: "generate",
    requestId,
    payload: message.input,
    ...(message.codexOptions ? { codexOptions: message.codexOptions } : {}),
  };
}
