import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { admin } from '~/lib/authClient'
import { cleanup, render, screen, waitFor } from '~/test-utils'

import { UserList } from './UserList'

const mockUsers = [
  {
    id: 'user-1',
    email: 'admin@example.com',
    username: 'adminuser',
    role: 'admin',
    emailVerified: true,
    banned: false,
    createdAt: new Date()
  },
  {
    id: 'user-2',
    email: 'test@example.com',
    username: 'testuser',
    role: 'user',
    emailVerified: false,
    banned: false,
    createdAt: new Date()
  },
  {
    id: 'user-3',
    email: 'banned@example.com',
    username: 'banneduser',
    role: 'user',
    emailVerified: true,
    banned: true,
    createdAt: new Date()
  }
]

mock.module('~/lib/authClient', () => ({
  admin: {
    listUsers: mock(() => Promise.resolve({ data: { users: mockUsers }, error: null }))
  }
}))

describe('UserList', () => {
  beforeEach(() => {
    cleanup()
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    mockListUsers.mockClear()
    mockListUsers.mockResolvedValue({ data: { users: mockUsers }, error: null })
  })

  it('should show loading state initially', () => {
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    mockListUsers.mockReturnValue(new Promise(() => {}))

    render(<UserList />)

    expect(screen.getByText(/loading users/i)).toBeInTheDocument()
  })

  it('should render users table after loading', async () => {
    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('adminuser')).toBeInTheDocument()
      expect(screen.getByText('testuser')).toBeInTheDocument()
      expect(screen.getByText('banneduser')).toBeInTheDocument()
    })
  })

  it('should display role badges', async () => {
    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
      expect(screen.getAllByText('user')).toHaveLength(2)
    })
  })

  it('should display status badges', async () => {
    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('Verified')).toBeInTheDocument()
      expect(screen.getByText('Unverified')).toBeInTheDocument()
      expect(screen.getByText('Banned')).toBeInTheDocument()
    })
  })

  it('should have view links for each user', async () => {
    render(<UserList />)

    await waitFor(() => {
      const viewLinks = screen.getAllByRole('link', { name: /view/i })
      expect(viewLinks).toHaveLength(3)
      expect(viewLinks[0]).toHaveAttribute('href', '/admin/users/user-1')
      expect(viewLinks[1]).toHaveAttribute('href', '/admin/users/user-2')
      expect(viewLinks[2]).toHaveAttribute('href', '/admin/users/user-3')
    })
  })

  it('should show error message when loading fails', async () => {
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    mockListUsers.mockResolvedValue({ data: null, error: { message: 'Network error' } })

    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })

  it('should show empty message when no users', async () => {
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    mockListUsers.mockResolvedValue({ data: { users: [] }, error: null })

    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument()
    })
  })
})
