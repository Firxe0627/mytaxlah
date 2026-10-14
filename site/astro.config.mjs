import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL / BASE_PATH are set by the deploy workflow.
// GitHub Pages project site: SITE_URL=https://firxe0627.github.io BASE_PATH=/mytaxlah
// Custom domain: SITE_URL=https://mytaxlah.com BASE_PATH=/
const site = process.env.SITE_URL || 'https://mytaxlah.com';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});
