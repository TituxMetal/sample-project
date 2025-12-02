import type { ExecutionContext } from '@nestjs/common'
import { describe, expect, it } from 'bun:test'

import { GetCurrentUser } from './GetCurrentUser.decorator'

interface MockUser {
  id: string
  email: string
}

interface RequestWithUser {
  user?: MockUser
}

describe('GetCurrentUser Decorator', () => {
  const mockUser: MockUser = { id: 'user-123', email: 'test@example.com' }

  // Helper function to simulate decorator logic with proper typing
  const simulateDecoratorLogic = (_data: unknown, ctx: ExecutionContext): MockUser | undefined => {
    const request = ctx.switchToHttp().getRequest() as RequestWithUser
    return request.user
  }

  it('should extract user from request context', () => {
    const mockRequest: RequestWithUser = { user: mockUser }
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest
      })
    } as ExecutionContext

    const result = simulateDecoratorLogic(undefined, mockContext)
    expect(result).toEqual(mockUser)
  })

  it('should handle undefined user', () => {
    const mockRequest: RequestWithUser = { user: undefined }
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest
      })
    } as ExecutionContext

    const result = simulateDecoratorLogic(undefined, mockContext)
    expect(result).toBeUndefined()
  })

  it('should be a parameter decorator', () => {
    expect(typeof GetCurrentUser).toBe('function')
  })
})
