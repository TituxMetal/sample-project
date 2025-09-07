import { DomainException } from '~/shared/domain/exceptions'

/**
 * Exception thrown when attempting to register with a username that already exists
 */
export class UsernameAlreadyExistsException extends DomainException {
  constructor(_username: string) {
    super('Username already exists', 'USERNAME_ALREADY_EXISTS')
  }

  static withUsername(username: string): UsernameAlreadyExistsException {
    return new UsernameAlreadyExistsException(username)
  }
}
