import { describe, expect, it } from 'bun:test'

import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema
} from './auth.schema'

describe('loginSchema', () => {
  it('should validate a valid login request', () => {
    const validLogin = {
      email: 'test@example.com',
      password: 'password123'
    }

    const result = loginSchema.safeParse(validLogin)

    expect(result.success).toBe(true)
  })

  it('should reject invalid email format', () => {
    const invalidLogin = {
      email: 'not-an-email',
      password: 'password123'
    }

    const result = loginSchema.safeParse(invalidLogin)

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address')
    }
  })

  it('should reject empty password', () => {
    const invalidLogin = {
      email: 'test@example.com',
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
      email: 'test@example.com',
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
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    }

    const result = signupSchema.safeParse(validSignup)

    expect(result.success).toBe(true)
  })

  it('should reject empty username', () => {
    const invalidSignup = {
      name: 'Test User',
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
      name: 'Test User',
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
      name: 'Test User',
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
      name: 'Test User',
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
      name: 'Test User',
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
      name: 'Test User',
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

describe('forgotPasswordSchema', () => {
  it('should validate a valid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'test@example.com' })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'not-an-email' })
    expect(result.success).toBe(false)
  })
})

describe('resetPasswordSchema', () => {
  it('should validate matching passwords', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'password123',
      confirmPassword: 'password123'
    })
    expect(result.success).toBe(true)
  })

  it('should reject non-matching passwords', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'password123',
      confirmPassword: 'different123'
    })
    expect(result.success).toBe(false)
  })

  it('should reject short password', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'short',
      confirmPassword: 'short'
    })
    expect(result.success).toBe(false)
  })
})

describe('changePasswordSchema', () => {
  it('should validate valid change password request', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'oldpass123',
      newPassword: 'newpass123',
      confirmPassword: 'newpass123'
    })
    expect(result.success).toBe(true)
  })

  it('should reject when new passwords do not match', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'oldpass123',
      newPassword: 'newpass123',
      confirmPassword: 'different123'
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty current password', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: '',
      newPassword: 'newpass123',
      confirmPassword: 'newpass123'
    })
    expect(result.success).toBe(false)
  })
})
