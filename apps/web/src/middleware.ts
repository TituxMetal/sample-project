import type { APIContext, MiddlewareNext } from 'astro'
// import { getSecret } from 'astro:env/server'
// import { PUBLIC_API_URL } from 'astro:env/client'
import { apiRequest } from './services/api.service'
import type { User } from './types/user.types'

export const onRequest = async (context: APIContext, next: MiddlewareNext) => {
  const token = context.cookies.get('auth_token')

  if (!token) {
    console.log('No auth token found in cookies')
    return next()
  }

  if (context.locals.user) {
    return next()
  }

  const API_URL = process.env.API_URL || 'http://localhost:3000'

  try {
    const { success, data, message } = await apiRequest<User>(`${API_URL}/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (!success) {
      console.log('API request failed:', message)

      if (message?.includes('Unauthorized')) {
        console.log('Invalid token, clearing cookie')
        context.cookies.delete('auth_token')
      }

      return next()
    }

    context.locals.user = data
  } catch (error) {
    console.error('Error in middleware:', error)
  }

  return next()
}
