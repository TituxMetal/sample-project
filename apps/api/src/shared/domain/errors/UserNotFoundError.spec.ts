import { DomainError } from './DomainError'
import { UserNotFoundError } from './UserNotFoundError'

describe('UserNotFoundError', () => {
  it('should extend DomainError', () => {
    const error = new UserNotFoundError('user123')
    expect(error).toBeInstanceOf(DomainError)
    expect(error).toBeInstanceOf(Error)
  })

  it('should set correct error name', () => {
    const error = new UserNotFoundError('user123')
    expect(error.name).toBe('UserNotFoundError')
  })

  it('should format message with identifier', () => {
    const identifier = 'user123'
    const error = new UserNotFoundError(identifier)
    expect(error.message).toBe(`User with identifier "${identifier}" not found`)
  })
})
