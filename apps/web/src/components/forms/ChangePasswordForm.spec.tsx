import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { authClient } from '~/lib/authClient'
import { cleanup, render, screen, userEvent, waitFor } from '~/test-utils'

import { ChangePasswordForm } from './ChangePasswordForm'

mock.module('~/lib/authClient', () => ({
  authClient: {
    changePassword: mock(() => Promise.resolve({ error: null }))
  }
}))

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    cleanup()
    mock.restore()
  })

  it('should render all password inputs', () => {
    render(<ChangePasswordForm />)

    expect(screen.getByLabelText('Current Password')).toBeInTheDocument()
    expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument()
  })

  it('should render change password button', () => {
    render(<ChangePasswordForm />)

    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument()
  })

  it('should call changePassword on submit', async () => {
    const user = userEvent.setup()
    void (authClient.changePassword as ReturnType<typeof mock>).mockResolvedValue({
      error: null
    })

    render(<ChangePasswordForm />)

    await user.type(screen.getByLabelText('Current Password'), 'oldpass123')
    await user.type(screen.getByLabelText('New Password'), 'newpass123')
    await user.type(screen.getByLabelText('Confirm New Password'), 'newpass123')
    await user.click(screen.getByRole('button', { name: /change password/i }))

    await waitFor(() => {
      expect(authClient.changePassword).toHaveBeenCalledWith({
        currentPassword: 'oldpass123',
        newPassword: 'newpass123',
        revokeOtherSessions: true
      })
    })
  })

  it('should show success message after change', async () => {
    const user = userEvent.setup()
    void (authClient.changePassword as ReturnType<typeof mock>).mockResolvedValue({
      error: null
    })

    render(<ChangePasswordForm />)

    await user.type(screen.getByLabelText('Current Password'), 'oldpass123')
    await user.type(screen.getByLabelText('New Password'), 'newpass123')
    await user.type(screen.getByLabelText('Confirm New Password'), 'newpass123')
    await user.click(screen.getByRole('button', { name: /change password/i }))

    await waitFor(() => {
      expect(screen.getByText(/password changed successfully/i)).toBeInTheDocument()
    })
  })

  it('should show error message on failure', async () => {
    const user = userEvent.setup()
    void (authClient.changePassword as ReturnType<typeof mock>).mockResolvedValue({
      error: { message: 'Current password is incorrect' }
    })

    render(<ChangePasswordForm />)

    await user.type(screen.getByLabelText('Current Password'), 'wrongpass')
    await user.type(screen.getByLabelText('New Password'), 'newpass123')
    await user.type(screen.getByLabelText('Confirm New Password'), 'newpass123')
    await user.click(screen.getByRole('button', { name: /change password/i }))

    await waitFor(() => {
      expect(screen.getByText(/current password is incorrect/i)).toBeInTheDocument()
    })
  })
})
