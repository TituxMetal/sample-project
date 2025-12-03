import type { ConfigService } from '@nestjs/config'
import { beforeEach, describe, expect, it, mock } from 'bun:test'
import type { Mock } from 'bun:test'

import { PrismaProvider } from './Prisma.provider'

describe('PrismaProvider', () => {
  let provider: PrismaProvider
  let mockConfigService: {
    get: Mock<(key: string) => string | undefined>
  }

  beforeEach(() => {
    mockConfigService = {
      get: mock((key: string) => {
        if (key === 'DATABASE_URL') return 'test-database-url'
        return undefined
      })
    } as unknown as {
      get: Mock<(key: string) => string | undefined>
    }

    provider = new PrismaProvider(mockConfigService as unknown as ConfigService)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })

  it('should configure database URL from ConfigService', () => {
    expect(mockConfigService.get).toHaveBeenCalledWith('DATABASE_URL')
  })

  describe('lifecycle hooks', () => {
    it('should have onModuleInit method', () => {
      expect(provider.onModuleInit).toBeDefined()
      expect(typeof provider.onModuleInit).toBe('function')
    })

    it('should have onModuleDestroy method', () => {
      expect(provider.onModuleDestroy).toBeDefined()
      expect(typeof provider.onModuleDestroy).toBe('function')
    })
  })
})
