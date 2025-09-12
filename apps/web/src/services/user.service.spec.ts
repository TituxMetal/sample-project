import { describe, expect, it, vi } from 'vitest'

import * as apiService from '~/lib/apiRequest'
import type { UpdateProfileSchema } from '~/schemas/user.schema'
import type { User } from '~/types/user.types'

import { updateProfile } from './user.service'

vi.mock('~/lib/apiRequest', () => ({
  api: {
    patch: vi.fn()
  }
}))

describe('updateProfile', () => {
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
      confirmed: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    vi.mocked(apiService.api.patch).mockResolvedValueOnce({
      success: true,
      data: mockUser
    })

    const result = await updateProfile(data)

    expect(apiService.api.patch).toHaveBeenCalledWith('/users/me', data)
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
      confirmed: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }

    vi.mocked(apiService.api.patch).mockResolvedValueOnce({
      success: true,
      data: mockUser
    })

    const result = await updateProfile(data)

    expect(apiService.api.patch).toHaveBeenCalledWith('/users/me', data)
    expect(result).toEqual(mockUser)
  })

  it('throws error on failed update', async () => {
    const data: UpdateProfileSchema = {
      username: 'invalid_user',
      firstName: 'John',
      lastName: 'Doe'
    }

    vi.mocked(apiService.api.patch).mockResolvedValueOnce({
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

    vi.mocked(apiService.api.patch).mockRejectedValue(new Error('Network error'))

    await expect(updateProfile(data)).rejects.toThrow('Network error')
  })
})
