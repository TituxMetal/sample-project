import nodeConfig from '@packages/eslint-config/node'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default [
  {
    ignores: ['eslint.config.mjs', 'generated/**', 'dist/**', 'coverage/**']
  },
  ...nodeConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
      }
    }
  }
]
