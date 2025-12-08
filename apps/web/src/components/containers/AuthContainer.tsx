import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { LoginForm } from '~/components/forms/LoginForm'
import { SignupForm } from '~/components/forms/SignupForm'
import { Button } from '~/components/ui'
import { FormWrapper } from '~/components/ui/FormWrapper'
import { useAuth } from '~/hooks/useAuth'
import type { LoginSchema, SignupSchema } from '~/schemas/auth.schema'
import { loginSchema, signupSchema } from '~/schemas/auth.schema'
import { routes } from '~/utils/routes'

export interface AuthContainerProps {
  mode?: 'login' | 'signup'
  redirectPath?: string
}

export const AuthContainer = ({ mode = 'login', redirectPath }: AuthContainerProps) => {
  const { login, register, isLoading } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
    criteriaMode: 'all'
  })

  const signupForm = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', username: '', email: '', password: '' },
    mode: 'onTouched',
    criteriaMode: 'all'
  })

  const handleLoginSubmit = loginForm.handleSubmit(async data => {
    setServerError(null)
    try {
      await login(data, redirectPath)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Login failed')
    }
  })

  const handleSignupSubmit = signupForm.handleSubmit(async data => {
    setServerError(null)
    try {
      await register(data, redirectPath)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Registration failed')
    }
  })

  if (mode === 'login') {
    const isFormError = loginForm.formState.isSubmitted && !loginForm.formState.isValid

    return (
      <FormWrapper onSubmit={handleLoginSubmit} error={serverError} isLoading={isLoading}>
        <LoginForm form={loginForm} />

        <div className='flex items-center justify-between'>
          <Button type='submit' disabled={isFormError || isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </Button>

          <a
            href={routes.auth.getOppositeModeUrl('login')}
            className='font-semibold text-amber-200 hover:text-amber-300'
          >
            Need an account?
          </a>
        </div>
      </FormWrapper>
    )
  }

  // Signup mode
  const isFormError = signupForm.formState.isSubmitted && !signupForm.formState.isValid

  return (
    <FormWrapper onSubmit={handleSignupSubmit} error={serverError} isLoading={isLoading}>
      <SignupForm form={signupForm} />

      <div className='flex items-center justify-between'>
        <Button type='submit' disabled={isFormError || isLoading}>
          {isLoading ? 'Loading...' : 'Sign Up'}
        </Button>

        <a
          href={routes.auth.getOppositeModeUrl('signup')}
          className='font-semibold text-amber-200 hover:text-amber-300'
        >
          Already have an account?
        </a>
      </div>
    </FormWrapper>
  )
}
