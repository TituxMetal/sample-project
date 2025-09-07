import { EmailValueObject } from './Email.vo'

describe('EmailValueObject', () => {
  describe('constructor', () => {
    it('should create a valid email value object', () => {
      const validEmail = 'user@example.com'

      const email = new EmailValueObject(validEmail)

      expect(email).toBeDefined()
      expect(email.value).toBe(validEmail)
    })

    it('should throw error for invalid email format', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user',
        'user @example.com',
        'user@example'
      ]

      invalidEmails.forEach(invalidEmail => {
        expect(() => new EmailValueObject(invalidEmail)).toThrow('Invalid email format')
      })
    })

    it('should throw error for empty email', () => {
      expect(() => new EmailValueObject('')).toThrow('Email is required')
    })

    it('should accept valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@subdomain.example.com',
        'user_name@example-domain.com'
      ]

      validEmails.forEach(validEmail => {
        const email = new EmailValueObject(validEmail)
        expect(email.value).toBe(validEmail)
      })
    })

    it('should throw error for null or undefined', () => {
      expect(() => new EmailValueObject(null as unknown as string)).toThrow('Email is required')
      expect(() => new EmailValueObject(undefined as unknown as string)).toThrow(
        'Email is required'
      )
    })
  })

  describe('equals', () => {
    it('should return true for equal email values', () => {
      const email1 = new EmailValueObject('user@example.com')
      const email2 = new EmailValueObject('user@example.com')

      const result = email1.equals(email2)

      expect(result).toBe(true)
    })

    it('should return false for different email values', () => {
      const email1 = new EmailValueObject('user1@example.com')
      const email2 = new EmailValueObject('user2@example.com')

      const result = email1.equals(email2)

      expect(result).toBe(false)
    })

    it('should be case-insensitive when comparing', () => {
      const email1 = new EmailValueObject('User@Example.com')
      const email2 = new EmailValueObject('user@example.com')

      const result = email1.equals(email2)

      expect(result).toBe(true)
    })
  })

  describe('toString', () => {
    it('should return the email value as string', () => {
      const emailValue = 'user@example.com'
      const email = new EmailValueObject(emailValue)

      const result = email.toString()

      expect(result).toBe(emailValue)
    })
  })

  describe('normalize', () => {
    it('should convert email to lowercase', () => {
      const email = new EmailValueObject('User@Example.COM')

      const normalized = email.normalize()

      expect(normalized).toBe('user@example.com')
    })
  })
})
