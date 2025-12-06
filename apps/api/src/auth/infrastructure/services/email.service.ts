import { Injectable } from '@nestjs/common'

import { LoggerService } from '~/shared/infrastructure/services'

@Injectable()
export class EmailService {
  constructor(private readonly logger: LoggerService) {}

  async sendVerificationEmail(email: string, url: string): Promise<void> {
    this.logger.info('Verification email', { email, url })
    console.log(`[EMAIL] Verify: ${email} -> ${url}`)
  }

  async sendPasswordResetEmail(email: string, url: string): Promise<void> {
    this.logger.info('Password reset email', { email, url })
    console.log(`[EMAIL] Reset: ${email} -> ${url}`)
  }
}
