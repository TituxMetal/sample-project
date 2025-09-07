import type { AuthMode } from '~/types/auth.types'

export const routes = Object.freeze({
  auth: Object.freeze({
    path: '/auth',
    getUrl: (mode: AuthMode) => `/auth?mode=${mode}`,
    getOppositeMode: (mode: AuthMode): AuthMode => (mode === 'login' ? 'signup' : 'login'),
    getOppositeModeUrl: (currentMode: AuthMode) =>
      routes.auth.getUrl(routes.auth.getOppositeMode(currentMode))
  })
})

export type AppRoutes = typeof routes
