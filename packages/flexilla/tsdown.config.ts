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
    neverBundle: [
      "@flexilla/accordion",
      "@flexilla/auto-resize-area",
      "@flexilla/collapse",
      "@flexilla/custom-range",
      "@flexilla/dismissible",
      "@flexilla/dropdown",
      "@flexilla/modal",
      "@flexilla/offcanvas",
      "@flexilla/pin-input",
      "@flexilla/popover",
      "@flexilla/tabs",
      "@flexilla/tooltip",
    ],
  },
});
