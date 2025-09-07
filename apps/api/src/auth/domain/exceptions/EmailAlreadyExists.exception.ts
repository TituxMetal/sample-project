import { DomainException } from '~/shared/domain/exceptions'

/**
 * Exception thrown when attempting to register with an email that already exists
 */
export class EmailAlreadyExistsException extends DomainException {
  constructor(_email: string) {
    super('Email already exists', 'EMAIL_ALREADY_EXISTS')

    // Don't include the actual email in the message for security
    // The email can be logged separately if needed
  }

  static withEmail(email: string): EmailAlreadyExistsException {
    return new EmailAlreadyExistsException(email)
  }
}
