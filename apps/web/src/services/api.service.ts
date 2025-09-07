import type { ApiResponse } from '~/types/api.types'

/**
 * Makes a standardized API request and returns a consistent response structure
 * @template T - The type of data expected in a successful response
 * @param url - The URL to fetch from
 * @param options - Fetch options
 * @param defaultError - Default error message if none is provided by the API
 * @returns A standardized API response object
 */
export const apiRequest = async <T>(
  url: string,
  options?: RequestInit,
  defaultError = 'An error occurred'
): Promise<ApiResponse<T>> => {
  const fetchOptions: RequestInit = {
    credentials: 'include',
    ...options
  }

  try {
    const response = await fetch(url, fetchOptions)
    const result = await response.json()

    if (!response.ok) return { success: false, message: result.message ?? defaultError }

    return { success: true, data: result.data ?? result }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    }
  }
}
