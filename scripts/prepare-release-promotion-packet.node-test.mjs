import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCommandSet,
  buildExternalDependencies,
  summarizeMetadata,
} from "./prepare-release-promotion-packet.mjs";

const EXTENSION_ID = "abcdefghijklmnopabcdefghijklmnop";
const BASE_ENV = {
  ARCHITECT_SAAS_ORIGIN: "https://architect.example.com",
  ARCHITECT_RELEASE_OWNER: "release-owner",
  ARCHITECT_CHROME_WEB_STORE_PUBLISHER: "publisher@example.com",
  ARCHITECT_NATIVE_HOST_INSTALL_ROOT: "C:\\Users\\example\\AppData\\Local\\Architect\\BrowserAssistant\\native-host",
};

test("production promotion packet treats signed metadata as configured", () => {
  const metadata = summarizeMetadata(
    { extensionId: EXTENSION_ID },
    {
      ...BASE_ENV,
      ARCHITECT_NATIVE_HOST_SIGNING_SUBJECT: "CN=Architect Browser Assistant",
    },
  );
  const dependencies = buildExternalDependencies(metadata, {
    productionOriginReady: true,
    saasOrigin: "https://architect.example.com",
  });

  assert.equal(dependencies.find((item) => item.id === "native-host-code-signing")?.status, "configured");
  assert.deepEqual(
    dependencies.filter((item) => item.blocking).map((item) => item.id),
    [],
  );
});

test("production promotion packet keeps unsigned native-host waiver explicit", () => {
  const metadata = summarizeMetadata({ extensionId: EXTENSION_ID, allowUnsignedNativeHost: true }, BASE_ENV);
  const dependencies = buildExternalDependencies(metadata, {
    productionOriginReady: true,
    saasOrigin: "https://architect.example.com",
  });
  const commands = buildCommandSet(metadata);

  assert.equal(dependencies.find((item) => item.id === "native-host-code-signing")?.status, "waived");
  assert.match(commands.productionReadiness, /--allow-unsigned-native-host/);
  assert.match(commands.promotionDryRun, /--allow-unsigned-native-host/);
});

test("production promotion packet reports missing production metadata as blocking", () => {
  const metadata = summarizeMetadata({}, {});
  const dependencies = buildExternalDependencies(metadata, {
    productionOriginReady: false,
    saasOrigin: "",
  });

  assert.deepEqual(
    dependencies.filter((item) => item.blocking).map((item) => item.id),
    [
      "production-saas-origin",
      "chrome-extension-id",
      "native-host-code-signing",
      "release-owner",
      "chrome-web-store-publisher",
      "native-host-install-root",
    ],
  );
});
