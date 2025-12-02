import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock, setSystemTime } from 'bun:test'

import * as authService from '~/services/auth.service'
import { $error, $isLoading, $user } from '~/stores/auth'
import type { User } from '~/types/user.types'
import * as navigationUtils from '~/utils/navigation'

import { useAuth } from './useAuth'

// Mock modules
mock.module('~/services/auth.service', () => ({
  login: mock(() => Promise.resolve(null)),
  register: mock(() => Promise.resolve(null)),
  logout: mock(() => Promise.resolve(undefined)),
  getCurrentUser: mock(() => Promise.resolve(null))
}))

mock.module('~/utils/navigation', () => ({
  redirect: mock(() => {})
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

describe('useAuth hook', () => {
  beforeEach(() => {
    ;(authService.login as ReturnType<typeof mock>).mockClear()
    ;(authService.register as ReturnType<typeof mock>).mockClear()
    ;(authService.logout as ReturnType<typeof mock>).mockClear()
    ;(authService.getCurrentUser as ReturnType<typeof mock>).mockClear()
    ;(navigationUtils.redirect as ReturnType<typeof mock>).mockClear()
    setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
    $user.set(null)
    $isLoading.set(false)
    $error.set(null)
  })

  afterEach(() => {
    setSystemTime()
  })

  describe('initial state', () => {
    it('should return initial auth state', () => {
      const { result } = renderHook(() => useAuth())

      expect(result.current.user).toBe(null)
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('login', () => {
    it('should login successfully', async () => {
      ;(authService.login as ReturnType<typeof mock>).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.login({ identifier: 'test@example.com', password: 'password' })
      })

      expect(authService.login).toHaveBeenCalledWith({
        identifier: 'test@example.com',
        password: 'password'
      })
      expect($user.get()).toEqual(mockUser)
    })

    it('should handle login failure', async () => {
      ;(authService.login as ReturnType<typeof mock>).mockImplementation(() =>
        Promise.reject(new Error('Invalid credentials'))
      )

      const { result } = renderHook(() => useAuth())

      let thrownError: Error | undefined
      await act(async () => {
        try {
          await result.current.login({ identifier: 'test@example.com', password: 'wrong' })
        } catch (error) {
          thrownError = error as Error
        }
      })

      expect(thrownError).toBeDefined()
      expect(thrownError!.message).toBe('Invalid credentials')
      expect($user.get()).toBe(null)
      expect(navigationUtils.redirect).not.toHaveBeenCalled()
    })

    it('should set loading state during login', async () => {
      ;(authService.login as ReturnType<typeof mock>).mockImplementation(
        () =>
          new Promise(resolve => {
            expect($isLoading.get()).toBe(true)
            resolve(mockUser)
          })
      )

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.login({ identifier: 'test@example.com', password: 'password' })
      })

      expect($isLoading.get()).toBe(false)
    })
  })

  describe('register', () => {
    it('should register successfully', async () => {
      ;(authService.register as ReturnType<typeof mock>).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.register({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password'
        })
      })

      expect(authService.register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password'
      })
      expect($user.get()).toEqual(mockUser)
    })

    it('should handle registration failure', async () => {
      ;(authService.register as ReturnType<typeof mock>).mockImplementation(() =>
        Promise.reject(new Error('Email already exists'))
      )

      const { result } = renderHook(() => useAuth())

      let thrownError: Error | undefined
      await act(async () => {
        try {
          await result.current.register({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password'
          })
        } catch (error) {
          thrownError = error as Error
        }
      })

      expect(thrownError).toBeDefined()
      expect(thrownError!.message).toBe('Email already exists')
      expect($user.get()).toBe(null)
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      $user.set(mockUser)
      ;(authService.logout as ReturnType<typeof mock>).mockResolvedValue(undefined)

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.logout()
      })

      expect(authService.logout).toHaveBeenCalled()
      expect($user.get()).toBe(null)
      expect(navigationUtils.redirect).toHaveBeenCalledWith('/auth')
    })

    it('should clear user state even if logout service fails', async () => {
      $user.set(mockUser)
      ;(authService.logout as ReturnType<typeof mock>).mockImplementation(() =>
        Promise.reject(new Error('Network error'))
      )

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.logout()
      })

      expect($user.get()).toBe(null)
      expect(navigationUtils.redirect).toHaveBeenCalledWith('/auth')
    })
  })

  describe('updateProfile', () => {
    it('should update user profile', () => {
      $user.set(mockUser)

      const { result } = renderHook(() => useAuth())

      act(() => {
        result.current.updateProfile({ firstName: 'Updated' })
      })

      expect($user.get()).toEqual({
        ...mockUser,
        firstName: 'Updated'
      })
    })

    it('should not update if no user is set', () => {
      const { result } = renderHook(() => useAuth())

      act(() => {
        result.current.updateProfile({ firstName: 'Updated' })
      })

      expect($user.get()).toBe(null)
    })
  })

  describe('error handling', () => {
    it('should expose error state', async () => {
      ;(authService.login as ReturnType<typeof mock>).mockImplementation(() =>
        Promise.reject(new Error('Login failed'))
      )

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        try {
          await result.current.login({ identifier: 'test@example.com', password: 'wrong' })
        } catch {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('Login failed')
      expect(result.current.hasError).toBe(true)
    })

    it('should clear error when clearError is called', async () => {
      ;(authService.login as ReturnType<typeof mock>).mockImplementation(() =>
        Promise.reject(new Error('Login failed'))
      )

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        try {
          await result.current.login({ identifier: 'test@example.com', password: 'wrong' })
        } catch {
          // Expected to throw
        }
      })

      expect(result.current.hasError).toBe(true)

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBe(null)
      expect(result.current.hasError).toBe(false)
    })
  })

  describe('refresh functionality', () => {
    it('should call refresh method', async () => {
      ;(authService.getCurrentUser as ReturnType<typeof mock>).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.refresh()
      })

      expect(authService.getCurrentUser).toHaveBeenCalled()
      expect(result.current.user).toEqual(mockUser)
    })

    it('should call silentRefresh method', async () => {
      ;(authService.getCurrentUser as ReturnType<typeof mock>).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.silentRefresh()
      })

      expect(authService.getCurrentUser).toHaveBeenCalled()
      expect(result.current.user).toEqual(mockUser)
    })
  })

  describe('reactive state', () => {
    it('should update when user state changes', () => {
      const { result } = renderHook(() => useAuth())

      expect(result.current.isAuthenticated).toBe(false)

      act(() => {
        $user.set(mockUser)
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
    })
  })
})
