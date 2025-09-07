export interface AuthenticatedUser {
  sub: string
  email: string
  username: string
  iat?: number
  exp?: number
}
