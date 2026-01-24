import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://ashwinphilips.com',
  output: 'static',
  integrations: [
    tailwind()
  ],

  // Prefetch configuration for instant navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport' // Prefetch links when they enter viewport
  },

  // Image optimization
  image: {
    domains: ['ashwinphilips.com'],
    remotePatterns: [{ protocol: 'https' }]
  },

  // Vite configuration
  vite: {
    ssr: {
      external: ['three']
    },
    build: {
      cssCodeSplit: true
    }
  },

  // Build optimizations
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets'
  }
});
