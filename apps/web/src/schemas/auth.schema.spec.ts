import { describe, expect, it } from 'bun:test'

import { loginSchema, signupSchema } from './auth.schema'

describe('loginSchema', () => {
  it('should validate a valid login request', () => {
    const validLogin = {
      identifier: 'testuser',
      password: 'password123'
    }

    const result = loginSchema.safeParse(validLogin)

    expect(result.success).toBe(true)
  })

  it('should reject empty identifier', () => {
    const invalidLogin = {
      identifier: '',
      password: 'password123'
    }

    const result = loginSchema.safeParse(invalidLogin)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Identifier is required')
    }
  })

  it('should reject short identifier', () => {
    const invalidLogin = {
      identifier: 'ab',
      password: 'password123'
    }

    const result = loginSchema.safeParse(invalidLogin)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Identifier must be at least 3 characters long')
    }
  })

  it('should reject empty password', () => {
    const invalidLogin = {
      identifier: 'testuser',
      password: ''
    }

    const result = loginSchema.safeParse(invalidLogin)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password is required')
    }
  })

  it('should reject short password', () => {
    const invalidLogin = {
      identifier: 'testuser',
      password: 'pass'
    }

    const result = loginSchema.safeParse(invalidLogin)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 8 characters')
    }
  })
})

describe('signupSchema', () => {
  it('should validate a valid signup request', () => {
    const validSignup = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    }

    const result = signupSchema.safeParse(validSignup)

    expect(result.success).toBe(true)
  })

  it('should reject empty username', () => {
    const invalidSignup = {
      username: '',
      email: 'test@example.com',
      password: 'password123'
    }

    const result = signupSchema.safeParse(invalidSignup)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Username is required')
    }
  })

  it('should reject short username', () => {
    const invalidSignup = {
      username: 'ab',
      email: 'test@example.com',
      password: 'password123'
    }

    const result = signupSchema.safeParse(invalidSignup)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Username must be at least 3 characters long')
    }
  })

  it('should reject too long username', () => {
    const invalidSignup = {
      username: 'a'.repeat(51),
      email: 'test@example.com',
      password: 'password123'
    }

    const result = signupSchema.safeParse(invalidSignup)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Username must not exceed 50 characters')
    }
  })

  it('should reject invalid email format', () => {
    const invalidSignup = {
      username: 'testuser',
      email: 'not-an-email',
      password: 'password123'
    }

    const result = signupSchema.safeParse(invalidSignup)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address')
    }
  })

  it('should reject empty password', () => {
    const invalidSignup = {
      username: 'testuser',
      email: 'test@example.com',
      password: ''
    }

    const result = signupSchema.safeParse(invalidSignup)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password is required')
    }
  })

  it('should reject short password', () => {
    const invalidSignup = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'pass'
    }

    const result = signupSchema.safeParse(invalidSignup)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 8 characters')
    }
  })
})
