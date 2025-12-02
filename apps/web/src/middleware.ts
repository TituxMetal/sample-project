import type { APIContext, MiddlewareNext } from 'astro'

import { apiRequest } from './lib/apiRequest'
import type { User } from './types/user.types'

export const onRequest = async (context: APIContext, next: MiddlewareNext) => {
  const token = context.cookies.get('auth_token')

  if (!token) {
    return next()
  }

  if (context.locals.user) {
    return next()
  }

  try {
    const result = await apiRequest('/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (!result.success) {
      if (result.message?.includes('Unauthorized')) {
        context.cookies.delete('auth_token')
      }
      return next()
    }

    context.locals.user = result.data as User
  } catch (error) {
    // Silently handle middleware errors, continue to next()
  }

  return next()
}
