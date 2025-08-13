import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { PrismaService } from '~/shared/infrastructure/database/prisma.service'
import { User } from '~/users/domain/User.entity'

import { UserRepository } from './UserRepository'

describe('UserRepository', () => {
  let repository: UserRepository

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn()
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile()

    repository = module.get<UserRepository>(UserRepository)
  })

  it('should be defined', () => {
    expect(repository).toBeDefined()
  })

  describe('findAll', () => {
    it('should return dummy users', async () => {
      const result = await repository.findAll()

      expect(result).toHaveLength(2)
      expect(result[0]).toBeInstanceOf(User)
      expect(result[0].email).toBe('titux.metal@lgdweb.fr')
      expect(result[1]).toBeInstanceOf(User)
      expect(result[1].email).toBe('john.smith@lgdweb.fr')
    })

    it('should return users with proper structure', async () => {
      const result = await repository.findAll()

      result.forEach(user => {
        expect(user.id).toBeDefined()
        expect(user.email).toBeDefined()
        expect(user.createdAt).toBeInstanceOf(Date)
        expect(user.updatedAt).toBeInstanceOf(Date)
      })
    })
  })

  describe('findById', () => {
    it('should return user when found', async () => {
      const result = await repository.findById('1')

      expect(result).toBeInstanceOf(User)
      expect(result?.id).toBe('1')
      expect(result?.email).toBe('titux.metal@lgdweb.fr')
    })

    it('should return null when user not found', async () => {
      const result = await repository.findById('999')

      expect(result).toBeNull()
    })
  })
})
