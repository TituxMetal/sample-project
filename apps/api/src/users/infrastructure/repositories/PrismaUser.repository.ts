import { Injectable } from '@nestjs/common'

import type { PrismaProvider } from '~/shared/infrastructure/database'
import { UserEntity } from '~/users/domain/entities'
import type { IUserRepository } from '~/users/domain/repositories'
import { UserIdValueObject } from '~/users/domain/value-objects'
import { UserInfrastructureMapper } from '~/users/infrastructure/mappers'

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaProvider) {}

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
