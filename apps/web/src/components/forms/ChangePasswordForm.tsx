import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper, Input } from '~/components/ui'
import type { ChangePasswordSchema } from '~/features/auth'
import { changePasswordSchema } from '~/features/auth'
import { authClient } from '~/lib/authClient'

export const ChangePasswordForm = () => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<ChangePasswordSchema>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onTouched',
    resolver: zodResolver(changePasswordSchema)
  })

  const handleSubmit = form.handleSubmit(async data => {
    setStatus('idle')
    setErrorMessage(null)

    const { error } = await authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      revokeOtherSessions: true
    })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message ?? 'Failed to change password')
      return
    }

    setStatus('success')
    form.reset()
  })

  return (
    <div className='p-6'>
      <h2 className='mb-4 text-xl font-bold text-zinc-100'>Change Password</h2>

      {status === 'success' && (
        <p className='mb-4 rounded-md bg-green-900/50 p-3 text-green-400'>
          Password changed successfully!
        </p>
      )}
      <FormWrapper onSubmit={handleSubmit} error={errorMessage}>
        <Input
          {...form.register('currentPassword')}
          type='password'
          label='Current Password'
          placeholder='Enter your current password'
          error={form.formState.errors.currentPassword?.message}
          autoComplete='current-password'
        />
        <Input
          {...form.register('newPassword')}
          type='password'
          label='New Password'
          placeholder='Enter your new password'
          error={form.formState.errors.newPassword?.message}
          autoComplete='new-password'
        />
        <Input
          {...form.register('confirmPassword')}
          type='password'
          label='Confirm New Password'
          placeholder='Confirm new password'
          error={form.formState.errors.confirmPassword?.message}
          autoComplete='new-password'
        />
        <Button type='submit' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Changing...' : 'Change Password'}
        </Button>
      </FormWrapper>
    </div>
  )
}
