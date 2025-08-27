import type { SourceData } from "@/types/index";

export const dismissibleCode: SourceData = {
    "dismissibleDefault": [
        {
            id: "dismissible_code_1",
            title: "Demo Collapse",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "index.html",
                    lang: "html",
                    code: `
<div data-dismissible class="w-full p5 rounded-lg bg-zinc-100 dark:bg-zinc-900/50">
    <div class="bg-zinc-200 dark-bg-zinc-800 rounded-md px3 py1.5 flex items-center justify-between">
        <h2 class="text-zinc8 dark-text-zinc1 text-lg font-semibold">
            Remove Element From Dom
        </h2>
        <button data-dismiss-btn aria-label="remove from screen" class="p2 text-zinc-700 dark:text-zinc-300 p3 hover-bg-zinc-200 dark-hover-bg-zinc9 rounded-full">
            <span class="flex i-carbon-close"></span>
        </button>
    </div>
    <div class="pt5 space-y-4">
        <div class="w-max p-3 rounded-full bg-red-200 dark-bg-red-9/30 text-red-600">
            <span class="flex i-carbon-accessibility text-lg"></span>
        </div>
        <h2 class="font-semibold text-xl text-zinc-900 dark:text-white">
            You neen to add new user
        </h2>
            <p class="text-zinc-700 dark:text-zinc-300">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </p>
    </div>
</div>`,
                },
            ],
        }
    ],
    "dismissibleRemoveDom": [
        {
            id: "dismissible_code_2",
            title: "Remove from DOM",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "index.html",
                    lang: "html",
                    code: `
<div data-remove-from-screen data-action="hide-from-screen" class="w-full p5 rounded-lg bg-zinc1 bg-zinc9/50">
    <div bg-zinc-200 dark-bg-zinc-800 rounded-md px3 py1.5 flex items-center justify-between>
    <h2 text-zinc8 dark-text-zinc1text-lg font-semibold>
        Hide Element From Screen Only
    </h2>
    <button data-dismiss-btn aria-label="remove from screen" p2 text-zinc7 p3 hover-bg-zinc-200 rounded-full>
        <span flex i-carbon-close></span>
    </button>
    </div>
    <div pt5 space-y-4>
    <div class="w-max p-3 rounded-full bg-red-200 dark-bg-red-9/30 text-red-600">
        <span flex i-carbon-accessibility text-lg></span>
    </div>
    <h2 class="font-semibold text-xl text-zinc-900 dark:text-white">
        You neen to add new user
    </h2>
    <p class="text-zinc-700 dark:text-zinc-300">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
    </p>
    </div>
</div>`,
                }
            ],
        },
    ],
}