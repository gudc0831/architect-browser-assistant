import { describe, expect, it } from "vitest";
import {
  SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE,
  isSidePanelContextBroadcastMessage,
  normalizeSidePanelContextBroadcastMessage,
  normalizeSidePanelContextSnapshot,
} from "./side-panel-contract";

describe("side panel context contract", () => {
  it("accepts a valid context snapshot", () => {
    const selectedAt = "2026-06-23T01:02:03.000Z";

    const result = normalizeSidePanelContextSnapshot({
      task: {
        taskId: " task-1\0 ",
        projectId: " project-1 ",
        displayId: " ARCH-1 ",
        title: " Daily task ",
        status: " in_review ",
      },
      review: {
        question: " What should be checked? ",
        executionMode: " local-codex ",
        assistantMode: "advanced",
      },
      page: {
        url: " https://example.com/daily?task=1 ",
        route: " /daily ",
      },
      reason: "selection-change",
      selectedAt,
      source: "architect-saas-daily",
    });

    expect(result).toEqual({
      task: {
        taskId: "task-1",
        projectId: "project-1",
        displayId: "ARCH-1",
        title: "Daily task",
        status: "in_review",
      },
      review: {
        question: "What should be checked?",
        executionMode: "local-codex",
        assistantMode: "advanced",
      },
      page: {
        url: "https://example.com/daily?task=1",
        route: "/daily",
      },
      reason: "selection-change",
      selectedAt,
      source: "architect-saas-daily",
    });
  });

  it("rejects snapshots without a task id", () => {
    expect(
      normalizeSidePanelContextSnapshot({
        task: { taskId: " \0 " },
        page: { url: "https://example.com/daily" },
        reason: "selection-change",
        selectedAt: "2026-06-23T01:02:03.000Z",
        source: "architect-saas-daily",
      }),
    ).toBeNull();
  });

  it("ignores unknown fields", () => {
    const selectedAt = "2026-06-23T01:02:03.000Z";

    const result = normalizeSidePanelContextSnapshot({
      task: {
        taskId: "task-1",
        title: "Daily task",
        secretTaskField: "drop-me",
      },
      review: {
        question: "Question",
        secretReviewField: "drop-me",
      },
      page: {
        url: "https://example.com/daily",
        secretPageField: "drop-me",
      },
      reason: "unknown-reason",
      selectedAt,
      source: "architect-saas-daily",
      secretRootField: "drop-me",
    });

    expect(result).toEqual({
      task: {
        taskId: "task-1",
        title: "Daily task",
      },
      review: {
        question: "Question",
      },
      page: {
        url: "https://example.com/daily",
        route: "/daily",
      },
      reason: "health-refresh",
      selectedAt,
      source: "architect-saas-daily",
    });
    expect(JSON.stringify(result)).not.toContain("secret");
  });

  it("clamps long title, question, and url fields", () => {
    const longTitle = "t".repeat(500);
    const longQuestion = "q".repeat(2500);
    const longUrl = `https://example.com/${"a".repeat(2500)}`;

    const result = normalizeSidePanelContextSnapshot({
      task: {
        taskId: "task-1",
        title: longTitle,
      },
      review: {
        question: longQuestion,
      },
      page: {
        url: longUrl,
      },
      reason: "question-change",
      selectedAt: "2026-06-23T01:02:03.000Z",
      source: "architect-saas-daily",
    });

    expect(result?.task.title).toHaveLength(300);
    expect(result?.review?.question).toHaveLength(2000);
    expect(result?.page.url.length).toBeLessThanOrEqual(2000);
    expect(result?.page.url).toMatch(/^https:\/\/example\.com\//);
  });

  it("strips sensitive query params during url normalization", () => {
    const result = normalizeSidePanelContextSnapshot({
      task: {
        taskId: "task-1",
      },
      page: {
        url: "https://example.com/daily?task=1&token=secret&access_token=secret&code=secret&ok=1",
      },
      reason: "health-refresh",
      selectedAt: "2026-06-23T01:02:03.000Z",
      source: "architect-saas-daily",
    });

    expect(result?.page.url).toBe("https://example.com/daily?task=1&ok=1");
  });

  it("strips hash fragments from normalized urls", () => {
    const result = normalizeSidePanelContextSnapshot({
      task: {
        taskId: "task-1",
      },
      page: {
        url: "https://example.com/daily?task=1#access_token=secret&session=secret",
      },
      reason: "health-refresh",
      selectedAt: "2026-06-23T01:02:03.000Z",
      source: "architect-saas-daily",
    });

    expect(result?.page.url).toBe("https://example.com/daily?task=1");
  });

  it("strips route query and hash text", () => {
    const result = normalizeSidePanelContextSnapshot({
      task: {
        taskId: "task-1",
      },
      page: {
        url: "https://example.com/daily?task=1",
        route: "/daily?token=secret#access_token=secret",
      },
      reason: "health-refresh",
      selectedAt: "2026-06-23T01:02:03.000Z",
      source: "architect-saas-daily",
    });

    expect(result?.page.route).toBe("/daily");
  });

  it("derives route from the scrubbed url pathname when route is empty", () => {
    const result = normalizeSidePanelContextSnapshot({
      task: {
        taskId: "task-1",
      },
      page: {
        url: "https://example.com/preview/daily?token=secret#access_token=secret",
        route: " ",
      },
      reason: "health-refresh",
      selectedAt: "2026-06-23T01:02:03.000Z",
      source: "architect-saas-daily",
    });

    expect(result?.page.route).toBe("/preview/daily");
    expect(result?.page.url).toBe("https://example.com/preview/daily");
  });

  it("strips sensitive query params case-insensitively", () => {
    const result = normalizeSidePanelContextSnapshot({
      task: {
        taskId: "task-1",
      },
      page: {
        url: "https://example.com/daily?Task=1&ToKeN=secret&ACCESS_TOKEN=secret&Refresh_Token=secret&ok=1",
      },
      reason: "health-refresh",
      selectedAt: "2026-06-23T01:02:03.000Z",
      source: "architect-saas-daily",
    });

    expect(result?.page.url).toBe("https://example.com/daily?Task=1&ok=1");
  });

  it("does not throw on non-object or non-plain payloads", () => {
    const throwingPayload = Object.defineProperty({}, "task", {
      get() {
        throw new Error("getter should not escape");
      },
    });

    for (const value of [null, undefined, "payload", 42, [], new Date(), throwingPayload]) {
      expect(() => normalizeSidePanelContextSnapshot(value)).not.toThrow();
      expect(normalizeSidePanelContextSnapshot(value)).toBeNull();
    }
  });

  it("returns null for a proxy payload with a throwing getPrototypeOf trap", () => {
    const throwingPrototypePayload = new Proxy(
      {},
      {
        getPrototypeOf() {
          throw new Error("prototype trap should not escape");
        },
      },
    );

    expect(() => normalizeSidePanelContextSnapshot(throwingPrototypePayload)).not.toThrow();
    expect(normalizeSidePanelContextSnapshot(throwingPrototypePayload)).toBeNull();
  });

  it("guards side panel context broadcast messages", () => {
    const context = normalizeSidePanelContextSnapshot({
      task: { taskId: "task-1" },
      page: { url: "https://example.com/daily" },
      reason: "health-refresh",
      selectedAt: "2026-06-23T01:02:03.000Z",
      source: "architect-saas-daily",
    });

    expect(context).not.toBeNull();
    expect(
      isSidePanelContextBroadcastMessage({
        type: SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE,
        context,
      }),
    ).toBe(true);
    expect(isSidePanelContextBroadcastMessage({ type: SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE, context: null })).toBe(false);
    expect(isSidePanelContextBroadcastMessage({ type: "architect:other", context })).toBe(false);
  });

  it("normalizes broadcast context before consumption", () => {
    const message = {
      type: SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE,
      context: {
        task: {
          taskId: " task-1 ",
          title: "t".repeat(500),
          secretTaskField: "drop-me",
        },
        review: {
          question: "q".repeat(2500),
          executionMode: " local-codex ",
          secretReviewField: "drop-me",
        },
        page: {
          url: "https://example.com/daily?task=1&refresh_token=secret&id_token=secret&session=secret&ok=1#token=secret",
          route: " /daily?token=secret#access_token=secret ",
          secretPageField: "drop-me",
        },
        reason: "not-valid",
        selectedAt: "2026-06-23T01:02:03.000Z",
        source: "architect-saas-daily",
        secretRootField: "drop-me",
      },
    };

    const normalized = normalizeSidePanelContextBroadcastMessage(message);

    expect(normalized).toEqual({
      type: SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE,
      context: {
        task: {
          taskId: "task-1",
          title: "t".repeat(300),
        },
        review: {
          question: "q".repeat(2000),
          executionMode: "local-codex",
        },
        page: {
          url: "https://example.com/daily?task=1&ok=1",
          route: "/daily",
        },
        reason: "health-refresh",
        selectedAt: "2026-06-23T01:02:03.000Z",
        source: "architect-saas-daily",
      },
    });
    expect(JSON.stringify(normalized)).not.toContain("secret");
  });

  it("replaces raw broadcast context with normalized context when using the guard", () => {
    const message = {
      type: SIDE_PANEL_CONTEXT_BROADCAST_MESSAGE,
      context: {
        task: {
          taskId: " task-1 ",
          title: "t".repeat(500),
          secretTaskField: "drop-me",
        },
        review: {
          question: "q".repeat(2500),
          secretReviewField: "drop-me",
        },
        page: {
          url: "https://example.com/daily?task=1&auth=secret&ok=1#session=secret",
          route: "/daily?token=secret#access_token=secret",
          secretPageField: "drop-me",
        },
        reason: "question-change",
        selectedAt: "2026-06-23T01:02:03.000Z",
        source: "architect-saas-daily",
        secretRootField: "drop-me",
      },
    };

    expect(isSidePanelContextBroadcastMessage(message)).toBe(true);
    expect(message.context.task.title).toHaveLength(300);
    expect(message.context.review?.question).toHaveLength(2000);
    expect(message.context.page.url).toBe("https://example.com/daily?task=1&ok=1");
    expect(message.context.page.route).toBe("/daily");
    expect(JSON.stringify(message.context)).not.toContain("secret");
  });

  it("returns false for a broadcast proxy with a throwing getPrototypeOf trap", () => {
    const throwingPrototypeMessage = new Proxy(
      {},
      {
        getPrototypeOf() {
          throw new Error("prototype trap should not escape");
        },
      },
    );

    expect(() => isSidePanelContextBroadcastMessage(throwingPrototypeMessage)).not.toThrow();
    expect(isSidePanelContextBroadcastMessage(throwingPrototypeMessage)).toBe(false);
  });
});
