import { UserEntity } from '~/users/domain/entities'
import { UserNotFoundException } from '~/users/domain/exceptions'
import type { IUserRepository } from '~/users/domain/repositories'
import { UserIdValueObject, UsernameValueObject } from '~/users/domain/value-objects'

import { DeleteUserAccountUseCase } from './DeleteUserAccount.uc'

describe('DeleteUserAccountUseCase', () => {
  let useCase: DeleteUserAccountUseCase
  let mockUserRepository: jest.Mocked<IUserRepository>

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn()
    }
    useCase = new DeleteUserAccountUseCase(mockUserRepository)
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
        true,
        false,
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
        true,
        false,
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
