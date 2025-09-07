import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from '~/auth/application/services'
import { LoginUseCase, LogoutUseCase, RegisterUseCase } from '~/auth/application/use-cases'
import type { IAuthUserRepository } from '~/auth/domain/repositories'
import { AuthController } from '~/auth/infrastructure/controllers'
import { JwtAuthGuard } from '~/auth/infrastructure/guards'
import { PrismaAuthUserRepository } from '~/auth/infrastructure/repositories'
import { JwtService, PasswordService, TokenService } from '~/auth/infrastructure/services'
import { ConfigModule as NestConfigModule, ConfigService as NestConfigService } from '~/config'
import { PrismaModule } from '~/shared/infrastructure/database'
import { LoggerService } from '~/shared/infrastructure/services'

@Module({
  imports: [
    PrismaModule,
    NestConfigModule,
    JwtModule.registerAsync({
      imports: [NestConfigModule],
      inject: [NestConfigService],
      useFactory: (configService: NestConfigService) => ({
        secret: configService.jwt.secret,
        signOptions: { expiresIn: configService.jwt.expiresIn }
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthUserRepository',
      useClass: PrismaAuthUserRepository
    },
    {
      provide: 'PasswordService',
      useClass: PasswordService
    },
    JwtService,
    {
      provide: 'IdGenerator',
      useFactory: () => ({
        generate: () => `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      })
    },
    {
      provide: 'TokenBlacklistService',
      useFactory: (loggerService: LoggerService) => ({
        blacklistToken: (token: string) => {
          loggerService.warn('Token blacklisted', { token })
          return Promise.resolve()
        }
      }),
      inject: [LoggerService]
    },
    {
      provide: LoginUseCase,
      useFactory: (
        authUserRepository: IAuthUserRepository,
        passwordService: PasswordService,
        jwtService: JwtService
      ) => new LoginUseCase(authUserRepository, passwordService, jwtService),
      inject: ['IAuthUserRepository', 'PasswordService', JwtService]
    },
    {
      provide: RegisterUseCase,
      useFactory: (
        authUserRepository: IAuthUserRepository,
        passwordService: PasswordService,
        idGenerator: { generate(): string }
      ) => new RegisterUseCase(authUserRepository, passwordService, idGenerator),
      inject: ['IAuthUserRepository', 'PasswordService', 'IdGenerator']
    },
    {
      provide: LogoutUseCase,
      useFactory: (tokenBlacklistService: { blacklistToken(token: string): Promise<void> }) =>
        new LogoutUseCase(tokenBlacklistService),
      inject: ['TokenBlacklistService']
    },
    TokenService,
    AuthService,
    JwtAuthGuard
  ],
  exports: [AuthService, JwtAuthGuard, JwtService, TokenService]
})
export class AuthModule {}
