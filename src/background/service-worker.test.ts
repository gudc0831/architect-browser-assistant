import { afterEach, describe, expect, it, vi } from "vitest";
import {
  SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE,
  UPDATE_SIDE_PANEL_CONTEXT_MESSAGE,
} from "../runtime/side-panel-contract";

type RuntimeMessageListener = (
  message: unknown,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void,
) => boolean | undefined;

type TabRemovedListener = (tabId: number) => void;

type ChromeHarness = {
  activeTab: chrome.tabs.Tab;
  sidePanelOpen: ReturnType<typeof vi.fn>;
  runtimeSendMessage: ReturnType<typeof vi.fn>;
  setActiveTab: (tab: chrome.tabs.Tab) => void;
  getRuntimeMessageListener: () => RuntimeMessageListener;
  getTabRemovedListener: () => TabRemovedListener;
};

describe("background service worker side panel context sync", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("stores launch context and opens the side panel on open-side-panel", async () => {
    const harness = setupChromeHarness(makeTab(101));
    await import("./service-worker");

    const response = await sendRuntimeMessage(harness, {
      type: "architect:open-side-panel",
      input: {
        taskId: "task-launch",
        projectId: "project-1",
        title: "Launch task",
        question: "Launch question",
        url: "https://app.example.com/daily?task=1&token=secret",
      },
    });

    expect(response).toMatchObject({
      ok: true,
      data: {
        opened: true,
        taskId: "task-launch",
        openedAt: expect.any(String),
      },
    });
    expect(harness.sidePanelOpen).toHaveBeenCalledWith({ tabId: 101 });

    const launchContext = await sendRuntimeMessage(harness, { type: "architect:get-side-panel-launch-context" });
    expect(launchContext).toMatchObject({
      ok: true,
      data: {
        taskId: "task-launch",
        projectId: "project-1",
        title: "Launch task",
        question: "Launch question",
        url: "https://app.example.com/daily?task=1",
        openedAt: expect.any(String),
        sourceTabId: 101,
      },
    });
  });

  it("stores update context and broadcasts without opening the side panel", async () => {
    const harness = setupChromeHarness(makeTab(202));
    await import("./service-worker");

    const response = await sendRuntimeMessage(harness, {
      type: UPDATE_SIDE_PANEL_CONTEXT_MESSAGE,
      input: makeContextSnapshot({
        taskId: "task-live",
        url: "https://app.example.com/daily?task=2&access_token=secret",
        reason: "selection-change",
      }),
    });

    expect(response).toEqual({
      ok: true,
      data: {
        taskId: "task-live",
      },
    });
    expect(harness.sidePanelOpen).not.toHaveBeenCalled();
    expect(harness.runtimeSendMessage).toHaveBeenCalledWith({
      type: SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE,
      context: expect.objectContaining({
        task: expect.objectContaining({ taskId: "task-live" }),
        page: {
          url: "https://app.example.com/daily?task=2",
          route: "/daily",
        },
        reason: "selection-change",
        selectedAt: "2026-06-23T01:02:03.000Z",
        source: "architect-saas-daily",
        sourceTabId: 202,
      }),
    });
  });

  it("returns active tab context as legacy launch shape", async () => {
    const harness = setupChromeHarness(makeTab(303));
    await import("./service-worker");

    await sendRuntimeMessage(harness, {
      type: UPDATE_SIDE_PANEL_CONTEXT_MESSAGE,
      input: makeContextSnapshot({
        taskId: "task-active",
        projectId: "project-active",
        title: "Active task",
        question: "Active question",
        url: "https://app.example.com/daily?task=3&code=secret",
        reason: "question-change",
      }),
    });

    const response = await sendRuntimeMessage(harness, { type: "architect:get-side-panel-launch-context" });

    expect(response).toEqual({
      ok: true,
      data: {
        taskId: "task-active",
        projectId: "project-active",
        title: "Active task",
        question: "Active question",
        url: "https://app.example.com/daily?task=3",
        openedAt: "2026-06-23T01:02:03.000Z",
        sourceTabId: 303,
      },
    });
  });

  it("returns ok false for invalid update payloads", async () => {
    const harness = setupChromeHarness(makeTab(404));
    await import("./service-worker");

    const response = await sendRuntimeMessage(harness, {
      type: UPDATE_SIDE_PANEL_CONTEXT_MESSAGE,
      input: {
        task: { taskId: "" },
        page: { url: "https://app.example.com/daily" },
        reason: "selection-change",
        selectedAt: "2026-06-23T01:02:03.000Z",
        source: "architect-saas-daily",
      },
    });

    expect(response).toEqual({
      ok: false,
      error: "Invalid side panel context update payload.",
    });
    expect(harness.runtimeSendMessage).not.toHaveBeenCalled();
    expect(harness.sidePanelOpen).not.toHaveBeenCalled();
  });

  it("does not return stale context from another active tab", async () => {
    const harness = setupChromeHarness(makeTab(505));
    await import("./service-worker");

    await sendRuntimeMessage(harness, {
      type: UPDATE_SIDE_PANEL_CONTEXT_MESSAGE,
      input: makeContextSnapshot({
        taskId: "task-tab-a",
        title: "Tab A task",
        question: "Tab A question",
        url: "https://app.example.com/daily?task=tab-a",
      }),
    });

    harness.setActiveTab(makeTab(606, "https://app.example.com/daily?task=tab-b"));

    await expect(sendRuntimeMessage(harness, { type: "architect:get-side-panel-launch-context" })).resolves.toEqual({
      ok: true,
      data: null,
    });
  });

  it("cleans tab-specific context on tab removal and does not fall back for a known active tab", async () => {
    const tab = makeTab(505);
    const harness = setupChromeHarness(tab);
    await import("./service-worker");

    await sendRuntimeMessage(harness, {
      type: "architect:open-side-panel",
      input: {
        taskId: "task-launch",
        projectId: "project-1",
        title: "Launch task",
        question: "Launch question",
        url: "https://app.example.com/daily?task=launch&session=secret",
      },
    });
    await sendRuntimeMessage(harness, {
      type: UPDATE_SIDE_PANEL_CONTEXT_MESSAGE,
      input: makeContextSnapshot({
        taskId: "task-live",
        title: "Live task",
        question: "Live question",
        url: "https://app.example.com/daily?task=live&auth=secret",
      }),
    });

    await expect(sendRuntimeMessage(harness, { type: "architect:get-side-panel-launch-context" })).resolves.toMatchObject({
      ok: true,
      data: {
        taskId: "task-live",
        title: "Live task",
        question: "Live question",
        url: "https://app.example.com/daily?task=live",
      },
    });

    harness.getTabRemovedListener()(505);

    await expect(sendRuntimeMessage(harness, { type: "architect:get-side-panel-launch-context" })).resolves.toEqual({
      ok: true,
      data: null,
    });
  });

  it("falls back to latest launch context only when active tab lookup has no tab id", async () => {
    const harness = setupChromeHarness(makeTab(707));
    await import("./service-worker");

    await sendRuntimeMessage(harness, {
      type: "architect:open-side-panel",
      input: {
        taskId: "task-launch",
        projectId: "project-1",
        title: "Launch task",
        question: "Launch question",
        url: "https://app.example.com/daily?task=launch&session=secret",
      },
    });

    harness.setActiveTab(makeTabWithoutId("https://app.example.com/daily?task=unknown"));

    await expect(sendRuntimeMessage(harness, { type: "architect:get-side-panel-launch-context" })).resolves.toMatchObject({
      ok: true,
      data: {
        taskId: "task-launch",
        title: "Launch task",
        question: "Launch question",
        url: "https://app.example.com/daily?task=launch",
      },
    });
  });
});

