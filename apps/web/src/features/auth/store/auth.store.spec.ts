import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { api } from '~/lib/apiRequest'
import type { ApiResponse, User } from '~/types'

import {
  $error,
  $hasError,
  $isAuthenticated,
  $isLoading,
  $user,
  $userDisplayName,
  authActions
} from './auth.store'

// Spy on api methods instead of mock.module to avoid test pollution
let getSpy: Mock<typeof api.get>

const mockUser: User = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  emailVerified: true,
  role: 'user',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
}

describe('Auth Store', () => {
  beforeEach(() => {
    // Setup spies on api methods
    getSpy = spyOn(api, 'get')
    // Reset store state
    $user.set(null)
    $isLoading.set(false)
    $error.set(null)
  })

  afterEach(() => {
    // Restore spies to avoid test pollution
    getSpy.mockRestore()
  })

  describe('State Atoms', () => {
    describe('$user atom', () => {
      it('should initialize with null', () => {
        expect($user.get()).toBe(null)
      })

      it('should set and get user correctly', () => {
        $user.set(mockUser)
        expect($user.get()).toEqual(mockUser)
      })

      it('should handle setting user to null', () => {
        $user.set(mockUser)
        expect($user.get()).toEqual(mockUser)

        $user.set(null)
        expect($user.get()).toBe(null)
      })
    })

    describe('$isLoading atom', () => {
      it('should initialize with false', () => {
        expect($isLoading.get()).toBe(false)
      })

      it('should set and get loading state correctly', () => {
        $isLoading.set(true)
        expect($isLoading.get()).toBe(true)

        $isLoading.set(false)
        expect($isLoading.get()).toBe(false)
      })
    })

    describe('$error atom', () => {
      it('should initialize with null', () => {
        expect($error.get()).toBe(null)
      })

      it('should set and get error correctly', () => {
        const errorMessage = 'Test error'
        $error.set(errorMessage)
        expect($error.get()).toBe(errorMessage)

        $error.set(null)
        expect($error.get()).toBe(null)
      })
    })
  })

  describe('Computed Values', () => {
    describe('$isAuthenticated', () => {
      it('should return false when user is null', () => {
        $user.set(null)
        expect($isAuthenticated.get()).toBe(false)
      })

      it('should return true when user is set', () => {
        $user.set(mockUser)
        expect($isAuthenticated.get()).toBe(true)
      })

      it('should update reactively when user changes', () => {
        $user.set(null)
        expect($isAuthenticated.get()).toBe(false)

        $user.set(mockUser)
        expect($isAuthenticated.get()).toBe(true)

        $user.set(null)
        expect($isAuthenticated.get()).toBe(false)
      })
    })

    describe('$hasError', () => {
      it('should return false when error is null', () => {
        $error.set(null)
        expect($hasError.get()).toBe(false)
      })

      it('should return true when error is set', () => {
        $error.set('Some error')
        expect($hasError.get()).toBe(true)
      })

      it('should update reactively when error changes', () => {
        $error.set(null)
        expect($hasError.get()).toBe(false)

        $error.set('Error occurred')
        expect($hasError.get()).toBe(true)

        $error.set(null)
        expect($hasError.get()).toBe(false)
      })
    })

    describe('$userDisplayName', () => {
      it('should return "Guest" when user is null', () => {
        $user.set(null)
        expect($userDisplayName.get()).toBe('Guest')
      })

      it('should return full name when user has firstName and lastName', () => {
        $user.set(mockUser)
        expect($userDisplayName.get()).toBe('Test User')
      })

      it('should return username when firstName/lastName are empty', () => {
        const userWithoutName = { ...mockUser, firstName: null, lastName: null }
        $user.set(userWithoutName)
        expect($userDisplayName.get()).toBe('testuser')
      })

      it('should handle partial names correctly', () => {
        const userWithPartialName = { ...mockUser, firstName: 'John', lastName: null }
        $user.set(userWithPartialName)
        expect($userDisplayName.get()).toBe('John')
      })
    })
  })

  describe('authActions', () => {
    describe('refresh', () => {
      it('should call getCurrentUser and set user on success', async () => {
        getSpy.mockResolvedValueOnce({ success: true, data: mockUser })

        await authActions.refresh()

        expect(api.get).toHaveBeenCalledWith('/users/me')
        expect($user.get()).toEqual(mockUser)
        expect($error.get()).toBe(null)
        expect($isLoading.get()).toBe(false)
      })

      it('should handle API errors gracefully', async () => {
        getSpy.mockResolvedValueOnce({ success: false, message: 'API Error' })

        await authActions.refresh()

        expect(api.get).toHaveBeenCalledWith('/users/me')
        expect($user.get()).toBe(null)
        expect($error.get()).toBe('API Error')
        expect($isLoading.get()).toBe(false)
      })

      it('should not set error for 401 responses', async () => {
        getSpy.mockResolvedValueOnce({ success: false, message: '401' })

        await authActions.refresh()

        expect($user.get()).toBe(null)
        expect($error.get()).toBe(null) // Should not set error for 401
        expect($isLoading.get()).toBe(false)
      })

      it('should set loading state during refresh', async () => {
        let resolvePromise: (value: ApiResponse<User>) => void
        const pendingPromise = new Promise<ApiResponse<User>>(resolve => {
          resolvePromise = resolve
        })
        getSpy.mockReturnValueOnce(pendingPromise)

        const refreshPromise = authActions.refresh()
        expect($isLoading.get()).toBe(true)

        resolvePromise!({ success: true, data: mockUser })
        await refreshPromise
        expect($isLoading.get()).toBe(false)
      })
    })

    describe('clearError', () => {
      it('should clear error state', () => {
        $error.set('Some error')
        expect($error.get()).toBe('Some error')

        authActions.clearError()

        expect($error.get()).toBe(null)
      })
    })

    describe('setInitialUser', () => {
      it('should set user and clear error', () => {
        $error.set('Some error')

        authActions.setInitialUser(mockUser)

        expect($user.get()).toEqual(mockUser)
        expect($error.get()).toBe(null)
      })

      it('should handle setting user to null', () => {
        $user.set(mockUser)
        $error.set('Some error')

        authActions.setInitialUser(null)

        expect($user.get()).toBe(null)
        expect($error.get()).toBe(null)
      })
    })

    describe('silentRefresh', () => {
      it('should call getCurrentUser without affecting loading state', async () => {
        getSpy.mockResolvedValueOnce({ success: true, data: mockUser })

        await authActions.silentRefresh()

        expect(api.get).toHaveBeenCalledWith('/users/me')
        expect($user.get()).toEqual(mockUser)
        expect($error.get()).toBe(null)
        expect($isLoading.get()).toBe(false) // Should not affect loading
      })

      it('should handle errors silently', async () => {
        getSpy.mockResolvedValueOnce({ success: false, message: 'Silent error' })

        await authActions.silentRefresh()

        expect($user.get()).toBe(null)
        expect($error.get()).toBe(null) // Should not set error
        expect($isLoading.get()).toBe(false)
      })
    })

    describe('updateUser', () => {
      it('should update existing user with new data', () => {
        $user.set(mockUser)
        const updates = { firstName: 'Updated', lastName: 'Name' }

        authActions.updateUser(updates)

        expect($user.get()).toEqual({
          ...mockUser,
          firstName: 'Updated',
          lastName: 'Name'
        })
      })

      it('should not update if no user is set', () => {
        $user.set(null)
        const updates = { firstName: 'Updated' }

        authActions.updateUser(updates)

        expect($user.get()).toBe(null)
      })
    })
  })
})
