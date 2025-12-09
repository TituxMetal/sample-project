import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { PrismaProvider } from '~/shared/infrastructure/database'
import { UserEntity } from '~/users/domain/entities'
import {
  NameValueObject,
  UserIdValueObject,
  UsernameValueObject
} from '~/users/domain/value-objects'

import { UserInfrastructureMapper } from '../mappers/User.mapper'

import { PrismaUserRepository } from './PrismaUser.repository'

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository
  let mockPrismaService: {
    user: {
      findUnique: Mock<(args: any) => Promise<any>>
      update: Mock<(args: any) => Promise<any>>
      delete: Mock<(args: any) => Promise<any>>
    }
  }

  beforeEach(() => {
    mockPrismaService = {
      user: {
        findUnique: mock(() => {}) as unknown as Mock<(args: any) => Promise<any>>,
        update: mock(() => {}) as unknown as Mock<(args: any) => Promise<any>>,
        delete: mock(() => {}) as unknown as Mock<(args: any) => Promise<any>>
      }
    }

    repository = new PrismaUserRepository(mockPrismaService as unknown as PrismaProvider)
  })

  describe('findById', () => {
    it('should find user by id', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const prismaUser = {
        id: userId.value,
        email: 'john@example.com',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
        banned: false,
        banReason: null,
        banExpires: null,
        role: 'user',
        name: 'John Doe',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const mockFindUnique = mockPrismaService.user.findUnique as Mock<
        typeof mockPrismaService.user.findUnique
      >
      mockFindUnique.mockResolvedValue(prismaUser)

      const result = await repository.findById(userId)

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId.value }
      })
      expect(result).toEqual(UserInfrastructureMapper.toDomain(prismaUser))
    })

    it('should return null when user not found', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const mockFindUnique = mockPrismaService.user.findUnique as Mock<
        typeof mockPrismaService.user.findUnique
      >
      mockFindUnique.mockResolvedValue(null)

      const result = await repository.findById(userId)

      expect(result).toBeNull()
    })
  })

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'john@example.com'
      const prismaUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email,
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
        banned: false,
        banReason: null,
        banExpires: null,
        role: 'user',
        name: 'John Doe',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const mockFindUnique = mockPrismaService.user.findUnique as Mock<
        typeof mockPrismaService.user.findUnique
      >
      mockFindUnique.mockResolvedValue(prismaUser)

      const result = await repository.findByEmail(email)

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email }
      })
      expect(result).toEqual(UserInfrastructureMapper.toDomain(prismaUser))
    })

    it('should return null when user not found by email', async () => {
      const mockFindUnique = mockPrismaService.user.findUnique as Mock<
        typeof mockPrismaService.user.findUnique
      >
      mockFindUnique.mockResolvedValue(null)

      const result = await repository.findByEmail('nonexistent@example.com')

      expect(result).toBeNull()
    })
  })

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      const username = 'johndoe'
      const prismaUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john@example.com',
        username,
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
        banned: false,
        banReason: null,
        banExpires: null,
        role: 'user',
        name: 'John Doe',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const mockFindUnique = mockPrismaService.user.findUnique as Mock<
        typeof mockPrismaService.user.findUnique
      >
      mockFindUnique.mockResolvedValue(prismaUser)

      const result = await repository.findByUsername(username)

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username }
      })
      expect(result).toEqual(UserInfrastructureMapper.toDomain(prismaUser))
    })
  })

  describe('update', () => {
    it('should update user', async () => {
      const createdAt = new Date()
      const updatedAt = new Date()
      const userEntity = new UserEntity(
        new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
        'john@example.com',
        new UsernameValueObject('johndoe'),
        new NameValueObject('John'),
        new NameValueObject('Doe'),
        true,
        false,
        null,
        null,
        'user',
        createdAt,
        updatedAt
      )

      const prismaUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john@example.com',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
        banned: false,
        banReason: null,
        banExpires: null,
        role: 'user',
        name: 'John Doe',
        image: null,
        createdAt,
        updatedAt
      }

      const mockUpdate = mockPrismaService.user.update as Mock<typeof mockPrismaService.user.update>
      mockUpdate.mockResolvedValue(prismaUser)

      const result = await repository.update(userEntity)

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userEntity.id.value },
        data: UserInfrastructureMapper.toPrisma(userEntity)
      })
      expect(result).toEqual(UserInfrastructureMapper.toDomain(prismaUser))
    })
  })

  describe('delete', () => {
    it('should delete user', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')

      const mockDelete = mockPrismaService.user.delete as Mock<typeof mockPrismaService.user.delete>
      mockDelete.mockResolvedValue({} as unknown as { id: string })

      await repository.delete(userId)

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId.value }
      })
    })
  })

  describe('exists', () => {
    it('should return true when user exists', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const mockFindUnique = mockPrismaService.user.findUnique as Mock<
        typeof mockPrismaService.user.findUnique
      >
      mockFindUnique.mockResolvedValue({} as unknown as { id: string })

      const result = await repository.exists(userId)

      expect(result).toBe(true)
    })

    it('should return false when user does not exist', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const mockFindUnique = mockPrismaService.user.findUnique as Mock<
        typeof mockPrismaService.user.findUnique
      >
      mockFindUnique.mockResolvedValue(null)

      const result = await repository.exists(userId)

      expect(result).toBe(false)
    })
  })
})
