// @ts-check

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: { project: 'tsconfig.json', sourceType: 'module' },
  plugins: ['import', '@typescript-eslint/eslint-plugin', 'prettier'],
  rules: {
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
    ]
  }
}
