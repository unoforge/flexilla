import type { SourceData } from "@/types/index";

export const tabsCode: SourceData = {
    "tabsDefault": [
        {
            id: "tabs1_demo",
            title: "Tabs Demo Examples",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "unocss.html",
                    lang: "html",
                    code: `
<div data-fx-tabs data-tabs class="wfull">
    <div data-tab-list-wrapper class="flex wfull">
        <ul data-tab-list role="tablist"
            class="flex items-center relative h-12 px-1 bg-zinc-100 dark:bg-zinc-900/50 w-full rounded-md *:cursor-pointer">
            <li role="presentation" class="flex">
                <a href="#link" data-tabs-trigger data-target="tab1" tabindex="0"
                    class="px-4 py-2 rounded text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 fx-active:bg-zinc-200 dark:fx-active:bg-zinc-800 outline outline-1 outline-transparent focus:outline-blue-500 dark:focus:outline-blue-400">
                    Tabs1
                </a>
            </li>
            <li>
                <a href="#link" data-tabs-trigger data-target="tab2" tabindex="-1"
                    class="px-4 py-2 rounded text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 fx-active:bg-zinc-200 dark:fx-active:bg-zinc-800 outline outline-1 outline-transparent focus:outline-blue-500 dark:focus:outline-blue-400">
                    Tabs2
                </a>
            </li>
            <li>
                <a href="#link" data-tabs-trigger data-target="tab3" tabindex="-1"
                    class="px-4 py-2 rounded text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 fx-active:bg-zinc-200 dark:fx-active:bg-zinc-800 outline outline-1 outline-transparent focus:outline-blue-500 dark:focus:outline-blue-400">
                    Tabs3
                </a>
            </li>
        </ul>
    </div>
    <div data-panels-container class="bg-zinc-100 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 rounded-md">
        <section role="tabpanel" tabindex="0"
            class="hidden fx-active:flex ring-offset-zinc-950 p-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md mt-2"
            data-tab-panel data-state="active" id="tab1" aria-labelledby="tab1">
            Tab 1 Content
        </section>
        <section role="tabpanel" tabindex="0"
            class="hidden fx-active:flex ring-offset-zinc-950 p-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md mt-2"
            data-tab-panel id="tab2" aria-labelledby="tab2">
            Tab 2 Content
        </section>
        <section role="tabpanel" tabindex="0"
            class="hidden fx-active:flex ring-offset-zinc-950 p-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md mt-2"
            data-tab-panel id="tab3" aria-labelledby="tab3">
            Tab 3 Content
        </section>
    </div>
</div>`,
                },
            ],
        },
    ],
    "tabsVertical": [
        {
            id: "tabsVerti1_demo",
            title: "Tabs Demo Examples",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "index.html",
                    lang: "html",
                    code: `
<div data-vertical-tab data-fx-tabs data-orientation="vertical" class="flex items-start wfull">
    <ul data-tab-list role="tablist"
        class="flex flex-col p0.5 wmax relative bg-zinc-100 dark:bg-zinc-900/50 rounded-md">
        <li role="presentation" class="flex">
            <a href="#" data-tabs-trigger data-target="tab1"
                class="px-4 py-2 rd fx-active:bg-zinc-200 dark:fx-active:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 relative wfull">
                Tab 1
            </a>
        </li>
        <li role="presentation" class="flex">
            <a href="#" data-tabs-trigger data-target="tab2"
                class="px-4 py-2 rd fx-active:bg-zinc-200 dark:fx-active:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 relative wfull">
                Tab2
            </a>
        </li>
        <li role="presentation" class="flex">
            <a href="#" data-tabs-trigger data-target="tab3"
                class="px-4 py-2 rd fx-active:bg-zinc-200 dark:fx-active:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 relative wfull">
                Tab3
            </a>
        </li>
    </ul>
    <div data-panels-container class="flex-1">
        <section role="tabpanel"
            class="hidden fx-active:flex bg-zinc-100 dark:bg-zinc-900/50 ring-offset-zinc950 h-48 p20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md ml2"
            data-tab-panel id="tab1" aria-labelledby="tab1">
            Tab 1 Content
        </section>
        <section role="tabpanel" data-state="active"
            class="hidden fx-active:flex bg-zinc-100 dark:bg-zinc-900/50 ring-offset-zinc950 h-48 p20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md ml2"
            data-tab-panel id="tab2" data-state="active" aria-labelledby="tab2">
            Tab 2 Content
        </section>
        <section role="tabpanel"
            class="hidden fx-active:flex bg-zinc-100 dark:bg-zinc-900/50 ring-offset-zinc950 h-48 p20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md ml2"
            data-tab-panel id="tab3" aria-labelledby="tab3">
            Tab 3 Content
        </section>
    </div>
</div>`,
                },
            ],
        },
    ],
    "tabsWithCustomIndicator": [
        {
            id: "tabsVerti1_demo",
            title: "Tabs Demo Examples",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "index.html",
                    lang: "html",
                    code: `
<div data-with-indicator data-fx-tabs data-indicator-class-name="ui-tabs-indicator bg-zinc-200 dark-bg-zinc-800 flex rd absolute ease-linear duration-200">
    <div data-tab-list-wrapper class="flex wfull">
        <ul data-tab-list role="tablist"
            class="flex items-center relative p0.5 bg-zinc-100 dark:bg-zinc-900/50 w-full rounded-md *:cursor-pointer">
            <li role="presentation" class="flex">
                <a href="#" role="tab" data-tabs-trigger data-target="tab1" data-state="active"
                    tabindex="0"
                    class="px-4 py-2 rounded text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 relative z20">
                    Tab 1
                </a>
            </li>
            <li role="presentation" class="flex">
                <a href="#" role="tab" data-tabs-trigger data-target="tab2" data-state="active"
                    tabindex="-1"
                    class="px-4 py-2 rounded text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 relative z20">
                    Tab 2
                </a>
            </li>
            <li role="presentation" class="flex">
                <a href="#" role="tab" data-tabs-trigger data-target="tab3" data-state="active"
                    tabindex="-1"
                    class="px-4 py-2 rounded text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 relative z20">
                    Tab 3
                </a>
            </li>
        </ul>
    </div>
    <div data-panels-container class="hmax bg-zinc1 text-zinc-700 dark:text-zinc-300 dark-bg-zinc9/50 rounded-lg">
        <section role="tabpanel"
            class="hidden fx-active:flex ring-offset-zinc950 h-48 p20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md mt-2"
            data-tab-panel id="tab1" data-state="active" aria-labelledby="tab1">
            Tab1 Content
        </section>
        <section role="tabpanel"
            class="hidden fx-active:flex ring-offset-zinc950 h-48 p20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md mt-2"
            data-tab-panel id="tab2" aria-labelledby="tab2">
            Tab 2
        </section>
        <section role="tabpanel"
            class="hidden fx-active:flex ring-offset-zinc-950 p-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md mt-2"
            data-tab-panel id="tab3" aria-labelledby="tab3">
            Tab panel 3
        </section>
    </div>
</div>`,
                },
            ],
        },
    ],
}