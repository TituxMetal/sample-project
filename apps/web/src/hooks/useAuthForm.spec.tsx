import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as authService from '~/services/auth.service'
import type { User } from '~/types/user.types'
import * as navigationUtils from '~/utils/navigation'

import { useAuthForm } from './useAuthForm'

// Mock modules
vi.mock('~/services/auth.service', () => ({
  authenticateUser: vi.fn()
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

describe('useAuthForm hook', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('login mode', () => {
    it('should initialize form with empty values', () => {
      const { result } = renderHook(() => useAuthForm('login', authService.authenticateUser))

      expect(result.current.form.getValues()).toEqual({
        identifier: '',
        password: ''
      })
      expect(result.current.serverError).toBeNull()
      expect(result.current.isError).toBe(false)
    })

    it('should handle successful login', async () => {
      // Mock successful login response
      vi.mocked(authService.authenticateUser).mockResolvedValueOnce({
        success: true,
        data: mockUser
      })

      const { result } = renderHook(() =>
        useAuthForm('login', authService.authenticateUser, '/dashboard')
      )

      // Set form values
      act(() => {
        result.current.form.setValue('identifier', 'testuser')
        result.current.form.setValue('password', 'password123')
      })

      // Trigger form submission by calling the onSubmit function returned by handleSubmit
      await act(async () => {
        const onSubmit = result.current.form.handleSubmit(async data => {
          await result.current.handleSubmit(data as any)
        })
        onSubmit({} as React.BaseSyntheticEvent)
      })

      // Verify the authenticateUser was called with correct args
      expect(authService.authenticateUser).toHaveBeenCalledWith(
        { identifier: 'testuser', password: 'password123' },
        'login'
      )
      expect(navigationUtils.redirect).toHaveBeenCalledWith('/dashboard')
      expect(result.current.serverError).toBeNull()
    })

    it('should handle login failure', async () => {
      // Use a valid login format that meets form validation requirements
      const testIdentifier = 'testuser'
      const testPassword = 'password123'

      // Override the mock for this test to return failure
      vi.mocked(authService.authenticateUser).mockImplementation(async (_data, _mode) => ({
        success: false,
        message: 'Invalid credentials'
      }))

      const { result } = renderHook(() => useAuthForm('login', authService.authenticateUser))

      // Set form values - using valid format values that will pass validation
      act(() => {
        result.current.form.setValue('identifier', testIdentifier)
        result.current.form.setValue('password', testPassword)
      })

      // Trigger form submission
      await act(async () => {
        const onSubmit = result.current.form.handleSubmit(async data => {
          await result.current.handleSubmit(data as any)
        })
        onSubmit({} as React.BaseSyntheticEvent)
      })

      expect(authService.authenticateUser).toHaveBeenCalledWith(
        { identifier: testIdentifier, password: testPassword },
        'login'
      )
      expect(navigationUtils.redirect).not.toHaveBeenCalled()
      expect(result.current.serverError).toBe('Invalid credentials')
    })

    it('should use default redirect path when none provided', async () => {
      // Mock successful login for this test
      vi.mocked(authService.authenticateUser).mockResolvedValueOnce({
        success: true,
        data: mockUser
      })

      const { result } = renderHook(() => useAuthForm('login', authService.authenticateUser))

      // Set form values
      act(() => {
        result.current.form.setValue('identifier', 'testuser')
        result.current.form.setValue('password', 'password123')
      })

      // Trigger form submission
      await act(async () => {
        const onSubmit = result.current.form.handleSubmit(async data => {
          await result.current.handleSubmit(data as any)
        })
        onSubmit({} as React.BaseSyntheticEvent)
      })

      expect(navigationUtils.redirect).toHaveBeenCalledWith('/')
    })
  })

  describe('signup mode', () => {
    it('should initialize form with empty values', () => {
      const { result } = renderHook(() => useAuthForm('signup', authService.authenticateUser))

      expect(result.current.form.getValues()).toEqual({
        username: '',
        email: '',
        password: ''
      })
      expect(result.current.serverError).toBeNull()
      expect(result.current.isError).toBe(false)
    })

    it('should handle successful signup', async () => {
      // Create a new user object for the signup test
      const newUser = {
        ...mockUser,
        id: '2',
        username: 'newuser',
        email: 'new@example.com'
      }

      // Mock successful signup
      vi.mocked(authService.authenticateUser).mockResolvedValueOnce({
        success: true,
        data: newUser
      })

      const { result } = renderHook(() =>
        useAuthForm('signup', authService.authenticateUser, '/profile')
      )

      // Set form values
      act(() => {
        result.current.form.setValue('username', 'newuser')
        result.current.form.setValue('email', 'new@example.com')
        result.current.form.setValue('password', 'password123')
      })

      // Trigger form submission
      await act(async () => {
        const onSubmit = result.current.form.handleSubmit(async data => {
          await result.current.handleSubmit(data as any)
        })
        onSubmit({} as React.BaseSyntheticEvent)
      })

      expect(authService.authenticateUser).toHaveBeenCalledWith(
        {
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123'
        },
        'signup'
      )
      expect(navigationUtils.redirect).toHaveBeenCalledWith('/profile')
      expect(result.current.serverError).toBeNull()
    })

    it('should handle signup failure', async () => {
      // Override the mock for this specific test
      vi.mocked(authService.authenticateUser).mockResolvedValueOnce({
        success: false,
        message: 'Username already taken'
      })

      const { result } = renderHook(() => useAuthForm('signup', authService.authenticateUser))

      // Set form values
      act(() => {
        result.current.form.setValue('username', 'existinguser')
        result.current.form.setValue('email', 'existing@example.com')
        result.current.form.setValue('password', 'password123')
      })

      // Trigger form submission
      await act(async () => {
        const onSubmit = result.current.form.handleSubmit(async data => {
          await result.current.handleSubmit(data as any)
        })
        onSubmit({} as React.BaseSyntheticEvent)
      })

      expect(authService.authenticateUser).toHaveBeenCalledWith(
        {
          username: 'existinguser',
          email: 'existing@example.com',
          password: 'password123'
        },
        'signup'
      )
      expect(navigationUtils.redirect).not.toHaveBeenCalled()
      expect(result.current.serverError).toBe('Username already taken')
    })

    it('should use default redirect path when none provided', async () => {
      // Create a new user object for the signup test
      const newUser = {
        ...mockUser,
        id: '2',
        username: 'newuser',
        email: 'new@example.com'
      }

      // Mock successful signup
      vi.mocked(authService.authenticateUser).mockResolvedValueOnce({
        success: true,
        data: newUser
      })

      const { result } = renderHook(() => useAuthForm('signup', authService.authenticateUser))

      // Set form values
      act(() => {
        result.current.form.setValue('username', 'newuser')
        result.current.form.setValue('email', 'new@example.com')
        result.current.form.setValue('password', 'password123')
      })

      // Trigger form submission
      await act(async () => {
        const onSubmit = result.current.form.handleSubmit(async data => {
          await result.current.handleSubmit(data as any)
        })
        onSubmit({} as React.BaseSyntheticEvent)
      })

      expect(navigationUtils.redirect).toHaveBeenCalledWith('/')
    })
  })
})
