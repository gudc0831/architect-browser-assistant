type SafeSettingKey = "saasBaseUrl" | "lastTaskId" | "runtimeMode" | "panelDensity";

type SafeSettingValue = string;

const blockedKeyPattern = /(token|secret|key|credential|password|serviceRole|openai|codex|chatgpt|lawOpenData|openDataOc)/i;

export async function readSafeSetting<T extends SafeSettingValue>(key: SafeSettingKey, fallback: T): Promise<T> {
  assertSafeKey(key);
  const value = await chrome.storage.local.get(key);
  return typeof value[key] === "string" ? (value[key] as T) : fallback;
}

export async function writeSafeSetting(key: SafeSettingKey, value: SafeSettingValue) {
  assertSafeKey(key);
  await chrome.storage.local.set({ [key]: value });
}

export function assertSafeKey(key: string) {
  if (blockedKeyPattern.test(key)) {
    throw new Error(`Sensitive setting keys are not allowed in extension storage: ${key}`);
  }
}
