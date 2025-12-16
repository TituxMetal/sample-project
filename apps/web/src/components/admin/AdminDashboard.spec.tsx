import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { admin } from '~/lib/authClient'
import { cleanup, render, screen, waitFor } from '~/test-utils'

import { AdminDashboard } from './AdminDashboard'

const mockUsers = [
  { id: '1', role: 'admin', emailVerified: true, banned: false },
  { id: '2', role: 'user', emailVerified: true, banned: false },
  { id: '3', role: 'user', emailVerified: false, banned: false },
  { id: '4', role: 'user', emailVerified: true, banned: true }
]

mock.module('~/lib/authClient', () => ({
  admin: {
    listUsers: mock(() => Promise.resolve({ data: { users: mockUsers }, error: null }))
  }
}))

describe('AdminDashboard', () => {
  beforeEach(() => {
    cleanup()
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    mockListUsers.mockClear()
    mockListUsers.mockResolvedValue({ data: { users: mockUsers }, error: null })
  })

  it('should show loading state initially', () => {
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    mockListUsers.mockReturnValue(new Promise(() => {}))

    render(<AdminDashboard />)

    expect(screen.getByText(/loading stats/i)).toBeInTheDocument()
  })

  it('should display total user count after loading', async () => {
    render(<AdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText(/total users/i)).toBeInTheDocument()
    })
  })

  it('should display correct stats for each category', async () => {
    render(<AdminDashboard />)

    await waitFor(() => {
      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(4)
      expect(screen.getByText(/admins/i)).toBeInTheDocument()
      expect(screen.getByText(/verified/i)).toBeInTheDocument()
      expect(screen.getByText(/banned/i)).toBeInTheDocument()
    })
  })

  it('should show error message when loading fails', async () => {
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    mockListUsers.mockResolvedValue({ data: null, error: { message: 'Failed to fetch' } })

    render(<AdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument()
    })
  })
})
