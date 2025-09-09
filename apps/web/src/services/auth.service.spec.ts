import { describe, expect, it, vi } from 'vitest'

import * as apiService from '~/lib/apiRequest'
import type { LoginSchema, SignupSchema } from '~/schemas/auth.schema'

import { login, register } from './auth.service'

vi.mock('~/lib/apiRequest', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

describe('auth service', () => {
  it('should call api.post with login endpoint for login', async () => {
    const mockLoginData: LoginSchema = {
      identifier: 'testuser',
      password: 'password123'
    }
    vi.mocked(apiService.api.post).mockResolvedValueOnce({
      success: true,
      data: { user: { id: '1', username: 'testuser' } }
    })

    await login(mockLoginData)

    expect(apiService.api.post).toHaveBeenCalledWith('/auth/login', {
      emailOrUsername: 'testuser',
      password: 'password123'
    })
  })

  it('should call api.post with register endpoint for signup', async () => {
    const mockSignupData: SignupSchema = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123'
    }
    vi.mocked(apiService.api.post).mockResolvedValueOnce({
      success: true,
      data: { user: { id: '2', username: 'newuser' } }
    })

    await register(mockSignupData)

    expect(apiService.api.post).toHaveBeenCalledWith('/auth/register', mockSignupData)
  })

  it('should extract user from response', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com'
    }
    const mockResponse = {
      success: true,
      data: { user: mockUser }
    }
    vi.mocked(apiService.api.post).mockResolvedValueOnce(mockResponse)
    const mockLoginData: LoginSchema = {
      identifier: 'testuser',
      password: 'password123'
    }

    const result = await login(mockLoginData)

    expect(result).toEqual({
      success: true,
      data: mockUser
    })
  })
})
