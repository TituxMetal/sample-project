import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { UserMapper } from '~/users/application/mappers'
import { UserEntity } from '~/users/domain/entities'
import { UserNotFoundException } from '~/users/domain/exceptions'
import type { IUserRepository } from '~/users/domain/repositories'
import {
  NameValueObject,
  UserIdValueObject,
  UsernameValueObject
} from '~/users/domain/value-objects'

import { GetUserProfileUseCase } from './GetUserProfile.uc'

describe('GetUserProfileUseCase', () => {
  let useCase: GetUserProfileUseCase
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
    useCase = new GetUserProfileUseCase(mockUserRepository as unknown as IUserRepository)
  })

  describe('execute', () => {
    it('should return user profile when user exists', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const userEntity = new UserEntity(
        userId,
        'john@example.com',
        new UsernameValueObject('johndoe'),
        new NameValueObject('John'),
        new NameValueObject('Doe'),
        true, // emailVerified
        false, // banned
        null, // banReason
        null, // banExpires
        'user', // role
        new Date('2024-01-01'),
        new Date('2024-01-02')
      )

      mockUserRepository.findById.mockResolvedValue(userEntity)

      const result = await useCase.execute(userId.value)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(result).toEqual(UserMapper.toGetUserProfileDto(userEntity))
    })

    it('should throw UserNotFoundException when user does not exist', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      mockUserRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(userId.value)).rejects.toThrow(UserNotFoundException)
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
    })

    it('should handle repository errors', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const error = new Error('Database error')
      mockUserRepository.findById.mockRejectedValue(error)

      await expect(useCase.execute(userId.value)).rejects.toThrow(error)
    })
  })
})
