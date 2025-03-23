import type { SourceData } from "@/types/index";

export const accordionCode: SourceData = {
    "accordionDefault": [
        {
            id: "ac1_uno",
            title: "UnoCSS",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "index.html",
                    lang: "html",
                    code: `
<div data-accordion-1 data-default-value="accordion-1" data-accordion-type="single" class="space-y-2 bg-zinc2/40 dark-bg-zinc9/60 rd-md">
    <div data-accordion-item data-accordion-value="accordion-1"
        class="rd-md">
        <button data-accordion-trigger aria-label="toggle button"
            class="px4 wfull flex justify-between items-center py2 text-zinc8 dark-text-zinc2 font-medium text-lg ease-linear hover-bg-zinc2/50 dark-hover-bg-zinc8/40 rd-md focus:outline-blue6 aria-expanded-text-blue6">
            Is it accessible?
        </button>
        <div aria-hidden="true" data-state="open" data-accordion-content
        class="text-zinc7 dark-text-zinc3 duration-200 ease-linear h-0 fx-open-h-auto overflow-hidden">
            <p class="p4">
                Yes. It adheres to the WAI-ARIA design pattern.
            </p>
        </div>
    </div>
    <div data-accordion-item data-accordion-value="accordion-2"
        class="rd-md">
        <button data-accordion-trigger aria-label="toggle button"
            class="px4 wfull flex justify-between items-center py2 text-zinc8 dark-text-zinc2 font-medium text-lg ease-linear hover-bg-zinc2/50 dark-hover-bg-zinc8/40 rd-md focus:outline-blue6 aria-expanded-text-blue6">
            Is it unstyled?
        </button>
        <div aria-hidden="true" data-accordion-content
            class="text-zinc7 dark-text-zinc3 duration-200 ease-linear h-0 fx-open-h-auto overflow-hidden">
            <p class="p4">
            Yes. It's unstyled by default, giving you freedom over the look and feel.
            </p>
        </div>
    </div>
    <div data-accordion-item data-accordion-value="accordion-3"
        class="rd-md">
        <button data-accordion-trigger aria-label="toggle button"
            class="px4 wfull flex justify-between items-center py2 text-zinc8 dark-text-zinc2 font-medium text-lg ease-linear hover-bg-zinc2/50 dark-hover-bg-zinc8/40 rd-md focus:outline-blue6 aria-expanded-text-blue6">
            Can it be animated?
        </button>
        <div aria-hidden="true" data-accordion-content
            class="text-zinc7 dark-text-zinc3 duration-200 ease-linear h-0 fx-open-h-auto overflow-hidden">
            <p class="p4">
                Yes! You can use the transition prop to configure the animation.
            </p>
        </div>
    </div>
    </div>`,
                },
                {
                    id: "tab2",
                    icon: "unocss",
                    title: "uno.config.js",
                    lang: "js",
                    code: `
import { defineConfig, presetMini, presetUno} from "unocss";

import unifyUI from "@flexilla/uno-preset"

export default defineConfig({
  presets: [
    presetUno(),
    presetMini({ dark: "class" }),
    unifyUI({}),
  ],
});`,
                },
            ],
        },
        {
            id: "ac1_tailwind",
            title: "TailwindCSS",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "index.html",
                    lang: "html",
                    code: `
<div data-accordion-1 data-default-value="accordion-1"  class="space-y-2 bg-zinc-200/40 dark:bg-zinc-900/60 rounded-md">
  <div data-accordion-item data-accordion-value="accordion-1"
    class="rounded-md">
    <button data-accordion-trigger aria-label="toggle button"
      class="px-4 w-full flex justify-between items-center py-2 text-zinc-800 dark:text-zinc-200 font-medium text-lg ease-linear hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 rounded-md focus:outline-blue-600 aria-expanded:text-blue-600">
      Is it accessible?
    </button>
    <div aria-hidden="false" data-accordion-content data-state="open"
      class="text-zinc-700 dark:text-zinc-300 duration-200 ease-linear h-0 fx-open:h-auto overflow-hidden">
      <p class="p-4">
        Yes. It adheres to the WAI-ARIA design pattern.
      </p>
    </div>
  </div>
  <div data-accordion-item data-accordion-value="accordion-2"
    class="rounded-md">
    <button data-accordion-trigger aria-label="toggle button"
      class="px-4 w-full flex justify-between items-center py-2 text-zinc-800 dark:text-zinc-200 font-medium text-lg ease-linear hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 rounded-md focus:outline-blue-600 aria-expanded:text-blue-600">
      Is it unstyled?
    </button>
    <div aria-hidden="true" data-accordion-content
      class="text-zinc-700 dark:text-zinc-300 duration-200 ease-linear h-0 fx-open:h-auto overflow-hidden">
      <p class="p-4">
        Yes. It's unstyled by default, giving you freedom over the look and feel.
      </p>
    </div>
  </div>
  <div data-accordion-item data-accordion-value="accordion-3"
    class="rounded-md">
    <button data-accordion-trigger aria-label="toggle button"
      class="px-4 w-full flex justify-between items-center py-2 text-zinc-800 dark:text-zinc-200 font-medium text-lg ease-linear hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 rounded-md focus:outline-blue-600 aria-expanded:text-blue-600">
      Can it be animated?
    </button>
    <div aria-hidden="true" data-accordion-content
      class="text-zinc-700 dark:text-zinc-300 duration-200 ease-linear h-0 fx-open:h-auto overflow-hidden">
      <p class="p-4">
        Yes! You can use the transition prop to configure the animation.
      </p>
    </div>
  </div>
</div>`
                },
                {
                    id: "tab2",
                    icon: "tailwind",
                    title: "tailwind.config.js",
                    lang: "js",
                    code: `
/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    require("@flexilla/tailwind-plugin")
  ],
}`,
                },
            ],
        },
    ],
    "accordionIndicator": [
        {
            id: "ac_i1_uno",
            title: "With Indicator",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "uno-eg.html",
                    lang: "html",
                    code: `
<div data-accordion-example data-accordion-type="single" class="space-y-2">
    <div
        data-accordion-item
        data-accordion-value="accordion-1"
        class="rd-md bg-zinc1/5 dark-bg-zinc9/5 b b-zinc2/30 dark-b-zinc8/20 fx-open-bg-zinc1/80 dark-fx-open-bg-zinc9/60 fx-open-b-zinc2/50 dark-fx-open-b-zinc8/40"
    >
        <button
            data-accordion-trigger
            aria-label="toggle button"
            class="px4 wfull flex justify-between items-center py2 text-zinc8 dark-text-zinc2 font-medium text-lg ease-linear hover-bg-zinc2/50 dark-hover-bg-zinc8/40 rd-md focus:outline-blue6 group"
        >
            Is it accessible?
            <span
                class="ease-linear duration-300 i-carbon-chevron-down group-aria-expanded-rotate-180 text-md group-aria-expanded-rotate-180"
            ></span>
        </button>
        <div
            aria-hidden="true"
            data-accordion-content
            class="text-zinc7 dark-text-zinc3 duration-200 ease-linear h-0 fx-open-h-auto overflow-hidden"
        >
            <p class="p4">Yes. It adheres to the WAI-ARIA design pattern.</p>
        </div>
    </div>
    <div
        data-accordion-item
        data-default-open
        data-accordion-value="accordion-2"
        class="rd-md bg-zinc1/5 dark-bg-zinc9/5 b b-zinc2/30 dark-b-zinc8/20 fx-open-bg-zinc1/80 dark-fx-open-bg-zinc9/60 fx-open-b-zinc2/50 dark-fx-open-b-zinc8/40"
    >
        <button
            data-accordion-trigger
            aria-label="toggle button"
            class="px4 wfull flex justify-between items-center py2 text-zinc8 dark-text-zinc2 font-medium text-lg ease-linear hover-bg-zinc2/50 dark-hover-bg-zinc8/40 rd-md focus:outline-blue6 group"
        >
            Is it unstyled?
            <span
                class="ease-linear duration-300 i-carbon-chevron-down group-aria-expanded-rotate-180 text-md"
            ></span>
        </button>
        <div
            aria-hidden="true"
            data-accordion-content
            class="text-zinc7 dark-text-zinc3 duration-200 ease-linear h-0 fx-open-h-auto overflow-hidden"
        >
            <p class="p4">
                Yes. It's unstyled by default, giving you freedom over the look
                and feel.
            </p>
        </div>
    </div>
    <div
        data-accordion-item
        data-accordion-value="accordion-3"
        class="rd-md bg-zinc1/5 dark-bg-zinc9/5 b b-zinc2/30 dark-b-zinc8/20 fx-open-bg-zinc1/80 dark-fx-open-bg-zinc9/60 fx-open-b-zinc2/50 dark-fx-open-b-zinc8/40"
    >
        <button
            data-accordion-trigger
            aria-label="toggle button"
            class="px4 wfull flex justify-between items-center py2 text-zinc8 dark-text-zinc2 font-medium text-lg ease-linear hover-bg-zinc2/50 dark-hover-bg-zinc8/40 rd-md focus:outline-blue6 group"
        >
            Can it be animated?
            <span
                class="ease-linear duration-300 i-carbon-chevron-down group-aria-expanded-rotate-180 text-md"
            ></span>
        </button>
        <div
            aria-hidden="true"
            data-accordion-content
            class="text-zinc7 dark-text-zinc3 duration-200 ease-linear h-0 fx-open-h-auto overflow-hidden"
        >
            <p class="p4">
                Yes! You can use the transition prop to configure the animation.
            </p>
        </div>
    </div>
</div>`,
                },
                {
                    id: "tab2",
                    icon: "html",
                    title: "tail-eg.html",
                    lang: "html",
                    code: `
<div data-accordion-4 class="space-y-2">
  <div data-accordion-item data-accordion-value="accordion-1"
    class="rounded-md bg-zinc-100/5 dark:bg-zinc-900/5 border border-zinc-200/30 dark:border-zinc-800/20 fx-open:bg-zinc-100/80 dark:fx-open:bg-zinc-900/60 fx-open:border-zinc-200/50 dark:fx-open:border-zinc-800/40">
    <button data-accordion-trigger aria-label="toggle button"
      class="px-4 w-full flex justify-between items-center py-2 text-zinc-800 dark:text-zinc-200 font-medium text-lg ease-linear hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 rounded-md focus:outline-blue-600 group">
      Is it accessible?
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        class="size-5 ease-linear duration-300 group:aria-expanded:rotate-180">
        <path fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"></path>
      </svg>
    </button>
    <div aria-hidden="true" data-accordion-content
      class="text-zinc-700 dark:text-zinc-300 duration-200 ease-linear h-0 fx-open:h-auto overflow-hidden">
      <p class="p-4">
        Yes. It adheres to the WAI-ARIA design pattern.
      </p>
    </div>
  </div>
  <div data-accordion-item data-accordion-value="accordion-2"
    class="rounded-md bg-zinc-100/5 dark:bg-zinc-900/5 border border-zinc-200/30 dark:border-zinc-800/20 fx-open:bg-zinc-100/80 dark:fx-open:bg-zinc-900/60 fx-open:border-zinc-200/50 dark:fx-open:border-zinc-800/40">
    <button data-accordion-trigger aria-label="toggle button"
      class="px-4 w-full flex justify-between items-center py-2 text-zinc-800 dark:text-zinc-200 font-medium text-lg ease-linear hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 rounded-md focus:outline-blue-600 group">
      Is it unstyled?
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        class="size-5 ease-linear duration-300 group:aria-expanded:rotate-180">
        <path fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"></path>
      </svg>
    </button>
    <div aria-hidden="true" data-accordion-content
      class="text-zinc-700 dark:text-zinc-300 duration-200 ease-linear h-0 fx-open:h-auto overflow-hidden">
      <p class="p-4">
        Yes. It's unstyled by default, giving you freedom over the look and feel.
      </p>
    </div>
  </div>
  <div data-accordion-item data-accordion-value="accordion-3"
    class="rounded-md bg-zinc-100/5 dark:bg-zinc-900/5 border border-zinc-200/30 dark:border-zinc-800/20 fx-open:bg-zinc-100/80 dark:fx-open:bg-zinc-900/60 fx-open:border-zinc-200/50 dark:fx-open:border-zinc-800/40">
    <button data-accordion-trigger aria-label="toggle button"
      class="px-4 w-full flex justify-between items-center py-2 text-zinc-800 dark:text-zinc-200 font-medium text-lg ease-linear hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 rounded-md focus:outline-blue-600 group">
      Can it be animated?
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        class="size-5 ease-linear duration-300 group:aria-expanded:rotate-180">
        <path fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"></path>
      </svg>
    </button>
    <div aria-hidden="true" data-accordion-content
      class="text-zinc-700 dark:text-zinc-300 duration-200 ease-linear h-0 fx-open:h-auto overflow-hidden">
      <p class="p-4">
        Yes! You can use the transition prop to configure the animation.
      </p>
    </div>
  </div>
</div>`,
                },
            ],
        },
    ],
}