import type { BetterAuthUser } from './admin.type'

export interface AuthSession {
  session: {
    id: string
    userId: string
    expiresAt: Date
  }
  user: BetterAuthUser
}
