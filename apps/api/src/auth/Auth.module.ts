import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth'

import { EmailService } from '~/auth/infrastructure/services'
import { ConfigModule, ConfigService } from '~/config'
import { PrismaModule, PrismaProvider } from '~/shared/infrastructure/database'
import { LoggerService } from '~/shared/infrastructure/services'
import { SharedModule } from '~/shared/Shared.module'

import { createBetterAuthConfig } from './infrastructure/config'
import { AuthHooks } from './infrastructure/hooks'

@Module({
  imports: [
    PrismaModule,
    NestConfigModule,
    SharedModule,
    BetterAuthModule.forRootAsync({
      imports: [PrismaModule, ConfigModule],
      inject: [PrismaProvider, ConfigService],
      useFactory: (prisma, configService) => {
        const emailService = new EmailService(new LoggerService('EmailService'))

        return {
          auth: createBetterAuthConfig(prisma, emailService, configService),
          // Fix for Express 5 routing incompatibility with nestjs-better-auth
          // See: https://github.com/ThallesP/nestjs-better-auth/issues/85
          middleware: (req, _res, next) => {
            req.url = req.originalUrl
            req.baseUrl = ''
            next()
          }
        }
      }
    })
  ],
  providers: [EmailService, AuthHooks],
  exports: [BetterAuthModule]
})
export class AuthModule {}
