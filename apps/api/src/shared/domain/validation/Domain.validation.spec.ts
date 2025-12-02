import { describe, expect, it } from 'bun:test'

import { DomainValidation } from './Domain.validation'

describe('DomainValidation', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(DomainValidation.isValidEmail('test@example.com')).toBe(true)
      expect(DomainValidation.isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(DomainValidation.isValidEmail('valid+email@test.org')).toBe(true)
    })

    it('should return false for invalid emails', () => {
      expect(DomainValidation.isValidEmail('')).toBe(false)
      expect(DomainValidation.isValidEmail('invalid-email')).toBe(false)
      expect(DomainValidation.isValidEmail('no@domain')).toBe(false)
      expect(DomainValidation.isValidEmail('@domain.com')).toBe(false)
      expect(DomainValidation.isValidEmail('test@')).toBe(false)
    })

    it('should return false for non-string values', () => {
      expect(DomainValidation.isValidEmail(null as unknown as string)).toBe(false)
      expect(DomainValidation.isValidEmail(undefined as unknown as string)).toBe(false)
      expect(DomainValidation.isValidEmail(123 as unknown as string)).toBe(false)
    })
  })

  describe('isValidUsername', () => {
    it('should return true for valid usernames', () => {
      expect(DomainValidation.isValidUsername('testuser')).toBe(true)
      expect(DomainValidation.isValidUsername('user123')).toBe(true)
      expect(DomainValidation.isValidUsername('test_user')).toBe(true)
      expect(DomainValidation.isValidUsername('ABC123')).toBe(true)
    })

    it('should return false for invalid usernames', () => {
      expect(DomainValidation.isValidUsername('')).toBe(false)
      expect(DomainValidation.isValidUsername('ab')).toBe(false) // too short
      expect(DomainValidation.isValidUsername('a'.repeat(31))).toBe(false) // too long
      expect(DomainValidation.isValidUsername('test-user')).toBe(false) // contains dash
      expect(DomainValidation.isValidUsername('test user')).toBe(false) // contains space
      expect(DomainValidation.isValidUsername('test@user')).toBe(false) // contains @
    })

    it('should return false for non-string values', () => {
      expect(DomainValidation.isValidUsername(null as unknown as string)).toBe(false)
      expect(DomainValidation.isValidUsername(undefined as unknown as string)).toBe(false)
      expect(DomainValidation.isValidUsername(123 as unknown as string)).toBe(false)
    })
  })

  describe('isValidPassword', () => {
    it('should return true for valid passwords', () => {
      expect(DomainValidation.isValidPassword('Password123!')).toBe(true)
      expect(DomainValidation.isValidPassword('StrongP@ss1')).toBe(true)
      expect(DomainValidation.isValidPassword('MySecure123$')).toBe(true)
    })

    it('should return false for invalid passwords', () => {
      expect(DomainValidation.isValidPassword('')).toBe(false)
      expect(DomainValidation.isValidPassword('short1!')).toBe(false) // too short
      expect(DomainValidation.isValidPassword('password123!')).toBe(false) // no uppercase
      expect(DomainValidation.isValidPassword('PASSWORD123!')).toBe(false) // no lowercase
      expect(DomainValidation.isValidPassword('Password!')).toBe(false) // no number
      expect(DomainValidation.isValidPassword('Password123')).toBe(false) // no special char
    })

    it('should return false for non-string values', () => {
      expect(DomainValidation.isValidPassword(null as unknown as string)).toBe(false)
      expect(DomainValidation.isValidPassword(undefined as unknown as string)).toBe(false)
      expect(DomainValidation.isValidPassword(123 as unknown as string)).toBe(false)
    })
  })

  describe('isValidName', () => {
    it('should return true for valid names', () => {
      expect(DomainValidation.isValidName('John')).toBe(true)
      expect(DomainValidation.isValidName('Mary Jane')).toBe(true)
      expect(DomainValidation.isValidName('Jean-Pierre')).toBe(true)
      expect(DomainValidation.isValidName("O'Connor")).toBe(false) // apostrophe not allowed by current pattern
    })

    it('should return false for invalid names', () => {
      expect(DomainValidation.isValidName('')).toBe(false)
      expect(DomainValidation.isValidName('  ')).toBe(false) // only spaces
      expect(DomainValidation.isValidName('John123')).toBe(false) // contains numbers
      expect(DomainValidation.isValidName('a'.repeat(51))).toBe(false) // too long
    })

    it('should return false for non-string values', () => {
      expect(DomainValidation.isValidName(null as unknown as string)).toBe(false)
      expect(DomainValidation.isValidName(undefined as unknown as string)).toBe(false)
      expect(DomainValidation.isValidName(123 as unknown as string)).toBe(false)
    })
  })
})
