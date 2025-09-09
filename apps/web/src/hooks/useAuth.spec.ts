import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import * as authService from '~/services/auth.service'
import { $isLoading, $user, authStore } from '~/stores/auth'
import type { User } from '~/types/user.types'
import * as navigationUtils from '~/utils/navigation'

import { useAuth } from './useAuth'

// Mock modules
vi.mock('~/services/auth.service', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn()
}))

vi.mock('~/utils/navigation', () => ({
  redirect: vi.fn()
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
    vi.clearAllMocks()
    vi.useFakeTimers()
    authStore.clearUser()
    authStore.setLoading(false)
  })

  afterEach(() => {
    vi.useRealTimers()
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
      vi.mocked(authService.login).mockResolvedValue({
        success: true,
        data: mockUser
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.login({ identifier: 'test@example.com', password: 'password' })
        // Advance timers to trigger the setTimeout in the login function
        vi.runAllTimers()
      })

      expect(authService.login).toHaveBeenCalledWith({
        identifier: 'test@example.com',
        password: 'password'
      })
      expect($user.get()).toEqual(mockUser)
      expect(navigationUtils.redirect).toHaveBeenCalledWith('/')
    })

    it('should handle login failure', async () => {
      vi.mocked(authService.login).mockResolvedValue({
        success: false,
        message: 'Invalid credentials'
      })

      const { result } = renderHook(() => useAuth())

      await expect(
        act(async () => {
          await result.current.login({ identifier: 'test@example.com', password: 'wrong' })
        })
      ).rejects.toThrow('Invalid credentials')

      expect($user.get()).toBe(null)
      expect(navigationUtils.redirect).not.toHaveBeenCalled()
    })

    it('should set loading state during login', async () => {
      vi.mocked(authService.login).mockImplementation(
        () =>
          new Promise(resolve => {
            expect($isLoading.get()).toBe(true)
            resolve({ success: true, data: mockUser })
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
      vi.mocked(authService.register).mockResolvedValue({
        success: true,
        data: mockUser
      })

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
      expect(navigationUtils.redirect).toHaveBeenCalledWith('/')
    })

    it('should handle registration failure', async () => {
      vi.mocked(authService.register).mockResolvedValue({
        success: false,
        message: 'Email already exists'
      })

      const { result } = renderHook(() => useAuth())

      await expect(
        act(async () => {
          await result.current.register({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password'
          })
        })
      ).rejects.toThrow('Email already exists')

      expect($user.get()).toBe(null)
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      authStore.setUser(mockUser)
      vi.mocked(authService.logout).mockResolvedValue({ success: true })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.logout()
      })

      expect(authService.logout).toHaveBeenCalled()
      expect($user.get()).toBe(null)
      expect(navigationUtils.redirect).toHaveBeenCalledWith('/auth')
    })

    it('should clear user state even if logout service fails', async () => {
      authStore.setUser(mockUser)
      vi.mocked(authService.logout).mockRejectedValue(new Error('Network error'))

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
      authStore.setUser(mockUser)

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

  describe('reactive state', () => {
    it('should update when user state changes', () => {
      const { result } = renderHook(() => useAuth())

      expect(result.current.isAuthenticated).toBe(false)

      act(() => {
        authStore.setUser(mockUser)
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
    })
  })
})
