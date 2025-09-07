export class JwtPayloadValueObject {
  constructor(
    private readonly sub: string,
    private readonly identifier: string,
    private readonly iat?: number,
    private readonly exp?: number
  ) {
    this.validate()
  }

  private validate(): void {
    if (!this.sub || typeof this.sub !== 'string' || this.sub.trim().length === 0) {
      throw new Error('JWT payload sub (subject) must be a non-empty string')
    }

    if (
      !this.identifier ||
      typeof this.identifier !== 'string' ||
      this.identifier.trim().length === 0
    ) {
      throw new Error('JWT payload identifier must be a non-empty string')
    }

    if (this.iat !== undefined && (typeof this.iat !== 'number' || this.iat < 0)) {
      throw new Error('JWT payload iat (issued at) must be a positive number')
    }

    if (this.exp !== undefined && (typeof this.exp !== 'number' || this.exp < 0)) {
      throw new Error('JWT payload exp (expiration) must be a positive number')
    }

    if (this.iat !== undefined && this.exp !== undefined && this.exp <= this.iat) {
      throw new Error('JWT payload exp (expiration) must be greater than iat (issued at)')
    }
  }

  getSub(): string {
    return this.sub
  }

  getIdentifier(): string {
    return this.identifier
  }

  getIat(): number | undefined {
    return this.iat
  }

  getExp(): number | undefined {
    return this.exp
  }

  toPlainObject() {
    return {
      sub: this.sub,
      identifier: this.identifier,
      ...(this.iat !== undefined && { iat: this.iat }),
      ...(this.exp !== undefined && { exp: this.exp })
    }
  }

  static fromPlainObject(payload: {
    sub: string
    identifier: string
    iat?: number
    exp?: number
  }): JwtPayloadValueObject {
    return new JwtPayloadValueObject(payload.sub, payload.identifier, payload.iat, payload.exp)
  }
}
