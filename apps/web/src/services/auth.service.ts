import type { LoginSchema, SignupSchema } from '~/schemas/auth.schema'
import { api } from '~/lib/apiRequest'
import type { User } from '~/types/user.types'

/**
 * Login user with credentials
 */
export const login = async (credentials: LoginSchema) => {
  const requestData = {
    emailOrUsername: credentials.identifier,
    password: credentials.password
  }

  const result = await api.post<{ user: User }>('/auth/login', requestData)

  if (result.success && result.data?.user) {
    return { ...result, data: result.data.user }
  }
  return result as any
}

/**
 * Register new user
 */
export const register = async (data: SignupSchema) => {
  const result = await api.post<{ user: User }>('/auth/register', data)

  if (result.success && result.data?.user) {
    return { ...result, data: result.data.user }
  }

  return result as any
}

/**
 * Logout current user
 */
export const logout = async () => {
  return api.post<void>('/auth/logout')
}

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  return api.get<User>('/users/me')
}
