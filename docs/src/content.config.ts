import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

const docsCollection = defineCollection({
    loader: glob({
        pattern: '**/*.mdx',
        base: './src/content/docs',
        generateId: ({ entry }) => entry.replace(/\.mdx$/, '').replace(/\/index$/, ''),
    }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        hideTableOfContent: z.boolean().optional(),
        hidePagination: z.boolean().optional(),
        references: z.array(z.record(z.string(), z.string())).optional()
    })
})

export const collections = {
    docs: docsCollection,
};