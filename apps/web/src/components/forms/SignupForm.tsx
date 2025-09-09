import type { UseFormReturn } from 'react-hook-form'

import { Input } from '~/components/ui'
import type { SignupSchema } from '~/schemas/auth.schema'

export interface SignupFormProps {
  form: UseFormReturn<SignupSchema>
}

export const SignupForm = ({ form }: SignupFormProps) => (
  <>
    <Input
      {...form.register('username')}
      label='Username'
      placeholder='Enter your username'
      error={form.formState.errors.username?.message}
      autoComplete='username'
    />

    <Input
      {...form.register('email')}
      label='Email'
      placeholder='Enter your email'
      error={form.formState.errors.email?.message}
      autoComplete='email'
    />

    <Input
      {...form.register('password')}
      type='password'
      label='Password'
      placeholder='Enter your password'
      error={form.formState.errors.password?.message}
      autoComplete='new-password'
    />
  </>
)
