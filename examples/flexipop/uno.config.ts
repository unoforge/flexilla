import {
    defineConfig,
    presetUno,
    presetAttributify
  } from "unocss";

  
  export default defineConfig({
    content: {
      pipeline: {

      },
    },
    presets: [
      presetUno(),
      presetAttributify(),
    ],
  });