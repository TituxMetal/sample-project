import type { User } from '@generated'

import { AuthUserEntity } from '~/auth/domain/entities'
import { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'

interface UserCreateData {
  id: string
  email: string
  username: string
  hash: string
  confirmed: boolean
  blocked: boolean
  createdAt: Date
}

export class AuthUserMapper {
  static toDomain(userData: User): AuthUserEntity {
    return new AuthUserEntity(
      userData.id,
      new EmailValueObject(userData.email),
      userData.username,
      new PasswordValueObject(userData.hash),
      userData.confirmed,
      userData.blocked,
      userData.createdAt
    )
  }

  static toPersistence(authUser: AuthUserEntity): UserCreateData {
    return {
      id: authUser.id,
      email: authUser.email.value,
      username: authUser.username,
      hash: authUser.password.value,
      confirmed: authUser.confirmed,
      blocked: authUser.blocked,
      createdAt: authUser.createdAt
    }
  }
}
