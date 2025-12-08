import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth'

import { EmailService } from '~/auth/infrastructure/services'
import { ConfigService } from '~/config'
import { PrismaModule, PrismaProvider } from '~/shared/infrastructure/database'
import { LoggerService } from '~/shared/infrastructure/services'

import { createBetterAuthConfig } from './infrastructure/config'
import { AuthHooks } from './infrastructure/hooks'

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    BetterAuthModule.forRootAsync({
      imports: [PrismaModule, ConfigModule],
      inject: [PrismaProvider, EmailService, ConfigService],
      useFactory: (prisma, emailService, configService) => ({
        auth: createBetterAuthConfig(prisma, emailService, configService)
      })
    })
  ],
  providers: [EmailService, AuthHooks, LoggerService],
  exports: [BetterAuthModule]
})
export class AuthModule {}
