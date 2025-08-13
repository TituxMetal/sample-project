import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  build: { inlineStylesheets: 'auto' },
  integrations: [react(), icon({ iconDir: 'src/assets/icons' })],
  output: 'server',
  security: {
    checkOrigin: true
  },
  vite: {
    plugins: [tailwindcss()],
    css: { devSourcemap: false },
    build: { cssCodeSplit: false }
  }
})
