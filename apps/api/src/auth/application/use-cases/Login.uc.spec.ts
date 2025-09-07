import { LoginDto } from '~/auth/application/dtos'
import { AuthUserEntity } from '~/auth/domain/entities'
import { AccountNotActiveException, InvalidCredentialsException } from '~/auth/domain/exceptions'
import type { IAuthUserRepository } from '~/auth/domain/repositories'
import { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'
import { TestDataFactory } from '~/shared/infrastructure/testing'

import { LoginUseCase } from './Login.uc'

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase
  let mockAuthUserRepository: jest.Mocked<IAuthUserRepository>
  let mockPasswordService: { compare: jest.Mock; hash: jest.Mock }
  let mockJwtService: { generateToken: jest.Mock }

  beforeEach(() => {
    mockAuthUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    mockPasswordService = {
      compare: jest.fn(),
      hash: jest.fn()
    }

    mockJwtService = {
      generateToken: jest.fn()
    }

    loginUseCase = new LoginUseCase(mockAuthUserRepository, mockPasswordService, mockJwtService)
  })

  afterEach(() => {
    jest.clearAllMocks()
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
      const findByEmailCalls = (mockAuthUserRepository.findByEmail as jest.Mock).mock.calls as [
        EmailValueObject
      ][]
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
      const findByUsernameCalls = (mockAuthUserRepository.findByUsername as jest.Mock).mock
        .calls as [string][]
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
