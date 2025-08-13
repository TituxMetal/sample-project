import { DomainError } from './DomainError'

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid credentials provided')
  }
}
