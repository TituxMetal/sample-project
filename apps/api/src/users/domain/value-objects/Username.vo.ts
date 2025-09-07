export class UsernameValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('Username cannot be empty')
    }

    const trimmedValue = value.trim()

    if (trimmedValue.length < 3 || trimmedValue.length > 30) {
      throw new Error('Username must be between 3 and 30 characters')
    }

    const validUsernameRegex = /^[a-zA-Z0-9_]+$/
    if (!validUsernameRegex.test(trimmedValue)) {
      throw new Error('Username can only contain letters, numbers, and underscores')
    }

    this._value = trimmedValue
  }

  get value(): string {
    return this._value
  }

  equals(other: UsernameValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }
}
