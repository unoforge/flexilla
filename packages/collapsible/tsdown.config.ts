import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["esm", "cjs"],
  fixedExtension: false,
  tsconfig: "../../tsconfig.json",
  dts: true,
  clean: true,
  treeshake: true,
  hash: false,
  minify: true,
  deps: {
    neverBundle: ["@flexilla/utilities"],
  },
});
