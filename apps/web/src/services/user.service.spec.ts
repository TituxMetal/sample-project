import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { UpdateProfileSchema } from '~/schemas/user.schema'

import * as apiService from './api.service'
import { updateProfile } from './user.service'

describe('updateProfile', () => {
  const mockApiRequest = vi.spyOn(apiService, 'apiRequest')
  const validData: UpdateProfileSchema = {
    username: 'valid_user',
    firstName: 'John',
    lastName: 'Doe'
  }

  beforeEach(() => {
    mockApiRequest.mockReset()
    Object.defineProperty(import.meta, 'env', {
      value: { PUBLIC_API_URL: 'https://api.example.com' },
      writable: true
    })
  })

  it('calls apiRequest with correct endpoint, method, headers, and body', async () => {
    const data = validData

    mockApiRequest.mockResolvedValue({ success: true })
    await updateProfile(data)

    expect(['https://api.example.com/users/me', '/api/users/me']).toContain(
      mockApiRequest.mock.calls[0][0]
    )
  })

  it('returns the result of apiRequest', async () => {
    const data = validData

    mockApiRequest.mockResolvedValue({ success: true, data: { foo: 'bar' } })
    const result = await updateProfile(data)

    expect(result).toEqual({ success: true, data: { foo: 'bar' } })
  })

  it('passes custom headers if provided', async () => {
    const data = validData
    const customHeaders = { Authorization: 'Bearer token' }

    mockApiRequest.mockResolvedValue({ success: true })
    await updateProfile(data, customHeaders)

    expect(mockApiRequest).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token',
          'Content-Type': 'application/json'
        })
      })
    )
  })

  it('falls back to /api if PUBLIC_API_URL is not set', async () => {
    const data = validData

    Object.defineProperty(import.meta, 'env', {
      value: {},
      writable: true
    })
    mockApiRequest.mockResolvedValue({ success: true })
    await updateProfile(data)

    expect(mockApiRequest).toHaveBeenCalledWith('/api/users/me', expect.any(Object))
  })

  it('serializes only provided fields for partial update', async () => {
    const data: UpdateProfileSchema = { firstName: 'Jane' }

    mockApiRequest.mockResolvedValue({ success: true })
    await updateProfile(data)

    expect(mockApiRequest).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify(data)
      })
    )
  })

  it('handles apiRequest errors', async () => {
    const data = validData

    mockApiRequest.mockRejectedValue(new Error('Network error'))
    await expect(updateProfile(data)).rejects.toThrow('Network error')
  })
})
