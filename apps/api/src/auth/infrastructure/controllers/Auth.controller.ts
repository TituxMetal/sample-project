import { Controller, Post, Body, HttpCode, HttpStatus, Res, UseGuards, Req } from '@nestjs/common'
import { Response, Request } from 'express'

type RequestWithCookies = Request & {
  cookies?: Record<string, string>
}

import { AuthUserMapper } from '~/auth/application/mappers'
import { AuthService } from '~/auth/application/services'
import { JwtAuthGuard } from '~/auth/infrastructure/guards'
import { LoggerService } from '~/shared/infrastructure/services'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService
  ) {}

  @Post('register')
  async register(
    @Body()
    registerData: {
      email: string
      username: string
      password: string
      firstName?: string
      lastName?: string
    }
  ) {
    this.loggerService.info('Registration attempt', {
      email: registerData.email,
      username: registerData.username
    })

    const registerDto = AuthUserMapper.toRegisterDto(registerData)
    const result = await this.authService.register(registerDto)

    this.loggerService.info('Registration successful', {
      userId: result.user.id,
      email: registerData.email
    })

    return result
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginData: { emailOrUsername: string; password: string },
    @Res({ passthrough: true }) response: Response
  ) {
    this.loggerService.info('Login attempt', {
      emailOrUsername: loginData.emailOrUsername
    })

    const loginDto = AuthUserMapper.toLoginDto(loginData)
    const result = await this.authService.login(loginDto)

    response.cookie('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    })

    this.loggerService.info('Login successful', {
      userId: result.user.id,
      email: result.user.email
    })

    return { user: result.user }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() request: RequestWithCookies, @Res({ passthrough: true }) response: Response) {
    const token = request.cookies?.auth_token as string | undefined

    await this.authService.logout(token)

    response.clearCookie('auth_token')

    return { success: true }
  }
}
