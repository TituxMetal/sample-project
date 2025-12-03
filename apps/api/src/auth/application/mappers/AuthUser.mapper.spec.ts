import { describe, expect, it } from 'bun:test'

import { LoginDto, RegisterDto } from '~/auth/application/dtos'
import { TestDataFactory } from '~/shared/infrastructure/testing'

import { AuthUserMapper } from './AuthUser.mapper'

describe('AuthUserMapper', () => {
  describe('toLoginDto', () => {
    it('should convert data to LoginDto', () => {
      const data = TestDataFactory.createLoginData({
        emailOrUsername: 'user@example.com',
        password: 'password123'
      })

      const result = AuthUserMapper.toLoginDto(data)

      expect(result).toBeInstanceOf(LoginDto)
      expect(result.emailOrUsername).toBe(data.emailOrUsername)
      expect(result.password).toBe(data.password)
    })

    it('should handle username as identifier', () => {
      const data = TestDataFactory.createLoginData({
        emailOrUsername: 'username',
        password: 'password123'
      })

      const result = AuthUserMapper.toLoginDto(data)

      expect(result).toBeInstanceOf(LoginDto)
      expect(result.emailOrUsername).toBe(data.emailOrUsername)
      expect(result.password).toBe(data.password)
    })
  })

  describe('toRegisterDto', () => {
    it('should convert data to RegisterDto with required fields', () => {
      const data = {
        email: 'user@example.com',
        username: 'username',
        password: 'password123'
      }

      const result = AuthUserMapper.toRegisterDto(data)

      expect(result).toBeInstanceOf(RegisterDto)
      expect(result.email).toBe(data.email)
      expect(result.username).toBe(data.username)
      expect(result.password).toBe(data.password)
      expect(result.firstName).toBeUndefined()
      expect(result.lastName).toBeUndefined()
    })

    it('should convert data to RegisterDto with optional fields', () => {
      const data = TestDataFactory.createRegisterData({
        email: 'user@example.com',
        username: 'username',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      })

      const result = AuthUserMapper.toRegisterDto(data)

      expect(result).toBeInstanceOf(RegisterDto)
      expect(result.email).toBe(data.email)
      expect(result.username).toBe(data.username)
      expect(result.password).toBe(data.password)
      expect(result.firstName).toBe(data.firstName)
      expect(result.lastName).toBe(data.lastName)
    })
  })

  describe('toResponseDto', () => {
    it('should convert AuthUserEntity to response dto', () => {
      const authUser = TestDataFactory.createAuthUser({
        id: 'user-id',
        email: 'user@example.com',
        username: 'username',
        password: 'hashedPassword',
        isActive: true,
        isVerified: false
      })

      const result = AuthUserMapper.toResponseDto(authUser)

      expect(result).toEqual({
        id: authUser.id,
        email: authUser.email.value,
        username: authUser.username,
        confirmed: authUser.confirmed,
        blocked: authUser.blocked,
        createdAt: authUser.createdAt
      })
    })

    it('should handle unconfirmed blocked user', () => {
      const authUser = TestDataFactory.createAuthUser({
        id: 'blocked-id',
        email: 'blocked@example.com',
        username: 'blockeduser',
        password: 'hashedPassword',
        isActive: false,
        isVerified: true
      })

      const result = AuthUserMapper.toResponseDto(authUser)

      expect(result).toEqual({
        id: authUser.id,
        email: authUser.email.value,
        username: authUser.username,
        confirmed: authUser.confirmed,
        blocked: authUser.blocked,
        createdAt: authUser.createdAt
      })
    })
  })
})
