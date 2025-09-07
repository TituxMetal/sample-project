import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import type { Request } from 'express'

import { JwtService } from '~/auth/infrastructure/services'

type RequestWithCookies = Request & {
  cookies?: Record<string, string>
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithCookies = context.switchToHttp().getRequest()
    const token = this.extractTokenFromRequest(request)

    if (!token) {
      throw new UnauthorizedException('No token provided')
    }

    try {
      const payload = this.jwtService.verifyToken(token)
      ;(request as RequestWithCookies & { user: unknown }).user = payload
      return true
    } catch {
      throw new UnauthorizedException('Invalid token')
    }
  }

  private extractTokenFromRequest(request: RequestWithCookies): string | undefined {
    const cookieToken = request.cookies?.auth_token as string | undefined
    const headerToken: string | undefined = this.extractFromAuthHeader(request)
    return cookieToken || headerToken
  }

  private extractFromAuthHeader(request: RequestWithCookies): string | undefined {
    const authHeader = request.headers?.authorization
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    return undefined
  }
}
