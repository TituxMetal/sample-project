import { PasswordValueObject } from './Password.vo'

describe('PasswordValueObject', () => {
  describe('constructor', () => {
    it('should create a valid password value object', () => {
      const validPassword = 'ValidPassword123!'

      const password = new PasswordValueObject(validPassword)

      expect(password).toBeDefined()
      expect(password.value).toBe(validPassword)
    })

    it('should throw error for password less than 8 characters', () => {
      const shortPassword = 'Pass1!'

      expect(() => new PasswordValueObject(shortPassword)).toThrow(
        'Password must be at least 8 characters long'
      )
    })

    it('should throw error for null or undefined', () => {
      expect(() => new PasswordValueObject(null as unknown as string)).toThrow(
        'Password is required'
      )
      expect(() => new PasswordValueObject(undefined as unknown as string)).toThrow(
        'Password is required'
      )
    })

    it('should throw error for empty password', () => {
      expect(() => new PasswordValueObject('')).toThrow('Password is required')
    })

    it('should accept passwords of 8 or more characters', () => {
      const validPasswords = ['12345678', 'longpassword123', 'Very$ecureP@ssw0rd!', 'a'.repeat(100)]

      validPasswords.forEach(validPassword => {
        const password = new PasswordValueObject(validPassword)
        expect(password.value).toBe(validPassword)
      })
    })
  })

  describe('equals', () => {
    it('should return true for equal password values', () => {
      const password1 = new PasswordValueObject('Password123!')
      const password2 = new PasswordValueObject('Password123!')

      const result = password1.equals(password2)

      expect(result).toBe(true)
    })

    it('should return false for different password values', () => {
      const password1 = new PasswordValueObject('Password123!')
      const password2 = new PasswordValueObject('Different123!')

      const result = password1.equals(password2)

      expect(result).toBe(false)
    })

    it('should be case-sensitive when comparing', () => {
      const password1 = new PasswordValueObject('Password123!')
      const password2 = new PasswordValueObject('password123!')

      const result = password1.equals(password2)

      expect(result).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return masked password for security', () => {
      const password = new PasswordValueObject('Password123!')

      const result = password.toString()

      expect(result).toBe('********')
    })
  })

  describe('isStrong', () => {
    it('should return true for strong passwords', () => {
      const strongPasswords = ['StrongP@ss1', 'Secure123!', 'MyP@ssw0rd', 'Test!234']

      strongPasswords.forEach(pass => {
        const password = new PasswordValueObject(pass)
        expect(password.isStrong()).toBe(true)
      })
    })

    it('should return false for weak passwords', () => {
      const weakPasswords = [
        'password',
        '12345678',
        'PASSWORD',
        'Pass word1',
        'Passw0rd',
        'Password!'
      ]

      weakPasswords.forEach(pass => {
        const password = new PasswordValueObject(pass)
        expect(password.isStrong()).toBe(false)
      })
    })
  })
})
