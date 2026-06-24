import type { ManifestV3Export } from "@crxjs/vite-plugin";

const DEFAULT_SAAS_ORIGINS = [
  "http://localhost:3000",
  "https://architect-start2-git-codex-multi-d1c003-chois-projects-7b2948cf.vercel.app",
];

const configuredSaasOrigins = normalizeSaasOrigins(process.env.ARCHITECT_SAAS_ORIGIN);
const saasOrigins = configuredSaasOrigins.length > 0 ? configuredSaasOrigins : DEFAULT_SAAS_ORIGINS;
const saasOriginPatterns = saasOrigins.map((origin) => `${origin}/*`);

export const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: "Architect Browser Assistant",
  version: "0.1.0",
  description: "Task-centered assistant side panel for Architect SaaS.",
  permissions: ["sidePanel", "storage", "activeTab", "nativeMessaging"],
  host_permissions: saasOriginPatterns,
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  side_panel: {
    default_path: "src/side-panel/index.html",
  },
  content_scripts: [
    {
      matches: saasOriginPatterns,
      js: ["src/content/content-script.ts"],
      run_at: "document_idle",
    },
  ],
  action: {
    default_title: "Architect Assistant",
  },
};

function normalizeSaasOrigins(value: string | undefined) {
  const rawValues = value?.split(/[,\s;]+/).map((item) => item.trim()).filter(Boolean) ?? [];
  const origins = rawValues.map(normalizeSaasOrigin).filter(Boolean);
  return [...new Set(origins)];
}

function normalizeSaasOrigin(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "";
    }
    return url.origin;
  } catch {
    return "";
  }
}
