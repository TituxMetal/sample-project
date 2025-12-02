import { UnauthorizedException } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import type { TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, mock } from 'bun:test'
import type { Mock } from 'bun:test'

import { JwtService } from '~/auth/infrastructure/services'

import { JwtAuthGuard } from './JwtAuth.guard'

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard
  let jwtService: JwtService

  const mockJwtService = {
    verifyToken: mock(() => {}) as unknown as Mock<
      (token: string) => { sub: string; email: string; username: string } | null
    >
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ]
    }).compile()

    guard = module.get<JwtAuthGuard>(JwtAuthGuard)
    jwtService = module.get<JwtService>(JwtService)
    mockJwtService.verifyToken.mockClear()
  })

  const createMockExecutionContext = (request: unknown): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request
      })
    }) as ExecutionContext

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })

  describe('canActivate', () => {
    it('should return true for valid token in cookies', () => {
      const mockRequest = {
        cookies: { auth_token: 'valid-token' },
        headers: {}
      }

      const mockPayload = {
        sub: 'user-id',
        email: 'test@example.com',
        username: 'testuser'
      }

      mockJwtService.verifyToken.mockReturnValue(mockPayload)

      const context = createMockExecutionContext(mockRequest)
      const result = guard.canActivate(context)

      expect(result).toBe(true)
      const verifyTokenCalls = (jwtService.verifyToken as Mock<typeof jwtService.verifyToken>).mock
        .calls as [string][]
      expect(verifyTokenCalls).toHaveLength(1)
      expect(verifyTokenCalls[0]?.[0]).toBe('valid-token')
      expect((mockRequest as unknown as { user: unknown }).user).toEqual(mockPayload)
    })

    it('should return true for valid token in Authorization header', () => {
      const mockRequest = {
        cookies: {},
        headers: { authorization: 'Bearer valid-token' }
      }

      const mockPayload = {
        sub: 'user-id',
        email: 'test@example.com',
        username: 'testuser'
      }

      mockJwtService.verifyToken.mockReturnValue(mockPayload)

      const context = createMockExecutionContext(mockRequest)
      const result = guard.canActivate(context)

      expect(result).toBe(true)
      const verifyTokenCalls = (jwtService.verifyToken as Mock<typeof jwtService.verifyToken>).mock
        .calls as [string][]
      expect(verifyTokenCalls).toHaveLength(1)
      expect(verifyTokenCalls[0]?.[0]).toBe('valid-token')
    })

    it('should throw UnauthorizedException when no token provided', () => {
      const mockRequest = {
        cookies: {},
        headers: {}
      }

      const context = createMockExecutionContext(mockRequest)

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException)
      expect(() => guard.canActivate(context)).toThrow('No token provided')
    })

    it('should throw UnauthorizedException when token is invalid', () => {
      const mockRequest = {
        cookies: { auth_token: 'invalid-token' },
        headers: {}
      }

      mockJwtService.verifyToken.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const context = createMockExecutionContext(mockRequest)

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException)
      expect(() => guard.canActivate(context)).toThrow('Invalid token')
    })

    it('should prioritize cookie token over header token', () => {
      const mockRequest = {
        cookies: { auth_token: 'cookie-token' },
        headers: { authorization: 'Bearer header-token' }
      }

      const mockPayload = {
        sub: 'user-id',
        email: 'test@example.com',
        username: 'testuser'
      }

      mockJwtService.verifyToken.mockReturnValue(mockPayload)

      const context = createMockExecutionContext(mockRequest)
      const result = guard.canActivate(context)

      expect(result).toBe(true)
      const verifyTokenCalls = (jwtService.verifyToken as Mock<typeof jwtService.verifyToken>).mock
        .calls as [string][]
      expect(verifyTokenCalls).toHaveLength(1)
      expect(verifyTokenCalls[0]?.[0]).toBe('cookie-token')
    })

    it('should handle malformed Authorization header', () => {
      const mockRequest = {
        cookies: {},
        headers: { authorization: 'InvalidFormat token' }
      }

      const context = createMockExecutionContext(mockRequest)

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException)
      expect(() => guard.canActivate(context)).toThrow('No token provided')
    })

    it('should handle non-string Authorization header', () => {
      const mockRequest = {
        cookies: {},
        headers: { authorization: 123 }
      }

      const context = createMockExecutionContext(mockRequest)

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException)
      expect(() => guard.canActivate(context)).toThrow('No token provided')
    })
  })
})
