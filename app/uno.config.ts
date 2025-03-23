import {
    defineConfig,
    presetIcons,
    presetWind3,
} from "unocss";

import { flexillaPreset } from "@unifydev/flexilla"
import { presetUI } from "@unifydev/preset-ui"


export default defineConfig({
    presets: [
        presetWind3({dark:"class"}),
        presetIcons({
            collections: {
                //@ts-ignore
                ph: () =>
                    import("@iconify-json/ph/icons.json").then((i) => i.default),
            },
        }),
        presetUI({}),
        flexillaPreset(),
    ],
})