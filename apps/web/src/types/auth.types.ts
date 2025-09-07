import type { ReactNode } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import type { LoginSchema, SignupSchema } from '~/schemas/auth.schema'
import type { authenticateUser } from '~/services/auth.service'
import type { ApiResponse } from './api.types'
import type { User } from './user.types'

export const AUTH_MODES = ['login', 'signup'] as const

export type AuthMode = (typeof AUTH_MODES)[number]

export type AuthResult = ApiResponse<User>

export type LoginFormReturn = AuthFormReturn<LoginSchema>

export type SignupFormReturn = AuthFormReturn<SignupSchema>

export type AuthenticateFunction = (
  data: LoginSchema | SignupSchema,
  mode: AuthMode
) => Promise<AuthResult>

export interface AuthFormReturn<T extends FieldValues> {
  form: UseFormReturn<T>
  serverError: string | null
  isError: boolean
  handleSubmit: ReturnType<UseFormReturn<T>['handleSubmit']>
}

export interface AuthFormProps {
  onAuthenticate?: AuthenticateFunction
  redirectPath?: string
}

export interface ComponentAuthFormProps extends AuthFormProps {
  mode?: AuthMode
}

export interface FormWrapperProps {
  serverError: string | null
  isError: boolean
  handleSubmit: () => void
  mode: AuthMode
  children: ReactNode
}

export interface FormComponentProps {
  onAuthenticate: typeof authenticateUser
  redirectPath?: string
}

export const isValidAuthMode = (mode: unknown): mode is AuthMode => {
  return typeof mode === 'string' && AUTH_MODES.includes(mode as AuthMode)
}
