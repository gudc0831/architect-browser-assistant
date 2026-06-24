export type AssistantEvidenceKind =
  | "central_knowledge"
  | "regulation"
  | "task"
  | "project_document"
  | "web_or_skill";

export type AssistantEvidence = {
  id: string;
  kind: AssistantEvidenceKind;
  priority: number;
  title: string;
  excerpt: string;
  sourceUrl?: string;
  recordId?: string;
  confidenceWeight?: number;
  officialSourceName?: string;
  lawName?: string;
  articleLabel?: string;
  articleNumber?: string;
  effectiveDate?: string;
  checkedAt?: string;
  apiSourceUrl?: string;
  verificationStatus?: "verified" | "needs_review" | "failed";
};

export type AssistantTaskContext = {
  taskId: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  issueId: string;
  projectName: string;
};

export type TaskRecord = {
  id: string;
  projectId: string;
  taskNumber: number;
  actionId: number;
  issueId: string;
  parentTaskId: string | null;
  rootTaskId: string;
  depth: number;
  siblingOrder: number;
  dueDate: string;
  workType: string;
  coordinationScope: string;
  ownerDiscipline: string;
  requestedBy: string;
  relatedDisciplines: string;
  assignee: string;
  assigneeProfileId: string | null;
  issueTitle: string;
  reviewedAt: string;
  createdAt: string;
  createdBy: string | null;
  isDaily: boolean;
  locationRef: string;
  calendarLinked: boolean;
  issueDetailNote: string;
  status: string;
  statusHistory: string;
  decision: string;
  completedAt: string | null;
  version: number;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  purgedAt: string | null;
};

export type AssistantActionAuditSummary = {
  conclusion: string;
  scope: string;
  followUpAction: string;
  tags: string[];
};

export type AssistantActionAuditRecord = {
  id: string;
  action: "task_update_applied" | "follow_up_task_created";
  projectId: string;
  sourceTaskId: string;
  targetTaskId: string;
  createdTaskId: string | null;
  assistantRecordId: string;
  summary: AssistantActionAuditSummary | null;
  statusFrom: string | null;
  statusTo: string | null;
  decisionMarker: string | null;
  createdBy: string | null;
  createdAt: string;
};

export type RetrieveResponse = {
  taskContext: AssistantTaskContext;
  evidence: AssistantEvidence[];
  unavailableEvidenceKinds: AssistantEvidenceKind[];
  legalEvidence?: AssistantEvidence[];
  projectContextChunks?: ProjectContextChunkForRuntime[];
  projectContextTrace?: ProjectContextTraceForRuntime;
  evidenceReadinessWarnings?: EvidenceReadinessWarningForRuntime[];
};

export type AssistantRecordResponse = {
  id: string;
  confidenceScore: number;
  confidenceReason: string;
};

export type DraftSummary = {
  conclusion: string;
  tags: string[];
  scope: string;
  followUpAction?: string;
};

export type SavedAssistantRecord = {
  id: string;
  taskId?: string;
  confidenceScore: number;
  confidenceReason?: string;
  executionMode?: "local-chatgpt-codex" | "mock" | "unavailable" | "saas-api";
  runtimeMode?: string;
  candidateState?: "candidate" | "not_candidate" | "pending_review" | "approved" | "rejected";
  draftSummary?: DraftSummary | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AssistantReviewSessionItem = {
  id: string;
  taskId: string;
  title: string;
  question: string;
  answerPreview: string;
  verdict: string | null;
  conclusionMayChange: boolean;
  savedAt: string;
  updatedAt: string;
  savedRecord: SavedAssistantRecord;
};

export type AssistantReviewSessionDetail = AssistantReviewSessionItem & {
  answer: string;
  savedEvidenceSnapshot: AssistantEvidence[];
  latestEvidenceSnapshot: AssistantEvidence[];
  savedWikiEvidence: AssistantEvidence[];
  latestWikiEvidence: AssistantEvidence[];
  savedHistoryEvidence: AssistantEvidence[];
  latestHistoryEvidence: AssistantEvidence[];
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

export type WorkSummaryDraftResponse = {
  id: string;
  status: "draft" | "approved" | "deferred";
};

export type ExternalEvidenceSourceType =
  | "web_page"
  | "skill_output"
  | "external_document"
  | "manufacturer_doc"
  | "public_standard";

export type ExternalEvidenceRecord = {
  id: string;
  projectId: string;
  taskId: string;
  sourceType: ExternalEvidenceSourceType;
  title: string;
  excerpt: string;
  sourceUrl?: string;
  toolName?: string;
  permissionState: "user_approved";
  capturedAt: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type SaveExternalEvidenceResponse = {
  externalEvidence: ExternalEvidenceRecord;
  evidence: AssistantEvidence;
};

export type AssistantGenerateResponse = {
  answer: string;
  suggestedDraftSummary: DraftSummary;
  citations: Array<{ sourceType: AssistantEvidenceKind; sourceId: string; title: string }>;
  usage: {
    inputTokens: number;
    outputTokens: number;
    estimatedCostCents: number;
  };
  executionMode: "saas-api";
  provider: {
    provider: "mock" | "openai";
    model: string;
    callMode: "mock" | "live";
    requestId: string | null;
  };
  retrieval?: unknown;
};

export type TaskReviewResponse = {
  status: "blocked" | "ready_for_generation" | "generated";
  reason: string;
  taskContext: AssistantTaskContext;
  retrievedEvidence: {
    count: number;
    regulationCount: number;
    unavailableEvidenceKinds: AssistantEvidenceKind[];
  };
  officialLawVerification: {
    status: "not_required" | "verified" | "failed";
    checkedAt: string;
    failures: string[];
    retry: string[];
  };
  evidence: AssistantEvidence[];
  evidenceReadiness: Array<{
    kind: "central_knowledge" | "project_document" | "web_or_skill";
    status: "available" | "missing";
    action: string;
  }>;
  generated?: AssistantGenerateResponse;
  savedRecord: SavedAssistantRecord | null;
};

export type TaskResultVerificationStatus = "not_required" | "verified" | "needs_review" | "failed";

export type TaskResultVerificationLaw = {
  lawName: string;
  articleLabel?: string;
  articleNumber?: string;
  effectiveDate?: string;
  sourceUrl?: string;
  apiSourceUrl: string;
  checkedAt: string;
  basisExcerpt: string;
};

export type TaskResultVerificationApiSource = {
  name: string;
  url: string;
  checkedAt: string;
  status: "verified" | "not_found" | "api_error" | "missing_query";
};

export type TaskResultVerification = {
  status: TaskResultVerificationStatus;
  checkedAt: string;
  laws: TaskResultVerificationLaw[];
  apiSources: TaskResultVerificationApiSource[];
  basis: string[];
  failures: string[];
  retry: string[];
};
