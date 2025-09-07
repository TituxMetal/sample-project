export class EmailValueObject {
  private readonly _value: string

  constructor(value: string) {
    if (!value) {
      throw new Error('Email is required')
    }

    if (!this.isValidEmail(value)) {
      throw new Error('Invalid email format')
    }

    this._value = value
  }

  get value(): string {
    return this._value
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  equals(other: EmailValueObject): boolean {
    return this._value.toLowerCase() === other._value.toLowerCase()
  }

  toString(): string {
    return this._value
  }

  normalize(): string {
    return this._value.toLowerCase()
  }
}
