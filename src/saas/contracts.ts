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
