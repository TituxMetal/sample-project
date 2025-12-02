// @ts-check
import eslintPluginAstro from 'eslint-plugin-astro'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

import baseConfig, {
  basePlugins,
  baseParser,
  baseParserOptions,
  baseSettings,
  baseRules
} from './base.mjs'

/**
 * Web ESLint flat config.
 * Extends the shared base config with browser/Astro-specific settings.
 */

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  {
    plugins: {
      ...basePlugins,
      'jsx-a11y': jsxA11y
    },
    languageOptions: {
      parser: baseParser,
      parserOptions: baseParserOptions,
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    settings: baseSettings,
    rules: baseRules
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: (await import('astro-eslint-parser')).default,
      parserOptions: {
        parser: baseParser,
        extraFileExtensions: ['.astro']
      }
    }
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.tsx', '**/*.test.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  }
]
