import { useState } from 'react'

import { Button } from '~/components/ui'
import { admin } from '~/lib/authClient'
import { redirect } from '~/utils/navigation'

type UserData = {
  id: string
  email: string
  username: string
  role: string
  emailVerified: boolean
  banned: boolean
  banReason: string | null
  banExpires: Date | null
  createdAt: Date
}

type Props = {
  user: UserData
}
export const UserManagement = ({ user: initialUser }: Props) => {
  const [user, setUser] = useState(initialUser)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSetRole = async (role: 'user' | 'admin') => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await admin.setRole({ userId: user.id, role })

    if (result.error) {
      setError(result.error.message ?? 'Failed to update role')
      setIsLoading(false)
      return
    }

    setUser({ ...user, role })
    setSuccess(`Role updated to ${role}`)
    setIsLoading(false)
  }

  const handleBan = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await admin.banUser({ userId: user.id })

    if (result.error) {
      setError(result.error.message ?? 'Failed to ban user')
      setIsLoading(false)
      return
    }

    setUser({ ...user, banned: true })
    setSuccess('User banned')
    setIsLoading(false)
  }

  const handleUnban = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await admin.unbanUser({ userId: user.id })

    if (result.error) {
      setError(result.error.message ?? 'Failed to unban user')
      setIsLoading(false)
      return
    }

    setUser({ ...user, banned: false })
    setSuccess('User unbanned')
    setIsLoading(false)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.username}? This cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setIsLoading(true)
    setError(null)

    const { error } = await admin.removeUser({ userId: user.id })

    if (error) {
      setError(error.message ?? 'Failed to delete user')
      setIsLoading(false)
      return
    }

    redirect('/admin/users')
  }

  return (
    <section className='space-y-6'>
      {error && <p className='rounded bg-red-400/20 p-3 text-red-400'>{error}</p>}
      {success && <p className='rounded bg-emerald-400/20 p-3 text-emerald-400'>{success}</p>}

      <article className='rounded-lg bg-zinc-800 p-6'>
        <h2 className='mb-4 text-xl font-bold text-zinc-100'>User Details</h2>
        <dl className='grid gap-3 sm:grid-cols-2'>
          <div>
            <dt className='text-sm text-zinc-400'>Username</dt>
            <dd className='text-zinc-100'>{user.username}</dd>
          </div>
          <div>
            <dt className='text-sm text-zinc-400'>Email</dt>
            <dd className='text-zinc-100'>{user.email}</dd>
          </div>
          <div>
            <dt className='text-sm text-zinc-400'>Role</dt>
            <dd>
              <span
                className={`rounded px-2 py-1 text-xs font-medium ${
                  user.role === 'admin' ? 'bg-sky-400 text-zinc-900' : 'bg-zinc-600 text-zinc-100'
                }`}
              >
                {user.role}
              </span>
            </dd>
          </div>
          <div>
            <dt className='text-sm text-zinc-400'>Status</dt>
            <dd>
              {user.banned ? (
                <span className='rounded bg-red-400 px-2 py-1 text-xs font-medium text-zinc-900'>
                  Banned
                </span>
              ) : user.emailVerified ? (
                <span className='rounded bg-emerald-400 px-2 py-1 text-xs font-medium text-zinc-900'>
                  Verified
                </span>
              ) : (
                <span className='rounded bg-amber-400 px-2 py-1 text-xs font-medium text-zinc-900'>
                  Unverified
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className='text-sm text-zinc-400'>Created</dt>
            <dd className='text-zinc-100'>{new Date(user.createdAt).toLocaleDateString()}</dd>
          </div>
          {user.banned && user.banReason && (
            <div>
              <dt className='text-sm text-zinc-400'>Ban Reason</dt>
              <dd className='text-zinc-100'>{user.banReason}</dd>
            </div>
          )}
        </dl>
      </article>

      <article className='rounded-lg bg-zinc-800 p-6'>
        <h2 className='mb-4 text-xl font-bold text-zinc-100'>Actions</h2>
        <div className='flex flex-wrap gap-3'>
          {user.role === 'user' ? (
            <Button onClick={() => handleSetRole('admin')} disabled={isLoading}>
              Promote to Admin
            </Button>
          ) : (
            <Button variant='outline' onClick={() => handleSetRole('user')} disabled={isLoading}>
              Demote to User
            </Button>
          )}

          {user.banned ? (
            <Button variant='outline' onClick={handleUnban} disabled={isLoading}>
              Unban User
            </Button>
          ) : (
            <Button variant='destructive' onClick={handleBan} disabled={isLoading}>
              Ban User
            </Button>
          )}

          <Button variant='destructive' onClick={handleDelete} disabled={isLoading}>
            Delete User
          </Button>
        </div>
      </article>
    </section>
  )
}
