import type { ManifestV3Export } from "@crxjs/vite-plugin";

const saasOrigin = "http://localhost:3000/*";

export const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: "Architect Browser Assistant",
  version: "0.1.0",
  description: "Task-centered assistant side panel for Architect SaaS.",
  permissions: ["sidePanel", "storage", "activeTab", "nativeMessaging"],
  host_permissions: [saasOrigin],
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  side_panel: {
    default_path: "src/side-panel/index.html",
  },
  content_scripts: [
    {
      matches: [saasOrigin],
      js: ["src/content/content-script.ts"],
      run_at: "document_idle",
    },
  ],
  action: {
    default_title: "Architect Assistant",
  },
};
