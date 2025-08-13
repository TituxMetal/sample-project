import { DomainError } from './DomainError'

// Testing abstract classes through concrete implementations is preferred
class TestDomainError extends DomainError {
  readonly type = 'TEST_ERROR'
}

describe('DomainError', () => {
  it('should set the correct error name', () => {
    const error = new TestDomainError('test message')
    expect(error.name).toBe('TestDomainError')
  })

  it('should preserve the message', () => {
    const message = 'test message'
    const error = new TestDomainError(message)
    expect(error.message).toBe(message)
  })

  it('should be an instance of Error', () => {
    const error = new TestDomainError('test')
    expect(error).toBeInstanceOf(Error)
  })
})
