import type { SourceData } from "@/types/index";

export const collapseCode: SourceData = {
    "collapseDefault": [
        {
            id: "collapse_demo_1",
            title: "Demo Collapse",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "index.html",
                    lang: "html",
                    code: `
<div class="flex flex-col gap3">
    <button data-collapse-trigger data-target="collapse1"
        class="bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm wmax">
        Trigger Collapse
    </button>
    <div data-collapsible-1 id="collapse1"
        class="overflow-hidden transition-[height] duration-300 ease-linear overflow-hidden w-full h-0 fx-open:h-auto">
        <div class="rounded-md w-full bg-zinc-100/5 dark:bg-zinc-900/5 border border-zinc-200/30 dark:border-zinc-800/20 p-4 inline-flex overflow-hidden">
            <p class="inline-flex">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam, dolorum, incidunt facilis quasi
            non ea mollitia odio, iure adipisci
            </p>
        </div>
    </div>
</div>`,
                }
            ],
        }
    ],
    "collapseIndicator": [
        {
            id: "collapse_demo_2",
            title: "With Indicator",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "index.html",
                    lang: "html",
                    code: `
`,
                }
            ],
        },
    ],
    "collapseMultiple": [
        {
            id: "collapse_demo_3",
            title: "With Indicator",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "index.html",
                    lang: "html",
                    code: `
<div class="flex flex-col gap3">
    <button data-collapse-trigger data-target="collapse4 collapse5"
        class="bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm flex wmax">
        Trigger Two Collapse
    </button>
    <div class="grid sm-grid-cols-2 gap-4">
        <div data-collapsible-4 id="collapse4"
            class="overflow-hidden transition-[height] duration-300 ease-linear overflow-hidden w-full">
            <div
                class=" rounded-md w-full bg-zinc-100/5 dark:bg-zinc-900/5 border border-zinc-200/30 dark:border-zinc-800/20 p-4 text-zinc-700 dark:text-zinc-300 h-0 fx-open:h-auto">
                <p class="inline-flex">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam, dolorum, incidunt facilis quasi
                    non ea mollitia odio, iure adipisci
                </p>
            </div>
        </div>
        <div data-collapsible-5 id="collapse5"
            class="overflow-hidden transition-[height] duration-300 ease-linear overflow-hidden">
            <div class="rounded-md w-full bg-zinc-100/5 dark:bg-zinc-900/5 border border-zinc-200/30 dark:border-zinc-800/20 p-4 text-zinc-700 dark:text-zinc-300 h-0 fx-open:h-auto">
                <p class="">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam, dolorum, incidunt facilis quasi
                    non ea mollitia odio, iure adipisci
                </p>
            </div>
        </div>
    </div>
</div>`,
                }
            ],
        },
    ],
}