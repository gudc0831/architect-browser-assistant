import type { AssistantRuntimeInput } from "./ArchitectLocalAssistantRuntime";
import type { AssistantEvidence } from "../saas/contracts";
import type { OfficialLawVerificationReport } from "../legal/official-law-api";

export type OfficialLawVerificationExtensionMessage = {
  type: "architect:verify-official-law-evidence";
  input: AssistantRuntimeInput;
};

export type OfficialLawVerificationExtensionData = {
  report: OfficialLawVerificationReport;
  evidence: AssistantEvidence[];
};
