import { afterEach, describe, expect, it, vi } from "vitest";
import { BRIDGE_SCHEMA_VERSION, type LocalRuntimeExtensionResponse } from "../runtime/native-bridge-contract";

describe("content script local runtime page bridge", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("announces when the content script is attached to the page", async () => {
    stubChromeRuntime({
      ok: true,
      data: {
        available: true,
        mode: "local-chatgpt-codex",
      },
    });

    const readyEvent = waitForReadyEvent();
    await import("./content-script");

    await expect(readyEvent).resolves.toMatchObject({
      type: "architect:page-local-runtime-ready",
      bridgeSchemaVersion: BRIDGE_SCHEMA_VERSION,
      extensionId: "test-extension-id",
      origin: window.location.origin,
      injectedAt: expect.any(String),
    });
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

  it("allows usage-summary and strips unsafe Codex option fields before background forwarding", async () => {
    const sendMessage = stubChromeRuntime((message) => ({
      ok: true,
      data: {
        bridgeSchemaVersion: 1,
        scannedAt: "2026-06-05T00:00:00.000Z",
        source: "local-codex-session-metadata",
        metadataOnly: true,
        sessionFileCount: 0,
        totalSessionBytes: 0,
        scanLimit: {
          maxFiles: 200,
          maxDirectories: 80,
          limited: false,
        },
        codexOptions: (message as { codexOptions?: unknown }).codexOptions,
      },
    }));

    await import("./content-script");

    const response = waitForBridgeResponse("request-usage");
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "architect:page-local-runtime-request",
          requestId: "request-usage",
          command: "usage-summary",
          codexOptions: {
            model: "gpt-5-codex",
            reasoningEffort: "high",
            serviceTier: "priority",
            sandboxMode: "read-only",
          configPath: "C:\\Users\\secret\\.codex\\config.toml",
          path: "D:\\secret\\workspace",
          env: { OPENAI_API_KEY: "secret" },
          stderr: "raw log",
          },
        },
        origin: window.location.origin,
        source: window,
      }),
    );

    await expect(response).resolves.toMatchObject({
      type: "architect:page-local-runtime-response",
      requestId: "request-usage",
      ok: true,
      data: {
        bridgeSchemaVersion: 1,
        codexOptions: {
          reasoningEffort: "high",
          serviceTier: "priority",
          sandboxMode: "read-only",
        },
      },
    });
    expect(sendMessage).toHaveBeenCalledWith(
      {
        type: "architect:local-runtime-usage-summary",
        codexOptions: {
          reasoningEffort: "high",
          serviceTier: "priority",
          sandboxMode: "read-only",
        },
      },
      expect.any(Function),
    );
    expect(JSON.stringify(sendMessage.mock.calls)).not.toContain("configPath");
    expect(JSON.stringify(sendMessage.mock.calls)).not.toContain("OPENAI_API_KEY");
    expect(JSON.stringify(sendMessage.mock.calls)).not.toContain("raw log");
  });

  it("forwards model-catalog requests with only the saved model value", async () => {
    const sendMessage = stubChromeRuntime((message) => ({
      ok: true,
      data: {
        bridgeSchemaVersion: 3,
        refreshedAt: "2026-06-11T05:42:00.000Z",
        source: "local-codex-bridge",
        codexCliVersion: "26.6.11",
        models: [
          {
            value: "gpt-5.5",
            label: "GPT-5.5",
            source: "known-catalog",
            available: true,
          },
        ],
        warnings: [],
        echoed: message,
      },
    }));

    await import("./content-script");

    const response = waitForBridgeResponse("request-models");
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "architect:page-local-runtime-request",
          requestId: "request-models",
          command: "model-catalog",
          input: {
            savedModel: "gpt-5.6",
            configPath: "C:\\Users\\secret\\.codex\\config.toml",
          },
        },
        origin: window.location.origin,
        source: window,
      }),
    );

    await expect(response).resolves.toMatchObject({
      type: "architect:page-local-runtime-response",
      requestId: "request-models",
      ok: true,
      data: {
        source: "local-codex-bridge",
        codexCliVersion: "26.6.11",
      },
    });
    expect(sendMessage).toHaveBeenCalledWith(
      {
        type: "architect:local-runtime-model-catalog",
        savedModel: "gpt-5.6",
      },
      expect.any(Function),
    );
    expect(JSON.stringify(sendMessage.mock.calls)).not.toContain("config.toml");
  });

  it("forwards sanitized top-level Codex options on page generate requests", async () => {
    const sendMessage = stubChromeRuntime((message) => {
      if ((message as { type?: string }).type === "architect:verify-official-law-evidence") {
        return {
          ok: true,
          data: {
            report: {
              status: "verified",
              failures: [],
              retry: [],
            },
            evidence: (message as { input: { evidence: unknown[] } }).input.evidence,
          },
        };
      }

      return {
        ok: true,
        data: {
          answer: "generated with options",
          draftSummary: {
            conclusion: "verified",
            tags: ["assistant"],
            scope: "ARCH-2",
          },
        },
      };
    });

    await import("./content-script");

    const response = waitForBridgeResponse("request-generate-options");
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "architect:page-local-runtime-request",
          requestId: "request-generate-options",
          command: "generate",
          codexOptions: {
            model: "gpt-5-codex",
            reasoningEffort: "high",
            serviceTier: "priority",
            sandboxMode: "read-only",
            configPath: "C:\\Users\\secret\\.codex\\config.toml",
            path: "D:\\secret\\workspace",
            env: { OPENAI_API_KEY: "secret" },
            stderr: "raw log",
          },
          input: {
            question: "건축 기준 검토",
            taskContext: {
              taskId: "task-2",
              projectId: "project-1",
              title: "채광 검토",
              description: "채광 기준 검토",
              status: "in_review",
              issueId: "ARCH-2",
              projectName: "Architect",
            },
            evidence: [
              {
                id: "reg-2",
                kind: "regulation",
                priority: 1,
                title: "건축 기준",
                excerpt: "검토 대상 기준",
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
      requestId: "request-generate-options",
      ok: true,
      data: {
        answer: "generated with options",
      },
    });

    const generateCall = sendMessage.mock.calls.find(
      ([message]) => (message as { type?: string }).type === "architect:local-runtime-generate",
    );
    expect(generateCall?.[0]).toEqual(
      expect.objectContaining({
        type: "architect:local-runtime-generate",
        codexOptions: {
          reasoningEffort: "high",
          serviceTier: "priority",
          sandboxMode: "read-only",
        },
      }),
    );
    expect(JSON.stringify(generateCall?.[0])).not.toContain("configPath");
    expect(JSON.stringify(generateCall?.[0])).not.toContain("OPENAI_API_KEY");
    expect(JSON.stringify(generateCall?.[0])).not.toContain("raw log");
  });

  it("forwards sanitized project context and readiness warnings on page generate requests", async () => {
    const sendMessage = stubChromeRuntime((message) => {
      if ((message as { type?: string }).type === "architect:verify-official-law-evidence") {
        return {
          ok: true,
          data: {
            report: {
              status: "verified",
              failures: [],
              retry: [],
            },
            evidence: (message as { input: { evidence: unknown[] } }).input.evidence,
          },
        };
      }

      return {
        ok: true,
        data: {
          answer: "generated with project context",
        },
      };
    });

    await import("./content-script");

    const response = waitForBridgeResponse("request-generate-project-context");
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "architect:page-local-runtime-request",
          requestId: "request-generate-project-context",
          command: "generate",
          input: {
            question: "단차 검토",
            taskContext: {
              taskId: "task-3",
              projectId: "project-1",
              title: "단차 검토",
              description: "현장 단차 검토",
              status: "in_review",
              issueId: "ARCH-3",
              projectName: "Architect",
            },
            evidence: [
              {
                id: "task-3-evidence",
                kind: "task",
                priority: 1,
                title: "현장 조건",
                excerpt: "단차 조건 검토",
              },
            ],
            legalEvidence: [],
            projectContextChunks: [
              {
                chunkId: "chunk-1",
                sourceId: "source-1",
                versionId: "version-1",
                sourceDocumentTitle: "회의록",
                normalizedText: "현장 조건은 북측 도로와 1.2m 단차가 있다.",
                sourceQuote: "북측 도로와 1.2m 단차",
                location: {
                  locationType: "line_range",
                  lineStart: 3,
                  lineEnd: 4,
                  nestedObjectThatMustNotCrossTheBridge: { unsafe: true },
                  htmlThatMustNotCrossTheBridge: "<script>alert(1)</script>",
                },
                contextType: "project_material",
                chunkQualityScore: 0.91,
                injectionRisk: "none",
                score: 0.83,
              },
            ],
            projectContextTrace: {
              status: "chunks_found",
              fallbackMode: "none",
              noRelevantChunkReason: null,
              searchErrorCode: null,
              includedChunkIds: ["chunk-1"],
              secretTraceField: "do-not-forward",
            },
            evidenceReadinessWarnings: [
              { code: "VERIFIED_LEGAL_CHANGE_WARNING", message: "법령 변경 감지 결과를 확인하세요." },
            ],
          },
        },
        origin: window.location.origin,
        source: window,
      }),
    );

    await expect(response).resolves.toMatchObject({
      type: "architect:page-local-runtime-response",
      requestId: "request-generate-project-context",
      ok: true,
    });

    const generateCall = sendMessage.mock.calls.find(
      ([message]) => (message as { type?: string }).type === "architect:local-runtime-generate",
    );
    expect(generateCall?.[0]).toMatchObject({
      type: "architect:local-runtime-generate",
      input: {
        projectContextChunks: [
          {
            chunkId: "chunk-1",
            sourceId: "source-1",
            versionId: "version-1",
            sourceDocumentTitle: "회의록",
            normalizedText: "현장 조건은 북측 도로와 1.2m 단차가 있다.",
            sourceQuote: "북측 도로와 1.2m 단차",
            location: { locationType: "line_range", lineStart: 3, lineEnd: 4 },
            contextType: "project_material",
            chunkQualityScore: 0.91,
            injectionRisk: "none",
            score: 0.83,
          },
        ],
        projectContextTrace: {
          status: "chunks_found",
          traceId: null,
          fallbackMode: "none",
          activeVersionIds: [],
          candidateChunkIds: [],
          matchedChunkIds: [],
          noRelevantChunkReason: null,
          searchErrorCode: null,
          includedChunkIds: ["chunk-1"],
        },
        evidenceReadinessWarnings: [
          { code: "VERIFIED_LEGAL_CHANGE_WARNING", message: "법령 변경 감지 결과를 확인하세요." },
        ],
      },
    });
    expect(JSON.stringify(generateCall?.[0])).not.toContain("nestedObjectThatMustNotCrossTheBridge");
    expect(JSON.stringify(generateCall?.[0])).not.toContain("htmlThatMustNotCrossTheBridge");
    expect(JSON.stringify(generateCall?.[0])).not.toContain("secretTraceField");
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
                id: "official-law:building-act:004900",
                kind: "regulation",
                priority: 2,
                title: "건축법 제49조",
                excerpt: "피난시설",
                officialSourceName: "국가법령정보센터",
                lawName: "건축법",
                articleLabel: "제49조",
                apiSourceUrl: "https://www.law.go.kr/DRF/lawService.do?target=eflaw&type=JSON&ID=123&JO=004900",
                verificationStatus: "verified",
              },
            ],
            projectContextChunks: [
              {
                chunkId: "chunk-1",
                sourceDocumentTitle: "회의록",
                normalizedText: "현장 조건은 북측 도로와 1.2m 단차가 있다.",
                sourceQuote: "북측 도로와 1.2m 단차",
              },
            ],
            projectContextTrace: {
              status: "chunks_found",
              fallbackMode: "none",
              includedChunkIds: ["chunk-1"],
            },
            evidenceReadinessWarnings: [
              { code: "VERIFIED_LEGAL_CHANGE_WARNING", message: "법령 변경 감지 결과를 확인하세요." },
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
          projectContextChunks: [
            expect.objectContaining({
              chunkId: "chunk-1",
              sourceQuote: "북측 도로와 1.2m 단차",
            }),
          ],
          projectContextTrace: expect.objectContaining({
            status: "chunks_found",
            includedChunkIds: ["chunk-1"],
          }),
          evidenceReadinessWarnings: [
            { code: "VERIFIED_LEGAL_CHANGE_WARNING", message: "법령 변경 감지 결과를 확인하세요." },
          ],
        }),
      }),
    );
  });

  it("reverifies page-supplied official law evidence even when it claims server verification", async () => {
    const sendMessage = stubChromeRuntime((message) => {
      if ((message as { type?: string }).type === "architect:verify-official-law-evidence") {
        return {
          ok: true,
          data: {
            report: {
              status: "verified",
              failures: [],
              retry: [],
            },
            evidence: (message as { input: { evidence: unknown[] } }).input.evidence,
          },
        };
      }

      return {
        ok: true,
        data: {
          answer: "server verified local answer",
          draftSummary: {
            conclusion: "verified",
            tags: ["assistant"],
            scope: "ARCH-1",
          },
        },
      };
    });

    await import("./content-script");

    const response = waitForBridgeResponse("request-server-verified");
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "architect:page-local-runtime-request",
          requestId: "request-server-verified",
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
        },
        origin: window.location.origin,
        source: window,
      }),
    );

    await expect(response).resolves.toMatchObject({
      type: "architect:page-local-runtime-response",
      requestId: "request-server-verified",
      ok: true,
      data: {
        answer: "server verified local answer",
      },
    });

    expect(sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: "architect:verify-official-law-evidence" }),
      expect.any(Function),
    );
    expect(sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: "architect:local-runtime-generate" }),
      expect.any(Function),
    );
  });

  it("fails closed for foundation regulation seeds without verified legal metadata", async () => {
    const sendMessage = stubChromeRuntime((message) => {
      if ((message as { type?: string }).type === "architect:verify-official-law-evidence") {
        return {
          ok: true,
          data: {
            report: {
              status: "failed",
              checkedAt: "2026-06-17T00:00:00.000Z",
              provider: {
                name: "국가법령정보센터",
                docsUrl: "https://open.law.go.kr/LSO/openApi/guideList.do",
              },
              locators: [],
              sources: [],
              failures: ["Verified legal evidence metadata is missing."],
              retry: ["Retrieve legal evidence through Architect SaaS/verified-legal-evidence-api first."],
            },
            evidence: [],
          },
        };
      }

      return {
        ok: true,
        data: {
          answer: "foundation seed review answer",
          draftSummary: {
            conclusion: "review required",
            tags: ["assistant"],
            scope: "ARCH-102",
          },
        },
      };
    });

    await import("./content-script");

    const response = waitForBridgeResponse("request-foundation-regulation");
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "architect:page-local-runtime-request",
          requestId: "request-foundation-regulation",
          command: "generate",
          input: {
            question: "102 task의 검토 근거와 후속 조치를 정리해줘.",
            taskContext: {
              taskId: "task-102",
              projectId: "project-1",
              title: "333333",
              description: "3333333333333",
              status: "new",
              issueId: "102",
              projectName: "밀양부북",
            },
            evidence: [
              {
                id: "foundation:building-act-egress",
                kind: "regulation",
                priority: 2,
                title: "건축법 피난ㆍ방화 기준 확인 seed",
                excerpt: "관리자 검토 전 foundation seed 근거입니다. 공식 원문은 import 전에 재확인해야 합니다.",
                sourceUrl: "https://www.law.go.kr/법령/건축법",
              },
              {
                id: "task-102-evidence",
                kind: "task",
                priority: 3,
                title: "Current task 밀양부북-102",
                excerpt: "333333 / 3333333333333",
              },
            ],
            legalEvidence: [],
          },
        },
        origin: window.location.origin,
        source: window,
      }),
    );

    await expect(response).resolves.toMatchObject({
      type: "architect:page-local-runtime-response",
      requestId: "request-foundation-regulation",
      ok: false,
    });

    expect(sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: "architect:verify-official-law-evidence" }),
      expect.any(Function),
    );
    expect(sendMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "architect:local-runtime-generate" }),
      expect.any(Function),
    );
  });

  it("uses centralized verified legal-search evidence after metadata preflight", async () => {
    const centralizedEvidence = {
      id: "verified-legal-search:law:004948:chunk-26",
      kind: "regulation",
      priority: 2,
      title: "주택건설기준 등에 관한 규정",
      excerpt: "주택건설기준 등에 관한 규정 제26조",
      sourceUrl: "https://www.law.go.kr/DRF/lawService.do?target=law&type=JSON&ID=004948",
      recordId: "law:004948",
      confidenceWeight: 0.8,
      officialSourceName: "국가법령정보센터",
      lawName: "주택건설기준 등에 관한 규정",
      articleLabel: "제26조",
      articleNumber: "002600",
      effectiveDate: "20260617",
      checkedAt: "2026-06-17T00:00:00.000Z",
      apiSourceUrl: "https://www.law.go.kr/DRF/lawService.do?target=law&type=JSON&ID=004948",
      verificationStatus: "verified",
    };
    const sendMessage = stubChromeRuntime((message) => {
      if ((message as { type?: string }).type === "architect:verify-official-law-evidence") {
        return {
          ok: true,
          data: {
            report: {
              status: "verified",
              checkedAt: "2026-06-17T00:00:00.000Z",
              provider: {
                name: "국가법령정보센터",
                docsUrl: "https://open.law.go.kr/LSO/openApi/guideList.do",
              },
              locators: [],
              sources: [],
              failures: [],
              retry: [],
            },
            evidence: [centralizedEvidence],
          },
        };
      }

      return {
        ok: true,
        data: {
          answer: "centralized verified legal answer",
          draftSummary: {
            conclusion: "verified by centralized evidence",
            tags: ["assistant"],
            scope: "ARCH-102",
          },
        },
      };
    });

    await import("./content-script");

    const response = waitForBridgeResponse("request-centralized-legal");
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "architect:page-local-runtime-request",
          requestId: "request-centralized-legal",
          command: "generate",
          input: {
            question: "102 task의 검토 근거와 후속 조치를 정리해줘.",
            taskContext: {
              taskId: "task-102",
              projectId: "project-1",
              title: "333333",
              description: "3333333333333",
              status: "new",
              issueId: "102",
              projectName: "밀양부북",
            },
            evidence: [
              centralizedEvidence,
              {
                id: "task-102-evidence",
                kind: "task",
                priority: 3,
                title: "Current task 밀양부북-102",
                excerpt: "333333 / 3333333333333",
              },
            ],
            legalEvidence: [centralizedEvidence],
          },
        },
        origin: window.location.origin,
        source: window,
      }),
    );

    await expect(response).resolves.toMatchObject({
      type: "architect:page-local-runtime-response",
      requestId: "request-centralized-legal",
      ok: true,
      data: {
        answer: "centralized verified legal answer",
      },
    });

    expect(sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: "architect:verify-official-law-evidence" }),
      expect.any(Function),
    );
    expect(sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "architect:local-runtime-generate",
        input: expect.objectContaining({
          evidence: expect.arrayContaining([
            expect.objectContaining({ id: "verified-legal-search:law:004948:chunk-26" }),
          ]),
        }),
      }),
      expect.any(Function),
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

function waitForReadyEvent() {
  return new Promise((resolve) => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as { type?: string };
      if (data?.type !== "architect:page-local-runtime-ready") {
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
      id: "test-extension-id",
      lastError: undefined,
      onMessage: {
        addListener: vi.fn(),
      },
      sendMessage,
    },
  });
  return sendMessage;
}