function setupChromeHarness(initialActiveTab: chrome.tabs.Tab): ChromeHarness {
  let activeTab = initialActiveTab;
  let runtimeMessageListener: RuntimeMessageListener | null = null;
  let tabRemovedListener: TabRemovedListener | null = null;

  const sidePanelOpen = vi.fn(() => Promise.resolve());
  const runtimeSendMessage = vi.fn(() => Promise.resolve({ ok: true }));
  const tabsQuery = vi.fn((_queryInfo: chrome.tabs.QueryInfo, callback?: (tabs: chrome.tabs.Tab[]) => void) => {
    const result = [activeTab];
    if (callback) {
      callback(result);
      return undefined;
    }
    return Promise.resolve(result);
  });

  vi.stubGlobal("chrome", {
    runtime: {
      id: "test-extension-id",
      lastError: undefined,
      onInstalled: {
        addListener: vi.fn(),
      },
      onMessage: {
        addListener: vi.fn((listener: RuntimeMessageListener) => {
          runtimeMessageListener = listener;
        }),
      },
      sendMessage: runtimeSendMessage,
      sendNativeMessage: vi.fn(),
    },
    sidePanel: {
      setPanelBehavior: vi.fn(() => Promise.resolve()),
      open: sidePanelOpen,
    },
    tabs: {
      query: tabsQuery,
      sendMessage: vi.fn(),
      captureVisibleTab: vi.fn(),
      onRemoved: {
        addListener: vi.fn((listener: TabRemovedListener) => {
          tabRemovedListener = listener;
        }),
      },
    },
  });

  return {
    get activeTab() {
      return activeTab;
    },
    sidePanelOpen,
    runtimeSendMessage,
    setActiveTab(tab: chrome.tabs.Tab) {
      activeTab = tab;
    },
    getRuntimeMessageListener() {
      if (!runtimeMessageListener) {
        throw new Error("Runtime message listener was not registered.");
      }
      return runtimeMessageListener;
    },
    getTabRemovedListener() {
      if (!tabRemovedListener) {
        throw new Error("Tab removal listener was not registered.");
      }
      return tabRemovedListener;
    },
  };
}

