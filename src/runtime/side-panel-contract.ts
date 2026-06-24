export type SidePanelLaunchContext = {
  taskId: string;
  projectId?: string;
  title?: string;
  url?: string;
  question?: string;
  openedAt?: string;
  sourceTabId?: number;
};

export const SIDE_PANEL_CONTEXT_UPDATED_EVENT = "architect:side-panel-context-updated";
export const UPDATE_SIDE_PANEL_CONTEXT_MESSAGE = "architect:update-side-panel-context";
export const SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE = "architect:side-panel-context-broadcast";

export type SidePanelContextReason =
  | "launch"
  | "selection-change"
  | "question-change"
  | "mode-change"
  | "health-refresh";

export type SidePanelContextSnapshot = {
  task: {
    taskId: string;
    projectId?: string;
    displayId?: string;
    title?: string;
    status?: string;
  };
  review?: {
    question?: string;
    executionMode?: string;
    assistantMode?: "basic" | "advanced";
  };
  page: {
    url: string;
    route: string;
  };
  reason: SidePanelContextReason;
  selectedAt: string;
  source: "architect-saas-daily";
  sourceTabId?: number;
};

export type SidePanelOpenExtensionMessage = {
  type: "architect:open-side-panel";
  input: SidePanelLaunchContext;
};

export type SidePanelContextUpdateExtensionMessage = {
  type: typeof UPDATE_SIDE_PANEL_CONTEXT_MESSAGE;
  input: SidePanelContextSnapshot;
};

export type SidePanelContextBroadcastExtensionMessage = {
  type: typeof SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE;
  context: SidePanelContextSnapshot;
};

export type SidePanelOpenResponse = {
  opened: true;
  taskId: string;
  openedAt: string;
};

const allowedContextReasons = new Set<SidePanelContextReason>([
  "launch",
  "selection-change",
  "question-change",
  "mode-change",
  "health-refresh",
]);
const sensitiveUrlQueryParams = new Set(["token", "access_token", "code", "refresh_token", "id_token", "auth", "session"]);

export function normalizeSidePanelLaunchContext(value: unknown): SidePanelLaunchContext | null {
  if (!isPlainRecord(value)) {
    return null;
  }

  try {
    const taskId = normalizeRequiredText(value.taskId, 120);
    if (!taskId) {
      return null;
    }

    const projectId = normalizeOptionalText(value.projectId, 120);
    const title = normalizeOptionalText(value.title, 300);
    const url = normalizeOptionalUrl(value.url, 500);
    const question = normalizeOptionalText(value.question, 1000);

    return {
      taskId,
      ...(projectId ? { projectId } : {}),
      ...(title ? { title } : {}),
      ...(url ? { url } : {}),
      ...(question ? { question } : {}),
    };
  } catch {
    return null;
  }
}

export function normalizeSidePanelContextSnapshot(value: unknown): SidePanelContextSnapshot | null {
  if (!isPlainRecord(value)) {
    return null;
  }

  try {
    if (!isPlainRecord(value.task) || !isPlainRecord(value.page)) {
      return null;
    }

    const taskId = normalizeRequiredText(value.task.taskId, 120);
    if (!taskId) {
      return null;
    }

    if (value.source !== "architect-saas-daily") {
      return null;
    }

    const normalizedUrl = normalizeOptionalUrl(value.page.url, 2000);
    if (!normalizedUrl) {
      return null;
    }

    const parsedUrl = new URL(normalizedUrl);
    const task: SidePanelContextSnapshot["task"] = { taskId };
    const projectId = normalizeOptionalText(value.task.projectId, 120);
    const displayId = normalizeOptionalText(value.task.displayId, 120);
    const title = normalizeOptionalText(value.task.title, 300);
    const status = normalizeOptionalText(value.task.status, 120);
    if (projectId) {
      task.projectId = projectId;
    }
    if (displayId) {
      task.displayId = displayId;
    }
    if (title) {
      task.title = title;
    }
    if (status) {
      task.status = status;
    }

    const review = normalizeSidePanelReview(value.review);
    const reason = allowedContextReasons.has(value.reason as SidePanelContextReason)
      ? (value.reason as SidePanelContextReason)
      : "health-refresh";
    const route = normalizeRoute(value.page.route, parsedUrl);
    const selectedAt = normalizeSelectedAt(value.selectedAt);
    const sourceTabId = normalizeSourceTabId(value.sourceTabId);

    return {
      task,
      ...(review ? { review } : {}),
      page: {
        url: normalizedUrl,
        route,
      },
      reason,
      selectedAt,
      source: "architect-saas-daily",
      ...(typeof sourceTabId === "number" ? { sourceTabId } : {}),
    };
  } catch {
    return null;
  }
}

