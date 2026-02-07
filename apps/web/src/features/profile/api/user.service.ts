import { api } from '~/lib/apiRequest'
import type { ApiResponse } from '~/types/api.types'
import type { User } from '~/types/user.types'

import type { UpdateProfileSchema } from '../schemas/user.schema'

/**
 * Helper function for consistent API response handling
 */
const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (response.success && response.data) {
    return response.data
  }
  throw new Error(response.message || 'API request failed')
}

/**
 * Update user profile
 */
export const updateProfile = async (data: UpdateProfileSchema): Promise<User> => {
  const response = await api.patch<User>('/users/me', data)
  return handleApiResponse(response)
}
