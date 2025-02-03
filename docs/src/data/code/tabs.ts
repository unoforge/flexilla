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
            class="flex items-center relative h12 px1 bg-zinc1 dark-bg-zinc9/50 wfull rd-md children-cursor-pointer">
            <li role="presentation" class="flex">
                <a href="#link" data-tabs-trigger data-target="tab1" tabindex="0"
                    class="px4 py2 rd text-zinc7 dark-text-zinc3 disabled-cursor-not-allowed disabled-op80 fx-active-bg-zinc2 dark-fx-active-bg-zinc8 outline outline-1 outline-transparent focus-outline-blue5 dark-focus-outline-blue4">
                    Tabs1
                </a>
            </li>
            <li>
                <a href="#link" data-tabs-trigger data-target="tab2" tabindex="-1"
                    class="px4 py2 rd text-zinc7 dark-text-zinc3 disabled-cursor-not-allowed disabled-op80 fx-active-bg-zinc2 dark-fx-active-bg-zinc8 outline outline-1 outline-transparent focus-outline-blue5 dark-focus-outline-blue4">
                    Tabs2
                </a>
            </li>
            <li>
                <a href="#link" data-tabs-trigger data-target="tab3" tabindex="-1"
                    class="px4 py2 rd text-zinc7 dark-text-zinc3 disabled-cursor-not-allowed disabled-op80 fx-active-bg-zinc2 dark-fx-active-bg-zinc8 outline outline-1 outline-transparent focus-outline-blue5 dark-focus-outline-blue4">
                    Tabs3
                </a>
            </li>
        </ul>
    </div>
    <div data-panels-container class="bg-zinc1 dark-bg-zinc9/50 text-zinc7 dark-text-zinc3 rd-md">
        <section role="tabpanel" tabindex="0"
            class="hidden fx-active-flex ring-offset-zinc950 p20 focus-visible-outline-none focus-visible-ring-2 focus-visible-ring-red5 focus-visible-ring-offset-2 b b-zinc2 dark-b-zinc8 rd-md mt2"
            data-tab-panel data-state="active" id="tab1" aria-labelledby="tab1">
            Tab 1 Content
        </section>
        <section role="tabpanel" tabindex="0"
            class="hidden fx-active-flex ring-offset-zinc950 p20 focus-visible-outline-none focus-visible-ring-2 focus-visible-ring-red5 focus-visible-ring-offset-2 b b-zinc2 dark-b-zinc8 rd-md mt2"
            data-tab-panel id="tab2" aria-labelledby="tab2">
            Tab 2 Content
        </section>
        <section role="tabpanel" tabindex="0"
            class="hidden fx-active-flex ring-offset-zinc950 p20 focus-visible-outline-none focus-visible-ring-2 focus-visible-ring-red5 focus-visible-ring-offset-2 b b-zinc2 dark-b-zinc8 rd-md mt2"
            data-tab-panel id="tab3" aria-labelledby="tab3">
            Tab 3 Content
        </section>
    </div>
</div>`,
                },
                {
                    id: "tab2",
                    icon: "html",
                    title: "tailwind.html",
                    lang: "html",
                    code: `
