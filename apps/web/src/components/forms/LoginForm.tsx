import type { UseFormReturn } from 'react-hook-form'

import { Input } from '~/components/ui'
import type { LoginSchema } from '~/schemas/auth.schema'

export interface LoginFormProps {
  form: UseFormReturn<LoginSchema>
}

export const LoginForm = ({ form }: LoginFormProps) => (
  <>
    <Input
      {...form.register('identifier')}
      label='Username or Email'
      placeholder='Enter your username or email'
      error={form.formState.errors.identifier?.message}
      autoComplete='username'
    />

    <Input
      {...form.register('password')}
      type='password'
      label='Password'
      placeholder='Enter your password'
      error={form.formState.errors.password?.message}
      autoComplete='current-password'
    />
  </>
)
