import { useEffect, useState } from 'react'

import { admin } from '~/lib/authClient'

type UserStats = {
  total: number
  admins: number
  verified: number
  banned: number
}

export const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<UserStats>({ total: 0, admins: 0, verified: 0, banned: 0 })

  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)

    const { error, data } = await admin.listUsers({ query: { limit: 100 } })

    if (error) {
      setError(error.message ?? 'Failed to load users')
      setIsLoading(false)
      return
    }

    const users = data?.users ?? []
    setStats({
      total: users.length,
      admins: users.filter(user => user.role === 'admin').length,
      verified: users.filter(user => user.emailVerified).length,
      banned: users.filter(user => user.banned).length
    })
    setIsLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (isLoading) {
    return <p className='text-zinc-400'>Loading stats...</p>
  }

  if (error) {
    return <p className='text-red-400'>{error}</p>
  }

  return (
    <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <article className='rounded-lg bg-zinc-800 p-6'>
        <p className='text-3xl font-bold text-zinc-100'>{stats.total}</p>
        <p className='text-zinc-400'>Total Users</p>
      </article>
      <article className='rounded-lg bg-zinc-800 p-6'>
        <p className='text-3xl font-bold text-sky-400'>{stats.admins}</p>
        <p className='text-zinc-400'>Admins</p>
      </article>
      <article className='rounded-lg bg-zinc-800 p-6'>
        <p className='text-3xl font-bold text-emerald-400'>{stats.verified}</p>
        <p className='text-zinc-400'>Verified</p>
      </article>
      <article className='rounded-lg bg-zinc-800 p-6'>
        <p className='text-3xl font-bold text-red-400'>{stats.banned}</p>
        <p className='text-zinc-400'>Banned</p>
      </article>
    </section>
  )
}
