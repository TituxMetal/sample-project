import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock, setSystemTime, spyOn } from 'bun:test'
import type { Mock } from 'bun:test'

import { api } from '~/lib/apiRequest'
import { $error, $isLoading, $user } from '~/stores/auth'
import type { ApiResponse } from '~/types/api.types'
import type { User } from '~/types/user.types'
import * as navigationUtils from '~/utils/navigation'

import { useAuth } from './useAuth'

// Spy on api methods instead of mock.module to avoid test pollution
let postSpy: Mock<typeof api.post>
let getSpy: Mock<typeof api.get>

// Mock navigation module (this is safe as it doesn't affect service tests)
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
    // Setup spies on api methods
    postSpy = spyOn(api, 'post')
    getSpy = spyOn(api, 'get')
    ;(navigationUtils.redirect as ReturnType<typeof mock>).mockClear()
    setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
    $user.set(null)
    $isLoading.set(false)
    $error.set(null)
  })

  afterEach(() => {
    // Restore spies to avoid test pollution
    postSpy.mockRestore()
    getSpy.mockRestore()
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
      postSpy.mockResolvedValueOnce({ success: true, data: { user: mockUser } })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.login({ identifier: 'test@example.com', password: 'password' })
      })

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        emailOrUsername: 'test@example.com',
        password: 'password'
      })
      expect($user.get()).toEqual(mockUser)
    })

    it('should handle login failure', async () => {
      postSpy.mockResolvedValueOnce({ success: false, message: 'Invalid credentials' })

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
      let resolvePromise: (value: ApiResponse<{ user: User }>) => void
      const pendingPromise = new Promise<ApiResponse<{ user: User }>>(resolve => {
        resolvePromise = resolve
      })
      postSpy.mockReturnValueOnce(pendingPromise)

      const { result } = renderHook(() => useAuth())

      const loginPromise = act(async () => {
        await result.current.login({ identifier: 'test@example.com', password: 'password' })
      })

      expect($isLoading.get()).toBe(true)
      resolvePromise!({ success: true, data: { user: mockUser } })
      await loginPromise

      expect($isLoading.get()).toBe(false)
    })
  })

  describe('register', () => {
    it('should register successfully', async () => {
      postSpy.mockResolvedValueOnce({ success: true, data: { user: mockUser } })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.register({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password'
        })
      })

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password'
      })
      expect($user.get()).toEqual(mockUser)
    })

    it('should handle registration failure', async () => {
      postSpy.mockResolvedValueOnce({ success: false, message: 'Email already exists' })

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
      postSpy.mockResolvedValueOnce({ success: true, data: undefined })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.logout()
      })

      expect(api.post).toHaveBeenCalledWith('/auth/logout')
      expect($user.get()).toBe(null)
      expect(navigationUtils.redirect).toHaveBeenCalledWith('/auth')
    })

    it('should clear user state even if logout service fails', async () => {
      $user.set(mockUser)
      postSpy.mockResolvedValueOnce({ success: false, message: 'Network error' })

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
      postSpy.mockResolvedValueOnce({ success: false, message: 'Login failed' })

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
      postSpy.mockResolvedValueOnce({ success: false, message: 'Login failed' })

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
      getSpy.mockResolvedValueOnce({ success: true, data: mockUser })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.refresh()
      })

      expect(api.get).toHaveBeenCalledWith('/users/me')
      expect(result.current.user).toEqual(mockUser)
    })

    it('should call silentRefresh method', async () => {
      getSpy.mockResolvedValueOnce({ success: true, data: mockUser })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.silentRefresh()
      })

      expect(api.get).toHaveBeenCalledWith('/users/me')
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
