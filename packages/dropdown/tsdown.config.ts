import { resolve } from "node:path";
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["esm", "cjs"],
  fixedExtension: false,
  tsconfig: "../../tsconfig.json",
  alias: {
    "flexipop/flexipop.css": resolve(import.meta.dirname, "../flexipop/src/index.css"),
  },
  dts: true,
  clean: true,
  treeshake: true,
  hash: false,
  minify: true,
  deps: {
    neverBundle: ["@flexilla/utilities", "@flexilla/manager", "flexipop"],
  },
});
