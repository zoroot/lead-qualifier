import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: "proj_uyaoekdkxstnhjcpfmdl",
  runtime: "node",
  maxDuration: 60,
  dirs: ["workflows/tasks"],
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
    },
  },
});
