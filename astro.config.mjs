// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://finessedetailing.com',
  integrations: [react(), sitemap()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 268402689, // Handle large images (16K x 16K)
      }
    }
  },
  vite: {
    assetsInclude: ['**/*.heic', '**/*.HEIC'],
  },
});
