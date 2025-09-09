import type { UpdateProfileSchema } from '~/schemas/user.schema'
import type { User } from '~/types/user.types'
import { apiRequest } from '~/lib/apiRequest'

export const updateProfile = async (data: UpdateProfileSchema, headers?: HeadersInit) => {
  return apiRequest<User>('/users/me', {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data)
  })
}
