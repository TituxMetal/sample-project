import { useEffect, useState } from 'react'

import { admin } from '~/lib/authClient'

type AdminUser = {
  id: string
  email: string
  username: string
  role: string
  emailVerified: boolean
  banned: boolean
  createdAt: Date
}

export const UserList = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)

    const result = await admin.listUsers({ query: { limit: 100 } })

    if (result.error) {
      setError(result.error.message ?? 'Failed to load users')
      setIsLoading(false)
      return
    }

    setUsers((result.data?.users as AdminUser[]) ?? [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (isLoading) {
    return <p className='text-zinc-400'>Loading users...</p>
  }

  if (error) {
    return <p className='text-red-400'>{error}</p>
  }

  if (users.length === 0) {
    return <p className='text-zinc-400'>No users found.</p>
  }

  return (
    <section className='overflow-x-auto rounded-lg bg-zinc-800'>
      <table className='w-full text-left'>
        <thead className='border-b border-zinc-700 text-zinc-400'>
          <tr>
            <th className='px-6 py-4 font-medium'>Username</th>
            <th className='px-6 py-4 font-medium'>Email</th>
            <th className='px-6 py-4 font-medium'>Role</th>
            <th className='px-6 py-4 font-medium'>Status</th>
            <th className='px-6 py-4 font-medium'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-zinc-700'>
          {users.map(user => (
            <tr key={user.id} className='text-zinc-100'>
              <td className='px-6 py-4'>{user.username}</td>
              <td className='px-6 py-4'>{user.email}</td>
              <td className='px-6 py-4'>
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    user.role === 'admin' ? 'bg-sky-400 text-zinc-900' : 'bg-zinc-600'
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className='px-6 py-4'>
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
              </td>
              <td className='px-6 py-4'>
                <a href={`/admin/users/${user.id}`} className='text-sky-400 hover:underline'>
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
