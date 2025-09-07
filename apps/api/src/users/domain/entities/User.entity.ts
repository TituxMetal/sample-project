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
    public confirmed: boolean,
    public blocked: boolean,
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

  block(): void {
    this.blocked = true
  }

  unblock(): void {
    this.blocked = false
  }

  confirm(): void {
    this.confirmed = true
  }

  isActive(): boolean {
    return this.confirmed && !this.blocked
  }
}
