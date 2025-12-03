import { describe, expect, it } from 'bun:test'

import { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'

import { AuthUserEntity } from './AuthUser.entity'

describe('AuthUserEntity', () => {
  const validEmail = 'user@example.com'
  const validPassword = 'ValidPassword123!'
  const userId = 'user-123'
  const username = 'testuser'

  describe('constructor', () => {
    it('should create an instance with required fields', () => {
      const email = new EmailValueObject(validEmail)
      const password = new PasswordValueObject(validPassword)

      const authUser = new AuthUserEntity(
        userId,
        email,
        username,
        password,
        false,
        false,
        new Date()
      )
      expect(authUser).toBeDefined()
      expect(authUser.id).toBe(userId)
      expect(authUser.email).toBe(email)
      expect(authUser.username).toBe(username)
      expect(authUser.password).toBe(password)
      expect(authUser.confirmed).toBe(false)
      expect(authUser.blocked).toBe(false)
      expect(authUser.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('isActive', () => {
    it('should return true when user is confirmed and not blocked', () => {
      const email = new EmailValueObject(validEmail)
      const password = new PasswordValueObject(validPassword)
      const authUser = new AuthUserEntity(
        userId,
        email,
        username,
        password,
        true,
        false,
        new Date()
      )

      const result = authUser.isActive()

      expect(result).toBe(true)
    })

    it('should return false when user is not confirmed', () => {
      const email = new EmailValueObject(validEmail)
      const password = new PasswordValueObject(validPassword)
      const authUser = new AuthUserEntity(
        userId,
        email,
        username,
        password,
        false,
        false,
        new Date()
      )

      const result = authUser.isActive()

      expect(result).toBe(false)
    })

    it('should return false when user is blocked', () => {
      const email = new EmailValueObject(validEmail)
      const password = new PasswordValueObject(validPassword)
      const authUser = new AuthUserEntity(userId, email, username, password, true, true, new Date())

      const result = authUser.isActive()

      expect(result).toBe(false)
    })
  })

  describe('confirmAccount', () => {
    it('should set confirmed to true', () => {
      const email = new EmailValueObject(validEmail)
      const password = new PasswordValueObject(validPassword)
      const authUser = new AuthUserEntity(
        userId,
        email,
        username,
        password,
        false,
        false,
        new Date()
      )

      authUser.confirmAccount()

      expect(authUser.confirmed).toBe(true)
    })
  })

  describe('blockAccount', () => {
    it('should set blocked to true', () => {
      const email = new EmailValueObject(validEmail)
      const password = new PasswordValueObject(validPassword)
      const authUser = new AuthUserEntity(
        userId,
        email,
        username,
        password,
        true,
        false,
        new Date()
      )

      authUser.blockAccount()

      expect(authUser.blocked).toBe(true)
    })
  })

  describe('unblockAccount', () => {
    it('should set blocked to false', () => {
      const email = new EmailValueObject(validEmail)
      const password = new PasswordValueObject(validPassword)
      const authUser = new AuthUserEntity(userId, email, username, password, true, true, new Date())

      authUser.unblockAccount()

      expect(authUser.blocked).toBe(false)
    })
  })

  describe('updatePassword', () => {
    it('should update the password', () => {
      const email = new EmailValueObject(validEmail)
      const password = new PasswordValueObject(validPassword)
      const newPassword = new PasswordValueObject('NewPassword123!')
      const authUser = new AuthUserEntity(
        userId,
        email,
        username,
        password,
        true,
        false,
        new Date()
      )

      authUser.updatePassword(newPassword)

      expect(authUser.password).toBe(newPassword)
    })
  })
})
