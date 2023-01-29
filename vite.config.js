import { resolve } from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        co2_emission: resolve(__dirname, 'co2-emission.html'),
        legal: resolve(__dirname, 'legal.html'),
        imprint: resolve(__dirname, 'imprint.html'),
      },
    },
  },
})
