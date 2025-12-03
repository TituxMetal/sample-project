import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import type { Mock } from 'bun:test'

import { LoginDto } from '~/auth/application/dtos'
import { AuthUserEntity } from '~/auth/domain/entities'
import { AccountNotActiveException, InvalidCredentialsException } from '~/auth/domain/exceptions'
import { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'
import { TestDataFactory } from '~/shared/infrastructure/testing'

import { LoginUseCase } from './Login.uc'

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase
  let mockAuthUserRepository: {
    findById: Mock<(id: string) => Promise<AuthUserEntity | null>>
    findByEmail: Mock<(email: EmailValueObject) => Promise<AuthUserEntity | null>>
    findByUsername: Mock<(username: string) => Promise<AuthUserEntity | null>>
    save: Mock<(user: AuthUserEntity) => Promise<AuthUserEntity>>
    update: Mock<(user: AuthUserEntity) => Promise<AuthUserEntity>>
    delete: Mock<(id: string) => Promise<void>>
  }
  let mockPasswordService: {
    compare: Mock<(plain: string, hashed: string) => Promise<boolean>>
    hash: Mock<(plain: string) => Promise<string>>
  }
  let mockJwtService: { generateToken: Mock<(payload: object) => string> }

  beforeEach(() => {
    mockAuthUserRepository = {
      findById: mock(() => {}) as unknown as Mock<(id: string) => Promise<AuthUserEntity | null>>,
      findByEmail: mock(() => {}) as unknown as Mock<
        (email: EmailValueObject) => Promise<AuthUserEntity | null>
      >,
      findByUsername: mock(() => {}) as unknown as Mock<
        (username: string) => Promise<AuthUserEntity | null>
      >,
      save: mock(() => {}) as unknown as Mock<(user: AuthUserEntity) => Promise<AuthUserEntity>>,
      update: mock(() => {}) as unknown as Mock<(user: AuthUserEntity) => Promise<AuthUserEntity>>,
      delete: mock(() => {}) as unknown as Mock<(id: string) => Promise<void>>
    }

    mockPasswordService = {
      compare: mock(() => {}) as unknown as Mock<
        (plain: string, hashed: string) => Promise<boolean>
      >,
      hash: mock(() => {}) as unknown as Mock<(plain: string) => Promise<string>>
    }

    mockJwtService = {
      generateToken: mock(() => {}) as unknown as Mock<(payload: object) => string>
    }

    loginUseCase = new LoginUseCase(mockAuthUserRepository, mockPasswordService, mockJwtService)
  })

  afterEach(() => {
    mockAuthUserRepository.findById.mockClear()
    mockAuthUserRepository.findByEmail.mockClear()
    mockAuthUserRepository.findByUsername.mockClear()
    mockAuthUserRepository.save.mockClear()
    mockAuthUserRepository.update.mockClear()
    mockAuthUserRepository.delete.mockClear()
    mockPasswordService.compare.mockClear()
    mockPasswordService.hash.mockClear()
    mockJwtService.generateToken.mockClear()
  })

  describe('execute', () => {
    it('should login successfully with email', async () => {
      const loginData = TestDataFactory.createLoginData({
        emailOrUsername: 'user@example.com',
        password: 'password123'
      })
      const loginDto = new LoginDto(loginData.emailOrUsername, loginData.password)
      const authUser = TestDataFactory.createAuthUser({
        id: 'user-id',
        email: 'user@example.com',
        username: 'username',
        password: 'hashedPassword',
        isActive: true,
        isVerified: false
      })

      mockAuthUserRepository.findByEmail.mockResolvedValue(authUser)
      mockPasswordService.compare.mockResolvedValue(true)
      mockJwtService.generateToken.mockReturnValue('jwt-token')

      const result = await loginUseCase.execute(loginDto)

      expect(result).toEqual({
        token: 'jwt-token',
        user: {
          id: 'user-id',
          email: 'user@example.com',
          username: 'username'
        }
      })
      const findByEmailCalls = mockAuthUserRepository.findByEmail.mock.calls as [EmailValueObject][]
      expect(findByEmailCalls).toHaveLength(1)
      expect(findByEmailCalls[0]?.[0]).toEqual(
        expect.objectContaining({
          value: 'user@example.com'
        })
      )
    })

    it('should login successfully with username', async () => {
      const loginDto = new LoginDto('username', 'password123')
      const email = new EmailValueObject('user@example.com')
      const password = new PasswordValueObject('hashedPassword')
      const authUser = new AuthUserEntity(
        'user-id',
        email,
        'username',
        password,
        true,
        false,
        new Date()
      )

      mockAuthUserRepository.findByEmail.mockResolvedValue(null)
      mockAuthUserRepository.findByUsername.mockResolvedValue(authUser)
      mockPasswordService.compare.mockResolvedValue(true)
      mockJwtService.generateToken.mockReturnValue('jwt-token')

      const result = await loginUseCase.execute(loginDto)

      expect(result).toEqual({
        token: 'jwt-token',
        user: {
          id: 'user-id',
          email: 'user@example.com',
          username: 'username'
        }
      })
      const findByUsernameCalls = mockAuthUserRepository.findByUsername.mock.calls as [string][]
      expect(findByUsernameCalls).toHaveLength(1)
      expect(findByUsernameCalls[0]?.[0]).toBe('username')
    })

    it('should throw error when user not found', async () => {
      const loginDto = new LoginDto('nonexistent', 'password123')

      mockAuthUserRepository.findByEmail.mockResolvedValue(null)
      mockAuthUserRepository.findByUsername.mockResolvedValue(null)

      await expect(loginUseCase.execute(loginDto)).rejects.toThrow(InvalidCredentialsException)
    })

    it('should throw error when password is invalid', async () => {
      const loginDto = new LoginDto('user@example.com', 'wrongpassword')
      const email = new EmailValueObject('user@example.com')
      const password = new PasswordValueObject('hashedPassword')
      const authUser = new AuthUserEntity(
        'user-id',
        email,
        'username',
        password,
        true,
        false,
        new Date()
      )

      mockAuthUserRepository.findByEmail.mockResolvedValue(authUser)
      mockPasswordService.compare.mockResolvedValue(false)

      await expect(loginUseCase.execute(loginDto)).rejects.toThrow(InvalidCredentialsException)
    })

    it('should throw error when user is not active', async () => {
      const loginDto = new LoginDto('user@example.com', 'password123')
      const email = new EmailValueObject('user@example.com')
      const password = new PasswordValueObject('hashedPassword')
      const authUser = new AuthUserEntity(
        'user-id',
        email,
        'username',
        password,
        false,
        false,
        new Date()
      )

      mockAuthUserRepository.findByEmail.mockResolvedValue(authUser)
      mockPasswordService.compare.mockResolvedValue(true)

      await expect(loginUseCase.execute(loginDto)).rejects.toThrow(AccountNotActiveException)
    })
  })
})
