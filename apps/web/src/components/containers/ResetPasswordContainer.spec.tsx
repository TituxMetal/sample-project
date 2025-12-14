import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { authClient } from '~/lib/authClient'
import { cleanup, render, screen, userEvent, waitFor } from '~/test-utils'

import { ResetPasswordContainer } from './ResetPasswordContainer'

mock.module('~/lib/authClient', () => ({
  authClient: {
    resetPassword: mock(() => Promise.resolve({ error: null }))
  }
}))

describe('ResetPasswordContainer', () => {
  beforeEach(() => {
    cleanup()
  })

  describe('when token is missing', () => {
    it('should show invalid link message', () => {
      render(<ResetPasswordContainer token={null} />)

      expect(screen.getByText(/invalid reset link/i)).toBeInTheDocument()
    })

    it('should show request new link button', () => {
      render(<ResetPasswordContainer token={null} />)

      expect(screen.getByRole('link', { name: /request new link/i })).toHaveAttribute(
        'href',
        '/forgot-password'
      )
    })
  })

  describe('when token is provided', () => {
    it('should render password inputs', () => {
      render(<ResetPasswordContainer token='valid-token' />)

      expect(screen.getByLabelText('New Password')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    })

    it('should show reset password button', () => {
      render(<ResetPasswordContainer token='valid-token' />)

      expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument()
    })

    it('should call resetPassword on submit', async () => {
      const user = userEvent.setup()

      void (authClient.resetPassword as unknown as ReturnType<typeof mock>).mockResolvedValue({
        error: null
      })

      render(<ResetPasswordContainer token='valid-token' />)

      await user.type(screen.getByLabelText('New Password'), 'newpassword123')

      await user.type(screen.getByLabelText('Confirm Password'), 'newpassword123')

      await user.click(screen.getByRole('button', { name: /reset password/i }))

      await waitFor(() => {
        expect(authClient.resetPassword).toHaveBeenCalledWith({
          token: 'valid-token',
          newPassword: 'newpassword123'
        })
      })
    })

    it('should show success message after reset', async () => {
      const user = userEvent.setup()
      void (authClient.resetPassword as unknown as ReturnType<typeof mock>).mockResolvedValue({
        error: null
      })

      render(<ResetPasswordContainer token='valid-token' />)

      await user.type(screen.getByLabelText('New Password'), 'newpassword123')
      await user.type(screen.getByLabelText('Confirm Password'), 'newpassword123')
      await user.click(screen.getByRole('button', { name: /reset password/i }))

      await waitFor(() => {
        expect(screen.getByText(/password has been successfully reset/i)).toBeInTheDocument()
      })
    })

    it('should show error message on failure', async () => {
      const user = userEvent.setup()
      void (authClient.resetPassword as unknown as ReturnType<typeof mock>).mockResolvedValue({
        error: { message: 'Token expired' }
      })

      render(<ResetPasswordContainer token='valid-token' />)

      await user.type(screen.getByLabelText('New Password'), 'newpassword123')
      await user.type(screen.getByLabelText('Confirm Password'), 'newpassword123')
      await user.click(screen.getByRole('button', { name: /reset password/i }))

      await waitFor(() => {
        expect(screen.getByText(/token expired/i)).toBeInTheDocument()
      })
    })
  })
})
