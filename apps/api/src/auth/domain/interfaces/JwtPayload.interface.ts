export interface IJwtPayload {
  sub: string
  identifier: string
  iat?: number
  exp?: number
}
