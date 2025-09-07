import { describe, expect, it, vi } from 'vitest'

import type { LoginSchema, SignupSchema } from '~/schemas/auth.schema'

import * as apiService from './api.service'
import { authenticateUser } from './auth.service'

vi.mock('./api.service', () => ({
  apiRequest: vi.fn()
}))

describe('authenticateUser', () => {
  it('should call apiRequest with login endpoint for login mode', async () => {
    const mockLoginData: LoginSchema = {
      identifier: 'testuser',
      password: 'password123'
    }
    vi.mocked(apiService.apiRequest).mockResolvedValueOnce({
      success: true,
      data: { id: '1', username: 'testuser' }
    })

    await authenticateUser(mockLoginData, 'login')

    expect(apiService.apiRequest).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ emailOrUsername: 'testuser', password: 'password123' })
    })
  })

  it('should call apiRequest with register endpoint for signup mode', async () => {
    const mockSignupData: SignupSchema = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123'
    }
    vi.mocked(apiService.apiRequest).mockResolvedValueOnce({
      success: true,
      data: { id: '2', username: 'newuser' }
    })

    await authenticateUser(mockSignupData, 'signup')

    expect(apiService.apiRequest).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockSignupData)
    })
  })

  it('should return the API response directly', async () => {
    const mockResponse = {
      success: true,
      data: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      }
    }
    vi.mocked(apiService.apiRequest).mockResolvedValueOnce(mockResponse)
    const mockLoginData: LoginSchema = {
      identifier: 'testuser',
      password: 'password123'
    }

    const result = await authenticateUser(mockLoginData, 'login')

    expect(result).toEqual(mockResponse)
  })
})
