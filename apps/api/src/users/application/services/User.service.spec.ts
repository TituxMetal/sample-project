import { Test } from '@nestjs/testing'
import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { TestDataFactory } from '~/shared/infrastructure/testing'
import { GetUserProfileDto, UpdateUserProfileDto } from '~/users/application/dtos'
import {
  DeleteUserAccountUseCase,
  GetUserProfileUseCase,
  UpdateUserProfileUseCase
} from '~/users/application/use-cases'

import { UserService } from './User.service'

describe('UserService', () => {
  let service: UserService
  let mockGetUserProfileUseCase: {
    execute: Mock<typeof GetUserProfileUseCase.prototype.execute>
  }
  let mockUpdateUserProfileUseCase: {
    execute: Mock<typeof UpdateUserProfileUseCase.prototype.execute>
  }
  let mockDeleteUserAccountUseCase: {
    execute: Mock<typeof DeleteUserAccountUseCase.prototype.execute>
  }

  beforeEach(async () => {
    mockGetUserProfileUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof GetUserProfileUseCase.prototype.execute>
    }

    mockUpdateUserProfileUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof UpdateUserProfileUseCase.prototype.execute>
    }

    mockDeleteUserAccountUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof DeleteUserAccountUseCase.prototype.execute>
    }

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: GetUserProfileUseCase,
          useValue: mockGetUserProfileUseCase
        },
        {
          provide: UpdateUserProfileUseCase,
          useValue: mockUpdateUserProfileUseCase
        },
        {
          provide: DeleteUserAccountUseCase,
          useValue: mockDeleteUserAccountUseCase
        }
      ]
    }).compile()

    service = module.get<UserService>(UserService)
  })

  describe('getUserProfile', () => {
    it('should call getUserProfileUseCase with correct parameters', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000'
      const expectedDto = new GetUserProfileDto()
      expectedDto.id = userId

      mockGetUserProfileUseCase.execute.mockResolvedValue(expectedDto)

      const result = await service.getUserProfile(userId)

      expect(mockGetUserProfileUseCase.execute).toHaveBeenCalledWith(userId)
      expect(result).toBe(expectedDto)
    })
  })

  describe('updateUserProfile', () => {
    it('should call updateUserProfileUseCase with correct parameters', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000'
      const updateData = TestDataFactory.createUpdateProfileData({
        firstName: 'John',
        lastName: 'Doe'
      })
      const updateDto = new UpdateUserProfileDto()
      updateDto.firstName = updateData.firstName
      updateDto.lastName = updateData.lastName

      const expectedDto = new GetUserProfileDto()
      expectedDto.id = userId
      expectedDto.firstName = updateData.firstName
      expectedDto.lastName = updateData.lastName

      mockUpdateUserProfileUseCase.execute.mockResolvedValue(expectedDto)

      const result = await service.updateUserProfile(userId, updateDto)

      expect(mockUpdateUserProfileUseCase.execute).toHaveBeenCalledWith(userId, updateDto)
      expect(result).toBe(expectedDto)
    })
  })

  describe('deleteUserAccount', () => {
    it('should call deleteUserAccountUseCase with correct parameters', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000'

      mockDeleteUserAccountUseCase.execute.mockResolvedValue(undefined)

      await service.deleteUserAccount(userId)

      expect(mockDeleteUserAccountUseCase.execute).toHaveBeenCalledWith(userId)
    })
  })
})
