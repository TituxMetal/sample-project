import { RegisterDto } from '~/auth/application/dtos'
import { AuthUserEntity } from '~/auth/domain/entities'
import type { IAuthUserRepository } from '~/auth/domain/repositories'
import { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'
import { TestDataFactory } from '~/shared/infrastructure/testing'

import { RegisterUseCase } from './Register.uc'

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase
  let mockAuthUserRepository: jest.Mocked<IAuthUserRepository>
  let mockPasswordService: { hash: jest.Mock; compare: jest.Mock }
  let mockIdGenerator: { generate: jest.Mock }

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
      hash: jest.fn(),
      compare: jest.fn()
    }

    mockIdGenerator = {
      generate: jest.fn()
    }

    registerUseCase = new RegisterUseCase(
      mockAuthUserRepository,
      mockPasswordService,
      mockIdGenerator
    )
  })

  describe('execute', () => {
    it('should register a new user successfully', async () => {
      const registerData = TestDataFactory.createRegisterData({
        email: 'user@example.com',
        username: 'username',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe'
      })
      const registerDto = new RegisterDto(
        registerData.email,
        registerData.username,
        registerData.password,
        registerData.firstName,
        registerData.lastName
      )

      mockAuthUserRepository.findByEmail.mockResolvedValue(null)
      mockAuthUserRepository.findByUsername.mockResolvedValue(null)
      mockPasswordService.hash.mockResolvedValue('hashedPassword')
      mockIdGenerator.generate.mockReturnValue('user-id')

      const savedUser = TestDataFactory.createAuthUser({
        id: 'user-id',
        email: 'user@example.com',
        username: 'username',
        password: 'hashedPassword',
        isActive: false,
        isVerified: false
      })

      mockAuthUserRepository.save.mockResolvedValue(savedUser)

      const result = await registerUseCase.execute(registerDto)

      expect(result).toEqual({
        user: {
          id: 'user-id',
          email: 'user@example.com',
          username: 'username',
          confirmed: false
        }
      })
      const saveCalls = (mockAuthUserRepository.save as jest.Mock).mock.calls as [AuthUserEntity][]
      expect(saveCalls).toHaveLength(1)
      expect(saveCalls[0]?.[0]).toBeInstanceOf(AuthUserEntity)
    })

    it('should throw error when email already exists', async () => {
      const registerDto = new RegisterDto('existing@example.com', 'username', 'Password123!')

      const existingUser = new AuthUserEntity(
        'existing-id',
        new EmailValueObject('existing@example.com'),
        'existinguser',
        new PasswordValueObject('hashedPassword'),
        true,
        false,
        new Date()
      )

      mockAuthUserRepository.findByEmail.mockResolvedValue(existingUser)

      await expect(registerUseCase.execute(registerDto)).rejects.toThrow('Email already exists')
    })

    it('should throw error when username already exists', async () => {
      const registerDto = new RegisterDto('user@example.com', 'existingusername', 'Password123!')

      const existingUser = new AuthUserEntity(
        'existing-id',
        new EmailValueObject('different@example.com'),
        'existingusername',
        new PasswordValueObject('hashedPassword'),
        true,
        false,
        new Date()
      )

      mockAuthUserRepository.findByEmail.mockResolvedValue(null)
      mockAuthUserRepository.findByUsername.mockResolvedValue(existingUser)

      await expect(registerUseCase.execute(registerDto)).rejects.toThrow('Username already exists')
    })

    it('should register user without optional fields', async () => {
      const registerDto = new RegisterDto('user@example.com', 'username', 'Password123!')

      mockAuthUserRepository.findByEmail.mockResolvedValue(null)
      mockAuthUserRepository.findByUsername.mockResolvedValue(null)
      mockPasswordService.hash.mockResolvedValue('hashedPassword')
      mockIdGenerator.generate.mockReturnValue('user-id')

      const savedUser = new AuthUserEntity(
        'user-id',
        new EmailValueObject('user@example.com'),
        'username',
        new PasswordValueObject('hashedPassword'),
        false,
        false,
        new Date()
      )

      mockAuthUserRepository.save.mockResolvedValue(savedUser)

      const result = await registerUseCase.execute(registerDto)

      expect(result).toEqual({
        user: {
          id: 'user-id',
          email: 'user@example.com',
          username: 'username',
          confirmed: false
        }
      })
    })
  })
})
