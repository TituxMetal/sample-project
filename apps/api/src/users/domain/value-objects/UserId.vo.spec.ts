import { UserIdValueObject } from './UserId.vo'

describe('UserIdValueObject', () => {
  describe('constructor', () => {
    it('should create a valid user ID with UUID format', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000'
      const userId = new UserIdValueObject(validUuid)

      expect(userId.value).toBe(validUuid)
    })

    it('should throw error for invalid UUID format', () => {
      const invalidId = 'invalid-id'

      expect(() => new UserIdValueObject(invalidId)).toThrow('Invalid user ID format')
    })

    it('should throw error for empty string', () => {
      expect(() => new UserIdValueObject('')).toThrow('User ID cannot be empty')
    })

    it('should throw error for null or undefined', () => {
      expect(() => new UserIdValueObject(null as unknown as string)).toThrow(
        'User ID cannot be empty'
      )
      expect(() => new UserIdValueObject(undefined as unknown as string)).toThrow(
        'User ID cannot be empty'
      )
    })
  })

  describe('equals', () => {
    it('should return true for identical user IDs', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000'
      const userId1 = new UserIdValueObject(id)
      const userId2 = new UserIdValueObject(id)

      expect(userId1.equals(userId2)).toBe(true)
    })

    it('should return false for different user IDs', () => {
      const userId1 = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const userId2 = new UserIdValueObject('987fcdeb-51d2-432e-b789-123456789abc')

      expect(userId1.equals(userId2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the string value', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000'
      const userId = new UserIdValueObject(id)

      expect(userId.toString()).toBe(id)
    })
  })

  describe('generate', () => {
    it('should generate a valid UUID', () => {
      const userId = UserIdValueObject.generate()
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

      expect(uuidRegex.test(userId.value)).toBe(true)
    })

    it('should generate unique IDs', () => {
      const userId1 = UserIdValueObject.generate()
      const userId2 = UserIdValueObject.generate()

      expect(userId1.equals(userId2)).toBe(false)
    })
  })
})
