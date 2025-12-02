import { Injectable } from '@nestjs/common'

import type { User } from '@generated'

import { AuthUserEntity } from '~/auth/domain/entities'
import type { IAuthUserRepository } from '~/auth/domain/repositories'
import { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'
import { PrismaProvider } from '~/shared/infrastructure/database'

interface UserCreateData {
  id: string
  email: string
  username: string
  hash: string
  confirmed: boolean
  blocked: boolean
  createdAt: Date
}

@Injectable()
export class PrismaAuthUserRepository implements IAuthUserRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async findById(id: string): Promise<AuthUserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })

    return user ? this.mapToDomain(user) : null
  }

  async findByEmail(email: EmailValueObject): Promise<AuthUserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.value }
    })

    return user ? this.mapToDomain(user) : null
  }

  async findByUsername(username: string): Promise<AuthUserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { username }
    })

    return user ? this.mapToDomain(user) : null
  }

  async save(authUser: AuthUserEntity): Promise<AuthUserEntity> {
    const userData = this.mapToPersistence(authUser)

    const savedUser = await this.prisma.user.create({
      data: userData
    })

    return this.mapToDomain(savedUser)
  }

  async update(authUser: AuthUserEntity): Promise<AuthUserEntity> {
    const userData = this.mapToPersistence(authUser)

    const updatedUser = await this.prisma.user.update({
      where: { id: authUser.id },
      data: userData
    })

    return this.mapToDomain(updatedUser)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    })
  }

  private mapToDomain(user: User): AuthUserEntity {
    return new AuthUserEntity(
      user.id,
      new EmailValueObject(user.email),
      user.username,
      new PasswordValueObject(user.hash),
      user.confirmed,
      user.blocked,
      user.createdAt
    )
  }

  private mapToPersistence(authUser: AuthUserEntity): UserCreateData {
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
