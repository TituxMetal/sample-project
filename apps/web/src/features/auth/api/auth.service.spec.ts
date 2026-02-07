import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { api } from '~/lib/apiRequest'
import type { User } from '~/types/user.types'

import { getCurrentUser } from './auth.service'

describe('auth service', () => {
  let getSpy: Mock<typeof api.get>

  beforeEach(() => {
    getSpy = spyOn(api, 'get')
  })

  afterEach(() => {
    getSpy.mockRestore()
  })

  describe('getCurrentUser', () => {
    it('should return user from /users/me endpoint', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
        role: 'user',
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

    it('should throw error on failed request', async () => {
      getSpy.mockResolvedValueOnce({
        success: false,
        message: 'Unauthorized'
      })

      await expect(getCurrentUser()).rejects.toThrow('Unauthorized')
    })

    it('should throw default error when no message provided', async () => {
      getSpy.mockResolvedValueOnce({
        success: false
      })

      await expect(getCurrentUser()).rejects.toThrow('API request failed')
    })
  })
})
