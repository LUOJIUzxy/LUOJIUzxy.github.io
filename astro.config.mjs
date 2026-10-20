// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

// The live site is a fully static build hosted on GitHub Pages
// (https://luojiuzxy.github.io), deployed by .github/workflows/deploy.yml.
//
// Keystatic's editor (/keystatic) needs server routes, which GitHub Pages can't run,
// so it is only switched on for `npm run dev`. Write locally, commit, push to main.
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://luojiuzxy.github.io',
  output: 'static',
  integrations: [react(), markdoc(), ...(isDev ? [keystatic()] : [])],
  vite: { plugins: [tailwindcss()] },
});
