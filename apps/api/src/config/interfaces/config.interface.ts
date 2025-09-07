export interface AuthConfig {
  cookieName: string
  sessionTtl: number
}

export interface JwtConfig {
  secret: string
  expiresIn: string
}

export interface AppConfig {
  isProduction: boolean
  port: number
}

export interface Config {
  AUTH_COOKIE_NAME: string
  SESSION_TTL: number
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  NODE_ENV: string
  PORT: number
}

export interface CookieOptions {
  name: string
  httpOnly: boolean
  secure: boolean
  sameSite: 'lax' | 'strict' | 'none'
  maxAge: number
  path: string
}
