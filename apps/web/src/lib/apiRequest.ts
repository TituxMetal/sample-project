import type { ApiResponse } from '~/types/api.types'

const BASE_URL =
  typeof window !== 'undefined'
    ? import.meta.env.PUBLIC_API_URL || '/api' // Client-side: use relative URL
    : process.env.API_URL || 'http://localhost:3000' // Server-side: use full URL

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${BASE_URL}${endpoint}`

  const headers = new Headers(options.headers)

  if (options.body && !headers.get('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = typeof window !== 'undefined' ? getCookie('auth_token') : null

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        message: errorText || `HTTP ${response.status}`,
        status: response.status
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
      status: response.status
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error'
    }
  }
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' })
}
