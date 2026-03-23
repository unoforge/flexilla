import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "accessibility/index": "src/accessibility/index.ts",
    "toggler/index": "src/toggler/index.ts",
    "selector/index": "src/selector/index.ts",
    "dom-utilities/index": "src/dom-utilities/index.ts",
    "scroll-to-top": "src/scroll-to-top.ts",
    "dom-teleport": "src/dom-teleport.ts",
    "theme/index": "src/theme/index.ts",
  },
  format: ["esm", "cjs"],
  fixedExtension: false,
  tsconfig: "../../tsconfig.json",
  dts: true,
  clean: true,
  treeshake: true,
  hash: false,
  minify: true,
});
