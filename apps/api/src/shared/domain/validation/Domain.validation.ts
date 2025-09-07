import { VALIDATION } from './Validation.constants'

export class DomainValidation {
  static isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= VALIDATION.EMAIL.MAX_LENGTH
  }

  static isValidUsername(username: string): boolean {
    if (!username || typeof username !== 'string') return false
    const trimmed = username.trim()
    return (
      trimmed.length >= VALIDATION.USERNAME.MIN_LENGTH &&
      trimmed.length <= VALIDATION.USERNAME.MAX_LENGTH &&
      VALIDATION.USERNAME.PATTERN.test(trimmed)
    )
  }

  static isValidPassword(password: string): boolean {
    if (!password || typeof password !== 'string') return false
    return (
      password.length >= VALIDATION.PASSWORD.MIN_LENGTH &&
      password.length <= VALIDATION.PASSWORD.MAX_LENGTH &&
      VALIDATION.PASSWORD.PATTERN.test(password)
    )
  }

  static isValidName(name: string): boolean {
    if (!name || typeof name !== 'string') return false
    const trimmed = name.trim()
    return (
      trimmed.length > 0 &&
      trimmed.length <= VALIDATION.NAME.MAX_LENGTH &&
      VALIDATION.NAME.PATTERN.test(trimmed)
    )
  }
}
