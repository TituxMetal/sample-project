import { act, renderHook } from '@testing-library/react'
import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, mock, setSystemTime, spyOn } from 'bun:test'

import { api } from '~/lib/apiRequest'
import { $error, $isLoading, $user } from '~/stores/auth'
import type { User } from '~/types/user.types'
import * as navigationUtils from '~/utils/navigation'

// Mock authClient module - type-safe mock return type
interface AuthSuccess<T> {
  data: T
  error: null
}
interface AuthError {
  data: null
  error: { message: string }
}
type AuthResult<T> = AuthSuccess<T> | AuthError

const mockSignInEmail = mock<() => Promise<AuthResult<{ user: User }>>>()
const mockSignUpEmail = mock<() => Promise<AuthResult<{ user: User }>>>()
const mockSignOut = mock<() => Promise<AuthResult<null>>>()

mock.module('~/lib/authClient', () => ({
  signIn: { email: mockSignInEmail },
  signUp: { email: mockSignUpEmail },
  signOut: mockSignOut,
  authClient: {}
}))

// Mock navigation module
mock.module('~/utils/navigation', () => ({
  redirect: mock(() => {})
}))

// Import after mocking
import { useAuth } from './useAuth'

// Spy on api methods for refresh calls
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

describe('useAuth hook', () => {
  beforeEach(() => {
    // Setup spies on api methods for refresh
    getSpy = spyOn(api, 'get')
    // Reset mocks
    mockSignInEmail.mockClear()
    mockSignUpEmail.mockClear()
    mockSignOut.mockClear()
    ;(navigationUtils.redirect as ReturnType<typeof mock>).mockClear()
    setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
    $user.set(null)
    $isLoading.set(false)
    $error.set(null)
  })

  afterEach(() => {
    // Restore spies to avoid test pollution
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
      mockSignInEmail.mockResolvedValueOnce({ data: { user: mockUser }, error: null })
      getSpy.mockResolvedValueOnce({ success: true, data: mockUser })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'password' })
      })

      expect(mockSignInEmail).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      })
    })

    it('should handle login failure', async () => {
      mockSignInEmail.mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid credentials' }
      })

      const { result } = renderHook(() => useAuth())

      let thrownError: Error | undefined
      await act(async () => {
        try {
          await result.current.login({ email: 'test@example.com', password: 'wrong' })
        } catch (error) {
          thrownError = error as Error
        }
      })

      expect(thrownError).toBeDefined()
      expect(thrownError!.message).toBe('Invalid credentials')
      expect($user.get()).toBe(null)
    })

    it('should set loading state during login', async () => {
      let resolvePromise: (value: AuthResult<{ user: User }>) => void
      const pendingPromise = new Promise<AuthResult<{ user: User }>>(resolve => {
        resolvePromise = resolve
      })
      mockSignInEmail.mockReturnValueOnce(pendingPromise)

      const { result } = renderHook(() => useAuth())

      const loginPromise = act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'password' })
      })

      expect($isLoading.get()).toBe(true)
      getSpy.mockResolvedValueOnce({ success: true, data: mockUser })
      resolvePromise!({ data: { user: mockUser }, error: null })
      await loginPromise

      expect($isLoading.get()).toBe(false)
    })
  })

  describe('register', () => {
    it('should register successfully', async () => {
      mockSignUpEmail.mockResolvedValueOnce({ data: { user: mockUser }, error: null })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.register({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password'
        })
      })

      expect(mockSignUpEmail).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
        name: 'testuser',
        username: 'testuser'
      })
    })

    it('should handle registration failure', async () => {
      mockSignUpEmail.mockResolvedValueOnce({
        data: null,
        error: { message: 'Email already exists' }
      })

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
      mockSignOut.mockResolvedValueOnce({ data: null, error: null })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.logout()
      })

      expect(mockSignOut).toHaveBeenCalled()
    })

    it('should handle logout errors gracefully', async () => {
      $user.set(mockUser)
      mockSignOut.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useAuth())

      // Should not throw
      await act(async () => {
        await result.current.logout()
      })

      expect($isLoading.get()).toBe(false)
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
      mockSignInEmail.mockResolvedValueOnce({
        data: null,
        error: { message: 'Login failed' }
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        try {
          await result.current.login({ email: 'test@example.com', password: 'wrong' })
        } catch {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('Login failed')
      expect(result.current.hasError).toBe(true)
    })

    it('should clear error when clearError is called', async () => {
      mockSignInEmail.mockResolvedValueOnce({
        data: null,
        error: { message: 'Login failed' }
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        try {
          await result.current.login({ email: 'test@example.com', password: 'wrong' })
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

      expect(api.get).toHaveBeenCalledWith('/api/users/me')
      expect(result.current.user).toEqual(mockUser)
    })

    it('should call silentRefresh method', async () => {
      getSpy.mockResolvedValueOnce({ success: true, data: mockUser })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.silentRefresh()
      })

      expect(api.get).toHaveBeenCalledWith('/api/users/me')
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
