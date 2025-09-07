import { UserMapper } from '~/users/application/mappers'
import { UserEntity } from '~/users/domain/entities'
import type { IUserRepository } from '~/users/domain/repositories'
import {
  UserIdValueObject,
  UsernameValueObject,
  NameValueObject
} from '~/users/domain/value-objects'

import { GetAllUsersUseCase } from './GetAllUsers.uc'

describe('GetAllUsersUseCase', () => {
  let useCase: GetAllUsersUseCase
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
    useCase = new GetAllUsersUseCase(mockUserRepository)
  })

  describe('execute', () => {
    it('should return all users', async () => {
      const users = [
        new UserEntity(
          new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
          'john@example.com',
          new UsernameValueObject('johndoe'),
          new NameValueObject('John'),
          new NameValueObject('Doe'),
          true,
          false,
          new Date('2024-01-01'),
          new Date('2024-01-02')
        ),
        new UserEntity(
          new UserIdValueObject('987fcdeb-51d2-432e-b789-123456789abc'),
          'jane@example.com',
          new UsernameValueObject('janedoe'),
          new NameValueObject('Jane'),
          new NameValueObject('Smith'),
          true,
          false,
          new Date('2024-01-03'),
          new Date('2024-01-04')
        )
      ]

      mockUserRepository.findAll.mockResolvedValue(users)

      const result = await useCase.execute()

      expect(mockUserRepository.findAll).toHaveBeenCalled()
      expect(result).toEqual(users.map(user => UserMapper.toGetUserProfileDto(user)))
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no users exist', async () => {
      mockUserRepository.findAll.mockResolvedValue([])

      const result = await useCase.execute()

      expect(mockUserRepository.findAll).toHaveBeenCalled()
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('should handle repository errors', async () => {
      const error = new Error('Database error')
      mockUserRepository.findAll.mockRejectedValue(error)

      await expect(useCase.execute()).rejects.toThrow(error)
    })
  })
})
