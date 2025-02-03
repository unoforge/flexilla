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
                    title: "with-uno.html",
                    lang: "html",
                    code: `
<button data-dropdown-trigger data-dropdown-id="dropdown-6"
    class="b b-zinc8 hover-bg-zinc950 bg-zinc9 text-white px4 py2 rd-lg text-sm flex items-center gap-x2 [&[aria-expanded=true]>span]-rotate-180">
    Open Dropdown
    <span aria-hidden="true" class="flex ease-linear i-carbon-chevron-down duration-200"></span>
</button>
<div role="list" id="dropdown-6" data-drop-down-6
    class="ui-popper z20 w56 p2 b b-zinc8 bg-zinc9/80 text-zinc50 backdrop-filter backdrop-blur-xl rd-lg flex flex-col overflow-hidden op0 invisible fx-open-op100 fx-open-visible">
    <div class="pb-2 b-b mb2 b-b-zinc6 flex items-center gap-x3">
        <span class="w9 h9 bg-zinc950 rd-full flex items-center justify-center text-zinc1">
            <span class="flex i-carbon-user-activity"></span>
        </span>
        <div class="flex items-start flex-col">
            <h4 class="font-semibold text-white">Johnkat MJ</h4>
            <span class="text-sm text-zinc3">FrontEnd Designer</span>
        </div>
    </div>
    <div role="list">
        <a href="#"
          class="focus-outline focus-bg-zinc9/90 outline-none focus-outline-blue5 ease-linear flex items-center gap-x3 hover-bg-zinc8/80 p2 rd-md">
          <span aria-hidden="true" class="flex ease-linear duration-200 i-carbon-edit"></span>
          Edit Profile
        </a>
        <a href="#"
          class="focus-outline focus-bg-zinc9/90 outline-none focus-outline-blue5 ease-linear flex items-center gap-x3 hover-bg-zinc8/80 p2 rd-md">
          <span aria-hidden="true" class="flex ease-linear duration-200 i-carbon-settings"></span>
          Setting
        </a>
        <a href="#"
          class="focus-outline focus-bg-zinc9/90 outline-none focus-outline-blue5 ease-linear flex items-center gap-x3 hover-bg-zinc8/80 p2 rd-md">
          <span aria-hidden="true" class="flex ease-linear duration-200 i-carbon-activity"></span>
          Billing
        </a>
    </div>
</div>`,
                },
                {
                    id: "tab2",
                    icon: "html",
                    title: "tailwind.html",
                    lang: "html",
                    code: `
<button data-dropdown-trigger data-dropdown-id="dropdown-6"
    class="border border-zinc8 hover:bg-zinc-950 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-x-2 [&[aria-expanded=true]>span]:rotate-180">
    Open Dropdown
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
      <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
    </svg>    
</button>
<div role="list" id="dropdown-6" data-drop-down-6
    class="ui-popper z-20 w-56 p-2 border border-zinc-800 bg-zinc-900/80 text-zinc-50 backdrop-filter backdrop-blur-xl rounded-lg flex flex-col overflow-hidden opacity-0 invisible fx-open:opacity-100 fx-open:visible">
    <div class="pb-2 border-b mb-2 border-b-zinc-600 flex items-center gap-x-3">
        <span class="size-9 bg-zinc-950 rounded-full flex items-center justify-center text-zinc-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path fill-rule="evenodd" d="M1.22 5.222a.75.75 0 0 1 1.06 0L7 9.942l3.768-3.769a.75.75 0 0 1 1.113.058 20.908 20.908 0 0 1 3.813 7.254l1.574-2.727a.75.75 0 0 1 1.3.75l-2.475 4.286a.75.75 0 0 1-1.025.275l-4.287-2.475a.75.75 0 0 1 .75-1.3l2.71 1.565a19.422 19.422 0 0 0-3.013-6.024L7.53 11.533a.75.75 0 0 1-1.06 0l-5.25-5.25a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>                 
        </span>
        <div class="flex items-start flex-col">
            <h4 class="font-semibold text-white">Johnkat MJ</h4>
            <span class="text-sm text-zinc-300">FrontEnd Designer</span>
        </div>
    </div>
    <div role="list">
        <a href="#"
          class="focus:outline focus:bg-zinc-900/90 outline-none focus:outline-blue-500 ease-linear flex items-center gap-x-3 hover:bg-zinc-800/80 p-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
          </svg>          
          Edit Profile
        </a>
        <a href="#"
          class="focus:outline focus:bg-zinc-900/90 outline-none focus:outline-blue-500 ease-linear flex items-center gap-x-3 hover:bg-zinc-800/80 p-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path fill-rule="evenodd" d="M14.5 10a4.5 4.5 0 0 0 4.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 0 1-.493.11 3.01 3.01 0 0 1-1.618-1.616.455.455 0 0 1 .11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 0 0-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 1 0 3.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01ZM5 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clip-rule="evenodd" />
            <path d="M14.5 11.5c.173 0 .345-.007.514-.022l3.754 3.754a2.5 2.5 0 0 1-3.536 3.536l-4.41-4.41 2.172-2.607c.052-.063.147-.138.342-.196.202-.06.469-.087.777-.067.128.008.257.012.387.012ZM6 4.586l2.33 2.33a.452.452 0 0 1-.08.09L6.8 8.214 4.586 6H3.309a.5.5 0 0 1-.447-.276l-1.7-3.402a.5.5 0 0 1 .093-.577l.49-.49a.5.5 0 0 1 .577-.094l3.402 1.7A.5.5 0 0 1 6 3.31v1.277Z" />
          </svg>          
          Setting
        </a>
        <a href="#"
          class="focus:outline focus:bg-zinc-900/90 outline-none focus:outline-blue-500 ease-linear flex items-center gap-x-3 hover:bg-zinc-800/80 p-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path fill-rule="evenodd" d="M1 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4Zm12 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM4 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm13-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM1.75 14.5a.75.75 0 0 0 0 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 0 0-1.5 0v.784a.272.272 0 0 1-.35.25A49.043 49.043 0 0 0 1.75 14.5Z" clip-rule="evenodd" />
          </svg>          
          Billing
        </a>
    </div>
</div>`,
                },
            ],
        },
    ],
}