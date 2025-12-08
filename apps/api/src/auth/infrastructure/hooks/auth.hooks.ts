import { Injectable } from '@nestjs/common'
import type { AuthHookContext } from '@thallesp/nestjs-better-auth'
import { AfterHook, BeforeHook, Hook } from '@thallesp/nestjs-better-auth'

import { LoggerService } from '~/shared/infrastructure/services'

@Hook()
@Injectable()
export class AuthHooks {
  constructor(private readonly logger: LoggerService) {}

  @BeforeHook('/sign-up/email')
  async beforeSignUp(ctx: AuthHookContext) {
    this.logger.info('Sign-up attempt', {
      email: ctx.body?.email,
      username: ctx.body?.username
    })

    // Validate username format
    const username = ctx.body?.username
    if (username && !/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      throw new Error('Username must be 3-30 alphanumeric characters or underscores')
    }
  }

  @AfterHook('/sign-up/email')
  async afterSignUp(ctx: AuthHookContext) {
    if (ctx.context.newSession) {
      this.logger.info('Sign-up successful', {
        userId: ctx.context.newSession.user.id,
        email: ctx.context.newSession.user.email
      })
    }
  }

  @BeforeHook('/sign-in/email')
  async beforeSignIn(ctx: AuthHookContext) {
    this.logger.info('Sign-in attempt', { email: ctx.body?.email })
  }

  @AfterHook('/sign-in/email')
  async afterSignIn(ctx: AuthHookContext) {
    if (ctx.context.newSession) {
      this.logger.info('Sign-in successful', {
        userId: ctx.context.newSession.user.id
      })
    }
  }

  @BeforeHook('/sign-out')
  async beforeSignOut(_ctx: AuthHookContext) {
    this.logger.info('Sign-out attempt')
  }
}
