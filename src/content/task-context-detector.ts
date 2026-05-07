export type DetectedTaskContext = {
  taskId: string;
  projectId?: string;
  title?: string;
  url: string;
};

export function detectTaskContext(urlValue: string, root: Document): DetectedTaskContext | null {
  const url = new URL(urlValue);
  const taskId = readTaskId(url, root);
  if (!taskId) {
    return null;
  }

  return {
    taskId,
    projectId: readProjectId(url, root),
    title: readTitle(root),
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

  return root.querySelector<HTMLElement>("[data-task-id]")?.dataset.taskId?.trim() || null;
}

function readProjectId(url: URL, root: Document) {
  return (
    url.searchParams.get("projectId")?.trim() ||
    root.querySelector<HTMLElement>("[data-project-id]")?.dataset.projectId?.trim() ||
    undefined
  );
}

function readTitle(root: Document) {
  return (
    root.querySelector<HTMLElement>("[data-task-title]")?.innerText.trim() ||
    root.querySelector("h1")?.textContent?.trim() ||
    root.title.trim() ||
    undefined
  );
}
