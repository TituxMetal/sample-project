export class NameValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('Name cannot be empty')
    }

    const trimmedValue = value.trim()

    if (trimmedValue.length < 2 || trimmedValue.length > 50) {
      throw new Error('Name must be between 2 and 50 characters')
    }

    const validNameRegex = /^[a-zA-Z\s'-]+$/
    if (!validNameRegex.test(trimmedValue)) {
      throw new Error('Name can only contain letters, spaces, hyphens, and apostrophes')
    }

    this._value = trimmedValue
  }

  get value(): string {
    return this._value
  }

  equals(other: NameValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }
}
