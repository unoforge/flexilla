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
<div data-dismissible class="wfull p5 rd-lg bg-zinc1 dark-bg-zinc9/50">
    <div class="bg-zinc2 dark-bg-zinc8 rd-md px3 py1.5 flex items-center justify-between">
        <h2 class="text-zinc8 dark-text-zinc1 text-lg font-semibold">
            Remove Element From Dom
        </h2>
        <button data-dismiss-btn aria-label="remove from screen" class="p2 text-zinc7 dark-text-zinc3 p3 hover-bg-zinc2 dark-hover-bg-zinc9 rd-full">
            <span class="flex i-carbon-close"></span>
        </button>
    </div>
    <div class="pt5 space-y-4">
        <div class="wmax p3 rd-full bg-red2 dark-bg-red-9/30 text-red6">
            <span class="flex i-carbon-accessibility text-lg"></span>
        </div>
        <h2 class="font-semibold text-xl text-zinc9 dark-text-white">
            You neen to add new user
        </h2>
            <p class="text-zinc7 dark-text-zinc3">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </p>
    </div>
</div>`,
                },
                {
                    id: "tab2",
                    icon: "unocss",
                    title: "tailwind.html",
                    lang: "html",
                    code: `
<div data-remove-from-dom class="w-full p-5 rounded-lg bg-zinc-100 bg-zinc-900/50">
    <div class="bg-zinc-200 dark:bg-zinc-800 rounded-md px-3 py-1.5 flex items-center justify-between">
    <h2 class="text-zinc-800 dark:text-zinc-100 text-lg font-semibold">
        Remove Element From Dom
    </h2>
    <button data-dismiss-btn aria-label="remove from screen" class="p-2 text-zinc-700 dark:text-gray-300 p-3  hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    </button>
    </div>
    <div class="pt-5 space-y-4">
    <div class="w-max p-3 rounded-full bg-red-200 dark:bg-red-900/30 text-red6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002" />
        </svg>              
    </div>
    <h2 class="font-semibold text-xl text-gray9 dark:text-white">
        You neen to add new user
    </h2>
    <p class="text-gray7 dark:text-gray3">
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
<div data-remove-from-screen data-action="hide-from-screen" class="wfull p5 rd-lg bg-zinc1 bg-zinc9/50">
    <div bg-zinc2 dark-bg-zinc8 rd-md px3 py1.5 flex items-center justify-between>
    <h2 text-zinc8 dark-text-zinc1text-lg font-semibold>
        Hide Element From Screen Only
    </h2>
    <button data-dismiss-btn aria-label="remove from screen" p2 text-zinc7 p3 hover-bg-zinc2 rd-full>
        <span flex i-carbon-close></span>
    </button>
    </div>
    <div pt5 space-y-4>
    <div class="wmax p3 rd-full bg-red2 dark-bg-red-9/30 text-red6">
        <span flex i-carbon-accessibility text-lg></span>
    </div>
    <h2 class="font-semibold text-xl text-zinc9 dark-text-white">
        You neen to add new user
    </h2>
    <p class="text-zinc7 dark-text-zinc3">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
    </p>
    </div>
</div>`,
                },
                {
                    id: "tab2",
                    icon: "html",
                    title: "tailwind.html",
                    lang: "html",
                    code: `
<div data-remove-from-screen data-action="hide-from-screen" class="w-full p-5 rounded-lg bg-zinc-100 bg-zinc-900/50">
    <div class="bg-zinc-200 dark:bg-zinc-800 rounded-md px-3 py-1.5 flex items-center justify-between">
    <h2 class="text-zinc-800 dark:text-zinc-100 text-lg font-semibold">
        Hide Element From Screen Only
    </h2>
    <button data-dismiss-btn aria-label="remove from screen" class="p-2 text-gray-700 dark:text-gray-300 p-3 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>              
    </button>
    </div>
    <div pt5 space-y-4>
    <div class="w-max p-3 rounded-full bg-red-200 dark:bg-red-900/30 text-red6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002" />
        </svg>              
    </div>
    <h2 class="font-semibold text-xl text-gray9 dark:text-white">
        You neen to add new user
    </h2>
    <p class="text-gray7 dark:text-gray3">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
    </p>
    </div>
</div>`,
                },
            ],
        },
    ],
}