// @ts-check
import { defineConfig } from "astro/config";
import unoCSS from "unocss/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    unoCSS({
      injectReset: true,
    }),
  ],
});
