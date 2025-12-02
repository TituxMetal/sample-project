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
        true,
        false,
        new Date('2024-01-01'),
        new Date('2024-01-02')
      )

      expect(user.id).toBe(userId)
      expect(user.email).toBe('john@example.com')
      expect(user.username).toBe(username)
      expect(user.firstName).toBe(firstName)
      expect(user.lastName).toBe(lastName)
      expect(user.confirmed).toBe(true)
      expect(user.blocked).toBe(false)
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

  describe('block/unblock', () => {
    it('should block a user', () => {
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
        new Date(),
        new Date()
      )

      user.block()
      expect(user.blocked).toBe(true)
    })

    it('should unblock a user', () => {
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
        new Date(),
        new Date()
      )

      user.unblock()
      expect(user.blocked).toBe(false)
    })
  })

  describe('confirm', () => {
    it('should confirm a user', () => {
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
        new Date(),
        new Date()
      )

      user.confirm()
      expect(user.confirmed).toBe(true)
    })
  })

  describe('isActive', () => {
    it('should return true for confirmed and unblocked user', () => {
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
        new Date(),
        new Date()
      )

      expect(user.isActive()).toBe(true)
    })

    it('should return false for blocked user', () => {
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
        new Date(),
        new Date()
      )

      expect(user.isActive()).toBe(false)
    })

    it('should return false for unconfirmed user', () => {
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
        new Date(),
        new Date()
      )

      expect(user.isActive()).toBe(false)
    })
  })
})
