import type { UpdateUserProfileDto, CreateUserDto } from '~/users/application/dtos'
import { GetUserProfileDto } from '~/users/application/dtos'
import { UserEntity } from '~/users/domain/entities'
import {
  UserIdValueObject,
  UsernameValueObject,
  NameValueObject
} from '~/users/domain/value-objects'

export class UserMapper {
  static toGetUserProfileDto(entity: UserEntity): GetUserProfileDto {
    const dto = new GetUserProfileDto()
    dto.id = entity.id.value
    dto.email = entity.email
    dto.username = entity.username.value
    dto.firstName = entity.firstName?.value
    dto.lastName = entity.lastName?.value
    dto.emailVerified = entity.emailVerified
    dto.banned = entity.banned
    dto.role = entity.role
    dto.createdAt = entity.createdAt
    dto.updatedAt = entity.updatedAt
    return dto
  }

  static fromUpdateUserProfileDto(
    dto: UpdateUserProfileDto,
    existingEntity: UserEntity
  ): UserEntity {
    const username = dto.username ? new UsernameValueObject(dto.username) : existingEntity.username
    const firstName =
      dto.firstName !== undefined
        ? dto.firstName
          ? new NameValueObject(dto.firstName)
          : undefined
        : existingEntity.firstName
    const lastName =
      dto.lastName !== undefined
        ? dto.lastName
          ? new NameValueObject(dto.lastName)
          : undefined
        : existingEntity.lastName

    const updatedEntity = new UserEntity(
      existingEntity.id,
      existingEntity.email,
      username,
      firstName,
      lastName,
      existingEntity.emailVerified,
      existingEntity.banned,
      existingEntity.banReason,
      existingEntity.banExpires,
      existingEntity.role,
      existingEntity.createdAt,
      new Date()
    )

    return updatedEntity
  }

  static fromCreateUserDto(dto: CreateUserDto): UserEntity {
    return new UserEntity(
      UserIdValueObject.generate(),
      dto.email,
      new UsernameValueObject(dto.username),
      dto.firstName ? new NameValueObject(dto.firstName) : undefined,
      dto.lastName ? new NameValueObject(dto.lastName) : undefined,
      true, // emailVerified
      false, // banned
      null, // banReason
      null, // banExpires
      'user', // role
      new Date(),
      new Date()
    )
  }
}
