import {
    defineConfig,
    presetIcons,
    presetUno,
    presetAttributify,
    type Preset
  } from "unocss";

import unoPreset from "./../../../unify-preset/packages/flexilla"
  
  export default defineConfig({
    content: {
      pipeline: {

      },
    },
    presets: [
      presetUno(),
      presetAttributify(),
      unoPreset.flexillaPreset() as Preset,
      presetIcons({
        collections: {
          carbon: () =>
            import("@iconify-json/carbon/icons.json").then((i) => i.default),
        },
      }),
    ],
  });