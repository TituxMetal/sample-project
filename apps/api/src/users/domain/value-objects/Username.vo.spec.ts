import { UsernameValueObject } from './Username.vo'

describe('UsernameValueObject', () => {
  describe('constructor', () => {
    it('should create a valid username', () => {
      const username = new UsernameValueObject('johndoe')
      expect(username.value).toBe('johndoe')
    })

    it('should accept username with numbers', () => {
      const username = new UsernameValueObject('user123')
      expect(username.value).toBe('user123')
    })

    it('should accept username with underscores', () => {
      const username = new UsernameValueObject('user_name')
      expect(username.value).toBe('user_name')
    })

    it('should throw error for empty username', () => {
      expect(() => new UsernameValueObject('')).toThrow('Username cannot be empty')
    })

    it('should throw error for null or undefined', () => {
      expect(() => new UsernameValueObject(null as unknown as string)).toThrow(
        'Username cannot be empty'
      )
      expect(() => new UsernameValueObject(undefined as unknown as string)).toThrow(
        'Username cannot be empty'
      )
    })

    it('should throw error for username too short', () => {
      expect(() => new UsernameValueObject('ab')).toThrow(
        'Username must be between 3 and 30 characters'
      )
    })

    it('should throw error for username too long', () => {
      const longUsername = 'a'.repeat(31)
      expect(() => new UsernameValueObject(longUsername)).toThrow(
        'Username must be between 3 and 30 characters'
      )
    })

    it('should throw error for invalid characters', () => {
      expect(() => new UsernameValueObject('user@name')).toThrow(
        'Username can only contain letters, numbers, and underscores'
      )
      expect(() => new UsernameValueObject('user-name')).toThrow(
        'Username can only contain letters, numbers, and underscores'
      )
      expect(() => new UsernameValueObject('user name')).toThrow(
        'Username can only contain letters, numbers, and underscores'
      )
    })

    it('should accept minimum length username', () => {
      const username = new UsernameValueObject('abc')
      expect(username.value).toBe('abc')
    })

    it('should accept maximum length username', () => {
      const maxUsername = 'a'.repeat(30)
      const username = new UsernameValueObject(maxUsername)
      expect(username.value).toBe(maxUsername)
    })
  })

  describe('equals', () => {
    it('should return true for identical usernames', () => {
      const username1 = new UsernameValueObject('johndoe')
      const username2 = new UsernameValueObject('johndoe')

      expect(username1.equals(username2)).toBe(true)
    })

    it('should return false for different usernames', () => {
      const username1 = new UsernameValueObject('johndoe')
      const username2 = new UsernameValueObject('janedoe')

      expect(username1.equals(username2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the string value', () => {
      const username = new UsernameValueObject('johndoe')
      expect(username.toString()).toBe('johndoe')
    })
  })
})
