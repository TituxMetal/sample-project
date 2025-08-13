// @ts-check
const base = require('./base')

module.exports = {
  ...base,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: [
    'eslint.config.cjs',
    'jest.config.cjs',
    'dist/**',
    'coverage/**',
    'packages/**',
    '.turbo/**'
  ],
  rules: {
    ...base.rules,
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'off'
  }
}
