import { useEffect, useState } from 'react'

import { Button } from '~/components/ui'
import { authClient } from '~/lib/authClient'

type VerificationStatus = 'verifying' | 'success' | 'error' | 'no-token'

export interface VerifyEmailContainerProps {
  token: string | null
}

export const VerifyEmailContainer = ({ token }: VerifyEmailContainerProps) => {
  const [status, setStatus] = useState<VerificationStatus>(token ? 'verifying' : 'no-token')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const verifyEmail = async () => {
      const { error } = await authClient.verifyEmail({ query: { token } })

      if (error) {
        setStatus('error')
        setErrorMessage(error.message ?? 'Verification failed. The link may have expired.')
        return
      }

      setStatus('success')
    }

    verifyEmail()
  }, [token])

  if (status === 'verifying') {
    return (
      <div className='mx-auto max-w-md text-center'>
        <p className='text-lg text-zinc-300'>Verifying your email...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className='mx-auto max-w-md rounded-lg bg-green-900/50 p-6 text-center'>
        <h2 className='mb-4 text-2xl font-bold text-green-400'>Email Verified!</h2>
        <p className='mb-6 text-zinc-300'>
          Your email has been successfully verified. You can now log in to your account.
        </p>
        <Button as='a' href='/auth?mode=login'>
          Go to Login
        </Button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className='mx-auto max-w-md rounded-lg bg-red-900/50 p-6 text-center'>
        <h2 className='mb-4 text-2xl font-bold text-red-400'>Verification Failed</h2>
        <p className='mb-6 text-zinc-300'>{errorMessage}</p>
        <Button as='a' href='/verification-pending'>
          Request New Link
        </Button>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-md rounded-lg bg-yellow-900/50 p-6 text-center'>
      <h2 className='mb-4 text-2xl font-bold text-yellow-400'>Invalid Link</h2>
      <p className='mb-6 text-zinc-300'>
        This verification link is invalid. Please check your email for the correct link.
      </p>
      <Button as='a' href='/auth?mode=login'>
        Go to Login
      </Button>
    </div>
  )
}
