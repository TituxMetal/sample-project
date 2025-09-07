import { Injectable } from '@nestjs/common'

import type { ITokenBlacklistService } from '~/auth/domain/services'

export interface LogoutResult {
  success: boolean
}

@Injectable()
export class LogoutUseCase {
  constructor(private readonly tokenBlacklistService: ITokenBlacklistService) {}

  async execute(token?: string): Promise<LogoutResult> {
    if (token) {
      await this.tokenBlacklistService.blacklistToken(token)
    }

    return { success: true }
  }
}
