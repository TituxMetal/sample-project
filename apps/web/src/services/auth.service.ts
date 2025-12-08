import { api } from '~/lib/apiRequest'
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
 * Get current authenticated user (SSR-only - use useAuth hook on client)
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/me')
  return handleApiResponseWithData(response)
}
