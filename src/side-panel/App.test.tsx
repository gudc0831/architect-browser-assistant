import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

const mocks = vi.hoisted(() => ({
  createAssistantRuntime: vi.fn(),
  readSafeSetting: vi.fn(),
  retrieveEvidence: vi.fn(),
  saveAssistantRecord: vi.fn(),
  saveExternalEvidence: vi.fn(),
  saveWorkSummaryDraft: vi.fn(),
  writeSafeSetting: vi.fn(),
}));

vi.mock("../runtime/runtime-factory", () => ({
  createAssistantRuntime: mocks.createAssistantRuntime,
}));

vi.mock("../saas/client", () => ({
  retrieveEvidence: mocks.retrieveEvidence,
  saveAssistantRecord: mocks.saveAssistantRecord,
  saveExternalEvidence: mocks.saveExternalEvidence,
  saveWorkSummaryDraft: mocks.saveWorkSummaryDraft,
}));

vi.mock("../storage/safe-storage", () => ({
  readSafeSetting: mocks.readSafeSetting,
  writeSafeSetting: mocks.writeSafeSetting,
}));

describe("App", () => {
  let root: Root | null = null;
  let rootElement: HTMLDivElement | null = null;

  beforeEach(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    document.body.innerHTML = "";
    rootElement = document.createElement("div");
    document.body.append(rootElement);
    root = createRoot(rootElement);

    mocks.readSafeSetting.mockImplementation(async (_key: string, fallback: unknown) => fallback);
    mocks.writeSafeSetting.mockResolvedValue(undefined);
    mocks.createAssistantRuntime.mockResolvedValue({
      generateAnswer: vi.fn(async () => ({
        answer: "검토 답변입니다.",
        draftSummary: {
          conclusion: "검토 요약입니다.",
          tags: ["assistant"],
          scope: "ARCH-100",
        },
      })),
      isAvailable: vi.fn(async () => ({
        available: true,
        mode: "mock",
        reason: "Development mock runtime",
      })),
      listCapabilities: vi.fn(async () => ["confidence-explanation"]),
    });
    mocks.retrieveEvidence.mockResolvedValue({
      taskContext: {
        taskId: "task-1",
        projectId: "project-1",
        title: "피난 계단 검토",
        description: "피난 계단 폭 검토",
        status: "in_review",
        issueId: "ARCH-100",
        projectName: "Architect Start",
      },
      evidence: [
        {
          id: "knowledge-1",
          kind: "central_knowledge",
          priority: 1,
          title: "Approved WIKI guidance",
          excerpt: "중앙 지식 근거입니다.",
        },
      ],
      unavailableEvidenceKinds: [],
    });
    mocks.saveAssistantRecord.mockResolvedValue({
      id: "record-1",
      confidenceScore: 76,
      confidenceReason: "Central knowledge matched, but regulation evidence is still missing.",
    });

    vi.stubGlobal("chrome", {
      runtime: {
        sendMessage: vi.fn(async (message: { type?: string }) => {
          if (message.type === "architect:get-task-context") {
            return {
              ok: true,
              data: {
                taskId: "task-1",
                projectId: "project-1",
                title: "피난 계단 검토",
                url: "http://localhost:3000/daily?taskId=task-1",
              },
            };
          }

          return { ok: false, error: "Unexpected message" };
        }),
      },
    });
  });

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root?.unmount();
      });
    }
    root = null;
    rootElement = null;
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("shows the saved confidence score and reason after generating an answer", async () => {
    await act(async () => {
      root?.render(<App />);
    });
    await waitFor(() => rootElement?.textContent?.includes("실행 가능") === true);

    await act(async () => {
      const textarea = rootElement?.querySelector("textarea");
      if (!textarea) {
        throw new Error("Composer textarea was not rendered");
      }
      setTextareaValue(textarea, "검토해줘");
    });
    await waitFor(() => getButton("근거 불러오기").disabled === false);

    await act(async () => {
      getButton("근거 불러오기").click();
    });
    await waitFor(() => rootElement?.textContent?.includes("Approved WIKI guidance") === true);

    await act(async () => {
      getButton("검토안 생성").click();
    });
    await waitFor(() => rootElement?.textContent?.includes("검토 답변입니다.") === true);

    expect(rootElement?.textContent).toContain("신뢰도 76%");
    expect(rootElement?.textContent).toContain("Central knowledge matched, but regulation evidence is still missing.");
  });

  function getButton(label: string) {
    const button = Array.from(rootElement?.querySelectorAll("button") ?? []).find(
      (element) => element.textContent?.trim() === label,
    );
    if (!button) {
      throw new Error(`Button not found: ${label}`);
    }
    return button as HTMLButtonElement;
  }
});

function setTextareaValue(textarea: HTMLTextAreaElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
  valueSetter?.call(textarea, value);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

async function waitFor(assertion: () => boolean, message = "Timed out waiting for condition") {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (assertion()) {
      return;
    }
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }

  throw new Error(message);
}
