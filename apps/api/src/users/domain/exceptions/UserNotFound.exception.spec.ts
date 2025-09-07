import { UserNotFoundException } from './UserNotFound.exception'

describe('UserNotFoundException', () => {
  it('should create exception with default message', () => {
    const exception = new UserNotFoundException()

    expect(exception).toBeInstanceOf(UserNotFoundException)
    expect(exception).toBeInstanceOf(Error)
    expect(exception.name).toBe('UserNotFoundException')
    expect(exception.message).toBe('User not found')
  })

  it('should create exception with custom identifier', () => {
    const identifier = '123'
    const exception = new UserNotFoundException(identifier)

    expect(exception).toBeInstanceOf(UserNotFoundException)
    expect(exception).toBeInstanceOf(Error)
    expect(exception.name).toBe('UserNotFoundException')
    expect(exception.message).toBe('User not found: 123')
  })

  it('should have proper stack trace', () => {
    const exception = new UserNotFoundException()

    expect(exception.stack).toBeDefined()
    expect(exception.stack).toContain('UserNotFoundException')
  })
})
