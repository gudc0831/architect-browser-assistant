chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => {
    console.error("Failed to configure side panel", error);
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "architect:get-active-tab-source") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab?.url || !isHttpUrl(tab.url)) {
        sendResponse({ ok: false, error: "Active tab source is not an http(s) page" });
        return;
      }

      sendResponse({
        ok: true,
        data: {
          title: tab.title?.trim() || "Browser source",
          url: tab.url,
          capturedAt: new Date().toISOString(),
        },
      });
    });
    return true;
  }

  if (message?.type !== "architect:get-task-context") {
    return false;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
    if (!tab?.id) {
      sendResponse({ ok: false, error: "No active tab" });
      return;
    }

    try {
      const response = await chrome.tabs.sendMessage(tab.id, { type: "architect:detect-task-context" });
      sendResponse(response ?? { ok: false, error: "No task context response" });
    } catch (error) {
      sendResponse({ ok: false, error: error instanceof Error ? error.message : "Task context unavailable" });
    }
  });

  return true;
});

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
