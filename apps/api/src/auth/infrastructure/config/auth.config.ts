import type { BetterAuthOptions } from 'better-auth'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'

import type { PrismaClient } from '@generated'

import type { EmailService } from '~/auth/infrastructure/services'
import type { ConfigService } from '~/config'

export const createBetterAuthConfig = (
  prisma: PrismaClient,
  emailService: EmailService,
  configService: ConfigService
) => {
  const config = {
    secret: configService.betterAuth.secret,
    baseURL: configService.betterAuth.frontendUrl,
    trustedOrigins: [configService.betterAuth.frontendUrl],
    database: prismaAdapter(prisma, { provider: 'sqlite' }),
    emailVerification: {
      sendVerificationEmail: async ({ user, url, token }, _request) => {
        await emailService.sendVerificationEmail(user.email, url)
      }
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url, token }, _request) => {
        await emailService.sendPasswordResetEmail(user.email, url)
      }
    },
    user: {
      additionalFields: {
        username: { type: 'string', required: true, input: true },
        firstName: { type: 'string', required: false, input: true },
        lastName: { type: 'string', required: false, input: true }
      },
      deleteUser: {
        enabled: true
      }
    },
    session: {
      expiresIn: configService.session.expiresIn,
      updateAge: configService.session.updateAge
    },
    plugins: [admin({ defaultRole: 'user', adminRole: 'admin' })],
    hooks: {}
  } satisfies BetterAuthOptions

  return betterAuth(config)
}

export type AuthInstance = ReturnType<typeof createBetterAuthConfig>