<div data-fx-tabs data-tabs class="w-full">
    <div data-tab-list-wrapper class="flex w-full">
        <ul data-tab-list role="tablist"
            class="flex items-center relative h-12 px-1 bg-zinc-100 dark:bg-zinc-900/50 w-full rounded-md *:cursor-pointer">
            <li role="presentation" class="flex">
                <a href="#link" data-tabs-trigger data-target="tab1" tabindex="0"
                    class="px-4 py-2 rounded text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 fx-active:bg-zinc-200 dark:fx-active:bg-zinc-800 outline outline-1 outline-transparent focus-outline-blue5 dark:focus-outline-blue4">
                    Tabs1
                </a>
            </li>
            <li>
                <a href="#link" data-tabs-trigger data-target="tab2" tabindex="-1"
                    class="px-4 py-2 rounded text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 fx-active:bg-zinc-200 dark:fx-active:bg-zinc-800 outline outline-1 outline-transparent focus-outline-blue5 dark:focus-outline-blue4">
                    Tabs2
                </a>
            </li>
            <li>
                <a href="#link" data-tabs-trigger data-target="tab3" tabindex="-1"
                    class="px-4 py-2 rounded text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 fx-active:bg-zinc-200 dark:fx-active:bg-zinc-800 outline outline-1 outline-transparent focus-outline-blue5 dark:focus-outline-blue4">
                    Tabs3
                </a>
            </li>
        </ul>
    </div>
    <div data-panels-container class="bg-zinc-100 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 rounded-md">
        <section role="tabpanel" tabindex="0"
            class="hidden fx-active:flex ring-offset-zinc-950 p-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red5 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md mt-2"
            data-tab-panel data-state="active" id="tab1" aria-labelledby="tab1">
            Tab 1 Content
        </section>
        <section role="tabpanel" tabindex="0"
            class="hidden fx-active:flex ring-offset-zinc-950 p-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red5 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md mt-2"
            data-tab-panel id="tab2" aria-labelledby="tab2">
            Tab 2 Content
        </section>
        <section role="tabpanel" tabindex="0"
            class="hidden fx-active:flex ring-offset-zinc-950 p-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red5 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md mt-2"
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
                    title: "with-uno.html",
                    lang: "html",
                    code: `
<div data-vertical-tab data-fx-tabs data-orientation="vertical" class="flex items-start wfull">
    <ul data-tab-list role="tablist"
        class="flex flex-col p0.5 wmax relative bg-zinc1 dark-bg-zinc9/50 rd-md">
        <li role="presentation" class="flex">
            <a href="#" data-tabs-trigger data-target="tab1"
                class="px4 py2 rd fx-active-bg-zinc2 dark-fx-active-bg-zinc8 text-zinc7 dark-text-zinc3 disabled-cursor-not-allowed disabled-op80 relative wfull">
                Tab 1
            </a>
        </li>
        <li role="presentation" class="flex">
            <a href="#" data-tabs-trigger data-target="tab2"
                class="px4 py2 rd fx-active-bg-zinc2 dark-fx-active-bg-zinc8 text-zinc7 dark-text-zinc3 disabled-cursor-not-allowed disabled-op80 relative wfull">
                Tab2
            </a>
        </li>
        <li role="presentation" class="flex">
            <a href="#" data-tabs-trigger data-target="tab3"
                class="px4 py2 rd fx-active-bg-zinc2 dark-fx-active-bg-zinc8 text-zinc7 dark-text-zinc3 disabled-cursor-not-allowed disabled-op80 relative wfull">
                Tab3
            </a>
        </li>
    </ul>
    <div data-panels-container class="flex-1">
        <section role="tabpanel"
            class="hidden fx-active-flex bg-zinc1 dark-bg-zinc9/50 ring-offset-zinc950 h48 p20 focus-visible-outline-none focus-visible-ring-2 focus-visible-ring-red5 focus-visible-ring-offset-2 b b-zinc2 dark-b-zinc8 rd-md ml2"
            data-tab-panel id="tab1" aria-labelledby="tab1">
            Tab 1 Content
        </section>
        <section role="tabpanel" data-state="active"
            class="hidden fx-active-flex bg-zinc1 dark-bg-zinc9/50 ring-offset-zinc950 h48 p20 focus-visible-outline-none focus-visible-ring-2 focus-visible-ring-red5 focus-visible-ring-offset-2 b b-zinc2 dark-b-zinc8 rd-md ml2"
            data-tab-panel id="tab2" data-state="active" aria-labelledby="tab2">
            Tab 2 Content
        </section>
        <section role="tabpanel"
            class="hidden fx-active-flex bg-zinc1 dark-bg-zinc9/50 ring-offset-zinc950 h48 p20 focus-visible-outline-none focus-visible-ring-2 focus-visible-ring-red5 focus-visible-ring-offset-2 b b-zinc2 dark-b-zinc8 rd-md ml2"
            data-tab-panel id="tab3" aria-labelledby="tab3">
            Tab 3 Content
        </section>
    </div>
</div>`,
                },
                {
                    id: "tab2",
                    icon: "html",
                    title: "tailwind.html",
                    lang: "html",
                    code: `
<div data-vertical-tab data-fx-tabs data-orientation="vertical" class="flex items-start w-full">
    <ul data-tab-list role="tablist"
        class="flex flex-col p-0.5 wmax relative bg-zinc-100 dark:bg-zinc-900/50 rounded-md">
        <li role="presentation" class="flex">
            <a data-tabs-trigger data-target="tab1"
                class="px-4 py-2 rounded fx-active:bg-zinc-200 dark:fx-active:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 relative w-full">
                Tab 1
            </a>
        </li>
        <li role="presentation" class="flex">
            <a data-tabs-trigger data-target="tab2"
                class="px-4 py-2 rounded fx-active:bg-zinc-200 dark:fx-active:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 relative w-full">
                Tab2
            </a>
        </li>
        <li role="presentation" class="flex">
            <a data-tabs-trigger data-target="tab3"
                class="px-4 py-2 rounded fx-active:bg-zinc-200 dark:fx-active:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 relative w-full">
                Tab3
            </a>
        </li>
    </ul>
    <div data-panels-container class="flex-1">
        <section role="tabpanel"
            class="hidden fx-active:flex bg-zinc-100 dark:bg-zinc-900/50 ring-offset-zinc-950 h-48 p-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red5 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md ml2"
            data-tab-panel id="tab1" aria-labelledby="tab1">
            Tab 1 Content
        </section>
        <section role="tabpanel" data-state="active"
            class="hidden fx-active:flex bg-zinc-100 dark:bg-zinc-900/50 ring-offset-zinc-950 h-48 p-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red5 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md ml2"
            data-tab-panel id="tab2" data-state="active" aria-labelledby="tab2">
            Tab 2 Content
        </section>
        <section role="tabpanel"
            class="hidden fx-active:flex bg-zinc-100 dark:bg-zinc-900/50 ring-offset-zinc-950 h-48 p-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red5 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md ml2"
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
                    title: "with-uno.html",
                    lang: "html",
                    code: `
<div data-with-indicator data-fx-tabs data-indicator-class-name="ui-tabs-indicator bg-zinc2 dark-bg-zinc8 flex rd absolute ease-linear duration-200">
    <div data-tab-list-wrapper class="flex wfull">
        <ul data-tab-list role="tablist"
            class="flex items-center relative p0.5 bg-zinc1 dark-bg-zinc9/50 wfull rd-md children-cursor-pointer">
            <li role="presentation" class="flex">
                <a href="#" role="tab" data-tabs-trigger data-target="tab1" data-state="active"
                    tabindex="0"
                    class="px4 py2 rd text-zinc7 dark-text-zinc3 disabled-cursor-not-allowed disabled-op80 relative z20">
                    Tab 1
                </a>
            </li>
            <li role="presentation" class="flex">
                <a href="#" role="tab" data-tabs-trigger data-target="tab2" data-state="active"
                    tabindex="-1"
                    class="px4 py2 rd text-zinc7 dark-text-zinc3 disabled-cursor-not-allowed disabled-op80 relative z20">
                    Tab 2
                </a>
            </li>
            <li role="presentation" class="flex">
                <a href="#" role="tab" data-tabs-trigger data-target="tab3" data-state="active"
                    tabindex="-1"
                    class="px4 py2 rd text-zinc7 dark-text-zinc3 disabled-cursor-not-allowed disabled-op80 relative z20">
                    Tab 3
                </a>
            </li>
        </ul>
    </div>
    <div data-panels-container class="hmax bg-zinc1 text-zinc7 dark-text-zinc3 dark-bg-zinc9/50 rd-lg">
        <section role="tabpanel"
            class="hidden fx-active-flex ring-offset-zinc950 h48 p20 focus-visible-outline-none focus-visible-ring-2 focus-visible-ring-red5 focus-visible-ring-offset-2 b b-zinc2 dark-b-zinc8 rd-md mt2"
            data-tab-panel id="tab1" data-state="active" aria-labelledby="tab1">
            Tab1 Content
        </section>
        <section role="tabpanel"
            class="hidden fx-active-flex ring-offset-zinc950 h48 p20 focus-visible-outline-none focus-visible-ring-2 focus-visible-ring-red5 focus-visible-ring-offset-2 b b-zinc2 dark-b-zinc8 rd-md mt2"
            data-tab-panel id="tab2" aria-labelledby="tab2">
            Tab 2
        </section>
        <section role="tabpanel"
            class="hidden fx-active-flex ring-offset-zinc950 p20 focus-visible-outline-none focus-visible-ring-2 focus-visible-ring-red5 focus-visible-ring-offset-2 b b-zinc2 dark-b-zinc8 rd-md mt2"
            data-tab-panel id="tab3" aria-labelledby="tab3">
            Tab panel 3
        </section>
    </div>
</div>`,
                },
                {
                    id: "tab2",
                    icon: "html",
                    title: "tailwind.html",
                    lang: "html",
                    code: `
<div data-with-indicator data-fx-tabs
    data-indicator-class-name="ui-tabs-indicator bg-zinc-200 dark:bg-zinc-800 flex rounded absolute ease-linear duration-200"
    class="w-full">
    <div data-tab-list-wrapper class="flex w-full">
        <ul data-tab-list role="tablist"
            class="flex items-center relative p-0.5 bg-zinc-100 dark:bg-zinc-900/50 w-full rounded-md *:cursor-pointer">
            <li role="presentation" class="flex">
                <a href="#" role="tab" data-tabs-trigger data-target="tab1" data-state="active"
                    tabindex="0"
                    class="px-4 py-2 rounded text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 relative z-20">
                    Tab 1
                </a>
            </li>
            <li role="presentation" class="flex">
                <a href="#" role="tab" data-tabs-trigger data-target="tab2" data-state="active"
                    tabindex="-1"
                    class="px-4 py-2 rounded text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 relative z-20">
                    Tab 2
                </a>
            </li>
            <li role="presentation" class="flex">
                <a href="#" role="tab" data-tabs-trigger data-target="tab3" data-state="active"
                    tabindex="-1"
                    class="px-4 py-2 rounded text-zinc-700 dark:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-80 relative z-20">
                    Tab 3
                </a>
            </li>
        </ul>
    </div>
    <div data-panels-container
        class="h-max bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:bg-zinc-900/50 rounded-lg">
        <section role="tabpanel"
            class="hidden fx-active:flex ring-offset-zinc-950 h-48 p-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red5 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md mt-2"
            data-tab-panel id="tab1" data-state="active" aria-labelledby="tab1">
            Tab1 Content
        </section>
        <section role="tabpanel"
            class="hidden fx-active:flex ring-offset-zinc-950 h-48 p-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red5 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md mt-2"
            data-tab-panel id="tab2" aria-labelledby="tab2">
            Tab 2
        </section>
        <section role="tabpanel"
            class="hidden fx-active:flex ring-offset-zinc-950 p-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red5 focus-visible:ring-offset-2 border border-zinc-200 dark:border-zinc-800 rounded-md mt-2"
            data-tab-panel id="tab3" aria-labelledby="tab3">
        Tabs 3
        </section>
    </div>
</div>`,
                },
            ],
        },
    ],
}