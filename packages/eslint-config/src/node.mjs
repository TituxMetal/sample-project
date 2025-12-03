// @ts-check
import globals from 'globals'

import baseConfig, {
  basePlugins,
  baseParser,
  baseParserOptions,
  baseSettings,
  baseRules
} from './base.mjs'

/**
 * Node.js ESLint flat config.
 * Extends the shared base config with Node.js-specific settings.
 */

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  {
    plugins: basePlugins,
    languageOptions: {
      parser: baseParser,
      parserOptions: baseParserOptions,
      globals: {
        ...globals.node
      }
    },
    settings: baseSettings,
    rules: {
      ...baseRules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off'
    }
  }
]
