<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Accordion } from "@flexilla/flexilla"
const accordion = ref<Accordion|null>(null)
onMounted(() => {
   accordion.value = new Accordion("[data-fx-accordion]")
})
onUnmounted(() => {
   if(accordion.value) accordion.value.cleanup()
})
</script>
<template>
    <div class="space-y-6">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
            Accordion Example
        </h1>
        <div class="p-6 rounded-lg border border-gray-200 dark:border-gray-900">
            <div data-fx-accordion data-default-value="accordion-1" data-type="single" class="space-y-2">
                <div data-accordion-item data-accordion-value="accordion-1"
                    class="rounded-md bg-gray-100/5 dark:bg-gray-900/5 border border-gray-200/30 dark:border-gray-800/20 data-[state=open]:bg-gray-100/80 dark:data-[state=open]:bg-gray-900/60 data-[state=open]:border-gray-200/50 dark:data-[state=open]:border-gray-800/40">
                    <button data-accordion-trigger aria-expanded="true" aria-label="toggle button"
                        class="cursor-pointer px-4 w-full flex justify-between items-center py-2 text-gray-800 dark:text-gray-200 font-medium text-lg ease-linear hover:bg-gray-200/50 dark:hover:bg-gray-800/40 rounded-md [&[aria-expanded=true]>svg]:rotate-180">
                        Is it accessible?
                        <svg viewBox="0 0 20 20" fill="currentColor" class="size-5 ease-linear duration-300">
                            <path fill-rule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </button>
                    <div aria-hidden="false" data-state="open" data-accordion-content
                        class="text-gray-700 dark:text-gray-300 duration-200 ease-linear overflow-hidden h-0 data-[state=open]:h-auto">
                        <p class="p-4">Yes. It adheres to the WAI-ARIA design pattern.</p>
                    </div>
                </div>
                <div data-accordion-item data-accordion-value="accordion-2"
                    class="rounded-md bg-gray-100/5 dark:bg-gray-900/5 border border-gray-200/30 dark:border-gray-800/20 data-[state=open]:bg-gray-100/80 dark:data-[state=open]:bg-gray-900/60 data-[state=open]:border-gray-200/50 dark:data-[state=open]:border-gray-800/40">
                    <button data-accordion-trigger aria-label="toggle button"
                        class="cursor-pointer px-4 w-full flex justify-between items-center py-2 text-gray-800 dark:text-gray-200 font-medium text-lg ease-linear hover:bg-gray-200/50 dark:hover:bg-gray-800/40 rounded-md [&[aria-expanded=true]>svg]:rotate-180">
                        Is it unstyled?
                        <svg viewBox="0 0 20 20" fill="currentColor" class="size-5 ease-linear duration-300">
                            <path fill-rule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </button>
                    <div aria-hidden="true" data-accordion-content
                        class="text-gray-700 dark:text-gray-300 duration-200 ease-linear overflow-hidden h-0 data-[state=open]:h-auto">
                        <p class="p-4">
                            Yes. It's unstyled by default, giving you freedom over the look and
                            feel.
                        </p>
                    </div>
                </div>
                <div data-accordion-item data-accordion-value="accordion-3"
                    class="rounded-md bg-gray-100/5 dark:bg-gray-900/5 border border-gray-200/30 dark:border-gray-800/20 data-[state=open]:bg-gray-100/80 dark:data-[state=open]:bg-gray-900/60 data-[state=open]:border-gray-200/50 dark:data-[state=open]:border-gray-800/40">
                    <button data-accordion-trigger aria-label="toggle button"
                        class="cursor-pointer px-4 w-full flex justify-between items-center py-2 text-gray-800 dark:text-gray-200 font-medium text-lg ease-linear hover:bg-gray-200/50 dark:hover:bg-gray-800/40 rounded-md [&[aria-expanded=true]>svg]:rotate-180">
                        Can it be animated?
                        <svg viewBox="0 0 20 20" fill="currentColor" class="size-5 ease-linear duration-300">
                            <path fill-rule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </button>
                    <div aria-hidden="true" data-accordion-content
                        class="text-gray-700 dark:text-gray-300 duration-200 ease-linear overflow-hidden h-0 data-[state=open]:h-auto">
                        <p class="p-4">
                            Yes! You can use the transition prop to configure the animation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>