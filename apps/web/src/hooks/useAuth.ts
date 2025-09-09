import { useStore } from '@nanostores/react'
import type { LoginSchema, SignupSchema } from '~/schemas/auth.schema'
import type { User } from '~/types/user.types'
import { redirect } from '~/utils/navigation'
import { $user, $isAuthenticated, $isLoading, authStore } from '~/stores/auth'
import {
  login as loginService,
  register as registerService,
  logout as logoutService
} from '~/services/auth.service'

export interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginSchema, redirectPath?: string) => Promise<void>
  register: (data: SignupSchema, redirectPath?: string) => Promise<void>
  logout: (redirectPath?: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => void
}

export const useAuth = (): UseAuthReturn => {
  const user = useStore($user)
  const isAuthenticated = useStore($isAuthenticated)
  const isLoading = useStore($isLoading)

  const login = async (credentials: LoginSchema, redirectPath?: string) => {
    authStore.setLoading(true)

    try {
      const result = await loginService(credentials)

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Login failed')
      }

      authStore.setUser(result.data)

      if (typeof window !== 'undefined') {
        // Small delay to ensure state updates are processed
        setTimeout(() => {
          redirect(redirectPath || '/')
        }, 100)
      }
    } catch (err) {
      throw err
    } finally {
      authStore.setLoading(false)
    }
  }

  const register = async (data: SignupSchema, redirectPath?: string) => {
    authStore.setLoading(true)

    try {
      const result = await registerService(data)

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Registration failed')
      }

      authStore.setUser(result.data)

      if (typeof window !== 'undefined') {
        redirect(redirectPath || '/')
      }
    } catch (err) {
      throw err
    } finally {
      authStore.setLoading(false)
    }
  }

  const logout = async (redirectPath?: string) => {
    authStore.setLoading(true)

    try {
      await logoutService()
      authStore.clearUser()

      if (typeof window !== 'undefined') {
        redirect(redirectPath || '/auth')
      }
    } catch (err) {
      authStore.clearUser()
      if (typeof window !== 'undefined') {
        redirect(redirectPath || '/auth')
      }
    } finally {
      authStore.setLoading(false)
    }
  }

  const updateProfile = (updates: Partial<User>) => {
    authStore.updateUser(updates)
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  }
}
