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
    useCase = new UpdateUserProfileUseCase(mockUserRepository)
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
        true,
        false,
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
        true,
        false,
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
