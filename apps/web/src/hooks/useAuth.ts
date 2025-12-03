import { useStore } from '@nanostores/react'

import type { LoginSchema, SignupSchema } from '~/schemas/auth.schema'
import { $error, $hasError, $isAuthenticated, $isLoading, $user, authActions } from '~/stores/auth'
import type { User } from '~/types/user.types'
import { redirect } from '~/utils/navigation'

export interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  hasError: boolean
  login: (credentials: LoginSchema, redirectPath?: string) => Promise<void>
  register: (data: SignupSchema, redirectPath?: string) => Promise<void>
  logout: (redirectPath?: string) => Promise<void>
  refresh: () => Promise<void>
  clearError: () => void
  silentRefresh: () => Promise<void>
  updateProfile: (updates: Partial<User>) => void
}

export const useAuth = (): UseAuthReturn => {
  const user = useStore($user)
  const isAuthenticated = useStore($isAuthenticated)
  const isLoading = useStore($isLoading)
  const error = useStore($error)
  const hasError = useStore($hasError)

  const login = async (credentials: LoginSchema, redirectPath?: string) => {
    await authActions.login(credentials)

    if (typeof window !== 'undefined') {
      // Small delay to ensure state updates are processed
      setTimeout(() => {
        redirect(redirectPath || '/')
      }, 100)
    }
  }

  const register = async (data: SignupSchema, redirectPath?: string) => {
    await authActions.register(data)

    if (typeof window !== 'undefined') {
      redirect(redirectPath || '/')
    }
  }

  const logout = async (redirectPath?: string) => {
    await authActions.logout()

    if (typeof window !== 'undefined') {
      redirect(redirectPath || '/auth')
    }
  }

  const updateProfile = (updates: Partial<User>) => {
    authActions.updateUser(updates)
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    hasError,
    login,
    register,
    logout,
    refresh: authActions.refresh,
    clearError: authActions.clearError,
    silentRefresh: authActions.silentRefresh,
    updateProfile
  }
}
