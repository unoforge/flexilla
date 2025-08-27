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
<div data-accordion-1 data-default-value="accordion-1" data-accordion-type="single" class="space-y-2 bg-zinc-200/40 dark:bg-zinc-900/60 rounded-md">
    <div data-accordion-item data-accordion-value="accordion-1"
        class="rounded-md">
        <button data-accordion-trigger aria-label="toggle button"
            class="px-4 w-full flex justify-between items-center py-2 text-zinc-800 dark:text-zinc-200 font-medium text-lg ease-linear hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 rounded-md focus:outline-blue-600 aria-expanded-text-blue6">
            Is it accessible?
        </button>
        <div aria-hidden="true" data-state="open" data-accordion-content
        class="text-zinc-700 dark:text-zinc-300 duration-200 ease-linear h-0 fx-open:h-auto overflow-hidden">
            <p class="p-4">
                Yes. It adheres to the WAI-ARIA design pattern.
            </p>
        </div>
    </div>
    <div data-accordion-item data-accordion-value="accordion-2"
        class="rounded-md">
        <button data-accordion-trigger aria-label="toggle button"
            class="px-4 w-full flex justify-between items-center py-2 text-zinc-800 dark:text-zinc-200 font-medium text-lg ease-linear hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 rounded-md focus:outline-blue-600 aria-expanded-text-blue6">
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
            class="px-4 w-full flex justify-between items-center py-2 text-zinc-800 dark:text-zinc-200 font-medium text-lg ease-linear hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 rounded-md focus:outline-blue-600 aria-expanded-text-blue6">
            Can it be animated?
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
        }
    ],
    "accordionIndicator": [
        {
            id: "ac_i1_uno",
            title: "With Indicator",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "index.html",
                    lang: "html",
                    code: `
<div data-accordion-example data-accordion-type="single" class="space-y-2">
    <div
        data-accordion-item
        data-accordion-value="accordion-1"
        class="rounded-md bg-zinc-100/5 dark:bg-zinc-900/5 border border-zinc-200/30 dark:border-zinc-800/20 fx-open:bg-zinc-100/80 dark:fx-open:bg-zinc-900/60 fx-open:border-zinc-200/50 dark:fx-open:border-zinc-800/40"
    >
        <button
            data-accordion-trigger
            aria-label="toggle button"
            class="px-4 w-full flex justify-between items-center py-2 text-zinc-800 dark:text-zinc-200 font-medium text-lg ease-linear hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 rounded-md focus:outline-blue-600 group"
        >
            Is it accessible?
            <span
                class="ease-linear duration-300 i-carbon-chevron-down group-aria-expanded:rotate-180 text-md"
            ></span>
        </button>
        <div
            aria-hidden="true"
            data-accordion-content
            class="text-zinc-700 dark:text-zinc-300 duration-200 ease-linear h-0 fx-open:h-auto overflow-hidden"
        >
            <p class="p-4">Yes. It adheres to the WAI-ARIA design pattern.</p>
        </div>
    </div>
    <div
        data-accordion-item
        data-default-open
        data-accordion-value="accordion-2"
        class="rounded-md bg-zinc-100/5 dark:bg-zinc-900/5 border border-zinc-200/30 dark:border-zinc-800/20 fx-open:bg-zinc-100/80 dark:fx-open:bg-zinc-900/60 fx-open:border-zinc-200/50 dark:fx-open:border-zinc-800/40"
    >
        <button
            data-accordion-trigger
            aria-label="toggle button"
            class="px-4 w-full flex justify-between items-center py-2 text-zinc-800 dark:text-zinc-200 font-medium text-lg ease-linear hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 rounded-md focus:outline-blue-600 group"
        >
            Is it unstyled?
            <span
                class="ease-linear duration-300 i-carbon-chevron-down group-aria-expanded-rotate-180 text-md"
            ></span>
        </button>
        <div
            aria-hidden="true"
            data-accordion-content
            class="text-zinc-700 dark:text-zinc-300 duration-200 ease-linear h-0 fx-open:h-auto overflow-hidden"
        >
            <p class="p-4">
                Yes. It's unstyled by default, giving you freedom over the look
                and feel.
            </p>
        </div>
    </div>
    <div
        data-accordion-item
        data-accordion-value="accordion-3"
        class="rounded-md bg-zinc-100/5 dark:bg-zinc-900/5 border border-zinc-200/30 dark:border-zinc-800/20 fx-open:bg-zinc-100/80 dark:fx-open:bg-zinc-900/60 fx-open:border-zinc-200/50 dark:fx-open:border-zinc-800/40"
    >
        <button
            data-accordion-trigger
            aria-label="toggle button"
            class="px-4 w-full flex justify-between items-center py-2 text-zinc-800 dark:text-zinc-200 font-medium text-lg ease-linear hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40 rounded-md focus:outline-blue-600 group"
        >
            Can it be animated?
            <span
                class="ease-linear duration-300 i-carbon-chevron-down group-aria-expanded-rotate-180 text-md"
            ></span>
        </button>
        <div
            aria-hidden="true"
            data-accordion-content
            class="text-zinc-700 dark:text-zinc-300 duration-200 ease-linear h-0 fx-open:h-auto overflow-hidden"
        >
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