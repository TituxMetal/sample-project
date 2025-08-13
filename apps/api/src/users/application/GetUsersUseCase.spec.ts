import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import type { IUserRepository } from '~/users/domain/IUserRepository.interface'
import { User } from '~/users/domain/User.entity'

import { GetUsersUseCase } from './GetUsersUseCase'

describe('GetUsersUseCase', () => {
  let useCase: GetUsersUseCase
  let userRepository: jest.Mocked<IUserRepository>

  beforeEach(async () => {
    const mockUserRepository: jest.Mocked<IUserRepository> = {
      findAll: jest.fn(),
      findById: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository
        }
      ]
    }).compile()

    useCase = module.get<GetUsersUseCase>(GetUsersUseCase)
    userRepository = module.get('IUserRepository')
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  describe('execute', () => {
    it('should return all users from repository', async () => {
      const mockUsers = [
        new User('1', 'user1@example.com', new Date(), new Date()),
        new User('2', 'user2@example.com', new Date(), new Date())
      ]
      userRepository.findAll.mockResolvedValue(mockUsers)

      const result = await useCase.execute()

      expect(result).toBe(mockUsers)
      expect(userRepository.findAll).toHaveBeenCalledTimes(1)
    })

    it('should return empty array when no users exist', async () => {
      userRepository.findAll.mockResolvedValue([])

      const result = await useCase.execute()

      expect(result).toEqual([])
      expect(userRepository.findAll).toHaveBeenCalledTimes(1)
    })

    it('should propagate repository errors', async () => {
      const error = new Error('Database connection failed')
      userRepository.findAll.mockRejectedValue(error)

      await expect(useCase.execute()).rejects.toThrow(error)
    })
  })
})
