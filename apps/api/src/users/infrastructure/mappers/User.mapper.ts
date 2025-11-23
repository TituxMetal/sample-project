import type { User as PrismaUser } from '@generated'

import { UserEntity } from '~/users/domain/entities'
import {
  UserIdValueObject,
  UsernameValueObject,
  NameValueObject
} from '~/users/domain/value-objects'

export class UserInfrastructureMapper {
  static toDomain(prismaUser: PrismaUser): UserEntity {
    return new UserEntity(
      new UserIdValueObject(prismaUser.id),
      prismaUser.email,
      new UsernameValueObject(prismaUser.username),
      prismaUser.firstName ? new NameValueObject(prismaUser.firstName) : undefined,
      prismaUser.lastName ? new NameValueObject(prismaUser.lastName) : undefined,
      prismaUser.confirmed,
      prismaUser.blocked,
      prismaUser.createdAt,
      prismaUser.updatedAt
    )
  }

  static toPrisma(userEntity: UserEntity): Omit<PrismaUser, 'hash'> {
    return {
      id: userEntity.id.value,
      email: userEntity.email,
      username: userEntity.username.value,
      firstName: userEntity.firstName?.value || null,
      lastName: userEntity.lastName?.value || null,
      confirmed: userEntity.confirmed,
      blocked: userEntity.blocked,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt
    }
  }
}
