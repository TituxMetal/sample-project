import type { APIContext, MiddlewareNext } from 'astro'

import { apiRequest } from './lib/apiRequest'
import type { User } from './types/user.types'

export const onRequest = async (context: APIContext, next: MiddlewareNext) => {
  const sessionToken = context.cookies.get('better-auth.session_token')

  if (!sessionToken) {
    return next()
  }

  if (context.locals.user) {
    return next()
  }

  try {
    const result = await apiRequest('/api/users/me', {
      method: 'GET',
      headers: {
        Cookie: `better-auth.session_token=${sessionToken.value}`
      }
    })

    if (!result.success) {
      if (result.message?.includes('Unauthorized')) {
        context.cookies.delete('better-auth.session_token')
      }
      return next()
    }

    context.locals.user = result.data as User
  } catch (error) {
    // Silently handle middleware errors, continue to next()
  }

  return next()
}
