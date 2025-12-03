import webConfig from '@packages/eslint-config/web'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default [
  {
    ignores: ['eslint.config.mjs', 'astro.config.mjs', 'dist/**', 'coverage/**', '.astro/**']
  },
  ...webConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
      }
    }
  }
]
