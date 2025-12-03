// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'

/**
 * Shared base ESLint flat config for the monorepo.
 * This config is extended by node.mjs and web.mjs.
 */

/** @type {import('eslint').Linter.Config[]} */
export const baseConfigs = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier
]

/** @type {Record<string, import('eslint').ESLint.Plugin>} */
export const basePlugins = {
  '@typescript-eslint': tseslint.plugin,
  import: importPlugin,
  prettier: eslintPluginPrettier
}

export const baseParser = tseslint.parser

/** @type {import('eslint').Linter.ParserOptions} */
export const baseParserOptions = {
  project: true,
  sourceType: 'module'
}

export const baseSettings = {
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true
    }
  }
}

/** @type {import('eslint').Linter.RulesRecord} */
export const baseRules = {
  'arrow-body-style': ['error', 'as-needed'],
  'arrow-parens': ['error', 'as-needed'],
  'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
  '@typescript-eslint/consistent-type-imports': [
    'warn',
    {
      prefer: 'type-imports',
      disallowTypeAnnotations: true,
      fixStyle: 'separate-type-imports'
    }
  ],
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true,
      caughtErrors: 'none',
      destructuredArrayIgnorePattern: '^_*',
      argsIgnorePattern: '^_*'
    }
  ],
  'import/order': [
    'error',
    {
      alphabetize: { order: 'asc', caseInsensitive: true },
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
      'newlines-between': 'always',
      pathGroups: [
        { pattern: 'node:*', group: 'builtin' },
        { pattern: '@auth-system/**', group: 'external' },
        { pattern: '~/**', group: 'internal', position: 'after' }
      ],
      pathGroupsExcludedImportTypes: ['builtin']
    }
  ],
  'import/newline-after-import': [
    'error',
    {
      count: 1,
      considerComments: true
    }
  ],
  'prettier/prettier': 'error'
}

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfigs,
  {
    plugins: basePlugins,
    languageOptions: {
      parser: baseParser,
      parserOptions: baseParserOptions
    },
    settings: baseSettings,
    rules: baseRules
  }
]
