import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'

import {
  AppConfig,
  AuthConfig,
  Config,
  CookieOptions,
  JwtConfig
} from './interfaces/config.interface'

@Injectable()
export class ConfigService extends NestConfigService<Config, true> {
  get auth(): AuthConfig {
    return {
      cookieName: this.get('AUTH_COOKIE_NAME', 'auth_token'),
      sessionTtl: this.get('SESSION_TTL', 24 * 60 * 60 * 1000)
    }
  }

  get jwt(): JwtConfig {
    return { secret: this.get('JWT_SECRET'), expiresIn: this.get('JWT_EXPIRES_IN', '1d') }
  }

  get app(): AppConfig {
    return { isProduction: this.get('NODE_ENV') === 'production', port: this.get('PORT', 3000) }
  }

  getCookieOptions(): CookieOptions {
    return {
      name: this.auth.cookieName,
      httpOnly: true,
      secure: this.app.isProduction, // Secure in production
      sameSite: this.app.isProduction ? 'none' : 'lax', // Cross-origin in prod
      maxAge: this.auth.sessionTtl,
      path: '/'
    }
  }

  extractTokenFromCookies(cookies: Record<string, string>): string | null {
    return cookies?.[this.auth.cookieName] || null
  }
}
