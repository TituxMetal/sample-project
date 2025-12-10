import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { authClient } from '~/lib/authClient'
import { cleanup, render, screen, userEvent, waitFor } from '~/test-utils'

import { VerificationPendingContainer } from './VerificationPendingContainer'

mock.module('~/lib/authClient', () => ({
  authClient: {
    sendVerificationEmail: mock(() => Promise.resolve({ error: null }))
  }
}))

describe('VerificationPendingContainer', () => {
  beforeEach(() => {
    cleanup()
    mock.restore()
  })

  it('should render check your email message', () => {
    render(<VerificationPendingContainer email='test@example.com' />)

    expect(screen.getByText(/check your email/i)).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('should show email placeholder when email is null', () => {
    render(<VerificationPendingContainer email={null} />)

    const emailPlaceholder = screen.getByText('your email')

    expect(emailPlaceholder.tagName).toBe('STRONG')
  })

  it('should not show resend button when email is null', () => {
    render(<VerificationPendingContainer email={null} />)

    expect(screen.queryByRole('button', { name: /resend/i })).not.toBeInTheDocument()
  })

  it('should show resend button when email is provided', () => {
    render(<VerificationPendingContainer email='test@example.com' />)

    expect(screen.getByRole('button', { name: /resend verification email/i })).toBeInTheDocument()
  })

  it('should show back to login link', () => {
    render(<VerificationPendingContainer email='test@example.com' />)

    expect(screen.getByRole('link', { name: /back to login/i })).toHaveAttribute(
      'href',
      '/auth?mode=login'
    )
  })

  describe('resend functionality', () => {
    it('should call sendVerificationEmail when resend button is clicked', async () => {
      const user = userEvent.setup()
      ;(authClient.sendVerificationEmail as ReturnType<typeof mock>).mockResolvedValue({
        error: null
      })

      render(<VerificationPendingContainer email='test@example.com' />)

      await user.click(screen.getByRole('button', { name: /resend verification email/i }))

      await waitFor(() => {
        expect(authClient.sendVerificationEmail).toHaveBeenCalledWith({ email: 'test@example.com' })
      })
    })

    it('should show success message after resend succeeds', async () => {
      const user = userEvent.setup()
      ;(authClient.sendVerificationEmail as ReturnType<typeof mock>).mockResolvedValue({
        error: null
      })

      render(<VerificationPendingContainer email='test@example.com' />)

      await user.click(screen.getByRole('button', { name: /resend verification email/i }))

      await waitFor(() => {
        expect(screen.getByText(/verification email sent/i)).toBeInTheDocument()
      })
    })

    it('should show error message when resend fails', async () => {
      const user = userEvent.setup()
      ;(authClient.sendVerificationEmail as ReturnType<typeof mock>).mockResolvedValue({
        error: { message: 'Rate limited' }
      })

      render(<VerificationPendingContainer email='test@example.com' />)

      await user.click(screen.getByRole('button', { name: /resend verification email/i }))

      await waitFor(() => {
        expect(screen.getByText(/rate limited/i)).toBeInTheDocument()
      })
    })

    it('should show loading state while resending', async () => {
      const user = userEvent.setup()
      ;(authClient.sendVerificationEmail as ReturnType<typeof mock>).mockReturnValue(
        new Promise(() => {})
      )

      render(<VerificationPendingContainer email='test@example.com' />)

      await user.click(screen.getByRole('button', { name: /resend verification email/i }))

      expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
    })
  })
})
