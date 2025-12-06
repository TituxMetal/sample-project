import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'

import { AppConfig, BetterAuthConfig, Config, SessionConfig } from './interfaces/config.interface'

@Injectable()
export class ConfigService extends NestConfigService<Config, true> {
  get betterAuth(): BetterAuthConfig {
    return {
      baseURL: this.get('BETTER_AUTH_URL'),
      secret: this.get('BETTER_AUTH_SECRET'),
      frontendUrl: this.get('FRONTEND_URL')
    }
  }

  get session(): SessionConfig {
    return {
      expiresIn: this.get('EXPIRES_IN', 604800),
      updateAge: this.get('UPDATE_AGE', 86400)
    }
  }

  get app(): AppConfig {
    return {
      isProduction: this.get('NODE_ENV') === 'production',
      port: this.get('PORT', 3000)
    }
  }
}
