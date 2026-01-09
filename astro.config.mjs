// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
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
