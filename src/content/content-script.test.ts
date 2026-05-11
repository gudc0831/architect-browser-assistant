import { afterEach, describe, expect, it, vi } from "vitest";
import type { LocalRuntimeExtensionResponse } from "../runtime/native-bridge-contract";

describe("content script local runtime page bridge", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("forwards same-origin page status requests to the extension runtime", async () => {
    const sendMessage = stubChromeRuntime({
      ok: true,
      data: {
        available: true,
        mode: "local-chatgpt-codex",
        reason: "Native bridge ready",
      },
    });

    await import("./content-script");

    const response = waitForBridgeResponse("request-1");
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

    await expect(response).resolves.toMatchObject({
      type: "architect:page-local-runtime-response",
      requestId: "request-1",
      ok: true,
      data: {
        available: true,
        mode: "local-chatgpt-codex",
      },
    });
    expect(sendMessage).toHaveBeenCalledWith({ type: "architect:local-runtime-status" }, expect.any(Function));
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

function stubChromeRuntime<T>(response: LocalRuntimeExtensionResponse<T>) {
  const sendMessage = vi.fn((_: unknown, callback: (value: LocalRuntimeExtensionResponse<T>) => void) => {
    callback(response);
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
