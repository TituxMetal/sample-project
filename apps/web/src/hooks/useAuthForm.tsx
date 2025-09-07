import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  loginSchema,
  signupSchema,
  type LoginSchema,
  type SignupSchema
} from '~/schemas/auth.schema'
import { authenticateUser } from '~/services/auth.service'
import type {
  AuthFormProps,
  AuthMode,
  AuthenticateFunction,
  LoginFormReturn,
  SignupFormReturn
} from '~/types/auth.types'
import { redirect } from '~/utils/navigation'

export const useLoginForm = ({
  onAuthenticate = authenticateUser,
  redirectPath
}: AuthFormProps): LoginFormReturn => {
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
    mode: 'onTouched',
    criteriaMode: 'all'
  })

  const handleSubmit = form.handleSubmit(async (data: LoginSchema) => {
    setServerError(null)
    const result = await onAuthenticate(data, 'login')

    if (!result.success) {
      setServerError(result.message || 'Login failed')
    }

    if (result.success && typeof window !== 'undefined') {
      form.reset()
      redirect(redirectPath || '/')
    }

    return result
  })

  return {
    form,
    serverError,
    isError: form.formState.isSubmitted && !form.formState.isValid,
    handleSubmit
  }
}

export const useSignupForm = ({
  onAuthenticate = authenticateUser,
  redirectPath
}: AuthFormProps): SignupFormReturn => {
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '' },
    mode: 'onTouched',
    criteriaMode: 'all'
  })

  const handleSubmit = form.handleSubmit(async (data: SignupSchema) => {
    setServerError(null)
    const result = await onAuthenticate(data, 'signup')

    if (!result.success) {
      setServerError(result.message || 'Sign up failed')
    }

    if (result.success && typeof window !== 'undefined') {
      form.reset()
      redirect(redirectPath || '/')
    }

    return result
  })

  return {
    form,
    serverError,
    isError: form.formState.isSubmitted && !form.formState.isValid,
    handleSubmit
  }
}

const authFormHooks = {
  login: useLoginForm,
  signup: useSignupForm
}

export function useAuthForm(
  mode: 'login',
  onAuthenticate: AuthenticateFunction,
  redirectPath?: string
): LoginFormReturn

export function useAuthForm(
  mode: 'signup',
  onAuthenticate: AuthenticateFunction,
  redirectPath?: string
): SignupFormReturn

export function useAuthForm(
  mode: AuthMode,
  onAuthenticate: AuthenticateFunction = authenticateUser,
  redirectPath?: string
): LoginFormReturn | SignupFormReturn {
  const selectedHook = authFormHooks[mode]

  return selectedHook({ onAuthenticate, redirectPath })
}
