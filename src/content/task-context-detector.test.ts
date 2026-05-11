import { describe, expect, it } from "vitest";
import { detectTaskContext } from "./task-context-detector";

describe("detectTaskContext", () => {
  it("detects the selected SaaS daily row by data-task-row-id", () => {
    const root = createDocument(`
      <div class="daily-grid-v2__row" data-task-row-id="task-001" aria-selected="false">
        <div data-task-column="issueTitle">Other task</div>
      </div>
      <div class="daily-grid-v2__row sheet-row--active" data-task-row-id="task-002" aria-selected="true">
        <div data-task-column="issueTitle"><span class="sheet-table__title-copy">Selected layout review</span></div>
      </div>
    `);

    const context = detectTaskContext("http://localhost:3000/daily", root);

    expect(context).toEqual({
      taskId: "task-002",
      projectId: undefined,
      title: "Selected layout review",
      url: "http://localhost:3000/daily",
    });
  });

  it("does not use an unselected daily row as task context", () => {
    const root = createDocument(`
      <div class="daily-grid-v2__row" data-task-row-id="task-001" aria-selected="false">
        <div data-task-column="issueTitle">Unselected task</div>
      </div>
    `);

    expect(detectTaskContext("http://localhost:3000/daily", root)).toBeNull();
  });

  it("keeps supporting task ids from query params", () => {
    const root = createDocument("<h1>Task detail</h1>");

    const context = detectTaskContext("http://localhost:3000/tasks?taskId=task-query", root);

    expect(context?.taskId).toBe("task-query");
    expect(context?.title).toBe("Task detail");
  });
});

function createDocument(body: string) {
  const root = document.implementation.createHTMLDocument("Architect");
  root.body.innerHTML = body;
  return root;
}
