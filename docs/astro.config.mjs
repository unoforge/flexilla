import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";
import { transformerNotationDiff } from "@shikijs/transformers";
import vercel from "@astrojs/vercel/serverless";
import partytown from "@astrojs/partytown";


import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  redirects: {
    "/docs": {
      status: 302,
      destination: "/docs/getting-started",
    },
    "/docs/": {
      status: 302,
      destination: "/docs/getting-started",
    },
  },
  site: "https://flexilla-docs.vercel.app",
  markdown: {
    shikiConfig: {
      theme: "css-variables",
      transformers: [transformerNotationDiff()],
    },
  },
  integrations: [UnoCSS({
    injectReset: true,
  }), preact(), mdx(), partytown({
    config: {
      forward: ["dataLayer.push"],
    },
  }), vue()],
  output: "server",
  adapter: vercel(),
});