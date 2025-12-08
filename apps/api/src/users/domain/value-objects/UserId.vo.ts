import { randomUUID } from 'crypto'

export class UserIdValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('User ID cannot be empty')
    }

    const isValidUserIdFormat = this.isValidUserIdFormat(value)
    if (!isValidUserIdFormat) {
      throw new Error('Invalid user ID format')
    }

    this._value = value
  }

  get value(): string {
    return this._value
  }

  equals(other: UserIdValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }

  static generate(): UserIdValueObject {
    return new UserIdValueObject(randomUUID())
  }

  private isValidUserIdFormat(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    // Better Auth generates 32-character alphanumeric IDs
    const betterAuthIdRegex = /^[a-zA-Z0-9]{32}$/
    return uuidRegex.test(value) || betterAuthIdRegex.test(value)
  }
}
