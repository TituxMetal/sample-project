import { Test } from '@nestjs/testing'
import type { TestingModule } from '@nestjs/testing'

import { LoginDto, RegisterDto } from '~/auth/application/dtos'
import { LoginUseCase, LogoutUseCase, RegisterUseCase } from '~/auth/application/use-cases'
import type { LoginResult, LogoutResult, RegisterResult } from '~/auth/application/use-cases'
import { TestDataFactory } from '~/shared/infrastructure/testing'

import { AuthService } from './Auth.service'

describe('AuthService', () => {
  let service: AuthService
  let loginUseCase: LoginUseCase
  let registerUseCase: RegisterUseCase
  let logoutUseCase: LogoutUseCase

  const mockLoginUseCase = {
    execute: jest.fn()
  }

  const mockRegisterUseCase = {
    execute: jest.fn()
  }

  const mockLogoutUseCase = {
    execute: jest.fn()
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
    loginUseCase = module.get<LoginUseCase>(LoginUseCase)
    registerUseCase = module.get<RegisterUseCase>(RegisterUseCase)
    logoutUseCase = module.get<LogoutUseCase>(LogoutUseCase)
    jest.clearAllMocks()
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
      const executeCalls = (loginUseCase.execute as jest.Mock).mock.calls as [LoginDto][]
      expect(executeCalls).toHaveLength(1)
      expect(executeCalls[0]?.[0]).toEqual(loginDto)
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
      const executeCalls = (registerUseCase.execute as jest.Mock).mock.calls as [RegisterDto][]
      expect(executeCalls).toHaveLength(1)
      expect(executeCalls[0]?.[0]).toEqual(registerDto)
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
      const executeCalls = (logoutUseCase.execute as jest.Mock).mock.calls as [string?][]
      expect(executeCalls).toHaveLength(1)
      expect(executeCalls[0]?.[0]).toBeUndefined()
    })

    it('should call logout use case with token', async () => {
      const token = 'jwt-token'
      const expectedResult: LogoutResult = {
        success: true
      }

      mockLogoutUseCase.execute.mockResolvedValue(expectedResult)

      const result = await service.logout(token)

      expect(result).toEqual(expectedResult)
      const executeCalls = (logoutUseCase.execute as jest.Mock).mock.calls as [string?][]
      expect(executeCalls).toHaveLength(1)
      expect(executeCalls[0]?.[0]).toBe(token)
    })
  })
})
