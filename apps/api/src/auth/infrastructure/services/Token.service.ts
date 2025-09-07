import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { IJwtPayload } from '~/auth/domain/interfaces'
import { JwtPayloadValueObject } from '~/auth/domain/value-objects'
import { ConfigService } from '~/config/config.service'
import { PrismaProvider } from '~/shared/infrastructure/database'

@Injectable()
export class TokenService {
  private readonly jwtSecret: string
  private readonly jwtExpiration: string

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaProvider
  ) {
    this.jwtSecret = this.configService.jwt.secret
    this.jwtExpiration = this.configService.jwt.expiresIn
  }

  async generateToken(jwtPayload: IJwtPayload): Promise<string> {
    const payloadVO = JwtPayloadValueObject.fromPlainObject(jwtPayload)

    return this.jwtService.signAsync(payloadVO.toPlainObject(), {
      secret: this.jwtSecret,
      expiresIn: this.jwtExpiration
    })
  }

  async verifyToken(token: string): Promise<IJwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<IJwtPayload>(token, {
        secret: this.jwtSecret
      })

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub }
      })

      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      return payload
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
