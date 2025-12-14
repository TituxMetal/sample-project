import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { authClient } from '~/lib/authClient'
import { cleanup, render, screen, userEvent, waitFor } from '~/test-utils'

import { ForgotPasswordContainer } from './ForgotPasswordContainer'

mock.module('~/lib/authClient', () => ({
  authClient: {
    requestPasswordReset: mock(() => Promise.resolve({ error: null }))
  }
}))

describe('ForgotPasswordContainer', () => {
  beforeEach(() => {
    cleanup()
    mock.restore()
  })

  it('should render email input and submit button', () => {
    render(<ForgotPasswordContainer />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
  })

  it('should show back to login link', () => {
    render(<ForgotPasswordContainer />)

    expect(screen.getByRole('link', { name: /back to login/i })).toHaveAttribute(
      'href',
      '/auth?mode=login'
    )
  })

  it('should call requestPasswordReset on submit', async () => {
    const user = userEvent.setup()
    void (authClient.requestPasswordReset as ReturnType<typeof mock>).mockResolvedValue({
      error: null
    })

    render(<ForgotPasswordContainer />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    await waitFor(() => {
      expect(authClient.requestPasswordReset).toHaveBeenCalledWith({
        email: 'test@example.com',
        redirectTo: '/reset-password'
      })
    })
  })

  it('should show success message after submission', async () => {
    const user = userEvent.setup()
    void (authClient.requestPasswordReset as ReturnType<typeof mock>).mockResolvedValue({
      error: null
    })

    render(<ForgotPasswordContainer />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument()
    })
  })

  it('should show error message on failure', async () => {
    const user = userEvent.setup()
    void (authClient.requestPasswordReset as ReturnType<typeof mock>).mockResolvedValue({
      error: { message: 'Something went wrong' }
    })

    render(<ForgotPasswordContainer />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })
})
