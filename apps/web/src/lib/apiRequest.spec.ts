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

    // Set up document.cookie for each test (Better Auth session token)
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'better-auth.session_token=test-session-token-123',
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

    expect(mockFetch).toHaveBeenCalled()
    const call = mockFetch.mock.calls[0] as unknown as [string, RequestInit]
    // URL can be /api/users/1 (browser) or http://localhost:3000/users/1 (SSR)
    expect(call[0]).toContain('/users/1')
    expect(call[1].credentials).toBe('include')

    // Check headers separately since Headers is a special object
    const headers = call[1].headers as Headers
    expect(headers.get('Cookie')).toBe('better-auth.session_token=test-session-token-123')

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

    expect(mockFetch).toHaveBeenCalled()
    const call = mockFetch.mock.calls[0] as unknown as [string, RequestInit]
    // URL can be /api/users (browser) or http://localhost:3000/users (SSR)
    expect(call[0]).toContain('/users')
    expect(call[1].method).toBe('POST')
    expect(call[1].body).toBe(JSON.stringify(body))
    expect(call[1].credentials).toBe('include')

    // Check headers separately since Headers is a special object
    const headers = call[1].headers as Headers
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(headers.get('Cookie')).toBe('better-auth.session_token=test-session-token-123')

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

  it('should work without session token', async () => {
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

    expect(mockFetch).toHaveBeenCalled()
    const call = mockFetch.mock.calls[0] as unknown as [string, RequestInit]
    // URL can be /api/public (browser) or http://localhost:3000/public (SSR)
    expect(call[0]).toContain('/public')

    // Check that no Cookie header was set
    const headers = call[1].headers as Headers
    expect(headers.get('Cookie')).toBeNull()

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
      value: 'better-auth.session_token=test-session-token-123',
      configurable: true
    })
  })

  it('should use correct HTTP methods', async () => {
    await api.get('/test')
    let call = mockFetch.mock.calls[0] as unknown as [string, RequestInit]
    expect(call[1].method).toBe('GET')

    mockFetch.mockClear()
    await api.post('/test', {})
    call = mockFetch.mock.calls[0] as unknown as [string, RequestInit]
    expect(call[1].method).toBe('POST')

    mockFetch.mockClear()
    await api.put('/test', {})
    call = mockFetch.mock.calls[0] as unknown as [string, RequestInit]
    expect(call[1].method).toBe('PUT')

    mockFetch.mockClear()
    await api.patch('/test', {})
    call = mockFetch.mock.calls[0] as unknown as [string, RequestInit]
    expect(call[1].method).toBe('PATCH')

    mockFetch.mockClear()
    await api.delete('/test')
    call = mockFetch.mock.calls[0] as unknown as [string, RequestInit]
    expect(call[1].method).toBe('DELETE')
  })
})
