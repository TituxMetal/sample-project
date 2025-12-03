import { describe, expect, it } from 'bun:test'

import { PrismaModule } from './Prisma.module'

describe('PrismaModule', () => {
  it('should be defined', () => {
    expect(PrismaModule).toBeDefined()
  })

  it('should be a valid module constructor', () => {
    expect(typeof PrismaModule).toBe('function')
    expect(PrismaModule.name).toBe('PrismaModule')
  })

  it('should be decorated with @Module', () => {
    // Check if the module has module metadata (indicates @Module decorator was applied)
    const moduleKeys = Reflect.getMetadataKeys(PrismaModule)
    expect(moduleKeys.length).toBeGreaterThan(0)
  })
})
