import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { admin } from '~/lib/authClient'
import { cleanup, render, screen, waitFor } from '~/test-utils'

import { UserDetailContainer } from './UserDetailContainer'

const mockUsers = [
  {
    id: 'user-1',
    email: 'test@example.com',
    username: 'testuser',
    role: 'user',
    emailVerified: true,
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: new Date()
  },
  {
    id: 'user-2',
    email: 'other@example.com',
    username: 'otheruser',
    role: 'admin',
    emailVerified: true,
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: new Date()
  }
]

mock.module('~/lib/authClient', () => ({
  admin: {
    listUsers: mock(() => Promise.resolve({ data: { users: mockUsers }, error: null })),
    setRole: mock(() => Promise.resolve({ error: null })),
    banUser: mock(() => Promise.resolve({ error: null })),
    unbanUser: mock(() => Promise.resolve({ error: null })),
    removeUser: mock(() => Promise.resolve({ error: null }))
  }
}))

mock.module('~/utils/navigation', () => ({
  redirect: mock(() => {})
}))

describe('UserDetailContainer', () => {
  beforeEach(() => {
    cleanup()
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    mockListUsers.mockClear()
    mockListUsers.mockResolvedValue({ data: { users: mockUsers }, error: null })
  })

  it('should show loading state initially', () => {
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    mockListUsers.mockReturnValue(new Promise(() => {}))

    render(<UserDetailContainer userId='user-1' />)

    expect(screen.getByText(/loading user/i)).toBeInTheDocument()
  })

  it('should render user management after loading', async () => {
    render(<UserDetailContainer userId='user-1' />)

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
  })

  it('should find correct user by id', async () => {
    render(<UserDetailContainer userId='user-2' />)

    await waitFor(() => {
      expect(screen.getByText('otheruser')).toBeInTheDocument()
      expect(screen.getByText('other@example.com')).toBeInTheDocument()
    })
  })

  it('should show error when user not found', async () => {
    render(<UserDetailContainer userId='non-existent' />)

    await waitFor(() => {
      expect(screen.getByText(/user not found/i)).toBeInTheDocument()
    })
  })

  it('should show error when loading fails', async () => {
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    mockListUsers.mockResolvedValue({ data: null, error: { message: 'Server error' } })

    render(<UserDetailContainer userId='user-1' />)

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument()
    })
  })
})
