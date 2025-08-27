<script lang="ts" setup>
import type { SupportedLanguage } from '@/types/index';
import { codeToHtml } from 'shiki';
import { computed, onMounted, ref } from 'vue';

import { createCssVariablesTheme } from 'shiki'

const cssVariables = createCssVariablesTheme({
    variablePrefix: '--astro-code-',
    variableDefaults: {},
})

const codeHtml = ref()
const isLoading = ref(true)

const props = defineProps<{
    code: string,
    lang: SupportedLanguage
}>()

const finalCodeHtml = computed(() => codeHtml.value)

onMounted(async () => {
    try {
        codeHtml.value = await codeToHtml(props.code, {
            lang: props.lang,
            theme: cssVariables
        })
        isLoading.value = false;
    } catch (error) {
        console.error(error)
    }
})
</script>
<template>
    <div v-if="isLoading" class="p2 w-full flex justify-center items-center">
        <span aria-hidden="true" class="flex i-carbon-rotate-180 animate-spin"></span>
    </div>
    <figure v-html="finalCodeHtml" data-code-snippet role="region" aria-label="codeblock region" class="grid px4 pb6"/>
</template>