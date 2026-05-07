chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => {
    console.error("Failed to configure side panel", error);
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
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
