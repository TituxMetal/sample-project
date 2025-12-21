import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { authClient } from '~/lib/authClient'
import { cleanup, render, screen, waitFor } from '~/test-utils'

import { VerifyEmailContainer } from './VerifyEmailContainer'

mock.module('~/lib/authClient', () => ({
  authClient: {
    verifyEmail: mock(() => Promise.resolve({ error: null }))
  }
}))

describe('VerifyEmailContainer', () => {
  beforeEach(() => {
    cleanup()
    mock.restore()
  })

  describe('when token is null', () => {
    it('should render invalid link message', () => {
      render(<VerifyEmailContainer token={null} />)

      expect(screen.getByText(/invalid link/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /go to login/i })).toHaveAttribute(
        'href',
        '/auth?mode=login'
      )
    })
  })

  describe('when token is provided', () => {
    it('should show verifying message initially', () => {
      const mockVerifyEmail = authClient.verifyEmail as ReturnType<typeof mock>
      mockVerifyEmail.mockReturnValue(new Promise(() => {})) // Never resolves

      render(<VerifyEmailContainer token='valid-token' />)

      expect(screen.getByText(/verifying your email/i)).toBeInTheDocument()
    })

    it('should show success message when verification succeeds', async () => {
      const mockVerifyEmail = authClient.verifyEmail as ReturnType<typeof mock>
      mockVerifyEmail.mockResolvedValue({ error: null })

      render(<VerifyEmailContainer token='valid-token' />)

      await waitFor(() => {
        expect(screen.getByText(/email verified/i)).toBeInTheDocument()
      })

      expect(screen.getByRole('link', { name: /go to login/i })).toHaveAttribute(
        'href',
        '/auth?mode=login'
      )
    })

    it('should show error message when verification fails', async () => {
      const mockVerifyEmail = authClient.verifyEmail as ReturnType<typeof mock>
      mockVerifyEmail.mockResolvedValue({ error: { message: 'Token expired' } })

      render(<VerifyEmailContainer token='expired-token' />)

      await waitFor(() => {
        expect(screen.getByText(/verification failed/i)).toBeInTheDocument()
        expect(screen.getByText(/token expired/i)).toBeInTheDocument()
      })

      expect(screen.getByRole('link', { name: /request new link/i })).toHaveAttribute(
        'href',
        '/auth/verification-pending'
      )
    })

    it('should show default error message when no message provided', async () => {
      const mockVerifyEmail = authClient.verifyEmail as ReturnType<typeof mock>
      mockVerifyEmail.mockResolvedValue({ error: {} })

      render(<VerifyEmailContainer token='bad-token' />)

      await waitFor(() => {
        expect(screen.getByText(/the link may have expired/i)).toBeInTheDocument()
      })
    })

    it('should call verifyEmail with correct token', async () => {
      const mockVerifyEmail = authClient.verifyEmail as ReturnType<typeof mock>
      mockVerifyEmail.mockResolvedValue({ error: null })

      render(<VerifyEmailContainer token='my-token-123' />)

      await waitFor(() => {
        expect(authClient.verifyEmail).toHaveBeenCalledWith({ query: { token: 'my-token-123' } })
      })
    })
  })
})
