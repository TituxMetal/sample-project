import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen, userEvent } from '~/test-utils'

import { DeleteAccountSection } from './DeleteAccountSection'

mock.module('~/lib/authClient', () => ({
  authClient: {
    deleteUser: mock(() => Promise.resolve({ error: null }))
  }
}))

mock.module('~/utils/navigation', () => ({
  redirect: mock(() => {})
}))

describe('DeleteAccountSection', () => {
  beforeEach(() => {
    cleanup()
    mock.restore()
  })

  it('should render danger zone section', () => {
    render(<DeleteAccountSection />)

    expect(screen.getByRole('heading', { name: /danger zone/i })).toBeInTheDocument()
    expect(screen.getByText(/no going back/i)).toBeInTheDocument()
  })

  it('should render delete account button', () => {
    render(<DeleteAccountSection />)

    expect(screen.getByRole('button', { name: /delete account/i })).toBeInTheDocument()
  })

  it('should open dialog when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<DeleteAccountSection />)

    await user.click(screen.getByRole('button', { name: /delete account/i }))

    expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument()
  })

  it('should close dialog when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<DeleteAccountSection />)

    await user.click(screen.getByRole('button', { name: /delete account/i }))
    await user.click(screen.getByRole('button', { name: /cancel/i, hidden: true }))

    expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument()
  })
})
