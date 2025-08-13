import { DomainError } from './DomainError'

export class UserNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`User with identifier "${identifier}" not found`)
  }
}
