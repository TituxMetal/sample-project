import { UserEntity } from '~/users/domain/entities'
import {
  NameValueObject,
  UserIdValueObject,
  UsernameValueObject
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
      false, // emailVerified
      false, // banned
      null, // banReason
      null, // banExpires
      'user', // role
      new Date(), // createdAt
      new Date() // updatedAt
    )
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
