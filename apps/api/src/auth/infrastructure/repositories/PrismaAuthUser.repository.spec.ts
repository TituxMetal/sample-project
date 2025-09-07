import { Test } from '@nestjs/testing'
import type { TestingModule } from '@nestjs/testing'
import type { User } from '@prisma/client'

import { AuthUserEntity } from '~/auth/domain/entities'
import { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'
import { PrismaProvider } from '~/shared/infrastructure/database'

import { PrismaAuthUserRepository } from './PrismaAuthUser.repository'

describe('PrismaAuthUserRepository', () => {
  let repository: PrismaAuthUserRepository
  let prismaService: PrismaProvider

  const mockPrismaProvider = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }

  const mockUser: User = {
    id: 'user-id',
    email: 'test@example.com',
    username: 'testuser',
    firstName: null,
    lastName: null,
    hash: 'hashed-password',
    confirmed: true,
    blocked: false,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaAuthUserRepository,
        {
          provide: PrismaProvider,
          useValue: mockPrismaProvider
        }
      ]
    }).compile()

    repository = module.get<PrismaAuthUserRepository>(PrismaAuthUserRepository)
    prismaService = module.get<PrismaProvider>(PrismaProvider)
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(repository).toBeDefined()
  })

  describe('findById', () => {
    it('should find user by id', async () => {
      mockPrismaProvider.user.findUnique.mockResolvedValue(mockUser)

      const result = await repository.findById('user-id')

      expect(result).toBeInstanceOf(AuthUserEntity)
      expect(result?.id).toBe('user-id')
      expect(result?.email.value).toBe('test@example.com')
      const findUniqueCalls = (prismaService.user.findUnique as jest.Mock).mock.calls as [
        { where: { id: string } }
      ][]
      expect(findUniqueCalls).toHaveLength(1)
      expect(findUniqueCalls[0]?.[0]).toEqual({ where: { id: 'user-id' } })
    })

    it('should return null when user not found', async () => {
      mockPrismaProvider.user.findUnique.mockResolvedValue(null)

      const result = await repository.findById('non-existent-id')

      expect(result).toBeNull()
    })
  })

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = new EmailValueObject('test@example.com')
      mockPrismaProvider.user.findUnique.mockResolvedValue(mockUser)

      const result = await repository.findByEmail(email)

      expect(result).toBeInstanceOf(AuthUserEntity)
      expect(result?.email.value).toBe('test@example.com')
      const findUniqueCalls = (prismaService.user.findUnique as jest.Mock).mock.calls as [
        { where: { email: string } }
      ][]
      expect(findUniqueCalls).toHaveLength(1)
      expect(findUniqueCalls[0]?.[0]).toEqual({ where: { email: 'test@example.com' } })
    })

    it('should return null when user not found', async () => {
      const email = new EmailValueObject('nonexistent@example.com')
      mockPrismaProvider.user.findUnique.mockResolvedValue(null)

      const result = await repository.findByEmail(email)

      expect(result).toBeNull()
    })
  })

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      mockPrismaProvider.user.findUnique.mockResolvedValue(mockUser)

      const result = await repository.findByUsername('testuser')

      expect(result).toBeInstanceOf(AuthUserEntity)
      expect(result?.username).toBe('testuser')
      const findUniqueCalls = (prismaService.user.findUnique as jest.Mock).mock.calls as [
        { where: { username: string } }
      ][]
      expect(findUniqueCalls).toHaveLength(1)
      expect(findUniqueCalls[0]?.[0]).toEqual({ where: { username: 'testuser' } })
    })

    it('should return null when user not found', async () => {
      mockPrismaProvider.user.findUnique.mockResolvedValue(null)

      const result = await repository.findByUsername('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('save', () => {
    it('should save a new user', async () => {
      const authUser = new AuthUserEntity(
        'user-id',
        new EmailValueObject('test@example.com'),
        'testuser',
        new PasswordValueObject('hashed-password'),
        true,
        false,
        new Date('2023-01-01')
      )

      mockPrismaProvider.user.create.mockResolvedValue(mockUser)

      const result = await repository.save(authUser)

      expect(result).toBeInstanceOf(AuthUserEntity)
      const createCalls = (prismaService.user.create as jest.Mock).mock.calls as [
        { data: unknown }
      ][]
      expect(createCalls).toHaveLength(1)
      expect(createCalls[0]?.[0]).toEqual({
        data: {
          id: 'user-id',
          email: 'test@example.com',
          username: 'testuser',
          hash: 'hashed-password',
          confirmed: true,
          blocked: false,
          createdAt: expect.any(Date) as Date
        }
      })
    })
  })

  describe('update', () => {
    it('should update an existing user', async () => {
      const authUser = new AuthUserEntity(
        'user-id',
        new EmailValueObject('test@example.com'),
        'testuser',
        new PasswordValueObject('hashed-password'),
        true,
        false,
        new Date('2023-01-01')
      )

      mockPrismaProvider.user.update.mockResolvedValue(mockUser)

      const result = await repository.update(authUser)

      expect(result).toBeInstanceOf(AuthUserEntity)
      const updateCalls = (prismaService.user.update as jest.Mock).mock.calls as [
        { where: { id: string }; data: unknown }
      ][]
      expect(updateCalls).toHaveLength(1)
      expect(updateCalls[0]?.[0]).toEqual({
        where: { id: 'user-id' },
        data: {
          id: 'user-id',
          email: 'test@example.com',
          username: 'testuser',
          hash: 'hashed-password',
          confirmed: true,
          blocked: false,
          createdAt: expect.any(Date) as Date
        }
      })
    })
  })

  describe('delete', () => {
    it('should delete a user', async () => {
      mockPrismaProvider.user.delete.mockResolvedValue(mockUser)

      await repository.delete('user-id')

      const deleteCalls = (prismaService.user.delete as jest.Mock).mock.calls as [
        { where: { id: string } }
      ][]
      expect(deleteCalls).toHaveLength(1)
      expect(deleteCalls[0]?.[0]).toEqual({ where: { id: 'user-id' } })
    })
  })
})
