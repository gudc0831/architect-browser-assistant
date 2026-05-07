import type {
  ArchitectLocalAssistantRuntime,
  AssistantRuntimeInput,
  AssistantRuntimeStatus,
} from "./ArchitectLocalAssistantRuntime";

export class MockAssistantRuntime implements ArchitectLocalAssistantRuntime {
  async isAvailable(): Promise<AssistantRuntimeStatus> {
    return { available: true, mode: "mock", reason: "Development mock runtime" };
  }

  async listCapabilities() {
    return ["grounded-answer", "draft-work-summary", "confidence-explanation"];
  }

  async generateAnswer(input: AssistantRuntimeInput) {
    const primaryEvidence = input.evidence[0];
    const answer = [
      `${input.taskContext.title} 기준으로 검토했습니다.`,
      primaryEvidence
        ? `우선 근거는 "${primaryEvidence.title}"이며, ${primaryEvidence.excerpt}`
        : "현재 연결된 근거가 부족합니다.",
      "이 답변은 업무 검토 보조 의견이며 법적 확정이나 인허가 가능성 보장이 아닙니다.",
    ].join("\n\n");

    return {
      answer,
      draftSummary: {
        conclusion: primaryEvidence ? "근거 확인 후 후속 검토가 필요합니다." : "추가 근거 수집이 필요합니다.",
        tags: ["assistant", "검토"],
        scope: input.taskContext.issueId || input.taskContext.taskId,
        followUpAction: "근거 문서와 프로젝트 조건을 확인하세요.",
      },
    };
  }
}
