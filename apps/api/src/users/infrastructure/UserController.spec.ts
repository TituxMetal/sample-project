import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { GetUsersUseCase } from '~/users/application/GetUsersUseCase'
import { User } from '~/users/domain/User.entity'

import { UserController } from './UserController'

describe('UserController', () => {
  let controller: UserController
  let getUsersUseCase: jest.Mocked<GetUsersUseCase>

  beforeEach(async () => {
    const mockGetUsersUseCase = {
      execute: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: GetUsersUseCase,
          useValue: mockGetUsersUseCase
        }
      ]
    }).compile()

    controller = module.get<UserController>(UserController)
    getUsersUseCase = module.get(GetUsersUseCase)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getUsers', () => {
    it('should return array of users', async () => {
      const mockUsers = [
        new User('1', 'user1@example.com', new Date(), new Date()),
        new User('2', 'user2@example.com', new Date(), new Date())
      ]
      getUsersUseCase.execute.mockResolvedValue(mockUsers)

      const result = await controller.getUsers()

      expect(result).toBe(mockUsers)
      expect(getUsersUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it('should return empty array when no users', async () => {
      getUsersUseCase.execute.mockResolvedValue([])

      const result = await controller.getUsers()

      expect(result).toEqual([])
      expect(getUsersUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it('should propagate use case errors', async () => {
      const error = new Error('Use case failed')
      getUsersUseCase.execute.mockRejectedValue(error)

      await expect(controller.getUsers()).rejects.toThrow(error)
    })
  })
})
