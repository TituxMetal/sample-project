import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper, Input } from '~/components/ui'
import { authClient } from '~/lib/authClient'

import type { ResetPasswordSchema } from '../schemas/auth.schema'
import { resetPasswordSchema } from '../schemas/auth.schema'

interface ResetPasswordContainerProps {
  token: string | null
}

export const ResetPasswordContainer = ({ token }: ResetPasswordContainerProps) => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<ResetPasswordSchema>({
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onTouched',
    resolver: zodResolver(resetPasswordSchema)
  })

  const handleSubmit = form.handleSubmit(async data => {
    if (!token) return

    setStatus('idle')
    setErrorMessage(null)

    const { error } = await authClient.resetPassword({ token, newPassword: data.password })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message ?? 'Failed to reset password')
      return
    }

    setStatus('success')
  })

  if (!token) {
    return (
      <div className='mx-auto max-w-md rounded-lg bg-zinc-800/50 p-6 text-center'>
        <h2 className='mb-4 text-2xl font-bold text-red-400'>Invalid Reset Link</h2>
        <p className='mb-6 text-zinc-300'>This password reset link is invalid or has expired.</p>
        <Button as='a' href='/forgot-password'>
          Request New Link
        </Button>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className='mx-auto max-w-md rounded-lg bg-zinc-800/50 p-6 text-center'>
        <h2 className='mb-4 text-2xl font-bold text-zinc-100'>Password Reset</h2>
        <p className='mb-6 text-zinc-300'>Your password has been successfully reset.</p>
        <Button as='a' href='/auth?mode=login'>
          Go to Login
        </Button>
      </div>
    )
  }

  return (
    <FormWrapper onSubmit={handleSubmit} error={errorMessage}>
      <Input
        {...form.register('password')}
        type='password'
        label='New Password'
        placeholder='Enter your new password'
        error={form.formState.errors.password?.message}
        autoComplete='new-password'
      />
      <Input
        {...form.register('confirmPassword')}
        type='password'
        label='Confirm Password'
        placeholder='Confirm your new password'
        error={form.formState.errors.confirmPassword?.message}
        autoComplete='new-password'
      />
      <div className='flex items-center justify-between'>
        <Button type='submit' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>
        <a href='/auth?mode=login' className='font-semibold text-amber-200 hover:text-amber-300'>
          Back to Login
        </a>
      </div>
    </FormWrapper>
  )
}
