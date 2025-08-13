/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    environmentOptions: {
      jsdom: {
        resources: 'usable'
      }
    }
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '~icons': path.resolve(__dirname, './src/assets/icons'),
      '~layouts': path.resolve(__dirname, './src/components/layouts'),
      '~forms': path.resolve(__dirname, './src/components/forms'),
      '~ui': path.resolve(__dirname, './src/components/ui'),
      '~hooks': path.resolve(__dirname, './src/hooks'),
      '~utils': path.resolve(__dirname, './src/utils'),
      '@packages/types': path.resolve(__dirname, '../../packages/shared-types/src'),
      '@packages/types/*': path.resolve(__dirname, '../../packages/shared-types/src/*')
    }
  }
})
