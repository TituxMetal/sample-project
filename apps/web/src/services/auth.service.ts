import { api } from '~/lib/apiRequest'
import type { LoginSchema, SignupSchema } from '~/schemas/auth.schema'
import type { ApiResponse } from '~/types/api.types'
import type { User } from '~/types/user.types'

/**
 * Helper function for API responses that return data
 */
const handleApiResponseWithData = <T>(response: ApiResponse<T>): T => {
  if (response.success && response.data) {
    return response.data
  }
  throw new Error(response.message || 'API request failed')
}

/**
 * Helper function for API responses that don't return data (like logout)
 */
const handleApiResponseWithoutData = (response: ApiResponse<unknown>): void => {
  if (response.success) {
    return
  }
  throw new Error(response.message || 'API request failed')
}

/**
 * Login user with credentials
 */
export const login = async (credentials: LoginSchema): Promise<User> => {
  const requestData = {
    emailOrUsername: credentials.identifier,
    password: credentials.password
  }

  const response = await api.post<{ user: User }>('/auth/login', requestData)
  const result = handleApiResponseWithData(response)
  return result.user
}

/**
 * Register new user
 */
export const register = async (data: SignupSchema): Promise<User> => {
  const response = await api.post<{ user: User }>('/auth/register', data)
  const result = handleApiResponseWithData(response)
  return result.user
}

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  const response = await api.post('/auth/logout')
  handleApiResponseWithoutData(response)
}

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/me')
  return handleApiResponseWithData(response)
}
