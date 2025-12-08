import { describe, expect, it } from 'bun:test'

import {
  NameValueObject,
  UserIdValueObject,
  UsernameValueObject
} from '~/users/domain/value-objects'

import { UserEntity } from './User.entity'

describe('UserEntity', () => {
  describe('constructor', () => {
    it('should create a user entity with all properties', () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const username = new UsernameValueObject('johndoe')
      const firstName = new NameValueObject('John')
      const lastName = new NameValueObject('Doe')

      const user = new UserEntity(
        userId,
        'john@example.com',
        username,
        firstName,
        lastName,
        true, // emailVerified
        false, // banned
        null, // banReason
        null, // banExpires
        'user', // role
        new Date('2024-01-01'),
        new Date('2024-01-02')
      )

      expect(user.id).toBe(userId)
      expect(user.email).toBe('john@example.com')
      expect(user.username).toBe(username)
      expect(user.firstName).toBe(firstName)
      expect(user.lastName).toBe(lastName)
      expect(user.emailVerified).toBe(true)
      expect(user.banned).toBe(false)
      expect(user.banReason).toBeNull()
      expect(user.banExpires).toBeNull()
      expect(user.role).toBe('user')
      expect(user.createdAt).toEqual(new Date('2024-01-01'))
      expect(user.updatedAt).toEqual(new Date('2024-01-02'))
    })

    it('should create a user entity with optional names as undefined', () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const username = new UsernameValueObject('johndoe')

      const user = new UserEntity(
        userId,
        'john@example.com',
        username,
        undefined,
        undefined,
        true,
        false,
        null,
        null,
        'user',
        new Date(),
        new Date()
      )

      expect(user.firstName).toBeUndefined()
      expect(user.lastName).toBeUndefined()
    })
  })

  describe('updateProfile', () => {
    it('should update user profile fields', () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const username = new UsernameValueObject('johndoe')
      const firstName = new NameValueObject('John')
      const lastName = new NameValueObject('Doe')

      const user = new UserEntity(
        userId,
        'john@example.com',
        username,
        firstName,
        lastName,
        true,
        false,
        null,
        null,
        'user',
        new Date('2024-01-01'),
        new Date('2024-01-01')
      )

      const newUsername = new UsernameValueObject('janedoe')
      const newFirstName = new NameValueObject('Jane')
      const newLastName = new NameValueObject('Smith')

      user.updateProfile(newUsername, newFirstName, newLastName)

      expect(user.username).toBe(newUsername)
      expect(user.firstName).toBe(newFirstName)
      expect(user.lastName).toBe(newLastName)
    })

    it('should allow partial profile updates', () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const username = new UsernameValueObject('johndoe')

      const user = new UserEntity(
        userId,
        'john@example.com',
        username,
        undefined,
        undefined,
        true,
        false,
        null,
        null,
        'user',
        new Date(),
        new Date()
      )

      const newUsername = new UsernameValueObject('janedoe')
      user.updateProfile(newUsername)

      expect(user.username).toBe(newUsername)
      expect(user.firstName).toBeUndefined()
      expect(user.lastName).toBeUndefined()
    })
  })

  describe('ban/unban', () => {
    it('should ban a user', () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const username = new UsernameValueObject('johndoe')

      const user = new UserEntity(
        userId,
        'john@example.com',
        username,
        undefined,
        undefined,
        true,
        false,
        null,
        null,
        'user',
        new Date(),
        new Date()
      )

      user.ban('Violation of terms')
      expect(user.banned).toBe(true)
      expect(user.banReason).toBe('Violation of terms')
    })

    it('should ban a user with expiration', () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const username = new UsernameValueObject('johndoe')

      const user = new UserEntity(
        userId,
        'john@example.com',
        username,
        undefined,
        undefined,
        true,
        false,
        null,
        null,
        'user',
        new Date(),
        new Date()
      )

      const banExpires = new Date('2025-12-31')
      user.ban('Temporary ban', banExpires)
      expect(user.banned).toBe(true)
      expect(user.banReason).toBe('Temporary ban')
      expect(user.banExpires).toBe(banExpires)
    })

    it('should unban a user', () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const username = new UsernameValueObject('johndoe')

      const user = new UserEntity(
        userId,
        'john@example.com',
        username,
        undefined,
        undefined,
        true,
        true,
        'Previous ban',
        new Date('2025-12-31'),
        'user',
        new Date(),
        new Date()
      )

      user.unban()
      expect(user.banned).toBe(false)
      expect(user.banReason).toBeNull()
      expect(user.banExpires).toBeNull()
    })
  })

  describe('verify', () => {
    it('should verify a user', () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const username = new UsernameValueObject('johndoe')

      const user = new UserEntity(
        userId,
        'john@example.com',
        username,
        undefined,
        undefined,
        false,
        false,
        null,
        null,
        'user',
        new Date(),
        new Date()
      )

      user.verify()
      expect(user.emailVerified).toBe(true)
    })
  })

  describe('isActive', () => {
    it('should return true for verified and unbanned user', () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const username = new UsernameValueObject('johndoe')

      const user = new UserEntity(
        userId,
        'john@example.com',
        username,
        undefined,
        undefined,
        true,
        false,
        null,
        null,
        'user',
        new Date(),
        new Date()
      )

      expect(user.isActive()).toBe(true)
    })

    it('should return false for banned user', () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const username = new UsernameValueObject('johndoe')

      const user = new UserEntity(
        userId,
        'john@example.com',
        username,
        undefined,
        undefined,
        true,
        true,
        'Banned',
        null,
        'user',
        new Date(),
        new Date()
      )

      expect(user.isActive()).toBe(false)
    })

    it('should return false for unverified user', () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const username = new UsernameValueObject('johndoe')

      const user = new UserEntity(
        userId,
        'john@example.com',
        username,
        undefined,
        undefined,
        false,
        false,
        null,
        null,
        'user',
        new Date(),
        new Date()
      )

      expect(user.isActive()).toBe(false)
    })

    it('should return true for banned user with expired ban', () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const username = new UsernameValueObject('johndoe')

      const user = new UserEntity(
        userId,
        'john@example.com',
        username,
        undefined,
        undefined,
        true,
        true,
        'Temporary ban',
        new Date('2020-01-01'), // Expired ban
        'user',
        new Date(),
        new Date()
      )

      expect(user.isActive()).toBe(true)
    })
  })
})
