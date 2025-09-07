export class UserNotFoundException extends Error {
  constructor(identifier?: string) {
    super(identifier ? `User not found: ${identifier}` : 'User not found')
    this.name = 'UserNotFoundException'
  }
}
