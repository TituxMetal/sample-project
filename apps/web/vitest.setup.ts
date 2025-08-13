import '@testing-library/jest-dom'
import { afterEach, beforeEach, vi } from 'vitest'

// Save original console methods
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

// Replace console methods with mocks before each test
beforeEach(() => {
  console.error = vi.fn()
  console.warn = vi.fn()
})

// Restore original console methods after each test
afterEach(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})
