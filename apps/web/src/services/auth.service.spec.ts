import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import type { Mock } from 'bun:test'

import { api } from '~/lib/apiRequest'
import type { LoginSchema, SignupSchema } from '~/schemas/auth.schema'
import type { User } from '~/types/user.types'

import { getCurrentUser, login, logout, register } from './auth.service'

describe('auth service', () => {
  let postSpy: Mock<typeof api.post>
  let getSpy: Mock<typeof api.get>

  beforeEach(() => {
    postSpy = spyOn(api, 'post')
    getSpy = spyOn(api, 'get')
  })

  afterEach(() => {
    postSpy.mockRestore()
    getSpy.mockRestore()
  })

  it('should call api.post with login endpoint for login', async () => {
    const mockLoginData: LoginSchema = {
      identifier: 'testuser',
      password: 'password123'
    }
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      confirmed: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
    postSpy.mockResolvedValueOnce({
      success: true,
      data: { user: mockUser }
    })

    const result = await login(mockLoginData)

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      emailOrUsername: 'testuser',
      password: 'password123'
    })
    expect(result).toEqual(mockUser)
  })

  it('should call api.post with register endpoint for signup', async () => {
    const mockSignupData: SignupSchema = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123'
    }
    const mockUser: User = {
      id: '2',
      username: 'newuser',
      email: 'new@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      confirmed: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
    postSpy.mockResolvedValueOnce({
      success: true,
      data: { user: mockUser }
    })

    const result = await register(mockSignupData)

    expect(api.post).toHaveBeenCalledWith('/auth/register', mockSignupData)
    expect(result).toEqual(mockUser)
  })

  it('should handle logout', async () => {
    postSpy.mockResolvedValueOnce({
      success: true,
      data: undefined
    })

    await expect(logout()).resolves.toBeUndefined()

    expect(api.post).toHaveBeenCalledWith('/auth/logout')
  })

  it('should handle getCurrentUser', async () => {
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      confirmed: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
    getSpy.mockResolvedValueOnce({
      success: true,
      data: mockUser
    })

    const result = await getCurrentUser()

    expect(api.get).toHaveBeenCalledWith('/users/me')
    expect(result).toEqual(mockUser)
  })

  it('should throw error on failed login', async () => {
    const mockLoginData: LoginSchema = {
      identifier: 'testuser',
      password: 'wrongpassword'
    }
    postSpy.mockResolvedValueOnce({
      success: false,
      message: 'Invalid credentials'
    })

    await expect(login(mockLoginData)).rejects.toThrow('Invalid credentials')
  })

  it('should throw error on failed register', async () => {
    const mockSignupData: SignupSchema = {
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123'
    }
    postSpy.mockResolvedValueOnce({
      success: false,
      message: 'User already exists'
    })

    await expect(register(mockSignupData)).rejects.toThrow('User already exists')
  })
})
