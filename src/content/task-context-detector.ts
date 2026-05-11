export type DetectedTaskContext = {
  taskId: string;
  projectId?: string;
  title?: string;
  url: string;
};

export function detectTaskContext(urlValue: string, root: Document): DetectedTaskContext | null {
  const url = new URL(urlValue);
  const selectedTaskElement = readSelectedTaskElement(root);
  const taskId = readTaskId(url, root);
  if (!taskId) {
    return null;
  }

  return {
    taskId,
    projectId: readProjectId(url, root),
    title: readTitle(root, selectedTaskElement),
    url: url.href,
  };
}

function readTaskId(url: URL, root: Document) {
  const queryTaskId = url.searchParams.get("taskId") ?? url.searchParams.get("task");
  if (queryTaskId?.trim()) {
    return queryTaskId.trim();
  }

  const pathMatch = url.pathname.match(/\/tasks\/([^/]+)/);
  if (pathMatch?.[1]) {
    return decodeURIComponent(pathMatch[1]);
  }

  const selectedTaskElement = readSelectedTaskElement(root);
  const selectedTaskId = readTaskIdFromElement(selectedTaskElement);
  if (selectedTaskId) {
    return selectedTaskId;
  }

  return root.querySelector<HTMLElement>("[data-task-id]")?.dataset.taskId?.trim() || null;
}

function readProjectId(url: URL, root: Document) {
  return (
    url.searchParams.get("projectId")?.trim() ||
    root.querySelector<HTMLElement>("[data-project-id]")?.dataset.projectId?.trim() ||
    undefined
  );
}

function readTitle(root: Document, selectedTaskElement: HTMLElement | null) {
  return (
    readText(root.querySelector<HTMLElement>("[data-task-title]")) ||
    readSelectedTaskTitle(selectedTaskElement) ||
    root.querySelector("h1")?.textContent?.trim() ||
    root.title.trim() ||
    undefined
  );
}

function readSelectedTaskElement(root: Document) {
  return root.querySelector<HTMLElement>(
    [
      '[data-task-row-id][aria-selected="true"]',
      "[data-task-row-id].sheet-row--active",
      '[data-task-id][aria-selected="true"]',
      "[data-task-id].sheet-row--active",
    ].join(","),
  );
}

function readTaskIdFromElement(element: HTMLElement | null) {
  return element?.dataset.taskRowId?.trim() || element?.dataset.taskId?.trim() || null;
}

function readSelectedTaskTitle(element: HTMLElement | null) {
  return readText(
    element?.querySelector<HTMLElement>(
      [
        '[data-task-column="issueTitle"] .sheet-table__title-copy',
        '[data-task-column="issueTitle"]',
        '[data-grid-column="issueTitle"] .sheet-table__title-copy',
        '[data-grid-column="issueTitle"]',
      ].join(","),
    ) ?? null,
  );
}

function readText(element: HTMLElement | null) {
  const text = element?.innerText || element?.textContent || "";
  return text.trim() || undefined;
}
