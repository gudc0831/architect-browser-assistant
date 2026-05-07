import { describe, expect, it } from "vitest";
import { MockAssistantRuntime } from "./mock-runtime";

describe("MockAssistantRuntime", () => {
  it("generates a deterministic grounded answer", async () => {
    const runtime = new MockAssistantRuntime();
    const output = await runtime.generateAnswer({
      question: "검토해줘",
      taskContext: {
        taskId: "task-1",
        projectId: "project-1",
        title: "피난 계단 검토",
        description: "",
        status: "in_review",
        issueId: "ARCH-001",
        projectName: "Architect Start",
      },
      evidence: [
        {
          id: "task:task-1",
          kind: "task",
          priority: 3,
          title: "Current task ARCH-001",
          excerpt: "피난 계단 폭 확인",
        },
      ],
    });

    expect(output.answer).toContain("피난 계단 검토");
    expect(output.answer).toContain("Current task ARCH-001");
    expect(output.draftSummary?.scope).toBe("ARCH-001");
  });
});
