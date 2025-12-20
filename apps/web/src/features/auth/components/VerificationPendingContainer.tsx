import { useState } from 'react'

import { Button } from '~/components/ui'
import { authClient } from '~/lib/authClient'

export interface VerificationPendingContainerProps {
  email: string | null
}

export const VerificationPendingContainer = ({ email }: VerificationPendingContainerProps) => {
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleResend = async () => {
    if (!email) return

    setIsResending(true)
    setResendStatus('idle')
    setErrorMessage(null)

    const { error } = await authClient.sendVerificationEmail({ email })

    setIsResending(false)

    if (error) {
      setResendStatus('error')
      setErrorMessage(error.message ?? 'Failed to resend verification email.')
      return
    }

    setResendStatus('success')
  }

  return (
    <div className='mx-auto max-w-md rounded-lg bg-zinc-800/50 p-6 text-center'>
      <h2 className='mb-4 text-2xl font-bold text-zinc-100'>Check Your Email</h2>
      <p className='mb-6 text-zinc-300'>
        We sent a verification link to{' '}
        <strong className='text-amber-200'>{email ?? 'your email'}</strong>. Please check your inbox
        and click the link to verify your account.
      </p>

      {resendStatus === 'success' && (
        <p className='mb-4 rounded-md bg-green-900/50 p-3 text-green-400'>
          Verification email sent! Check your inbox.
        </p>
      )}

      {resendStatus === 'error' && (
        <p className='mb-4 rounded-md bg-red-900/50 p-3 text-red-400'>{errorMessage}</p>
      )}

      <div className='flex flex-col gap-3'>
        {email && (
          <Button onClick={handleResend} disabled={isResending} variant='outline'>
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
        )}

        <Button as='a' href='/auth?mode=login' variant='ghost'>
          Back to Login
        </Button>
      </div>
    </div>
  )
}
