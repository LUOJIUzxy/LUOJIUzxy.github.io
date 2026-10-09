import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    status: z.enum(['draft', 'published']).default('draft'),
    date: z.coerce.date(),
    category: z.enum(['therapy', 'life', 'making']).default('therapy'),
    excerpt: z.string().optional().default(''),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: 'about.yaml', base: './src/content/site' }),
  schema: z.object({
    heading: z.string(),
    paragraphs: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { notes, site };
