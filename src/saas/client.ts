import type {
  AssistantEvidence,
  AssistantRecordResponse,
  ExternalEvidenceSourceType,
  RetrieveResponse,
  SaveExternalEvidenceResponse,
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

  const parsed = (await response.json()) as ApiEnvelope<T> | { error?: { message?: string } };
  if (!response.ok) {
    throw new Error("error" in parsed ? parsed.error?.message ?? "SaaS request failed" : "SaaS request failed");
  }

  return (parsed as ApiEnvelope<T>).data;
}
