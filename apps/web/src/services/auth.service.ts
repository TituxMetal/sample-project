// import { PUBLIC_API_URL } from 'astro:env/client'
import type { LoginSchema, SignupSchema } from '~/schemas/auth.schema'
import { apiRequest } from '~/services/api.service'
import type { AuthMode } from '~/types/auth.types'
import type { User } from '~/types/user.types'

/**
 * Authenticates a user through the API
 * @param data - The authentication data (login or signup schema)
 * @param mode - The authentication mode (login or signup)
 * @returns API response with user data on success
 */
export const authenticateUser = async (data: LoginSchema | SignupSchema, mode: AuthMode) => {
  const endpoint = mode === 'login' ? 'login' : 'register'
  // const API_URL = PUBLIC_API_URL
  const API_URL = import.meta.env.PUBLIC_API_URL || '/api'
  console.log('API_URL in auth.service', API_URL)

  // Transform the data for login to match backend expectations
  const requestData =
    mode === 'login' && 'identifier' in data
      ? { emailOrUsername: data.identifier, password: data.password }
      : data

  return apiRequest<User>(`${API_URL}/auth/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
}
