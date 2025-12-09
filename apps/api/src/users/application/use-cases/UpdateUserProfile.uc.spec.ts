import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { UpdateUserProfileDto } from '~/users/application/dtos'
import { UserMapper } from '~/users/application/mappers'
import { UserEntity } from '~/users/domain/entities'
import { UserNotFoundException } from '~/users/domain/exceptions'
import type { IUserRepository } from '~/users/domain/repositories'
import {
  NameValueObject,
  UserIdValueObject,
  UsernameValueObject
} from '~/users/domain/value-objects'

import { UpdateUserProfileUseCase } from './UpdateUserProfile.uc'

describe('UpdateUserProfileUseCase', () => {
  let useCase: UpdateUserProfileUseCase
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
    useCase = new UpdateUserProfileUseCase(mockUserRepository as unknown as IUserRepository)
  })

  describe('execute', () => {
    it('should update user profile successfully', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const existingUser = new UserEntity(
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
        new Date('2024-01-01')
      )

      const updateDto = new UpdateUserProfileDto()
      updateDto.username = 'janedoe'
      updateDto.firstName = 'Jane'
      updateDto.lastName = 'Smith'

      const expectedUpdatedUser = UserMapper.fromUpdateUserProfileDto(updateDto, existingUser)

      mockUserRepository.findById.mockResolvedValue(existingUser)
      mockUserRepository.update.mockResolvedValue(expectedUpdatedUser)

      const result = await useCase.execute(userId.value, updateDto)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: userId,
          email: existingUser.email,
          username: expect.objectContaining({ value: 'janedoe' }),
          firstName: expect.objectContaining({ value: 'Jane' }),
          lastName: expect.objectContaining({ value: 'Smith' })
        })
      )
      expect(result).toEqual(UserMapper.toGetUserProfileDto(expectedUpdatedUser))
    })

    it('should update partial profile fields', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const existingUser = new UserEntity(
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
        new Date('2024-01-01')
      )

      const updateDto = new UpdateUserProfileDto()
      updateDto.username = 'janedoe'

      mockUserRepository.findById.mockResolvedValue(existingUser)
      mockUserRepository.update.mockResolvedValue(existingUser)

      await useCase.execute(userId.value, updateDto)

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          username: expect.objectContaining({ value: 'janedoe' }),
          firstName: existingUser.firstName,
          lastName: existingUser.lastName
        })
      )
    })

    it('should throw UserNotFoundException when user does not exist', async () => {
      const userId = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000')
      const updateDto = new UpdateUserProfileDto()
      updateDto.username = 'janedoe'

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(userId.value, updateDto)).rejects.toThrow(UserNotFoundException)
      expect(mockUserRepository.update).not.toHaveBeenCalled()
    })
  })
})