function sendRuntimeMessage(
  harness: ChromeHarness,
  message: unknown,
  sender: chrome.runtime.MessageSender = { tab: harness.activeTab },
) {
  return new Promise<unknown>((resolve) => {
    harness.getRuntimeMessageListener()(message, sender, resolve);
  });
}

function makeTab(id: number, url = "https://app.example.com/daily?task=1"): chrome.tabs.Tab {
  return {
    id,
    windowId: 10,
    index: 0,
    highlighted: true,
    active: true,
    pinned: false,
    incognito: false,
    selected: true,
    discarded: false,
    autoDiscardable: true,
    groupId: -1,
    url,
    title: "Daily",
  } as chrome.tabs.Tab;
}

function makeTabWithoutId(url = "https://app.example.com/daily?task=1"): chrome.tabs.Tab {
  return {
    windowId: 10,
    index: 0,
    highlighted: true,
    active: true,
    pinned: false,
    incognito: false,
    selected: true,
    discarded: false,
    autoDiscardable: true,
    groupId: -1,
    url,
    title: "Daily",
  } as chrome.tabs.Tab;
}

function makeContextSnapshot({
  taskId,
  projectId = "project-1",
  title = "Live task",
  question = "Live question",
  url,
  reason = "health-refresh",
}: {
  taskId: string;
  projectId?: string;
  title?: string;
  question?: string;
  url: string;
  reason?: "selection-change" | "question-change" | "health-refresh";
}) {
  return {
    task: {
      taskId,
      projectId,
      title,
    },
    review: {
      question,
      assistantMode: "advanced",
    },
    page: {
      url,
      route: "/daily",
    },
    reason,
    selectedAt: "2026-06-23T01:02:03.000Z",
    source: "architect-saas-daily",
  };
}
