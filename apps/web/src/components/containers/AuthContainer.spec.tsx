import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuth } from '~/hooks/useAuth'

import { AuthContainer } from './AuthContainer'

// Mock modules
vi.mock('~/hooks/useAuth')

const mockUseAuth = {
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn(),
  clearError: vi.fn(),
  silentRefresh: vi.fn(),
  isLoading: false,
  user: null,
  isAuthenticated: false,
  error: null,
  hasError: false,
  updateProfile: vi.fn()
}

describe('AuthContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuth).mockReturnValue(mockUseAuth)
  })

  describe('Login Mode', () => {
    it('should render login form by default', () => {
      render(<AuthContainer />)

      expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
      expect(screen.getByText(/need an account/i)).toBeInTheDocument()
    })

    it('should render login form when mode is explicitly set to login', () => {
      render(<AuthContainer mode='login' />)

      expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    it('should call login with form data when login form is submitted', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='login' />)

      await user.type(screen.getByLabelText(/username or email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /login/i }))

      await waitFor(() => {
        expect(mockUseAuth.login).toHaveBeenCalledWith(
          {
            identifier: 'test@example.com',
            password: 'password123'
          },
          undefined
        )
      })
    })

    it('should call login with redirectPath when provided', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='login' redirectPath='/dashboard' />)

      await user.type(screen.getByLabelText(/username or email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /login/i }))

      await waitFor(() => {
        expect(mockUseAuth.login).toHaveBeenCalledWith(
          {
            identifier: 'test@example.com',
            password: 'password123'
          },
          '/dashboard'
        )
      })
    })

    it('should show error message when login fails', async () => {
      const user = userEvent.setup()
      mockUseAuth.login.mockRejectedValueOnce(new Error('Invalid credentials'))
      render(<AuthContainer mode='login' />)

      await user.type(screen.getByLabelText(/username or email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /login/i }))

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })
    })

    it('should show loading state during login', () => {
      vi.mocked(useAuth).mockReturnValue({
        ...mockUseAuth,
        isLoading: true
      })

      render(<AuthContainer mode='login' />)

      expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled()
    })

    it('should show correct navigation link for login form', () => {
      render(<AuthContainer mode='login' />)

      const link = screen.getByText(/need an account/i).closest('a')
      expect(link).toHaveAttribute('href', expect.stringContaining('signup'))
    })
  })

  describe('Signup Mode', () => {
    it('should render signup form when mode is set to signup', () => {
      render(<AuthContainer mode='signup' />)

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
    })

    it('should call register with form data when signup form is submitted', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='signup' />)

      await user.type(screen.getByLabelText(/username/i), 'testuser')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(mockUseAuth.register).toHaveBeenCalledWith(
          {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
          },
          undefined
        )
      })
    })

    it('should call register with redirectPath when provided', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='signup' redirectPath='/welcome' />)

      await user.type(screen.getByLabelText(/username/i), 'testuser')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(mockUseAuth.register).toHaveBeenCalledWith(
          {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
          },
          '/welcome'
        )
      })
    })

    it('should show error message when registration fails', async () => {
      const user = userEvent.setup()
      mockUseAuth.register.mockRejectedValueOnce(new Error('Email already exists'))
      render(<AuthContainer mode='signup' />)

      await user.type(screen.getByLabelText(/username/i), 'testuser')
      await user.type(screen.getByLabelText(/email/i), 'existing@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument()
      })
    })

    it('should show loading state during registration', () => {
      vi.mocked(useAuth).mockReturnValue({
        ...mockUseAuth,
        isLoading: true
      })

      render(<AuthContainer mode='signup' />)

      expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled()
    })

    it('should show correct navigation link for signup form', () => {
      render(<AuthContainer mode='signup' />)

      const link = screen.getByText(/already have an account/i).closest('a')
      expect(link).toHaveAttribute('href', expect.stringContaining('login'))
    })
  })

  describe('Form Validation', () => {
    it('should disable submit button when login form has validation errors', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='login' />)

      // Submit empty form to trigger validation
      await user.click(screen.getByRole('button', { name: /login/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /login/i })).toBeDisabled()
      })
    })

    it('should disable submit button when signup form has validation errors', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='signup' />)

      // Submit empty form to trigger validation
      await user.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled()
      })
    })
  })
})
