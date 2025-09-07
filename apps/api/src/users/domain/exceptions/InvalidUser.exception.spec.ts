import { InvalidUserException } from './InvalidUser.exception'

describe('InvalidUserException', () => {
  it('should create exception with default message', () => {
    const exception = new InvalidUserException()

    expect(exception).toBeInstanceOf(InvalidUserException)
    expect(exception).toBeInstanceOf(Error)
    expect(exception.name).toBe('InvalidUserException')
    expect(exception.message).toBe('Invalid user data')
  })

  it('should create exception with custom message', () => {
    const customMessage = 'Invalid username format'
    const exception = new InvalidUserException(customMessage)

    expect(exception).toBeInstanceOf(InvalidUserException)
    expect(exception).toBeInstanceOf(Error)
    expect(exception.name).toBe('InvalidUserException')
    expect(exception.message).toBe('Invalid user: Invalid username format')
  })

  it('should handle validation error scenarios', () => {
    const validationErrors = [
      'Username must be at least 3 characters',
      'Email format is invalid',
      'First name contains invalid characters'
    ]

    validationErrors.forEach(errorMessage => {
      const exception = new InvalidUserException(errorMessage)
      expect(exception.message).toBe(`Invalid user: ${errorMessage}`)
    })
  })

  it('should have proper stack trace', () => {
    const exception = new InvalidUserException()

    expect(exception.stack).toBeDefined()
    expect(exception.stack).toContain('InvalidUserException')
  })
})
