import type { APIContext, MiddlewareNext } from 'astro'
import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import * as apiModule from './lib/apiRequest'
import { onRequest } from './middleware'
import type { User } from './types/user.types'

// Create proper mock context type
const createMockContext = (overrides: Partial<APIContext> = {}): APIContext =>
  ({
    cookies: {
      get: mock(() => undefined),
      delete: mock(() => {})
    } as unknown as APIContext['cookies'],
    locals: {},
    url: new URL('http://localhost/any-route'),
    ...overrides
  }) as APIContext

describe('Authentication Middleware', () => {
  let apiRequestSpy: Mock<typeof apiModule.apiRequest>

  beforeEach(() => {
    apiRequestSpy = spyOn(apiModule, 'apiRequest').mockResolvedValue({
      success: true,
      data: null,
      message: ''
    })
    spyOn(console, 'log').mockImplementation(() => {})
    spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    apiRequestSpy.mockRestore()
  })

  it('continues without user when no session token exists', async () => {
    const mockGet = mock(() => undefined)
    const context = createMockContext({
      cookies: {
        get: mockGet,
        delete: mock(() => {})
      } as unknown as APIContext['cookies']
    })
    const next = mock(() => Promise.resolve('next-result')) as unknown as MiddlewareNext

    const result = await onRequest(context, next)

    expect(next).toHaveBeenCalled()
    expect(context.locals.user).toBeUndefined()
    expect(result).toBe('next-result' as unknown as Response)
  })

  it('skips API call when user already exists in locals', async () => {
    const mockUser: User = {
      id: '1',
      username: 'test',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      emailVerified: true,
      role: 'user',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }
    const mockGet = mock(() => ({ value: 'session-token-value' }))
    const context = createMockContext({
      cookies: {
        get: mockGet,
        delete: mock(() => {})
      } as unknown as APIContext['cookies'],
      locals: { user: mockUser }
    })
    const next = mock(() => Promise.resolve('next-result')) as unknown as MiddlewareNext

    const result = await onRequest(context, next)

    expect(apiModule.apiRequest).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(result).toBe('next-result' as unknown as Response)
  })

  it('sets user in locals when session token is valid', async () => {
    const mockUser: User = {
      id: '1',
      username: 'test',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      emailVerified: true,
      role: 'user',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }
    const mockGet = mock(() => ({ value: 'session-token-value' }))
    const mockDelete = mock(() => {})
    const context = createMockContext({
      cookies: {
        get: mockGet,
        delete: mockDelete
      } as unknown as APIContext['cookies']
    })
    const next = mock(() => Promise.resolve('next-result')) as unknown as MiddlewareNext

    apiRequestSpy.mockResolvedValueOnce({
      success: true,
      data: mockUser,
      message: ''
    })

    const result = await onRequest(context, next)

    expect(apiModule.apiRequest).toHaveBeenCalledWith(
      '/api/users/me',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Cookie: 'better-auth.session_token=session-token-value'
        }
      })
    )
    expect(context.locals.user).toEqual(mockUser)
    expect(next).toHaveBeenCalled()
    expect(result).toBe('next-result' as unknown as Response)
  })

  it('clears session cookie when token is unauthorized', async () => {
    const mockGet = mock(() => ({ value: 'invalid-token' }))
    const mockDelete = mock(() => {})
    const context = createMockContext({
      cookies: {
        get: mockGet,
        delete: mockDelete
      } as unknown as APIContext['cookies']
    })
    const next = mock(() => Promise.resolve('next-result')) as unknown as MiddlewareNext

    apiRequestSpy.mockResolvedValueOnce({
      success: false,
      data: undefined,
      message: 'Unauthorized: Token is invalid'
    })

    const result = await onRequest(context, next)

    expect(mockDelete).toHaveBeenCalledWith('better-auth.session_token')
    expect(context.locals.user).toBeUndefined()
    expect(next).toHaveBeenCalled()
    expect(result).toBe('next-result' as unknown as Response)
  })
})
