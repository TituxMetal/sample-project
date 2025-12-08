import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_API_URL || 'http://localhost:3000',
  plugins: [adminClient()]
})

export const { useSession, signIn, signUp, signOut, admin } = authClient
