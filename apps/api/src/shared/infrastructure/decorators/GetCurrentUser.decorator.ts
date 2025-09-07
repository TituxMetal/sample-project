import { createParamDecorator } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

export const GetCurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request: Request & { user: unknown } = ctx.switchToHttp().getRequest()
  return request.user
})
