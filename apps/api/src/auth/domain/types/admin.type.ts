export interface BetterAuthUser {
  id: string
  email: string
  emailVerified: boolean
  username: string
  firstName: string | null
  lastName: string | null
  role: string
  banned: boolean
  banReason: string | null
  banExpires: Date | null
  createdAt: Date
  updatedAt: Date
}
