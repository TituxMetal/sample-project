import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { api } from '~/lib/apiRequest'
import type { User } from '~/types/user.types'

import type { UpdateProfileSchema } from '../schemas/user.schema'

import { updateProfile } from './user.service'

describe('updateProfile', () => {
  let patchSpy: Mock<typeof api.patch>

  beforeEach(() => {
    patchSpy = spyOn(api, 'patch')
  })

  afterEach(() => {
    patchSpy.mockRestore()
  })

  it('calls api.patch with correct endpoint and data', async () => {
    const data: UpdateProfileSchema = {
      username: 'valid_user',
      firstName: 'John',
      lastName: 'Doe'
    }
    const mockUser: User = {
      id: '1',
      username: 'valid_user',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      emailVerified: true,
      role: 'user',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    patchSpy.mockResolvedValueOnce({
      success: true,
      data: mockUser
    })

    const result = await updateProfile(data)

    expect(api.patch).toHaveBeenCalledWith('/users/me', data)
    expect(result).toEqual(mockUser)
  })

  it('handles partial updates', async () => {
    const data: UpdateProfileSchema = { firstName: 'Jane' }
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      emailVerified: true,
      role: 'user',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    patchSpy.mockResolvedValueOnce({
      success: true,
      data: mockUser
    })

    const result = await updateProfile(data)

    expect(api.patch).toHaveBeenCalledWith('/users/me', data)
    expect(result).toEqual(mockUser)
  })

  it('throws error on failed update', async () => {
    const data: UpdateProfileSchema = {
      username: 'invalid_user',
      firstName: 'John',
      lastName: 'Doe'
    }

    patchSpy.mockResolvedValueOnce({
      success: false,
      message: 'Validation failed'
    })

    await expect(updateProfile(data)).rejects.toThrow('Validation failed')
  })

  it('handles network errors', async () => {
    const data: UpdateProfileSchema = {
      username: 'testuser',
      firstName: 'John',
      lastName: 'Doe'
    }

    patchSpy.mockImplementation(() => Promise.reject(new Error('Network error')))

    await expect(updateProfile(data)).rejects.toThrow('Network error')
  })
})
