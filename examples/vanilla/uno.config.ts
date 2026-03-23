import {
  defineConfig,
  presetIcons,
  presetUno,
  presetAttributify,
  type Preset
} from "unocss";

import { flexillaPreset } from "@unifydev/flexilla"

export default defineConfig({
  content: {
    pipeline: {

    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    flexillaPreset(),
    presetIcons({
      collections: {
        carbon: () =>
          import("@iconify-json/carbon/icons.json").then((i) => i.default),
      },
    }),
  ],
});