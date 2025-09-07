import type { AuthUserEntity } from '~/auth/domain/entities'
import type { EmailValueObject } from '~/auth/domain/value-objects'

import type { IAuthUserRepository } from './AuthUser.repository'

describe('IAuthUserRepository', () => {
  let mockRepository: IAuthUserRepository

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  })

  it('should have all required methods', () => {
    const methods = ['findById', 'findByEmail', 'findByUsername', 'save', 'update', 'delete']

    for (const method of methods) {
      expect(mockRepository[method as keyof IAuthUserRepository]).toBeDefined()
      expect(typeof mockRepository[method as keyof IAuthUserRepository]).toBe('function')
    }
  })

  it('should accept correct parameter types', async () => {
    const mockEmail = { value: 'test@example.com' } as EmailValueObject
    const mockAuthUser = { id: 'test-id' } as AuthUserEntity

    await mockRepository.findById('test-id')
    await mockRepository.findByEmail(mockEmail)
    await mockRepository.findByUsername('testuser')
    await mockRepository.save(mockAuthUser)
    await mockRepository.update(mockAuthUser)
    await mockRepository.delete('test-id')

    const findByIdCalls = (mockRepository.findById as jest.Mock).mock.calls as [string][]
    expect(findByIdCalls).toHaveLength(1)
    expect(findByIdCalls[0]?.[0]).toBe('test-id')

    const findByEmailCalls = (mockRepository.findByEmail as jest.Mock).mock.calls as [
      EmailValueObject
    ][]
    expect(findByEmailCalls).toHaveLength(1)
    expect(findByEmailCalls[0]?.[0]).toEqual(mockEmail)

    const findByUsernameCalls = (mockRepository.findByUsername as jest.Mock).mock.calls as [
      string
    ][]
    expect(findByUsernameCalls).toHaveLength(1)
    expect(findByUsernameCalls[0]?.[0]).toBe('testuser')

    const saveCalls = (mockRepository.save as jest.Mock).mock.calls as [AuthUserEntity][]
    expect(saveCalls).toHaveLength(1)
    expect(saveCalls[0]?.[0]).toEqual(mockAuthUser)

    const updateCalls = (mockRepository.update as jest.Mock).mock.calls as [AuthUserEntity][]
    expect(updateCalls).toHaveLength(1)
    expect(updateCalls[0]?.[0]).toEqual(mockAuthUser)

    const deleteCalls = (mockRepository.delete as jest.Mock).mock.calls as [string][]
    expect(deleteCalls).toHaveLength(1)
    expect(deleteCalls[0]?.[0]).toBe('test-id')
  })
})
