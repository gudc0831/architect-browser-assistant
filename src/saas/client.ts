import type {
  AssistantEvidence,
  AssistantActionAuditRecord,
  AssistantActionAuditSummary,
  AssistantRecordResponse,
  AssistantReviewSessionDetail,
  AssistantReviewSessionItem,
  ExternalEvidenceRecord,
  ExternalEvidenceSourceType,
  RetrieveResponse,
  SaveExternalEvidenceResponse,
  TaskRecord,
  TaskReviewResponse,
  WorkSummaryDraftResponse,
} from "./contracts";
import { readSafeSetting } from "../storage/safe-storage";

type ApiEnvelope<T> = { data: T };

export async function getSaasBaseUrl() {
  return (await readSafeSetting("saasBaseUrl", "http://localhost:3000")).replace(/\/$/, "");
}

export async function retrieveEvidence(input: { taskId: string; question: string }): Promise<RetrieveResponse> {
  return postJson<RetrieveResponse>("/api/assistant/retrieve", input);
}

export async function listReviewSessions(taskId: string): Promise<AssistantReviewSessionItem[]> {
  return getJson<AssistantReviewSessionItem[]>(`/api/assistant/review-sessions?taskId=${encodeURIComponent(taskId)}`);
}

export async function getReviewSession(sessionId: string): Promise<AssistantReviewSessionDetail> {
  return getJson<AssistantReviewSessionDetail>(`/api/assistant/review-sessions/${encodeURIComponent(sessionId)}`);
}

export async function listExternalEvidence(taskId: string): Promise<ExternalEvidenceRecord[]> {
  return getJson<ExternalEvidenceRecord[]>(`/api/assistant/external-evidence?taskId=${encodeURIComponent(taskId)}`);
}

export async function listTasks(): Promise<TaskRecord[]> {
  return getJson<TaskRecord[]>("/api/tasks");
}

export async function updateTask(taskId: string, input: {
  version: number;
  decision: string;
  status?: string;
}): Promise<TaskRecord> {
  return patchJson<TaskRecord>(`/api/tasks/${encodeURIComponent(taskId)}`, input);
}

export async function createTask(input: Partial<TaskRecord> & {
  clientMutationId?: string;
  issueTitle: string;
  issueDetailNote: string;
  status: string;
  decision: string;
  parentTaskId: string;
}): Promise<TaskRecord> {
  return postJson<TaskRecord>("/api/tasks", input);
}

export async function saveAssistantActionAudit(input: {
  action: AssistantActionAuditRecord["action"];
  sourceTaskId: string;
  targetTaskId: string;
  createdTaskId?: string;
  assistantRecordId: string;
  summary: AssistantActionAuditSummary | null;
  statusFrom?: string;
  statusTo?: string;
  decisionMarker?: string;
}): Promise<AssistantActionAuditRecord> {
  return postJson<AssistantActionAuditRecord>("/api/assistant/action-audits", input);
}

export async function saveReviewSession(input: {
  taskId: string;
  question: string;
  answer: string;
  evidence: AssistantEvidence[];
  title?: string;
  executionMode?: "local-chatgpt-codex" | "mock" | "unavailable" | "saas-api";
  runtimeMode?: string;
  draftSummary?: {
    conclusion: string;
    tags: string[];
    scope: string;
    followUpAction?: string;
  };
  officialLawVerification?: unknown;
}): Promise<AssistantReviewSessionItem> {
  return postJson<AssistantReviewSessionItem>("/api/assistant/review-sessions", input);
}

export async function runTaskReview(input: {
  taskId: string;
  question: string;
  instruction?: string;
  mode: "preview" | "generate";
}): Promise<TaskReviewResponse> {
  return postJson<TaskReviewResponse>("/api/assistant/task-review", input);
}

export async function saveAssistantRecord(input: {
  taskId: string;
  question: string;
  answer: string;
  evidence: AssistantEvidence[];
  confidenceScore?: number;
  confidenceReason?: string;
  executionMode: "local-chatgpt-codex" | "mock" | "unavailable";
  runtimeMode: string;
  draftSummary?: {
    conclusion: string;
    tags: string[];
    scope: string;
    followUpAction?: string;
  };
}): Promise<AssistantRecordResponse> {
  return postJson<AssistantRecordResponse>("/api/assistant/records", input);
}

export async function saveWorkSummaryDraft(input: {
  taskId: string;
  recordId: string;
  conclusion: string;
  tags: string[];
  scope: string;
  followUpAction?: string;
  status: "draft" | "approved" | "deferred";
}): Promise<WorkSummaryDraftResponse> {
  return postJson<WorkSummaryDraftResponse>("/api/assistant/summaries", input);
}

export async function saveExternalEvidence(input: {
  taskId: string;
  sourceType: ExternalEvidenceSourceType;
  title: string;
  excerpt: string;
  sourceUrl?: string;
  toolName?: string;
  permissionState: "user_approved";
  capturedAt: string;
}): Promise<SaveExternalEvidenceResponse> {
  return postJson<SaveExternalEvidenceResponse>("/api/assistant/external-evidence", input);
}

async function getJson<T>(path: string): Promise<T> {
  const baseUrl = await getSaasBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
  });

  return parseApiResponse<T>(response);
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = await getSaasBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return parseApiResponse<T>(response);
}

async function patchJson<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = await getSaasBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return parseApiResponse<T>(response);
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const parsed = parseJsonEnvelope<T>(text);
  if (!response.ok) {
    const apiMessage = parsed && "error" in parsed ? parsed.error?.message : undefined;
    throw new Error(apiMessage || formatHttpError(response.status, text));
  }

  if (!parsed || !("data" in parsed)) {
    throw new Error("SaaS API returned an unexpected non-JSON response. Check login, origin, and route availability.");
  }

  return parsed.data;
}

function parseJsonEnvelope<T>(text: string): ApiEnvelope<T> | { error?: { message?: string } } | null {
  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as ApiEnvelope<T> | { error?: { message?: string } };
  } catch {
    return null;
  }
}

function formatHttpError(status: number, body: string) {
  if (status === 401) {
    return "SaaS login is required. Open /daily in the SaaS tab and confirm you are logged in.";
  }
  if (status === 403) {
    return "SaaS request was forbidden. Check project access and ARCHITECT_ASSISTANT_EXTENSION_ORIGINS.";
  }
  if (/<html/i.test(body)) {
    return `SaaS API returned HTML instead of JSON with status ${status}. Check login, origin, and route availability.`;
  }
  return `SaaS request failed with status ${status}.`;
}
