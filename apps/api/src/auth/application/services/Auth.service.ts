import { Injectable } from '@nestjs/common'

import { LoginDto, RegisterDto } from '~/auth/application/dtos'
import { LoginUseCase, LogoutUseCase, RegisterUseCase } from '~/auth/application/use-cases'
import type { LoginResult, LogoutResult, RegisterResult } from '~/auth/application/use-cases'

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly logoutUseCase: LogoutUseCase
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResult> {
    return this.loginUseCase.execute(loginDto)
  }

  async register(registerDto: RegisterDto): Promise<RegisterResult> {
    return this.registerUseCase.execute(registerDto)
  }

  async logout(token?: string): Promise<LogoutResult> {
    return this.logoutUseCase.execute(token)
  }
}
