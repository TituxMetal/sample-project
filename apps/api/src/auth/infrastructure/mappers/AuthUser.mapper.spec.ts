import { describe, expect, it } from 'bun:test'

import type { User } from '@generated'

import { AuthUserEntity } from '~/auth/domain/entities'
import { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'
import { TestDataFactory } from '~/shared/infrastructure/testing'

import { AuthUserMapper } from './AuthUser.mapper'

describe('AuthUserMapper', () => {
  const mockPrismaUser: User = {
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

  const mockAuthUser = TestDataFactory.createAuthUser({
    id: 'user-id',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashed-password',
    isActive: true,
    isVerified: false
  })

  describe('toDomain', () => {
    it('should convert Prisma user to domain entity', () => {
      const result = AuthUserMapper.toDomain(mockPrismaUser)

      expect(result).toBeInstanceOf(AuthUserEntity)
      expect(result.id).toBe('user-id')
      expect(result.email).toBeInstanceOf(EmailValueObject)
      expect(result.email.value).toBe('test@example.com')
      expect(result.username).toBe('testuser')
      expect(result.password).toBeInstanceOf(PasswordValueObject)
      expect(result.password.value).toBe('hashed-password')
      expect(result.confirmed).toBe(true)
      expect(result.blocked).toBe(false)
      expect(result.createdAt).toEqual(new Date('2023-01-01'))
    })
  })

  describe('toPersistence', () => {
    it('should convert domain entity to persistence data', () => {
      const result = AuthUserMapper.toPersistence(mockAuthUser)

      expect(result).toEqual({
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        hash: 'hashed-password',
        confirmed: true,
        blocked: false,
        createdAt: expect.any(Date)
      })
    })
  })
})
