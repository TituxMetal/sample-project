/**
 * Centralized environment configuration
 * Handles environment variables consistently across client and server contexts
 */
const isServer = typeof window === 'undefined'
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD

export const env = {
  // API URLs - automatically selects correct URL based on environment
  apiUrl: isServer
    ? process.env.API_URL || 'http://localhost:3000'
    : import.meta.env.PUBLIC_API_URL || '/api',

  // Environment flags
  isDev,
  isProd,
  isServer,
  isClient: !isServer
}
