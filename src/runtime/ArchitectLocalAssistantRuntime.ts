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
  noHistory?: boolean;
};

export type LocalCodexModelCatalog = {
  bridgeSchemaVersion: number;
  refreshedAt: string;
  source: "local-codex-bridge" | "fallback-catalog";
  codexCliVersion?: string;
  models: Array<{
    value: string;
    label: string;
    source: "codex-default" | "known-catalog" | "saved-custom";
    available: boolean;
  }>;
  warnings: Array<{
    code: string;
    label: string;
  }>;
};

export type ProjectContextLocationForRuntime = {
  locationType?: string;
  pageNumber?: number;
  lineStart?: number;
  lineEnd?: number;
  sectionLabel?: string;
};

export type ProjectContextChunkForRuntime = {
  chunkId: string;
  sourceId?: string;
  versionId?: string;
  sourceDocumentTitle: string;
  normalizedText: string;
  sourceQuote: string;
  location?: ProjectContextLocationForRuntime;
  contextType?: string;
  chunkQualityScore?: number;
  injectionRisk?: string;
  score?: number;
};

export type ProjectContextTraceForRuntime = {
  corpusType?: "project_context";
  status: "chunks_found" | "active_corpus_missing" | "no_relevant_chunks" | "search_failed";
  traceId?: string | null;
  fallbackMode: "none" | "legal_only_after_project_context_error";
  activeVersionIds?: string[];
  candidateChunkIds?: string[];
  matchedChunkIds?: string[];
  noRelevantChunkReason?: string | null;
  searchErrorCode?: string | null;
  includedChunkIds?: string[];
};

export type EvidenceReadinessWarningForRuntime = {
  code: string;
  message: string;
};

export type AssistantRuntimeInput = {
  question: string;
  taskContext: AssistantTaskContext;
  evidence: AssistantEvidence[];
  legalEvidence?: AssistantEvidence[];
  projectContextChunks?: ProjectContextChunkForRuntime[];
  projectContextTrace?: ProjectContextTraceForRuntime;
  evidenceReadinessWarnings?: EvidenceReadinessWarningForRuntime[];
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
