// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// Pages are prerendered (static) by default. Only Keystatic's admin UI and API
// (/keystatic, /api/keystatic) run on demand, which is why an adapter is needed.
// Hosting somewhere else? Swap `vercel()` for `@astrojs/node`, `@astrojs/netlify`, etc.
export default defineConfig({
  site: 'https://example.com', // TODO: replace with your domain
  integrations: [react(), markdoc(), keystatic()],
  adapter: vercel(),
});
