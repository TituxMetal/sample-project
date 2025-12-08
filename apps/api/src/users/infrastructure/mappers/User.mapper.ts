import type { User as PrismaUser } from '@generated'

import { UserEntity } from '~/users/domain/entities'
import {
  NameValueObject,
  UserIdValueObject,
  UsernameValueObject
} from '~/users/domain/value-objects'

export class UserInfrastructureMapper {
  static toDomain(prismaUser: PrismaUser): UserEntity {
    return new UserEntity(
      new UserIdValueObject(prismaUser.id),
      prismaUser.email,
      new UsernameValueObject(prismaUser.username),
      prismaUser.firstName ? new NameValueObject(prismaUser.firstName) : undefined,
      prismaUser.lastName ? new NameValueObject(prismaUser.lastName) : undefined,
      prismaUser.emailVerified,
      prismaUser.banned,
      prismaUser.banReason,
      prismaUser.banExpires,
      prismaUser.role,
      prismaUser.createdAt,
      prismaUser.updatedAt
    )
  }

  static toPrisma(userEntity: UserEntity): Partial<PrismaUser> {
    return {
      id: userEntity.id.value,
      email: userEntity.email,
      username: userEntity.username.value,
      firstName: userEntity.firstName?.value || null,
      lastName: userEntity.lastName?.value || null,
      emailVerified: userEntity.emailVerified,
      banned: userEntity.banned,
      banReason: userEntity.banReason,
      banExpires: userEntity.banExpires,
      role: userEntity.role,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt
    }
  }
}
