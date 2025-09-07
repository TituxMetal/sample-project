import type { UpdateProfileSchema } from '~/schemas/user.schema'
import type { User } from '~/types/user.types'
import { apiRequest } from './api.service'

export const updateProfile = async (data: UpdateProfileSchema, headers?: HeadersInit) => {
  const API_URL = import.meta.env.PUBLIC_API_URL || '/api'

  return apiRequest<User>(`${API_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}
