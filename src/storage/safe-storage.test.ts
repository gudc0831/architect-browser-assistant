import { describe, expect, it } from "vitest";
import { assertSafeKey } from "./safe-storage";

describe("assertSafeKey", () => {
  it("rejects sensitive credential-like keys", () => {
    expect(() => assertSafeKey("openaiApiKey")).toThrow();
    expect(() => assertSafeKey("chatgptSessionToken")).toThrow();
    expect(() => assertSafeKey("serviceRoleSecret")).toThrow();
  });

  it("allows non-sensitive extension settings", () => {
    expect(() => assertSafeKey("saasBaseUrl")).not.toThrow();
    expect(() => assertSafeKey("runtimeMode")).not.toThrow();
  });

  it("rejects law open data credential storage", () => {
    expect(() => assertSafeKey("lawOpenDataOc")).toThrow();
  });
});
