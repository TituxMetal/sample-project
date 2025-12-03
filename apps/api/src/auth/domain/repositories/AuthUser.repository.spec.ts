import { beforeEach, describe, expect, it, mock } from 'bun:test'
import type { Mock } from 'bun:test'

import type { AuthUserEntity } from '~/auth/domain/entities'
import type { EmailValueObject } from '~/auth/domain/value-objects'

import type { IAuthUserRepository } from './AuthUser.repository'

describe('IAuthUserRepository', () => {
  let mockRepository: IAuthUserRepository

  beforeEach(() => {
    mockRepository = {
      findById: mock(() => {}) as unknown as IAuthUserRepository['findById'],
      findByEmail: mock(() => {}) as unknown as IAuthUserRepository['findByEmail'],
      findByUsername: mock(() => {}) as unknown as IAuthUserRepository['findByUsername'],
      save: mock(() => {}) as unknown as IAuthUserRepository['save'],
      update: mock(() => {}) as unknown as IAuthUserRepository['update'],
      delete: mock(() => {}) as unknown as IAuthUserRepository['delete']
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

    const findByIdCalls = (mockRepository.findById as Mock<typeof mockRepository.findById>).mock
      .calls as [string][]
    expect(findByIdCalls).toHaveLength(1)
    expect(findByIdCalls[0]?.[0]).toBe('test-id')

    const findByEmailCalls = (mockRepository.findByEmail as Mock<typeof mockRepository.findByEmail>)
      .mock.calls as [EmailValueObject][]
    expect(findByEmailCalls).toHaveLength(1)
    expect(findByEmailCalls[0]?.[0]).toEqual(mockEmail)

    const findByUsernameCalls = (
      mockRepository.findByUsername as Mock<typeof mockRepository.findByUsername>
    ).mock.calls as [string][]
    expect(findByUsernameCalls).toHaveLength(1)
    expect(findByUsernameCalls[0]?.[0]).toBe('testuser')

    const saveCalls = (mockRepository.save as Mock<typeof mockRepository.save>).mock.calls as [
      AuthUserEntity
    ][]
    expect(saveCalls).toHaveLength(1)
    expect(saveCalls[0]?.[0]).toEqual(mockAuthUser)

    const updateCalls = (mockRepository.update as Mock<typeof mockRepository.update>).mock
      .calls as [AuthUserEntity][]
    expect(updateCalls).toHaveLength(1)
    expect(updateCalls[0]?.[0]).toEqual(mockAuthUser)

    const deleteCalls = (mockRepository.delete as Mock<typeof mockRepository.delete>).mock
      .calls as [string][]
    expect(deleteCalls).toHaveLength(1)
    expect(deleteCalls[0]?.[0]).toBe('test-id')
  })
})
