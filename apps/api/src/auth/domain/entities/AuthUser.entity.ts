import type { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'

export class AuthUserEntity {
  constructor(
    public readonly id: string,
    public readonly email: EmailValueObject,
    public readonly username: string,
    public password: PasswordValueObject,
    public confirmed: boolean,
    public blocked: boolean,
    public readonly createdAt: Date
  ) {}

  isActive(): boolean {
    return this.confirmed && !this.blocked
  }

  confirmAccount(): void {
    this.confirmed = true
  }

  blockAccount(): void {
    this.blocked = true
  }

  unblockAccount(): void {
    this.blocked = false
  }

  updatePassword(newPassword: PasswordValueObject): void {
    this.password = newPassword
  }
}
