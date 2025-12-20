import { useStore } from '@nanostores/react'

import type { LoginSchema, SignupSchema } from '~/features/auth/schemas/auth.schema'
import {
  $error,
  $hasError,
  $isAuthenticated,
  $isLoading,
  $user,
  authActions
} from '~/features/auth/store/auth.store'
import { signIn, signOut, signUp } from '~/lib/authClient'
import type { User } from '~/types'
import { redirect } from '~/utils/navigation'

export interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  hasError: boolean
  login: (credentials: LoginSchema, redirectPath?: string) => Promise<void>
  register: (data: SignupSchema, redirectPath?: string) => Promise<void>
  logout: () => Promise<void>
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
    try {
      $isLoading.set(true)
      $error.set(null)

      const result = await signIn.email({
        email: credentials.email,
        password: credentials.password
      })

      if (result.error) {
        throw new Error(result.error.message || 'Login Failed')
      }

      await authActions.refresh()

      if (typeof window !== 'undefined') {
        setTimeout(() => {
          redirect(redirectPath || '/profile')
        }, 100)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login Failed'
      $error.set(errorMessage)
      throw err
    } finally {
      $isLoading.set(false)
    }
  }

  const register = async (data: SignupSchema, redirectPath?: string) => {
    try {
      $isLoading.set(true)
      $error.set(null)

      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.username,
        username: data.username
      })

      if (result.error) {
        throw new Error(result.error.message || 'Registration Failed')
      }

      if (typeof window !== 'undefined') {
        const verificationUrl = `/verification-pending?email=${encodeURIComponent(data.email)}`
        redirect(verificationUrl)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration Failed'
      $error.set(errorMessage)
      throw err
    } finally {
      $isLoading.set(false)
    }
  }

  const logout = async () => {
    try {
      $isLoading.set(true)
      $error.set(null)

      await signOut()
    } catch (err) {
      console.warn('Logout error:', err)
    } finally {
      $isLoading.set(false)
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
