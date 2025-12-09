import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { UserEntity } from '~/users/domain/entities'
import { UserNotFoundException } from '~/users/domain/exceptions'
import type { IUserRepository } from '~/users/domain/repositories'
import { UserIdValueObject, UsernameValueObject } from '~/users/domain/value-objects'

import { DeleteUserAccountUseCase } from './DeleteUserAccount.uc'

describe('DeleteUserAccountUseCase', () => {
  let useCase: DeleteUserAccountUseCase
  let mockUserRepository: {
    findById: Mock<IUserRepository['findById']>
    findByEmail: Mock<IUserRepository['findByEmail']>
    findByUsername: Mock<IUserRepository['findByUsername']>
    update: Mock<IUserRepository['update']>
    delete: Mock<IUserRepository['delete']>
    exists: Mock<IUserRepository['exists']>
  }

  beforeEach(() => {
    mockUserRepository = {
      findById: mock(() => {}) as unknown as Mock<IUserRepository['findById']>,
      findByEmail: mock(() => {}) as unknown as Mock<IUserRepository['findByEmail']>,
      findByUsername: mock(() => {}) as unknown as Mock<IUserRepository['findByUsername']>,
      update: mock(() => {}) as unknown as Mock<IUserRepository['update']>,
      delete: mock(() => {}) as unknown as Mock<IUserRepository['delete']>,
      exists: mock(() => {}) as unknown as Mock<IUserRepository['exists']>
    }
    useCase = new DeleteUserAccountUseCase(mockUserRepository as unknown as IUserRepository)
  })

  describe('execute', () => {
    it('should delete user account successfully', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const existingUser = new UserEntity(
        userId,
        'john@example.com',
        new UsernameValueObject('johndoe'),
        undefined,
        undefined,
        true, // emailVerified
        false, // banned
        null, // banReason
        null, // banExpires
        'user', // role
        new Date(),
        new Date()
      )

      mockUserRepository.findById.mockResolvedValue(existingUser)
      mockUserRepository.delete.mockResolvedValue(undefined)

      await useCase.execute(userId.value)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId)
    })

    it('should throw UserNotFoundException when user does not exist', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      mockUserRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(userId.value)).rejects.toThrow(UserNotFoundException)
      expect(mockUserRepository.delete).not.toHaveBeenCalled()
    })

    it('should handle repository errors during deletion', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const existingUser = new UserEntity(
        userId,
        'john@example.com',
        new UsernameValueObject('johndoe'),
        undefined,
        undefined,
        true, // emailVerified
        false, // banned
        null, // banReason
        null, // banExpires
        'user', // role
        new Date(),
        new Date()
      )

      const error = new Error('Database error')
      mockUserRepository.findById.mockResolvedValue(existingUser)
      mockUserRepository.delete.mockRejectedValue(error)

      await expect(useCase.execute(userId.value)).rejects.toThrow(error)
    })
  })
})
