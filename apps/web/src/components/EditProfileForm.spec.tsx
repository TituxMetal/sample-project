import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { updateProfile } from '~/services/user.service'
import type { User } from '~/types/user.types'

import { EditProfileForm } from './EditProfileForm'

vi.mock('~/services/user.service', () => ({
  updateProfile: vi.fn()
}))

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  confirmed: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
}

describe('EditProfileForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders user info in view mode', () => {
    render(<EditProfileForm userData={mockUser} />)

    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('First name')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Last name')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Confirmed')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })

  it('switches to edit mode and shows form fields', () => {
    render(<EditProfileForm userData={mockUser} />)

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('shows validation errors for invalid input', async () => {
    render(<EditProfileForm userData={mockUser} />)

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'a' } })
    fireEvent.blur(screen.getByLabelText(/username/i))

    await waitFor(() => {
      expect(screen.getByText(/Too small: expected string to have/i)).toBeInTheDocument()
    })
  })

  it('calls updateProfile and updates UI on success', async () => {
    const updateProfileMock = vi.mocked(updateProfile)
    updateProfileMock.mockResolvedValue({
      success: true,
      data: { ...mockUser, firstName: 'Updated', lastName: 'Name' }
    })

    render(<EditProfileForm userData={mockUser} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Updated' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Name' } })
    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: 'Updated', lastName: 'Name' })
      )
      expect(screen.getByText('Updated')).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    })
  })

  it('shows error message on API failure', async () => {
    const updateProfileMock = vi.mocked(updateProfile)
    updateProfileMock.mockResolvedValue({
      success: false,
      message: 'Update failed'
    })

    render(<EditProfileForm userData={mockUser} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Update failed')
    })
  })

  it('resets form and exits edit mode on cancel', async () => {
    render(<EditProfileForm userData={mockUser} />)

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Changed' } })
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
