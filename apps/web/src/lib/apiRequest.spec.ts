import { beforeEach, describe, expect, it, mock } from 'bun:test'

// Create a mock fetch function that we'll control in tests
const mockFetch = mock(() => Promise.resolve({} as Response))

// Override global fetch immediately when this file loads
// This happens before the module under test is imported
globalThis.fetch = mockFetch as unknown as typeof fetch

// Now import the module under test - it will capture our mocked fetch
import { api, apiRequest } from './apiRequest'

describe('apiRequest', () => {
  beforeEach(() => {
    // Reset the mock for each test
    mockFetch.mockClear()
    mockFetch.mockReset()

    // Set up document.cookie for each test
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'auth_token=test-token-123',
      configurable: true
    })
  })

  it('should make a successful GET request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, name: 'Test User' })
    } as Response)

    const result = await apiRequest('/users/1')

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/users/1',
      expect.objectContaining({
        credentials: 'include',
        headers: expect.any(Headers)
      })
    )

    // Check headers separately since Headers is a special object
    const call = mockFetch.mock.calls[0] as unknown as [string, RequestInit]
    const headers = call[1].headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer test-token-123')

    expect(result).toEqual({
      success: true,
      data: { id: 1, name: 'Test User' },
      status: 200
    })
  })

  it('should make a successful POST request with JSON body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: 2, name: 'New User' })
    } as Response)

    const body = { name: 'New User', email: 'test@example.com' }
    const result = await api.post('/users', body)

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
        headers: expect.any(Headers)
      })
    )

    // Check headers separately since Headers is a special object
    const call = mockFetch.mock.calls[0] as unknown as [string, RequestInit]
    const headers = call[1].headers as Headers
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(headers.get('Authorization')).toBe('Bearer test-token-123')

    expect(result).toEqual({
      success: true,
      data: { id: 2, name: 'New User' },
      status: 201
    })
  })

  it('should handle HTTP error responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized'
    } as Response)

    const result = await apiRequest('/protected')

    expect(result).toEqual({
      success: false,
      message: 'Unauthorized',
      status: 401
    })
  })

  it('should handle network errors', async () => {
    mockFetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')))

    const result = await apiRequest('/users')

    expect(result).toEqual({
      success: false,
      message: 'Network error',
      status: 0
    })
  })

  it('should work without auth token', async () => {
    // Mock no cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
      configurable: true
    })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ message: 'Public data' })
    } as Response)

    const result = await apiRequest('/public')

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/public',
      expect.objectContaining({
        headers: expect.any(Headers)
      })
    )

    // Check that no Authorization header was set
    const call = mockFetch.mock.calls[0] as unknown as [string, RequestInit]
    const headers = call[1].headers as Headers
    expect(headers.get('Authorization')).toBeNull()

    expect(result.success).toBe(true)
  })
})

describe('api helpers', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true })
    } as Response)
    // Set up document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'auth_token=test-token-123',
      configurable: true
    })
  })

  it('should use correct HTTP methods', async () => {
    await api.get('/test')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'GET' })
    )

    mockFetch.mockClear()
    await api.post('/test', {})
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'POST' })
    )

    mockFetch.mockClear()
    await api.put('/test', {})
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PUT' })
    )

    mockFetch.mockClear()
    await api.patch('/test', {})
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PATCH' })
    )

    mockFetch.mockClear()
    await api.delete('/test')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'DELETE' })
    )
  })
})
