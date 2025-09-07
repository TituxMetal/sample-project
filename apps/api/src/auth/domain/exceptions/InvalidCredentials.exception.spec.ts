import { InvalidCredentialsException } from './InvalidCredentials.exception'

describe('InvalidCredentialsException', () => {
  it('should create exception with default message', () => {
    const exception = new InvalidCredentialsException()

    expect(exception).toBeInstanceOf(Error)
    expect(exception).toBeInstanceOf(InvalidCredentialsException)
    expect(exception.message).toBe('Invalid credentials provided')
    expect(exception.name).toBe('InvalidCredentialsException')
  })

  it('should create exception with custom message', () => {
    const customMessage = 'Custom error message'
    const exception = new InvalidCredentialsException(customMessage)

    expect(exception).toBeInstanceOf(Error)
    expect(exception).toBeInstanceOf(InvalidCredentialsException)
    expect(exception.message).toBe(customMessage)
    expect(exception.name).toBe('InvalidCredentialsException')
  })

  it('should be throwable and catchable', () => {
    expect(() => {
      throw new InvalidCredentialsException()
    }).toThrow(InvalidCredentialsException)

    expect(() => {
      throw new InvalidCredentialsException('User not found')
    }).toThrow('User not found')
  })

  it('should maintain error properties', () => {
    const exception = new InvalidCredentialsException('Test message')

    expect(exception.stack).toBeDefined()
    expect(exception.name).toBe('InvalidCredentialsException')
    expect(exception.message).toBe('Test message')
  })
})
