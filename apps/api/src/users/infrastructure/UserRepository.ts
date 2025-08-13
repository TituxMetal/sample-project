import { Injectable } from '@nestjs/common'

import { PrismaService } from '~/shared/infrastructure/database/prisma.service'
import type { IUserRepository } from '~/users/domain/IUserRepository.interface'
import { User } from '~/users/domain/User.entity'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    // For now, return dummy data since we don't have real users in DB
    // In real implementation:
    // const users = await this.prisma.user.findMany()
    // return users.map(user => new User(user.id, user.email, user.createdAt, user.updatedAt))

    return [
      new User('1', 'titux.metal@lgdweb.fr', new Date('2025-08-13'), new Date('2025-08-13')),
      new User('2', 'john.smith@lgdweb.fr', new Date('2025-08-13'), new Date('2025-08-13'))
    ]
  }

  async findById(id: string): Promise<User | null> {
    // Dummy implementation
    const users = await this.findAll()
    return users.find(user => user.id === id) || null
  }
}
