import { beforeEach, describe, expect, it, vi } from 'vitest'

import { apiRequest } from './api.service'

describe('apiRequest', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    global.fetch = vi.fn()
  })

  it('should include credentials by default', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'test-data' })
    }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await apiRequest('https://api.example.com/data')

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({ credentials: 'include' })
    )
  })

  it('should allow overriding default options', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'test-data' })
    }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await apiRequest('https://api.example.com/data', {
      credentials: 'omit',
      method: 'POST'
    })

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({
        credentials: 'omit',
        method: 'POST'
      })
    )
  })

  it('should return success response with data for successful requests', async () => {
    const responseData = { name: 'Test User', email: 'test@example.com' }
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ data: responseData })
    }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const result = await apiRequest<typeof responseData>('https://api.example.com/user')

    expect(result).toEqual({
      success: true,
      data: responseData
    })
  })

  it('should handle responses without data property', async () => {
    const responseData = { name: 'Test User', email: 'test@example.com' }
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(responseData)
    }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const result = await apiRequest<typeof responseData>('https://api.example.com/user')

    expect(result).toEqual({
      success: true,
      data: responseData
    })
  })

  it('should return error response for unsuccessful requests', async () => {
    const errorMessage = 'Invalid credentials'
    const mockResponse = {
      ok: false,
      json: vi.fn().mockResolvedValue({ message: errorMessage })
    }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const result = await apiRequest('https://api.example.com/login')

    expect(result).toEqual({
      success: false,
      message: errorMessage
    })
  })

  it('should use default error message when none provided', async () => {
    const mockResponse = {
      ok: false,
      json: vi.fn().mockResolvedValue({})
    }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const result = await apiRequest('https://api.example.com/data', undefined, 'Custom error')

    expect(result).toEqual({
      success: false,
      message: 'Custom error'
    })
  })

  it('should handle fetch errors', async () => {
    const networkError = new Error('Network failure')
    global.fetch = vi.fn().mockRejectedValue(networkError)

    const result = await apiRequest('https://api.example.com/data')

    expect(result).toEqual({
      success: false,
      message: 'Network failure'
    })
  })

  it('should handle unknown errors gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue('Unknown error type')

    const result = await apiRequest('https://api.example.com/data')

    expect(result).toEqual({
      success: false,
      message: 'An unknown error occurred'
    })
  })
})
