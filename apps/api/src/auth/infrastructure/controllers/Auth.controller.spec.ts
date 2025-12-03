import { Test } from '@nestjs/testing'
import type { TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, mock } from 'bun:test'
import type { Mock } from 'bun:test'

import { AuthService } from '~/auth/application/services'
import type { LoginResult, LogoutResult, RegisterResult } from '~/auth/application/use-cases'
import { JwtAuthGuard } from '~/auth/infrastructure/guards'
import { LoggerService } from '~/shared/infrastructure/services'

import { AuthController } from './Auth.controller'

describe('AuthController', () => {
  let controller: AuthController

  const mockAuthService = {
    register: mock(() => {}) as unknown as Mock<(dto: unknown) => Promise<RegisterResult>>,
    login: mock(() => {}) as unknown as Mock<(dto: unknown) => Promise<LoginResult>>,
    logout: mock(() => {}) as unknown as Mock<(token?: string) => Promise<LogoutResult>>
  }

  const mockLoggerService = {
    info: mock(() => {}),
    warn: mock(() => {}),
    error: mock(() => {}),
    debug: mock(() => {})
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService
        }
      ]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: mock(() => true) })
      .compile()

    controller = module.get<AuthController>(AuthController)

    mockAuthService.register.mockClear()
    mockAuthService.login.mockClear()
    mockAuthService.logout.mockClear()
    mockLoggerService.info.mockClear()
    mockLoggerService.warn.mockClear()
    mockLoggerService.error.mockClear()
    mockLoggerService.debug.mockClear()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('register', () => {
    it('should register a new user', async () => {
      const registerData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      }

      const expectedResult = {
        user: {
          id: 'user-id',
          email: 'test@example.com',
          username: 'testuser',
          confirmed: false
        }
      }

      mockAuthService.register.mockResolvedValue(expectedResult)

      const result = await controller.register(registerData)

      expect(result).toEqual(expectedResult)
      expect(mockAuthService.register).toHaveBeenCalledTimes(1)
    })
  })

  describe('login', () => {
    it('should login and set cookie', async () => {
      const loginData = {
        emailOrUsername: 'test@example.com',
        password: 'Password123!'
      }

      const loginResult = {
        token: 'jwt-token',
        user: {
          id: 'user-id',
          email: 'test@example.com',
          username: 'testuser'
        }
      }

      mockAuthService.login.mockResolvedValue(loginResult)

      const mockResponse = {
        cookie: mock(() => {})
      }

      const result = await controller.login(loginData, mockResponse as never)

      expect(result).toEqual({ user: loginResult.user })
      expect(mockAuthService.login).toHaveBeenCalledTimes(1)
      expect(mockResponse.cookie).toHaveBeenCalledWith('auth_token', 'jwt-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      })
    })
  })

  describe('logout', () => {
    it('should logout and clear cookie', async () => {
      const mockRequest = {
        cookies: { auth_token: 'jwt-token' }
      }

      const mockResponse = {
        clearCookie: mock(() => {})
      }

      mockAuthService.logout.mockResolvedValue({ success: true })

      const result = await controller.logout(mockRequest as never, mockResponse as never)

      expect(result).toEqual({ success: true })
      expect(mockAuthService.logout).toHaveBeenCalledWith('jwt-token')
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('auth_token')
    })

    it('should logout without token', async () => {
      const mockRequest = {
        cookies: {}
      }

      const mockResponse = {
        clearCookie: mock(() => {})
      }

      mockAuthService.logout.mockResolvedValue({ success: true })

      const result = await controller.logout(mockRequest as never, mockResponse as never)

      expect(result).toEqual({ success: true })
      expect(mockAuthService.logout).toHaveBeenCalledWith(undefined)
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('auth_token')
    })
  })
})
