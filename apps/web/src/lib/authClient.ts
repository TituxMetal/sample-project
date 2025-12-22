import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

// Get the appropriate base URL for the auth client
// Better-auth expects baseURL to be the server origin, NOT including /api/auth
// The basePath config (default /api/auth) is added automatically
const getBaseURL = (): string => {
  // In browser, use current origin (proxy handles /api/auth/*)
  if (typeof window !== 'undefined') {
    const origin = window.location?.origin
    // Check for valid origin (happy-dom returns literal string "null")
    if (origin && origin !== 'null') {
      return origin
    }
  }

  // SSR/Test - use direct API URL with fallback
  return import.meta.env?.API_URL || process.env.API_URL || 'http://localhost:3000'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [
    adminClient(),
    inferAdditionalFields({
      user: {
        username: { type: 'string', required: true },
        firstName: { type: 'string', required: false },
        lastName: { type: 'string', required: false }
      }
    })
  ]
})

export const { useSession, signIn, signUp, signOut, admin } = authClient
