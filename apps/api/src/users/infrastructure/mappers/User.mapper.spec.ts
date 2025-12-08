import { describe, expect, it } from 'bun:test'

import type { User as PrismaUser } from '@generated'

import { UserEntity } from '~/users/domain/entities'
import {
  NameValueObject,
  UserIdValueObject,
  UsernameValueObject
} from '~/users/domain/value-objects'

import { UserInfrastructureMapper } from './User.mapper'

describe('UserInfrastructureMapper', () => {
  describe('toDomain', () => {
    it('should map PrismaUser to UserEntity with all fields', () => {
      const prismaUser: PrismaUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john@example.com',
        name: 'John Doe',
        image: null,
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
        banned: false,
        banReason: null,
        banExpires: null,
        role: 'user',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-02T00:00:00Z')
      }

      const result = UserInfrastructureMapper.toDomain(prismaUser)

      expect(result).toBeInstanceOf(UserEntity)
      expect(result.id).toBeInstanceOf(UserIdValueObject)
      expect(result.id.value).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(result.email).toBe('john@example.com')
      expect(result.username).toBeInstanceOf(UsernameValueObject)
      expect(result.username.value).toBe('johndoe')
      expect(result.firstName).toBeInstanceOf(NameValueObject)
      expect(result.firstName?.value).toBe('John')
      expect(result.lastName).toBeInstanceOf(NameValueObject)
      expect(result.lastName?.value).toBe('Doe')
      expect(result.emailVerified).toBe(true)
      expect(result.banned).toBe(false)
      expect(result.banReason).toBeNull()
      expect(result.banExpires).toBeNull()
      expect(result.role).toBe('user')
      expect(result.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'))
      expect(result.updatedAt).toEqual(new Date('2024-01-02T00:00:00Z'))
    })

    it('should map PrismaUser to UserEntity with null names', () => {
      const prismaUser: PrismaUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john@example.com',
        name: 'John Doe',
        image: null,
        username: 'johndoe',
        firstName: null,
        lastName: null,
        emailVerified: true,
        banned: false,
        banReason: null,
        banExpires: null,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = UserInfrastructureMapper.toDomain(prismaUser)

      expect(result.firstName).toBeUndefined()
      expect(result.lastName).toBeUndefined()
    })
  })

  describe('toPrisma', () => {
    it('should map UserEntity to Prisma data with all fields', () => {
      const userEntity = new UserEntity(
        new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
        'john@example.com',
        new UsernameValueObject('johndoe'),
        new NameValueObject('John'),
        new NameValueObject('Doe'),
        true, // emailVerified
        false, // banned
        null, // banReason
        null, // banExpires
        'user', // role
        new Date('2024-01-01T00:00:00Z'),
        new Date('2024-01-02T00:00:00Z')
      )

      const result = UserInfrastructureMapper.toPrisma(userEntity)

      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(result.email).toBe('john@example.com')
      expect(result.username).toBe('johndoe')
      expect(result.firstName).toBe('John')
      expect(result.lastName).toBe('Doe')
      expect(result.emailVerified).toBe(true)
      expect(result.banned).toBe(false)
      expect(result.banReason).toBeNull()
      expect(result.banExpires).toBeNull()
      expect(result.role).toBe('user')
      expect(result.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'))
      expect(result.updatedAt).toEqual(new Date('2024-01-02T00:00:00Z'))
    })

    it('should map UserEntity to Prisma data with undefined names', () => {
      const userEntity = new UserEntity(
        new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
        'john@example.com',
        new UsernameValueObject('johndoe'),
        undefined,
        undefined,
        true, // emailVerified
        false, // banned
        null, // banReason
        null, // banExpires
        'user', // role
        new Date(),
        new Date()
      )

      const result = UserInfrastructureMapper.toPrisma(userEntity)

      expect(result.firstName).toBeNull()
      expect(result.lastName).toBeNull()
    })
  })
})
