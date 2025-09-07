import { beforeEach, describe, expect, it, vi } from 'vitest'

import { onRequest } from './middleware'
import * as apiService from './services/api.service'

// Mock the api service
vi.mock('./services/api.service', () => ({
  apiRequest: vi.fn()
}))

describe('Authentication Middleware', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('continues without user when no token exists', async () => {
    const context = {
      cookies: {
        get: vi.fn().mockReturnValue(undefined)
      },
      locals: {},
      url: new URL('http://localhost/any-route')
    } as any
    const next = vi.fn().mockResolvedValue('next-result')

    const result = await onRequest(context, next)

    expect(next).toHaveBeenCalled()
    expect(context.locals.user).toBeUndefined()
    expect(result).toBe('next-result')
  })

  it('skips API call when user already exists in locals', async () => {
    const mockUser = { id: '1', username: 'test' }
    const context = {
      cookies: {
        get: vi.fn().mockReturnValue({ value: 'token-value' })
      },
      locals: { user: mockUser },
      url: new URL('http://localhost/any-route')
    } as any
    const next = vi.fn().mockResolvedValue('next-result')

    const result = await onRequest(context, next)

    expect(apiService.apiRequest).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(result).toBe('next-result')
  })

  it('sets user in locals when token is valid', async () => {
    const mockUser = { id: '1', username: 'test' }
    const context = {
      cookies: {
        get: vi.fn().mockReturnValue({ value: 'token-value' }),
        delete: vi.fn()
      },
      locals: {},
      url: new URL('http://localhost/any-route')
    } as any
    const next = vi.fn().mockResolvedValue('next-result')

    vi.mocked(apiService.apiRequest).mockResolvedValueOnce({
      success: true,
      data: mockUser,
      message: ''
    })

    const result = await onRequest(context, next)

    expect(apiService.apiRequest).toHaveBeenCalledWith(
      'http://localhost:3000/users/me',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
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
    const context = {
      cookies: {
        get: vi.fn().mockReturnValue({ value: 'invalid-token' }),
        delete: vi.fn()
      },
      locals: {},
      url: new URL('http://localhost/any-route')
    } as any
    const next = vi.fn().mockResolvedValue('next-result')

    vi.mocked(apiService.apiRequest).mockResolvedValueOnce({
      success: false,
      data: null,
      message: 'Unauthorized: Token is invalid'
    })

    const result = await onRequest(context, next)

    expect(context.cookies.delete).toHaveBeenCalledWith('auth_token')
    expect(context.locals.user).toBeUndefined()
    expect(next).toHaveBeenCalled()
    expect(result).toBe('next-result')
  })
})
