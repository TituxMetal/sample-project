import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { updateProfile } from '~/services/user.service'
import type { User } from '~/types/user.types'

import { EditProfileContainer } from './EditProfileContainer'

// Mock modules
vi.mock('~/services/user.service', () => ({
  updateProfile: vi.fn()
}))

const mockUser: User = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  confirmed: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
}

describe('EditProfileContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Profile View Mode', () => {
    it('should render profile view by default', () => {
      render(<EditProfileContainer userData={mockUser} />)

      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByText('testuser')).toBeInTheDocument()
      expect(screen.getByText('John')).toBeInTheDocument()
      expect(screen.getByText('Doe')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    })

    it('should switch to edit mode when Edit button is clicked', () => {
      render(<EditProfileContainer userData={mockUser} />)

      fireEvent.click(screen.getByRole('button', { name: /edit/i }))

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    })
  })

  describe('Edit Mode', () => {
    it('should render edit form with current user data', () => {
      render(<EditProfileContainer userData={mockUser} />)
      fireEvent.click(screen.getByRole('button', { name: /edit/i }))

      expect(screen.getByDisplayValue('testuser')).toBeInTheDocument()
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
    })

    it('should return to view mode when Cancel button is clicked', () => {
      render(<EditProfileContainer userData={mockUser} />)
      fireEvent.click(screen.getByRole('button', { name: /edit/i }))

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
    })

    it('should reset form data when Cancel button is clicked after making changes', async () => {
      const user = userEvent.setup()
      render(<EditProfileContainer userData={mockUser} />)

      fireEvent.click(screen.getByRole('button', { name: /edit/i }))

      // Change the username
      await user.clear(screen.getByDisplayValue('testuser'))
      await user.type(screen.getByDisplayValue(''), 'newusername')

      // Cancel the changes
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      fireEvent.click(screen.getByRole('button', { name: /edit/i }))

      // Should show original data
      expect(screen.getByDisplayValue('testuser')).toBeInTheDocument()
    })

    it('should clear server error when Cancel button is clicked', async () => {
      vi.mocked(updateProfile).mockRejectedValue(new Error('Update failed'))

      const user = userEvent.setup()
      render(<EditProfileContainer userData={mockUser} />)

      fireEvent.click(screen.getByRole('button', { name: /edit/i }))
      await user.type(screen.getByLabelText(/username/i), 'updated')
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(screen.getByText('Update failed')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      fireEvent.click(screen.getByRole('button', { name: /edit/i }))

      expect(screen.queryByText('Update failed')).not.toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should call updateProfile with form data when submitted', async () => {
      vi.mocked(updateProfile).mockResolvedValue({ ...mockUser, firstName: 'Jane' })

      const user = userEvent.setup()
      render(<EditProfileContainer userData={mockUser} />)

      fireEvent.click(screen.getByRole('button', { name: /edit/i }))

      await user.clear(screen.getByDisplayValue('John'))
      await user.type(screen.getByDisplayValue(''), 'Jane')
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(updateProfile).toHaveBeenCalledWith({
          username: 'testuser',
          firstName: 'Jane',
          lastName: 'Doe'
        })
      })
    })

    it('should update user data and return to view mode on successful update', async () => {
      const updatedUser = { ...mockUser, firstName: 'Jane' }
      vi.mocked(updateProfile).mockResolvedValue(updatedUser)

      const user = userEvent.setup()
      render(<EditProfileContainer userData={mockUser} />)

      fireEvent.click(screen.getByRole('button', { name: /edit/i }))

      await user.clear(screen.getByDisplayValue('John'))
      await user.type(screen.getByDisplayValue(''), 'Jane')
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(screen.getByText('Jane')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
      })
    })

    it('should show error message when update fails', async () => {
      vi.mocked(updateProfile).mockRejectedValue(new Error('Username already exists'))

      const user = userEvent.setup()
      render(<EditProfileContainer userData={mockUser} />)

      fireEvent.click(screen.getByRole('button', { name: /edit/i }))
      await user.type(screen.getByLabelText(/username/i), 'updated')
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(screen.getByText('Username already exists')).toBeInTheDocument()
      })
    })

    it('should show default error message when no error message is provided', async () => {
      vi.mocked(updateProfile).mockRejectedValue(new Error('Update failed'))

      const user = userEvent.setup()
      render(<EditProfileContainer userData={mockUser} />)

      fireEvent.click(screen.getByRole('button', { name: /edit/i }))
      await user.type(screen.getByLabelText(/username/i), 'updated')
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(screen.getByText('Update failed')).toBeInTheDocument()
      })
    })
  })

  describe('Form Validation', () => {
    it('should disable submit button when form has validation errors', async () => {
      const user = userEvent.setup()
      render(<EditProfileContainer userData={mockUser} />)

      fireEvent.click(screen.getByRole('button', { name: /edit/i }))

      // Clear username to trigger validation error
      await user.clear(screen.getByDisplayValue('testuser'))
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
      })
    })

    it('should enable submit button when form is valid', async () => {
      render(<EditProfileContainer userData={mockUser} />)

      fireEvent.click(screen.getByRole('button', { name: /edit/i }))

      expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled()
    })
  })

  describe('Form Layout', () => {
    it('should apply correct CSS classes for edit form', () => {
      render(<EditProfileContainer userData={mockUser} />)
      fireEvent.click(screen.getByRole('button', { name: /edit/i }))

      const form = screen.getByRole('form')
      expect(form).toHaveClass('mx-auto', 'mt-6', 'grid', 'w-full', 'max-w-lg', 'gap-4')
    })

    it('should render Cancel button with destructive variant', () => {
      render(<EditProfileContainer userData={mockUser} />)
      fireEvent.click(screen.getByRole('button', { name: /edit/i }))

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      expect(cancelButton).toHaveAttribute('type', 'button')
    })

    it('should render Submit button with correct type', () => {
      render(<EditProfileContainer userData={mockUser} />)
      fireEvent.click(screen.getByRole('button', { name: /edit/i }))

      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })
  })
})
