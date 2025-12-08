import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_API_URL || 'http://localhost:3000',
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
