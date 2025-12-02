import { describe, expect, it } from 'bun:test'

import { NameValueObject } from './Name.vo'

describe('NameValueObject', () => {
  describe('constructor', () => {
    it('should create a valid name', () => {
      const name = new NameValueObject('John')
      expect(name.value).toBe('John')
    })

    it('should accept names with spaces', () => {
      const name = new NameValueObject('Mary Jane')
      expect(name.value).toBe('Mary Jane')
    })

    it('should accept names with hyphens', () => {
      const name = new NameValueObject('Jean-Pierre')
      expect(name.value).toBe('Jean-Pierre')
    })

    it('should accept names with apostrophes', () => {
      const name = new NameValueObject("O'Connor")
      expect(name.value).toBe("O'Connor")
    })

    it('should trim whitespace', () => {
      const name = new NameValueObject('  John  ')
      expect(name.value).toBe('John')
    })

    it('should throw error for empty name', () => {
      expect(() => new NameValueObject('')).toThrow('Name cannot be empty')
    })

    it('should throw error for null or undefined', () => {
      expect(() => new NameValueObject(null as unknown as string)).toThrow('Name cannot be empty')
      expect(() => new NameValueObject(undefined as unknown as string)).toThrow(
        'Name cannot be empty'
      )
    })

    it('should throw error for whitespace only', () => {
      expect(() => new NameValueObject('   ')).toThrow('Name cannot be empty')
    })

    it('should throw error for name too short', () => {
      expect(() => new NameValueObject('A')).toThrow('Name must be between 2 and 50 characters')
    })

    it('should throw error for name too long', () => {
      const longName = 'A'.repeat(51)
      expect(() => new NameValueObject(longName)).toThrow(
        'Name must be between 2 and 50 characters'
      )
    })

    it('should throw error for invalid characters', () => {
      expect(() => new NameValueObject('John123')).toThrow(
        'Name can only contain letters, spaces, hyphens, and apostrophes'
      )
      expect(() => new NameValueObject('John@Doe')).toThrow(
        'Name can only contain letters, spaces, hyphens, and apostrophes'
      )
    })

    it('should accept minimum length name', () => {
      const name = new NameValueObject('Jo')
      expect(name.value).toBe('Jo')
    })

    it('should accept maximum length name', () => {
      const maxName = 'A'.repeat(50)
      const name = new NameValueObject(maxName)
      expect(name.value).toBe(maxName)
    })
  })

  describe('equals', () => {
    it('should return true for identical names', () => {
      const name1 = new NameValueObject('John')
      const name2 = new NameValueObject('John')

      expect(name1.equals(name2)).toBe(true)
    })

    it('should return false for different names', () => {
      const name1 = new NameValueObject('John')
      const name2 = new NameValueObject('Jane')

      expect(name1.equals(name2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the string value', () => {
      const name = new NameValueObject('John')
      expect(name.toString()).toBe('John')
    })
  })
})
