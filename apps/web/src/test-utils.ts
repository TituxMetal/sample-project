// Test utilities for web app
// This file must be imported at the top of each test file that uses @testing-library/react

import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'bun:test'

// Extend Bun's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test to avoid DOM state bleeding between tests
afterEach(() => {
  cleanup()
  // Also clear the document body to ensure no elements persist
  if (typeof document !== 'undefined' && document.body) {
    document.body.innerHTML = ''
  }
})

// Re-export commonly used testing utilities
export { cleanup }
export { fireEvent, render, screen, waitFor } from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
