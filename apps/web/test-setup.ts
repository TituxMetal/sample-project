// Bun test setup for web app
// Configures happy-dom for browser environment simulation

// IMPORTANT: Set up happy-dom BEFORE any imports that need DOM
import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register()

// Verify DOM is available
if (typeof document === 'undefined' || !document.body) {
  throw new Error('happy-dom failed to register global DOM')
}
