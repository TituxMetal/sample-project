import type { ConfigService } from '@nestjs/config'

import { PrismaProvider } from './Prisma.provider'

describe('PrismaProvider', () => {
  let provider: PrismaProvider
  let mockConfigService: jest.Mocked<ConfigService>

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'DATABASE_URL') return 'test-database-url'
        return undefined
      })
    } as unknown as jest.Mocked<ConfigService>

    provider = new PrismaProvider(mockConfigService)
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