export function isSidePanelContextBroadcastMessage(
  value: unknown,
): value is SidePanelContextBroadcastExtensionMessage {
  const normalized = normalizeSidePanelContextBroadcastMessage(value);
  if (!normalized || !isPlainRecord(value)) {
    return false;
  }

  try {
    value.context = normalized.context;
    return value.context === normalized.context;
  } catch {
    return false;
  }
}

export function normalizeSidePanelContextBroadcastMessage(
  value: unknown,
): SidePanelContextBroadcastExtensionMessage | null {
  if (!isPlainRecord(value)) {
    return null;
  }

  try {
    if (value.type !== SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE) {
      return null;
    }

    const context = normalizeSidePanelContextSnapshot(value.context);
    return context ? { type: SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE, context } : null;
  } catch {
    return null;
  }
}

export function sidePanelLaunchContextToSnapshot(
  launchContext: SidePanelLaunchContext,
  options: {
    pageUrl?: string;
    route?: string;
    reason?: SidePanelContextReason;
    selectedAt?: string;
    sourceTabId?: number;
  } = {},
): SidePanelContextSnapshot | null {
  const pageUrl = launchContext.url || options.pageUrl || "";
  return normalizeSidePanelContextSnapshot({
    task: {
      taskId: launchContext.taskId,
      projectId: launchContext.projectId,
      title: launchContext.title,
    },
    review: {
      question: launchContext.question,
    },
    page: {
      url: pageUrl,
      route: options.route,
    },
    reason: options.reason ?? "launch",
    selectedAt: options.selectedAt ?? launchContext.openedAt,
    source: "architect-saas-daily",
    sourceTabId: options.sourceTabId ?? launchContext.sourceTabId,
  });
}

export function sidePanelContextSnapshotToLaunchContext(
  snapshot: SidePanelContextSnapshot,
): SidePanelLaunchContext {
  return {
    taskId: snapshot.task.taskId,
    ...(snapshot.task.projectId ? { projectId: snapshot.task.projectId } : {}),
    ...(snapshot.task.title ? { title: snapshot.task.title } : {}),
    url: snapshot.page.url,
    ...(snapshot.review?.question ? { question: snapshot.review.question } : {}),
    openedAt: snapshot.selectedAt,
    ...(typeof snapshot.sourceTabId === "number" ? { sourceTabId: snapshot.sourceTabId } : {}),
  };
}

function normalizeRequiredText(value: unknown, maxLength: number) {
  const normalized = normalizeOptionalText(value, maxLength);
  return normalized || null;
}

function normalizeOptionalText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.replaceAll("\0", "").trim().slice(0, maxLength) : "";
}

function normalizeOptionalUrl(value: unknown, maxLength: number) {
  const raw = normalizeOptionalText(value, maxLength);
  if (!raw) {
    return "";
  }

  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "";
    }
    for (const key of [...url.searchParams.keys()]) {
      if (sensitiveUrlQueryParams.has(key.toLowerCase())) {
        url.searchParams.delete(key);
      }
    }
    url.hash = "";
    return url.href;
  } catch {
    return "";
  }
}

function normalizeRoute(value: unknown, url: URL) {
  const raw = normalizeOptionalText(value, 200);
  if (!raw) {
    return url.pathname || "";
  }

  try {
    const parsedRoute = new URL(raw, url.origin);
    return parsedRoute.origin === url.origin ? parsedRoute.pathname : url.pathname || "";
  } catch {
    return raw.split(/[?#]/, 1)[0].trim().slice(0, 200) || url.pathname || "";
  }
}

function normalizeSidePanelReview(value: unknown): SidePanelContextSnapshot["review"] | undefined {
  if (!isPlainRecord(value)) {
    return undefined;
  }

  const question = normalizeOptionalText(value.question, 2000);
  const executionMode = normalizeOptionalText(value.executionMode, 120);
  const assistantMode = value.assistantMode === "basic" || value.assistantMode === "advanced" ? value.assistantMode : undefined;
  const review: SidePanelContextSnapshot["review"] = {};
  if (question) {
    review.question = question;
  }
  if (executionMode) {
    review.executionMode = executionMode;
  }
  if (assistantMode) {
    review.assistantMode = assistantMode;
  }

  return Object.keys(review).length > 0 ? review : undefined;
}

function normalizeSelectedAt(value: unknown) {
  const raw = normalizeOptionalText(value, 80);
  return raw && !Number.isNaN(Date.parse(raw)) ? raw : new Date().toISOString();
}

function normalizeSourceTabId(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : undefined;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  try {
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  } catch {
    return false;
  }
}
