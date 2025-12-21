import webConfig from '@packages/eslint-config/web'
import boundaries from 'eslint-plugin-boundaries'
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
  },
  {
    plugins: {
      boundaries
    },
    settings: {
      'boundaries/elements': [
        {
          type: 'shared',
          pattern: [
            'src/lib/*',
            'src/components/ui/*',
            'src/types/*',
            'src/utils/*',
            'src/layouts/*',
            'src/config/*'
          ]
        },
        { type: 'feature', pattern: ['src/features/*'] },
        { type: 'pages', pattern: ['src/pages/*'] }
      ],
      'boundaries/ignore': ['**/*.spec.ts', '**/*.spec.tsx', '**/test-utils.ts']
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'shared', allow: ['shared'] },
            { from: 'feature', allow: ['shared', 'feature'] },
            { from: 'pages', allow: ['shared', 'feature', 'pages'] }
          ]
        }
      ]
    }
  }
]
