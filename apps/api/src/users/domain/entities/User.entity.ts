import type {
  NameValueObject,
  UserIdValueObject,
  UsernameValueObject
} from '~/users/domain/value-objects'

export class UserEntity {
  constructor(
    public readonly id: UserIdValueObject,
    public readonly email: string,
    public username: UsernameValueObject,
    public firstName: NameValueObject | undefined,
    public lastName: NameValueObject | undefined,
    public emailVerified: boolean,
    public banned: boolean,
    public banReason: string | null,
    public banExpires: Date | null,
    public role: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  updateProfile(
    username?: UsernameValueObject,
    firstName?: NameValueObject,
    lastName?: NameValueObject
  ): void {
    if (username) {
      this.username = username
    }
    if (firstName !== undefined) {
      this.firstName = firstName
    }
    if (lastName !== undefined) {
      this.lastName = lastName
    }
  }

  ban(reason?: string, expires?: Date): void {
    this.banned = true
    this.banReason = reason ?? null
    this.banExpires = expires ?? null
  }

  unban(): void {
    this.banned = false
    this.banReason = null
    this.banExpires = null
  }

  verify(): void {
    this.emailVerified = true
  }

  isActive(): boolean {
    if (!this.emailVerified) return false
    if (!this.banned) return true
    if (this.banExpires && this.banExpires < new Date()) return true

    return false
  }
}
