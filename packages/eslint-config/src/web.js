// @ts-check
const base = require('./base')

module.exports = {
  ...base,
  extends: [
    'plugin:astro/recommended',
    'plugin:astro/jsx-a11y-recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    ...base.rules
  },
  ignorePatterns: [
    'astro.config.mjs',
    'eslint.config.cjs',
    'dist/**',
    'coverage/**',
    'packages/**',
    '.turbo/**'
  ],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
        project: './tsconfig.json'
      },
      rules: { ...base.rules }
    },
    {
      files: ['*.spec.ts', '*.test.ts', '*.spec.tsx', '*.test.tsx'],
      env: {
        browser: true,
        node: true,
        'vitest/globals': true
      },
      rules: { ...base.rules }
    }
  ]
}
