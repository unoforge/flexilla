import type { SourceData } from "@/types/index";

export const modalCode: SourceData = {
    "modalDefault": [
        {
            id: "modal1_demo",
            title: "Modal Demo",
            items: [
                {
                    id: "tab1",
                    icon: "html",
                    title: "with-uno.html",
                    lang: "html",
                    code: `
<button data-modal-target="modal-alert1" class="bg-zinc8 text-white px4 py2 rd-lg text-sm">
    Open Modal
</button>
<div data-fx-modal aria-hidden="true" data-modal-id="modal-alert1"
    data-modal-overlay="ui-overlay bg-zinc8/70 backdrop-filter backdrop-blur-3xl" 
    class="inset-0 justify-center items-start hidden fx-open-flex p4 fixed wscreen hscreen top-0 left-0 z-80">
    <dialog data-modal-content
      class="relative bg-white dark-bg-zinc950 rd-lg overflow-hidden wfull max-wxl p8 flex flex-col gap-y4 items-center">
      <div class="wmax p3 rd-full bg-red2 text-red6">
        <span class="flex i-carbon-trash-can text-lg"></span>
      </div>
      <h2 class="font-semibold text-xl text-zinc9 dark-text-white">
        Confirm your action
      </h2>
      <p class="text-zinc7 dark-text-zinc3">
        Are you sure you want to delete this event?
      </p>
      <div class="flex justify-center gap-x3 pt4">
        <button data-close-modal
          class="h9 text-sm flex items-center px5 rd-md bg-zinc1 dark-bg-zinc9 duration-300 hover-!bg-op60 text-zinc8 dark-text-zinc2">
          No, Cancel
        </button>
        <button class="h9 text-sm flex items-center px5 rd-md bg-red6 duration-200 hover-bg-op80 text-white">
          Yes, Delete
        </button>
      </div>
    </dialog>
</div>`,
                },
                {
                    id: "tab2",
                    icon: "html",
                    title: "tailwind.html",
                    lang: "html",
                    code: `
<button data-modal-target="modal-alert1" class="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm">
  Open Modal
</button>
<div data-fx-modal data-modal-id="modal-alert1" aria-hidden="true" 
  data-modal-overlay="ui-overlay bg-zinc-800/70 backdrop-filter backdrop-blur-3xl" 
  class="inset-0 justify-center items-start hidden fx-open:flex p-4 fixed w-screen h-screen top-0 left-0 z-[80]">
  <dialog data-modal-content data-enter-animation="fadeScale .4s linear"
    class="relative bg-white dark:bg-zinc-950 rounded-lg overflow-hidden w-full max-w-xl p-8 flex flex-col gap-y-4 items-center">
    <div class="w-max p-3 rounded-full bg-red-200 text-red-600">
      <svg class="size-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
      </svg>
    </div>
    <h2 class="font-semibold text-xl text-zinc-900 dark:text-white">
      Confirm your action
    </h2>
    <p class="text-zinc-700 dark:text-zinc-300">
      Are you sure you want to delete this event?
    </p>
    <div class="flex justify-center gap-x3 pt-4">
      <button data-close-modal
        class="h-9 text-sm flex items-center px-5 rounded-md bg-zinc-100 dark:bg-zinc-900 duration-300 hover:!bg-opacity-60 text-zinc-800 dark:text-zinc-200">
        No, Cancel
      </button>
      <button class="h-9 text-sm flex items-center px-5 rounded-md bg-red-600 duration-200 hover:bg-opacity-80 text-white">
        Yes, Delete
      </button>
    </div>
  </dialog>
</div>`,
                },
            ],
        },
    ],
}