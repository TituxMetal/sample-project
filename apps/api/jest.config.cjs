module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/main.ts',
    '!src/**/*.interface.ts',
    '!src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@packages/types$': '<rootDir>/../../packages/shared-types/src/index',
    '^@packages/types/(.*)$': '<rootDir>/../../packages/shared-types/src/$1'
  },
  setupFilesAfterEnv: [],
  testTimeout: 10000,
  clearMocks: true,
  restoreMocks: true
}
