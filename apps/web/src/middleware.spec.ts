import type { APIContext, MiddlewareNext } from 'astro'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { apiRequest } from './lib/apiRequest'
import { onRequest } from './middleware'
import type { User } from './types/user.types'

// Mock the api service
vi.mock('./lib/apiRequest', () => ({
  apiRequest: vi.fn()
}))

// Create proper mock context type
const createMockContext = (overrides: Partial<APIContext> = {}): APIContext =>
  ({
    cookies: {
      get: vi.fn(),
      delete: vi.fn()
    } as unknown as APIContext['cookies'],
    locals: {},
    url: new URL('http://localhost/any-route'),
    ...overrides
  }) as APIContext

describe('Authentication Middleware', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('continues without user when no token exists', async () => {
    const mockGet = vi.fn().mockReturnValue(undefined)
    const context = createMockContext({
      cookies: {
        get: mockGet,
        delete: vi.fn()
      } as unknown as APIContext['cookies']
    })
    const next = vi.fn().mockResolvedValue('next-result') as MiddlewareNext

    const result = await onRequest(context, next)

    expect(next).toHaveBeenCalled()
    expect(context.locals.user).toBeUndefined()
    expect(result).toBe('next-result')
  })

  it('skips API call when user already exists in locals', async () => {
    const mockUser: User = {
      id: '1',
      username: 'test',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      confirmed: true,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }
    const mockGet = vi.fn().mockReturnValue({ value: 'token-value' })
    const context = createMockContext({
      cookies: {
        get: mockGet,
        delete: vi.fn()
      } as unknown as APIContext['cookies'],
      locals: { user: mockUser }
    })
    const next = vi.fn().mockResolvedValue('next-result') as MiddlewareNext

    const result = await onRequest(context, next)

    expect(apiRequest).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(result).toBe('next-result')
  })

  it('sets user in locals when token is valid', async () => {
    const mockUser: User = {
      id: '1',
      username: 'test',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      confirmed: true,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }
    const mockGet = vi.fn().mockReturnValue({ value: 'token-value' })
    const mockDelete = vi.fn()
    const context = createMockContext({
      cookies: {
        get: mockGet,
        delete: mockDelete
      } as unknown as APIContext['cookies']
    })
    const next = vi.fn().mockResolvedValue('next-result') as MiddlewareNext

    vi.mocked(apiRequest).mockResolvedValueOnce({
      success: true,
      data: mockUser,
      message: ''
    })

    const result = await onRequest(context, next)

    expect(apiRequest).toHaveBeenCalledWith(
      '/users/me',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Authorization: 'Bearer token-value'
        }
      })
    )
    expect(context.locals.user).toEqual(mockUser)
    expect(next).toHaveBeenCalled()
    expect(result).toBe('next-result')
  })

  it('clears auth cookie when token is unauthorized', async () => {
    const mockGet = vi.fn().mockReturnValue({ value: 'invalid-token' })
    const mockDelete = vi.fn()
    const context = createMockContext({
      cookies: {
        get: mockGet,
        delete: mockDelete
      } as unknown as APIContext['cookies']
    })
    const next = vi.fn().mockResolvedValue('next-result') as MiddlewareNext

    vi.mocked(apiRequest).mockResolvedValueOnce({
      success: false,
      data: undefined,
      message: 'Unauthorized: Token is invalid'
    })

    const result = await onRequest(context, next)

    expect(mockDelete).toHaveBeenCalledWith('auth_token')
    expect(context.locals.user).toBeUndefined()
    expect(next).toHaveBeenCalled()
    expect(result).toBe('next-result')
  })
})
