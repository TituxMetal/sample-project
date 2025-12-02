import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

import * as authService from '~/services/auth.service'
import {
  $error,
  $hasError,
  $isAuthenticated,
  $isLoading,
  $user,
  $userDisplayName,
  authActions
} from '~/stores/auth'
import type { User } from '~/types/user.types'

// Mock services
mock.module('~/services/auth.service', () => ({
  login: mock(() => Promise.resolve(null)),
  register: mock(() => Promise.resolve(null)),
  logout: mock(() => Promise.resolve(undefined)),
  getCurrentUser: mock(() => Promise.resolve(null))
}))

const mockUser: User = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  confirmed: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
}

describe('Auth Store', () => {
  beforeEach(() => {
    ;(authService.login as ReturnType<typeof mock>).mockClear()
    ;(authService.register as ReturnType<typeof mock>).mockClear()
    ;(authService.logout as ReturnType<typeof mock>).mockClear()
    ;(authService.getCurrentUser as ReturnType<typeof mock>).mockClear()
    // Reset store state
    $user.set(null)
    $isLoading.set(false)
    $error.set(null)
  })

  afterEach(() => {
    // Restore mocks
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
        ;(authService.getCurrentUser as ReturnType<typeof mock>).mockResolvedValue(mockUser)

        await authActions.refresh()

        expect(authService.getCurrentUser).toHaveBeenCalled()
        expect($user.get()).toEqual(mockUser)
        expect($error.get()).toBe(null)
        expect($isLoading.get()).toBe(false)
      })

      it('should handle API errors gracefully', async () => {
        const error = new Error('API Error')
        ;(authService.getCurrentUser as ReturnType<typeof mock>).mockRejectedValue(error)

        await authActions.refresh()

        expect(authService.getCurrentUser).toHaveBeenCalled()
        expect($user.get()).toBe(null)
        expect($error.get()).toBe('API Error')
        expect($isLoading.get()).toBe(false)
      })

      it('should not set error for 401 responses', async () => {
        const error = new Error('401')
        ;(authService.getCurrentUser as ReturnType<typeof mock>).mockRejectedValue(error)

        await authActions.refresh()

        expect($user.get()).toBe(null)
        expect($error.get()).toBe(null) // Should not set error for 401
        expect($isLoading.get()).toBe(false)
      })

      it('should set loading state during refresh', async () => {
        ;(authService.getCurrentUser as ReturnType<typeof mock>).mockImplementation(
          () =>
            new Promise(resolve => {
              expect($isLoading.get()).toBe(true)
              resolve(mockUser)
            })
        )

        const refreshPromise = authActions.refresh()
        expect($isLoading.get()).toBe(true)

        await refreshPromise
        expect($isLoading.get()).toBe(false)
      })
    })

    describe('login', () => {
      const loginCredentials = { identifier: 'test@example.com', password: 'password' }

      it('should call login service and set user on success', async () => {
        ;(authService.login as ReturnType<typeof mock>).mockResolvedValue(mockUser)

        await authActions.login(loginCredentials)

        expect(authService.login).toHaveBeenCalledWith(loginCredentials)
        expect($user.get()).toEqual(mockUser)
        expect($error.get()).toBe(null)
        expect($isLoading.get()).toBe(false)
      })

      it('should handle login errors and set error state', async () => {
        const error = new Error('Invalid credentials')
        ;(authService.login as ReturnType<typeof mock>).mockRejectedValue(error)

        await expect(authActions.login(loginCredentials)).rejects.toThrow('Invalid credentials')

        expect($user.get()).toBe(null)
        expect($error.get()).toBe('Invalid credentials')
        expect($isLoading.get()).toBe(false)
      })

      it('should set loading state during login', async () => {
        ;(authService.login as ReturnType<typeof mock>).mockImplementation(
          () =>
            new Promise(resolve => {
              expect($isLoading.get()).toBe(true)
              resolve(mockUser)
            })
        )

        const loginPromise = authActions.login(loginCredentials)
        expect($isLoading.get()).toBe(true)

        await loginPromise
        expect($isLoading.get()).toBe(false)
      })
    })

    describe('register', () => {
      const registerData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password'
      }

      it('should call register service and set user on success', async () => {
        ;(authService.register as ReturnType<typeof mock>).mockResolvedValue(mockUser)

        await authActions.register(registerData)

        expect(authService.register).toHaveBeenCalledWith(registerData)
        expect($user.get()).toEqual(mockUser)
        expect($error.get()).toBe(null)
        expect($isLoading.get()).toBe(false)
      })

      it('should handle registration errors and set error state', async () => {
        const error = new Error('Email already exists')
        ;(authService.register as ReturnType<typeof mock>).mockRejectedValue(error)

        await expect(authActions.register(registerData)).rejects.toThrow('Email already exists')

        expect($user.get()).toBe(null)
        expect($error.get()).toBe('Email already exists')
        expect($isLoading.get()).toBe(false)
      })
    })

    describe('logout', () => {
      it('should call logout service and clear user state', async () => {
        $user.set(mockUser)
        $error.set('Some error')
        ;(authService.logout as ReturnType<typeof mock>).mockResolvedValue(undefined)

        await authActions.logout()

        expect(authService.logout).toHaveBeenCalled()
        expect($user.get()).toBe(null)
        expect($error.get()).toBe(null)
        expect($isLoading.get()).toBe(false)
      })

      it('should clear user state even if logout service fails', async () => {
        $user.set(mockUser)
        $error.set('Some error')
        ;(authService.logout as ReturnType<typeof mock>).mockRejectedValue(
          new Error('Logout failed')
        )

        await authActions.logout()

        expect($user.get()).toBe(null)
        expect($error.get()).toBe(null)
        expect($isLoading.get()).toBe(false)
      })

      it('should set loading state during logout', async () => {
        ;(authService.logout as ReturnType<typeof mock>).mockImplementation(
          () =>
            new Promise(resolve => {
              expect($isLoading.get()).toBe(true)
              resolve(undefined)
            })
        )

        const logoutPromise = authActions.logout()
        expect($isLoading.get()).toBe(true)

        await logoutPromise
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
        ;(authService.getCurrentUser as ReturnType<typeof mock>).mockResolvedValue(mockUser)

        await authActions.silentRefresh()

        expect(authService.getCurrentUser).toHaveBeenCalled()
        expect($user.get()).toEqual(mockUser)
        expect($error.get()).toBe(null)
        expect($isLoading.get()).toBe(false) // Should not affect loading
      })

      it('should handle errors silently', async () => {
        ;(authService.getCurrentUser as ReturnType<typeof mock>).mockRejectedValue(
          new Error('Silent error')
        )

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
