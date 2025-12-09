import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { useAuth } from '~/hooks/useAuth'
import { cleanup, render, screen, userEvent, waitFor } from '~/test-utils'

import { AuthContainer } from './AuthContainer'

// Mock modules
mock.module('~/hooks/useAuth', () => ({
  useAuth: mock(() => {})
}))

const mockUseAuth = {
  login: mock(() => {}) as unknown as Mock<(data: unknown) => Promise<void>>,
  register: mock(() => {}) as unknown as Mock<(data: unknown) => Promise<void>>,
  logout: mock(() => {}) as unknown as Mock<() => Promise<void>>,
  refresh: mock(() => {}) as unknown as Mock<() => Promise<void>>,
  clearError: mock(() => {}),
  silentRefresh: mock(() => {}) as unknown as Mock<() => Promise<void>>,
  isLoading: false,
  user: null,
  isAuthenticated: false,
  error: null,
  hasError: false,
  updateProfile: mock(() => {}) as unknown as Mock<(data: unknown) => Promise<void>>
}

describe('AuthContainer', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
    mock.restore()
    ;(useAuth as ReturnType<typeof mock>).mockReturnValue(mockUseAuth)
  })

  describe('Login Mode', () => {
    it('should render login form by default', () => {
      render(<AuthContainer />)

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
      expect(screen.getByText(/need an account/i)).toBeInTheDocument()
    })

    it('should render login form when mode is explicitly set to login', () => {
      render(<AuthContainer mode='login' />)

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    it('should call login with form data when login form is submitted', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='login' />)

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /login/i }))

      await waitFor(() => {
        expect(mockUseAuth.login).toHaveBeenCalledWith(
          {
            email: 'test@example.com',
            password: 'password123'
          },
          undefined
        )
      })
    })

    it('should call login with redirectPath when provided', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='login' redirectPath='/dashboard' />)

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /login/i }))

      await waitFor(() => {
        expect(mockUseAuth.login).toHaveBeenCalledWith(
          {
            email: 'test@example.com',
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

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /login/i }))

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })
    })

    it('should show loading state during login', () => {
      ;(useAuth as ReturnType<typeof mock>).mockReturnValue({
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
            name: '', // name field removed from form, defaults to empty
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
            name: '', // name field removed from form, defaults to empty
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
      ;(useAuth as ReturnType<typeof mock>).mockReturnValue({
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
