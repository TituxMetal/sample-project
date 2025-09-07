import { Injectable } from '@nestjs/common'
import { JwtService as NestJwtService } from '@nestjs/jwt'

export interface JwtPayload {
  sub: string
  email: string
  username: string
  iat?: number
  exp?: number
}

@Injectable()
export class JwtService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  generateToken(payload: JwtPayload): string {
    return this.nestJwtService.sign(payload)
  }

  verifyToken(token: string): JwtPayload {
    return this.nestJwtService.verify(token)
  }

  decodeToken(token: string): JwtPayload | null {
    return this.nestJwtService.decode(token)
  }
}
