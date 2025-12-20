import { useEffect, useState } from 'react'

import { Button } from '~/components/ui'
import { authClient } from '~/lib/authClient'
import { redirect } from '~/utils/navigation'

type Session = {
  id: string
  token: string
  expiresAt: Date
  createdAt: Date
  userAgent?: string | null
  ipAddress?: string | null
}

export const SessionList = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentToken, setCurrentToken] = useState<string | null>(null)

  const fetchSessions = async () => {
    setIsLoading(true)
    setError(null)

    const [sessionsResult, currentResult] = await Promise.all([
      authClient.listSessions(),
      authClient.getSession()
    ])

    if (sessionsResult.error) {
      setError(sessionsResult.error.message ?? 'Failed to load sessions')
      setIsLoading(false)
      return
    }

    setSessions(sessionsResult.data ?? [])
    setCurrentToken(currentResult.data?.session?.token ?? null)
    setIsLoading(false)
  }

  const handleRevokeSession = async (token: string) => {
    const { error } = await authClient.revokeSession({ token })

    if (error) {
      setError(error.message ?? 'Failed to revoke session')
      return
    }

    await fetchSessions()
  }

  const handleRevokeOtherSessions = async () => {
    const { error } = await authClient.revokeOtherSessions()

    if (error) {
      setError(error.message ?? 'Failed to revoke sessions')
      return
    }

    await fetchSessions()
  }

  const handleRevokeAllSessions = async () => {
    const { error } = await authClient.revokeSessions()

    if (error) {
      setError(error.message ?? 'Failed to revoke all sessions')
      return
    }

    redirect('/auth')
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  if (isLoading) {
    return (
      <section className='rounded-lg bg-zinc-800 p-6'>
        <h2 className='text-lg font-bold text-zinc-100'>Active Sessions</h2>
        <p className='mt-4 text-zinc-400'>Loading sessions...</p>
      </section>
    )
  }

  return (
    <section className='rounded-lg bg-zinc-800 p-6'>
      <header className='flex items-center justify-between'>
        <h2 className='text-lg font-bold text-zinc-100'>Active Sessions</h2>
        <div className='flex gap-2'>
          {sessions.length > 1 && (
            <Button variant='outline' onClick={handleRevokeOtherSessions}>
              Log out other devices
            </Button>
          )}
          <Button variant='destructive' onClick={handleRevokeAllSessions}>
            Log out everywhere
          </Button>
        </div>
      </header>

      {error && <p className='mt-4 text-red-400'>{error}</p>}

      {sessions.length === 0 ? (
        <p className='mt-4 text-zinc-400'>No active sessions found.</p>
      ) : (
        <ul className='mt-4 space-y-3'>
          {sessions.map(session => {
            const isCurrent = session.token === currentToken

            return (
              <li
                key={session.id}
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  isCurrent ? 'border-sky-400 bg-zinc-700' : 'border-zinc-700'
                }`}
              >
                <div>
                  <p className='text-zinc-100'>
                    {session.userAgent ?? 'Unknown device'}
                    {isCurrent && (
                      <span className='ml-2 rounded bg-sky-400 px-2 py-0.5 text-xs font-medium text-zinc-900'>
                        Current
                      </span>
                    )}
                  </p>
                  <p className='text-sm text-zinc-400'>
                    {session.ipAddress ?? 'Unknown IP'} · Created{' '}
                    {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!isCurrent && (
                  <Button variant='ghost' onClick={() => handleRevokeSession(session.token)}>
                    Revoke
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
