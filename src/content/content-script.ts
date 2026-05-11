import { detectTaskContext } from "./task-context-detector";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "architect:detect-task-context") {
    return false;
  }

  const context = detectTaskContext(window.location.href, document);
  sendResponse(context ? { ok: true, data: context } : { ok: false, error: "Current page is not a supported task view" });
  return false;
});
