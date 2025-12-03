import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen } from '~/test-utils'
import type { User } from '~/types/user.types'

import { ProfileView } from './ProfileView'

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

describe('ProfileView', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render user information correctly', () => {
    const onEdit = mock(() => {})
    render(<ProfileView user={mockUser} onEdit={onEdit} />)

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Doe')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument() // confirmed: true
  })

  it('should render field labels correctly', () => {
    const onEdit = mock(() => {})
    render(<ProfileView user={mockUser} onEdit={onEdit} />)

    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByText('First name')).toBeInTheDocument()
    expect(screen.getByText('Last name')).toBeInTheDocument()
    expect(screen.getByText('Confirmed')).toBeInTheDocument()
  })

  it('should render "-" for null firstName and lastName', () => {
    const userWithNullNames: User = {
      ...mockUser,
      firstName: null,
      lastName: null
    }
    const onEdit = mock(() => {})

    render(<ProfileView user={userWithNullNames} onEdit={onEdit} />)

    const dashElements = screen.getAllByText('-')
    expect(dashElements).toHaveLength(2) // firstName and lastName
  })

  it('should render "No" for unconfirmed user', () => {
    const unconfirmedUser: User = {
      ...mockUser,
      confirmed: false
    }
    const onEdit = mock(() => {})

    render(<ProfileView user={unconfirmedUser} onEdit={onEdit} />)

    expect(screen.getByText('No')).toBeInTheDocument()
  })

  it('should render Edit button', () => {
    const onEdit = mock(() => {})
    render(<ProfileView user={mockUser} onEdit={onEdit} />)

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })

  it('should call onEdit when Edit button is clicked', () => {
    const onEdit = mock(() => {})
    render(<ProfileView user={mockUser} onEdit={onEdit} />)

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('should render data in a description list format', () => {
    const onEdit = mock(() => {})
    render(<ProfileView user={mockUser} onEdit={onEdit} />)

    const descriptionList = screen.getByRole('list')
    expect(descriptionList).toBeInTheDocument()
    expect(descriptionList.tagName).toBe('DL')
  })

  it('should apply correct CSS classes for layout', () => {
    const onEdit = mock(() => {})
    render(<ProfileView user={mockUser} onEdit={onEdit} />)

    const descriptionList = screen.getByRole('list')
    expect(descriptionList).toHaveClass(
      'mx-auto',
      'mt-6',
      'grid',
      'w-full',
      'max-w-lg',
      'grid-cols-2',
      'gap-x-8',
      'gap-y-2'
    )

    const section = screen.getByRole('button', { name: /edit/i }).closest('section')
    expect(section).toHaveClass(
      'mx-auto',
      'mt-4',
      'grid',
      'w-full',
      'max-w-lg',
      'items-center',
      'justify-end'
    )
  })

  it('should handle undefined firstName and lastName gracefully', () => {
    const userWithUndefinedNames: User = {
      ...mockUser,
      firstName: undefined as unknown as string,
      lastName: undefined as unknown as string
    }
    const onEdit = mock(() => {})

    render(<ProfileView user={userWithUndefinedNames} onEdit={onEdit} />)

    const dashElements = screen.getAllByText('-')
    expect(dashElements).toHaveLength(2)
  })
})
