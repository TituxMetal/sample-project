import { Test } from '@nestjs/testing'
import type { TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, mock } from 'bun:test'
import type { Mock } from 'bun:test'

import { LoginDto, RegisterDto } from '~/auth/application/dtos'
import { LoginUseCase, LogoutUseCase, RegisterUseCase } from '~/auth/application/use-cases'
import type { LoginResult, LogoutResult, RegisterResult } from '~/auth/application/use-cases'
import { TestDataFactory } from '~/shared/infrastructure/testing'

import { AuthService } from './Auth.service'

describe('AuthService', () => {
  let service: AuthService

  const mockLoginUseCase = {
    execute: mock(() => {}) as unknown as Mock<(dto: LoginDto) => Promise<LoginResult>>
  }

  const mockRegisterUseCase = {
    execute: mock(() => {}) as unknown as Mock<(dto: RegisterDto) => Promise<RegisterResult>>
  }

  const mockLogoutUseCase = {
    execute: mock(() => {}) as unknown as Mock<(token?: string) => Promise<LogoutResult>>
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: LoginUseCase,
          useValue: mockLoginUseCase
        },
        {
          provide: RegisterUseCase,
          useValue: mockRegisterUseCase
        },
        {
          provide: LogoutUseCase,
          useValue: mockLogoutUseCase
        }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
    mockLoginUseCase.execute.mockClear()
    mockRegisterUseCase.execute.mockClear()
    mockLogoutUseCase.execute.mockClear()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('login', () => {
    it('should call login use case with dto', async () => {
      const loginData = TestDataFactory.createLoginData({
        emailOrUsername: 'user@example.com',
        password: 'password123'
      })
      const loginDto = new LoginDto(loginData.emailOrUsername, loginData.password)
      const expectedResult: LoginResult = {
        token: 'jwt-token',
        user: {
          id: 'user-id',
          email: 'user@example.com',
          username: 'username'
        }
      }

      mockLoginUseCase.execute.mockResolvedValue(expectedResult)

      const result = await service.login(loginDto)

      expect(result).toEqual(expectedResult)
      expect(mockLoginUseCase.execute).toHaveBeenCalledTimes(1)
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(loginDto)
    })
  })

  describe('register', () => {
    it('should call register use case with dto', async () => {
      const registerData = TestDataFactory.createRegisterData({
        email: 'user@example.com',
        username: 'username',
        password: 'password123'
      })
      const registerDto = new RegisterDto(
        registerData.email,
        registerData.username,
        registerData.password,
        registerData.firstName,
        registerData.lastName
      )
      const expectedResult: RegisterResult = {
        user: {
          id: 'user-id',
          email: 'user@example.com',
          username: 'username',
          confirmed: true
        }
      }

      mockRegisterUseCase.execute.mockResolvedValue(expectedResult)

      const result = await service.register(registerDto)

      expect(result).toEqual(expectedResult)
      expect(mockRegisterUseCase.execute).toHaveBeenCalledTimes(1)
      expect(mockRegisterUseCase.execute).toHaveBeenCalledWith(registerDto)
    })
  })

  describe('logout', () => {
    it('should call logout use case without token', async () => {
      const expectedResult: LogoutResult = {
        success: true
      }

      mockLogoutUseCase.execute.mockResolvedValue(expectedResult)

      const result = await service.logout()

      expect(result).toEqual(expectedResult)
      expect(mockLogoutUseCase.execute).toHaveBeenCalledTimes(1)
      expect(mockLogoutUseCase.execute).toHaveBeenCalledWith(undefined)
    })

    it('should call logout use case with token', async () => {
      const token = 'jwt-token'
      const expectedResult: LogoutResult = {
        success: true
      }

      mockLogoutUseCase.execute.mockResolvedValue(expectedResult)

      const result = await service.logout(token)

      expect(result).toEqual(expectedResult)
      expect(mockLogoutUseCase.execute).toHaveBeenCalledTimes(1)
      expect(mockLogoutUseCase.execute).toHaveBeenCalledWith(token)
    })
  })
})
