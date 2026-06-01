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

export type RetrieveResponse = {
  taskContext: AssistantTaskContext;
  evidence: AssistantEvidence[];
  unavailableEvidenceKinds: AssistantEvidenceKind[];
};

export type AssistantRecordResponse = {
  id: string;
  confidenceScore: number;
  confidenceReason: string;
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
