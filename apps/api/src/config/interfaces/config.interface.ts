export interface AppConfig {
  isProduction: boolean
  port: number
}

export interface BetterAuthConfig {
  baseURL: string
  secret: string
  frontendUrl: string
}

export interface Config {
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  FRONTEND_URL: string
  EXPIRES_IN: number
  UPDATE_AGE: number
  NODE_ENV: string
  PORT: number
}

export interface SessionConfig {
  expiresIn: number
  updateAge: number
}
