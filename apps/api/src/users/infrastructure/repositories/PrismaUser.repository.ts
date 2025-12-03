import { Injectable } from '@nestjs/common'

import { Prisma } from '@generated'

import type { PrismaProvider } from '~/shared/infrastructure/database'
import { UserEntity } from '~/users/domain/entities'
import type { IUserRepository } from '~/users/domain/repositories'
import { UserIdValueObject } from '~/users/domain/value-objects'
import { UserInfrastructureMapper } from '~/users/infrastructure/mappers'

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const prismaData = UserInfrastructureMapper.toPrisma(user)
    // Note: This method should only be used for user profile creation where password
    // is handled separately by the Auth module. For full user creation with authentication,
    // use the Auth module's user creation methods.
    const prismaUser = await this.prisma.user.create({
      data: {
        ...prismaData,
        hash: '' // Password management is Auth module's responsibility
      } as Prisma.UserCreateInput
    })
    return UserInfrastructureMapper.toDomain(prismaUser)
  }

  async findById(id: UserIdValueObject): Promise<UserEntity | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: id.value }
    })
    return prismaUser ? UserInfrastructureMapper.toDomain(prismaUser) : null
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email }
    })
    return prismaUser ? UserInfrastructureMapper.toDomain(prismaUser) : null
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { username }
    })
    return prismaUser ? UserInfrastructureMapper.toDomain(prismaUser) : null
  }

  async findAll(): Promise<UserEntity[]> {
    const prismaUsers = await this.prisma.user.findMany()
    return prismaUsers.map(user => UserInfrastructureMapper.toDomain(user))
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const prismaData = UserInfrastructureMapper.toPrisma(user)
    const prismaUser = await this.prisma.user.update({
      where: { id: user.id.value },
      data: prismaData
    })
    return UserInfrastructureMapper.toDomain(prismaUser)
  }

  async delete(id: UserIdValueObject): Promise<void> {
    await this.prisma.user.delete({
      where: { id: id.value }
    })
  }

  async exists(id: UserIdValueObject): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: id.value }
    })
    return user !== null
  }
}
