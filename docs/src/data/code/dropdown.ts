import type { SourceData } from "@/types/index";

export const dropdownCode: SourceData = {
    "dropdownDefault": [
        {
            id: "drop1_demo",
            title: "Dropdown Demo",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "index.html",
                    lang: "html",
                    code: `
<button data-dropdown-trigger data-dropdown-id="dropdown-6"
    class="border border-zinc-800 hover:bg-zinc-950 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-x-2 [&[aria-expanded=true]>span]:rotate-180">
    Open Dropdown
    <span aria-hidden="true" class="flex ease-linear i-carbon-chevron-down duration-200"></span>
</button>
<div role="list" id="dropdown-6" data-drop-down-6
    class="ui-popper z-20 w-56 p-2 border border-zinc-800 bg-zinc-900/80 text-zinc-50 backdrop-filter backdrop-blur-xl rounded-lg flex flex-col overflow-hidden opacity-0 invisible fx-open:opacity-100 fx-open:visible">
    <div class="pb-2 border-b mb-2 border-zinc-600 flex items-center gap-x-3">
        <span class="size-9 bg-zinc-950 rounded-full flex items-center justify-center text-zinc1">
            <span class="flex i-carbon-user-activity"></span>
        </span>
        <div class="flex items-start flex-col">
            <h4 class="font-semibold text-white">Johnkat MJ</h4>
            <span class="text-sm text-zinc-300">FrontEnd Designer</span>
        </div>
    </div>
    <div role="list">
        <a href="#"
          class="focus:outline focus:bg-zinc-900/90 outline-none focus:outline-blue-500 ease-linear flex items-center gap-x-3 hover:bg-zinc-800/80 p-2 rounded-md">
          <span aria-hidden="true" class="flex ease-linear duration-200 i-carbon-edit"></span>
          Edit Profile
        </a>
        <a href="#"
          class="focus:outline focus:bg-zinc-900/90 outline-none focus:outline-blue-500 ease-linear flex items-center gap-x-3 hover:bg-zinc-800/80 p-2 rounded-md">
          <span aria-hidden="true" class="flex ease-linear duration-200 i-carbon-settings"></span>
          Setting
        </a>
        <a href="#"
          class="focus:outline focus:bg-zinc-900/90 outline-none focus:outline-blue-500 ease-linear flex items-center gap-x-3 hover:bg-zinc-800/80 p-2 rounded-md">
          <span aria-hidden="true" class="flex ease-linear duration-200 i-carbon-activity"></span>
          Billing
        </a>
    </div>
</div>`,
                }
            ],
        },
    ],
}