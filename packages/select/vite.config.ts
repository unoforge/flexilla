import { resolve } from "path";
import { defineConfig } from "vite";
import sharedConfig from "./../../shared/vite.config.shared";

export default defineConfig({
  ...sharedConfig,
  resolve: {
    alias: {
      "@flexilla/select-core": resolve(__dirname, "../select-core/src/index.ts"),
    },
  },
  build: {
    ...sharedConfig.build,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "@flexilla/select",
      formats: ["es", "cjs"],
    },
  },
});
