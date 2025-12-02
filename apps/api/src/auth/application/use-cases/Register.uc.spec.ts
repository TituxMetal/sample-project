import { beforeEach, describe, expect, it, mock } from 'bun:test'
import type { Mock } from 'bun:test'

import { RegisterDto } from '~/auth/application/dtos'
import { AuthUserEntity } from '~/auth/domain/entities'
import { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'
import { TestDataFactory } from '~/shared/infrastructure/testing'

import { RegisterUseCase } from './Register.uc'

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase
  let mockAuthUserRepository: {
    findById: Mock<(id: string) => Promise<AuthUserEntity | null>>
    findByEmail: Mock<(email: EmailValueObject) => Promise<AuthUserEntity | null>>
    findByUsername: Mock<(username: string) => Promise<AuthUserEntity | null>>
    save: Mock<(user: AuthUserEntity) => Promise<AuthUserEntity>>
    update: Mock<(user: AuthUserEntity) => Promise<AuthUserEntity>>
    delete: Mock<(id: string) => Promise<void>>
  }
  let mockPasswordService: {
    hash: Mock<(plain: string) => Promise<string>>
    compare: Mock<(plain: string, hashed: string) => Promise<boolean>>
  }
  let mockIdGenerator: { generate: Mock<() => string> }

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
      hash: mock(() => {}) as unknown as Mock<(plain: string) => Promise<string>>,
      compare: mock(() => {}) as unknown as Mock<
        (plain: string, hashed: string) => Promise<boolean>
      >
    }

    mockIdGenerator = {
      generate: mock(() => {}) as unknown as Mock<() => string>
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
      const saveCalls = mockAuthUserRepository.save.mock.calls as [AuthUserEntity][]
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
