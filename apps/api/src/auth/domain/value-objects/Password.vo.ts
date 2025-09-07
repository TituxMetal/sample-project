export class PasswordValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!value) {
      throw new Error('Password is required')
    }

    if (value.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }

    this._value = value
  }

  get value(): string {
    return this._value
  }

  equals(other: PasswordValueObject): boolean {
    return this._value === other._value
  }

  toString(): string {
    return '********'
  }

  isStrong(): boolean {
    const hasUpperCase = /[A-Z]/.test(this._value)
    const hasLowerCase = /[a-z]/.test(this._value)
    const hasNumber = /[0-9]/.test(this._value)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this._value)

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
  }
}
