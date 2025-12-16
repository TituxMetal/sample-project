import { useEffect, useState } from 'react'

import { admin } from '~/lib/authClient'

import { UserManagement } from './UserManagement'

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
  userId: string
}

export const UserDetailContainer = ({ userId }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      setError(null)

      const result = await admin.listUsers({ query: { limit: 100 } })

      if (result.error) {
        setError(result.error.message ?? 'Failed to load user')
        setIsLoading(false)
        return
      }

      const foundUser = result.data?.users?.find(u => u.id === userId) as UserData | undefined

      if (!foundUser) {
        setError('User not found')
        setIsLoading(false)
        return
      }

      setUser(foundUser)
      setIsLoading(false)
    }

    fetchUser()
  }, [userId])

  if (isLoading) {
    return <p className='text-zinc-400'>Loading user...</p>
  }

  if (error) {
    return <p className='text-red-400'>{error}</p>
  }

  if (!user) {
    return <p className='text-zinc-400'>User not found</p>
  }

  return <UserManagement user={user} />
}
