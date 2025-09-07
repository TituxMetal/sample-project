export class InvalidUserException extends Error {
  constructor(message?: string) {
    super(message ? `Invalid user: ${message}` : 'Invalid user data')
    this.name = 'InvalidUserException'
  }
}
