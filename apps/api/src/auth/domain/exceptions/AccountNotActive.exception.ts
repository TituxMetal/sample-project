import { DomainException } from '~/shared/domain/exceptions'

/**
 * Exception thrown when attempting to login to an inactive account
 */
export class AccountNotActiveException extends DomainException {
  constructor() {
    super('Account is not active', 'ACCOUNT_NOT_ACTIVE')
  }

  static create(): AccountNotActiveException {
    return new AccountNotActiveException()
  }
}
