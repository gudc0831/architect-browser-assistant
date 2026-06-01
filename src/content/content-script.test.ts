import { afterEach, describe, expect, it, vi } from "vitest";
import type { LocalRuntimeExtensionResponse } from "../runtime/native-bridge-contract";

describe("content script local runtime page bridge", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("forwards same-origin page status and region-capture requests to the extension runtime", async () => {
    const sendMessage = stubChromeRuntime((message) => {
      if ((message as { type?: string }).type === "architect:capture-visible-tab") {
        return {
          ok: true,
          data: {
            dataUrl: "data:image/png;base64,abc",
            title: "Daily task",
            url: window.location.href,
            capturedAt: "2026-05-14T09:00:00.000Z",
            region: (message as { input: { region: unknown } }).input.region,
            pixelRegion: (message as { input: { pixelRegion: unknown } }).input.pixelRegion,
            viewport: (message as { input: { viewport: unknown } }).input.viewport,
          },
        };
      }

      return {
        ok: true,
        data: {
          available: true,
          mode: "local-chatgpt-codex",
          reason: "Native bridge ready",
        },
      };
    });

    await import("./content-script");

    const statusResponse = waitForBridgeResponse("request-1");
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "architect:page-local-runtime-request",
          requestId: "request-1",
          command: "status",
        },
        origin: window.location.origin,
        source: window,
      }),
    );

    await expect(statusResponse).resolves.toMatchObject({
      type: "architect:page-local-runtime-response",
      requestId: "request-1",
      ok: true,
      data: {
        available: true,
        mode: "local-chatgpt-codex",
      },
    });
    expect(sendMessage).toHaveBeenCalledWith({ type: "architect:local-runtime-status" }, expect.any(Function));

    const captureResponse = waitForBridgeResponse("request-2");
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "architect:page-local-runtime-request",
          requestId: "request-2",
          command: "select-region",
        },
        origin: window.location.origin,
        source: window,
      }),
    );

    const overlay = document.querySelector<HTMLElement>("[data-architect-region-selector='overlay']");
    expect(overlay).not.toBeNull();
    overlay?.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, clientX: 100, clientY: 120 }));
    overlay?.dispatchEvent(new MouseEvent("pointermove", { bubbles: true, clientX: 300, clientY: 260 }));
    overlay?.dispatchEvent(new MouseEvent("pointerup", { bubbles: true, clientX: 300, clientY: 260 }));

    await expect(captureResponse).resolves.toMatchObject({
      type: "architect:page-local-runtime-response",
      requestId: "request-2",
      ok: true,
      data: {
        dataUrl: "data:image/png;base64,abc",
        cropDataUrl: "data:image/png;base64,abc",
        region: {
          x: expect.any(Number),
          y: expect.any(Number),
          width: expect.any(Number),
          height: expect.any(Number),
          unit: "percent",
        },
        pixelRegion: {
          x: 100,
          y: 120,
          width: 200,
          height: 140,
          unit: "px",
        },
      },
    });
    expect(sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "architect:capture-visible-tab",
        input: expect.objectContaining({
          region: expect.objectContaining({ unit: "percent" }),
          pixelRegion: expect.objectContaining({ unit: "px" }),
        }),
      }),
      expect.any(Function),
    );
  });

  it("rejects malformed generate page requests before they reach the extension runtime", async () => {
    const sendMessage = stubChromeRuntime({
      ok: true,
      data: {
        answer: "should not run",
      },
    });

    await import("./content-script");

    const response = waitForBridgeResponse("request-invalid");
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "architect:page-local-runtime-request",
          requestId: "request-invalid",
          command: "generate",
          input: {
            question: "",
            taskContext: { taskId: "" },
            evidence: "not-an-array",
          },
        },
        origin: window.location.origin,
        source: window,
      }),
    );

    await expect(response).resolves.toMatchObject({
      type: "architect:page-local-runtime-response",
      requestId: "request-invalid",
      ok: false,
      error: "Invalid local runtime generate payload.",
    });
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("verifies official law sources before forwarding page generate requests", async () => {
    const sendMessage = stubChromeRuntime((message) => {
      if ((message as { type?: string }).type === "architect:verify-official-law-evidence") {
        return {
          ok: true,
          data: {
            report: {
              status: "verified",
              checkedAt: "2026-05-28T00:00:00.000Z",
              provider: {
                name: "국가법령정보센터",
                docsUrl: "https://open.law.go.kr/LSO/openApi/guideList.do",
              },
              locators: [],
              sources: [],
              failures: [],
              retry: [],
            },
            evidence: [
              {
                id: "official-law:building-act:004900",
                kind: "regulation",
                priority: 0,
                title: "건축법 제49조 원문 확인",
                excerpt: "국가법령정보센터 Open API 확인",
                officialSourceName: "국가법령정보센터",
                lawName: "건축법",
                articleLabel: "제49조",
                checkedAt: "2026-05-28T00:00:00.000Z",
                apiSourceUrl: "https://www.law.go.kr/DRF/lawService.do?target=eflaw&type=JSON&ID=123&JO=004900",
                verificationStatus: "verified",
              },
            ],
          },
        };
      }

      return {
        ok: true,
        data: {
          answer: "verified local answer",
          draftSummary: {
            conclusion: "verified",
            tags: ["assistant"],
            scope: "ARCH-1",
          },
        },
      };
    });

    await import("./content-script");

    const response = waitForBridgeResponse("request-generate");
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "architect:page-local-runtime-request",
          requestId: "request-generate",
          command: "generate",
          input: {
            question: "건축법 제49조 기준 검토",
            taskContext: {
              taskId: "task-1",
              projectId: "project-1",
              title: "피난 검토",
              description: "피난시설 검토",
              status: "in_review",
              issueId: "ARCH-1",
              projectName: "Architect",
            },
            evidence: [
              {
                id: "reg-1",
                kind: "regulation",
                priority: 2,
                title: "건축법 제49조",
                excerpt: "피난시설",
              },
            ],
          },
        },
        origin: window.location.origin,
        source: window,
      }),
    );

    await expect(response).resolves.toMatchObject({
      type: "architect:page-local-runtime-response",
      requestId: "request-generate",
      ok: true,
      data: {
        answer: "verified local answer",
      },
    });

    expect(sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: "architect:verify-official-law-evidence" }),
      expect.any(Function),
    );

    const generateCall = sendMessage.mock.calls.find(
      ([message]) => (message as { type?: string }).type === "architect:local-runtime-generate",
    );
    expect(generateCall?.[0]).toEqual(
      expect.objectContaining({
        type: "architect:local-runtime-generate",
        input: expect.objectContaining({
          evidence: [
            expect.objectContaining({
              officialSourceName: "국가법령정보센터",
              lawName: "건축법",
              articleLabel: "제49조",
              verificationStatus: "verified",
            }),
          ],
        }),
      }),
    );
  });
});

function waitForBridgeResponse(requestId: string) {
  return new Promise((resolve) => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as { type?: string; requestId?: string };
      if (data?.type !== "architect:page-local-runtime-response" || data.requestId !== requestId) {
        return;
      }

      window.removeEventListener("message", handleMessage);
      resolve(event.data);
    }

    window.addEventListener("message", handleMessage);
  });
}

function stubChromeRuntime(
  response: LocalRuntimeExtensionResponse<unknown> | ((message: unknown) => LocalRuntimeExtensionResponse<unknown>),
) {
  const sendMessage = vi.fn((message: unknown, callback: (value: LocalRuntimeExtensionResponse<unknown>) => void) => {
    callback(typeof response === "function" ? response(message) : response);
  });
  vi.stubGlobal("chrome", {
    runtime: {
      lastError: undefined,
      onMessage: {
        addListener: vi.fn(),
      },
      sendMessage,
    },
  });
  return sendMessage;
}
