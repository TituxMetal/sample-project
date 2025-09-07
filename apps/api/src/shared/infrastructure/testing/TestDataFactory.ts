import { AuthUserEntity } from '~/auth/domain/entities'
import { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'
import { UserEntity } from '~/users/domain/entities'
import {
  NameValueObject,
  UsernameValueObject,
  UserIdValueObject
} from '~/users/domain/value-objects'

export interface TestUserData {
  id?: string
  email?: string
  username?: string
  firstName?: string
  lastName?: string
  password?: string
  isActive?: boolean
  isVerified?: boolean
}

export interface TestAuthUserData extends TestUserData {
  password?: string
  isActive?: boolean
  isVerified?: boolean
}

export class TestDataFactory {
  /**
   * Create test user data for User domain
   */
  static createUser(overrides: TestUserData = {}): UserEntity {
    const defaults = {
      id: 'test-user-id',
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User'
    }

    const userData = { ...defaults, ...overrides }

    return new UserEntity(
      new UserIdValueObject(userData.id),
      userData.email,
      new UsernameValueObject(userData.username),
      userData.firstName ? new NameValueObject(userData.firstName) : undefined,
      userData.lastName ? new NameValueObject(userData.lastName) : undefined,
      false, // confirmed
      false, // blocked
      new Date(), // createdAt
      new Date() // updatedAt
    )
  }

  /**
   * Create test auth user data for Auth domain
   */
  static createAuthUser(overrides: TestAuthUserData = {}): AuthUserEntity {
    const defaults = {
      id: 'test-auth-user-id',
      email: 'auth@example.com',
      username: 'authuser',
      password: 'hashedPassword123',
      isActive: true,
      isVerified: false
    }

    const userData = { ...defaults, ...overrides }

    return new AuthUserEntity(
      userData.id,
      new EmailValueObject(userData.email),
      userData.username,
      new PasswordValueObject(userData.password),
      userData.isActive,
      userData.isVerified,
      new Date()
    )
  }

  /**
   * Create test JWT payload
   */
  static createJwtPayload(
    overrides: Partial<{ sub: string; identifier: string; iat: number; exp: number }> = {}
  ) {
    const defaults = {
      sub: 'test-user-id',
      identifier: 'test@example.com',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }

    return { ...defaults, ...overrides }
  }

  /**
   * Create test authenticated user for controllers
   */
  static createAuthenticatedUser(
    overrides: Partial<{
      sub: string
      email: string
      username: string
      iat?: number
      exp?: number
    }> = {}
  ) {
    const defaults = {
      sub: 'test-user-id',
      email: 'authenticated@example.com',
      username: 'authenticateduser',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }

    return { ...defaults, ...overrides }
  }

  /**
   * Create test login DTO data
   */
  static createLoginData(overrides: Partial<{ emailOrUsername: string; password: string }> = {}) {
    const defaults = {
      emailOrUsername: 'test@example.com',
      password: 'testPassword123'
    }

    return { ...defaults, ...overrides }
  }

  /**
   * Create test register DTO data
   */
  static createRegisterData(
    overrides: Partial<{
      email: string
      username: string
      password: string
      firstName?: string
      lastName?: string
    }> = {}
  ) {
    const defaults = {
      email: 'register@example.com',
      username: 'registeruser',
      password: 'registerPassword123',
      firstName: 'Register',
      lastName: 'User'
    }

    return { ...defaults, ...overrides }
  }

  /**
   * Create test update profile DTO data
   */
  static createUpdateProfileData(
    overrides: Partial<{
      firstName?: string
      lastName?: string
    }> = {}
  ) {
    const defaults = {
      firstName: 'Updated',
      lastName: 'Name'
    }

    return { ...defaults, ...overrides }
  }
}
