import { DatabaseError } from './DatabaseError'

describe('DatabaseError', () => {
  it('should extend Error', () => {
    const error = new DatabaseError('Database connection failed')
    expect(error).toBeInstanceOf(Error)
  })

  it('should set correct error name', () => {
    const error = new DatabaseError('Database connection failed')
    expect(error.name).toBe('DatabaseError')
  })

  it('should preserve error message', () => {
    const message = 'Database connection failed'
    const error = new DatabaseError(message)
    expect(error.message).toBe(message)
  })

  it('should store original error when provided', () => {
    const originalError = new Error('Connection timeout')
    const error = new DatabaseError('Database connection failed', originalError)
    expect(error.originalError).toBe(originalError)
  })
})
