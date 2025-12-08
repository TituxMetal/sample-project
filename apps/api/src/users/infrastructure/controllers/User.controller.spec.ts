import { Test } from '@nestjs/testing'
import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { AuthSession } from '~/auth/domain/types'
import { LoggerService } from '~/shared/infrastructure/services'
import { CreateUserDto, GetUserProfileDto, UpdateUserProfileDto } from '~/users/application/dtos'
import { UserService } from '~/users/application/services'

import { UserController } from './User.controller'

describe('UserController', () => {
  let controller: UserController
  let mockUserService: {
    getUserProfile: Mock<typeof UserService.prototype.getUserProfile>
    updateUserProfile: Mock<typeof UserService.prototype.updateUserProfile>
    deleteUserAccount: Mock<typeof UserService.prototype.deleteUserAccount>
    createUser: Mock<typeof UserService.prototype.createUser>
    getAllUsers: Mock<typeof UserService.prototype.getAllUsers>
  }

  const mockLoggerService = {
    info: mock(() => {}),
    warn: mock(() => {}),
    error: mock(() => {}),
    debug: mock(() => {})
  }

  beforeEach(async () => {
    mockUserService = {
      getUserProfile: mock(() => {}) as unknown as Mock<
        typeof UserService.prototype.getUserProfile
      >,
      updateUserProfile: mock(() => {}) as unknown as Mock<
        typeof UserService.prototype.updateUserProfile
      >,
      deleteUserAccount: mock(() => {}) as unknown as Mock<
        typeof UserService.prototype.deleteUserAccount
      >,
      createUser: mock(() => {}) as unknown as Mock<typeof UserService.prototype.createUser>,
      getAllUsers: mock(() => {}) as unknown as Mock<typeof UserService.prototype.getAllUsers>
    }

    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService
        }
      ]
    }).compile()

    controller = module.get<UserController>(UserController)

    // Clear all mocks
    mockUserService.getUserProfile.mockClear()
    mockUserService.updateUserProfile.mockClear()
    mockUserService.deleteUserAccount.mockClear()
    mockUserService.createUser.mockClear()
    mockUserService.getAllUsers.mockClear()
    mockLoggerService.info.mockClear()
    mockLoggerService.warn.mockClear()
    mockLoggerService.error.mockClear()
    mockLoggerService.debug.mockClear()
  })

  describe('getProfile', () => {
    it('should get current user profile', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000'
      const expectedDto = new GetUserProfileDto()
      expectedDto.id = userId
      expectedDto.email = 'john@example.com'
      expectedDto.username = 'johndoe'

      const mockSession: AuthSession = {
        session: { id: 'session-id', userId, expiresAt: new Date() },
        user: {
          id: userId,
          email: 'john@example.com',
          emailVerified: true,
          username: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          banned: false,
          banReason: null,
          banExpires: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      mockUserService.getUserProfile.mockResolvedValue(expectedDto)

      const result = await controller.getProfile(mockSession)

      expect(mockUserService.getUserProfile).toHaveBeenCalledWith(userId)
      expect(result).toBe(expectedDto)
    })
  })

  describe('updateProfile', () => {
    it('should update current user profile', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000'
      const updateDto = new UpdateUserProfileDto()
      updateDto.username = 'newusername'

      const expectedDto = new GetUserProfileDto()
      expectedDto.id = userId
      expectedDto.username = 'newusername'

      const mockSession: AuthSession = {
        session: { id: 'session-id', userId, expiresAt: new Date() },
        user: {
          id: userId,
          email: 'john@example.com',
          emailVerified: true,
          username: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          banned: false,
          banReason: null,
          banExpires: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      mockUserService.updateUserProfile.mockResolvedValue(expectedDto)

      const result = await controller.updateProfile(mockSession, updateDto)

      expect(mockUserService.updateUserProfile).toHaveBeenCalledWith(userId, updateDto)
      expect(result).toBe(expectedDto)
    })
  })

  describe('deleteAccount', () => {
    it('should delete current user account', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000'
      const mockSession: AuthSession = {
        session: { id: 'session-id', userId, expiresAt: new Date() },
        user: {
          id: userId,
          email: 'john@example.com',
          emailVerified: true,
          username: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          banned: false,
          banReason: null,
          banExpires: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }

      mockUserService.deleteUserAccount.mockResolvedValue(undefined)

      await controller.deleteAccount(mockSession)

      expect(mockUserService.deleteUserAccount).toHaveBeenCalledWith(userId)
    })
  })

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createDto = new CreateUserDto()
      createDto.email = 'john@example.com'
      createDto.username = 'johndoe'
      createDto.password = 'password123'

      const expectedDto = new GetUserProfileDto()
      expectedDto.email = createDto.email
      expectedDto.username = createDto.username

      mockUserService.createUser.mockResolvedValue(expectedDto)

      const result = await controller.createUser(createDto)

      expect(mockUserService.createUser).toHaveBeenCalledWith(createDto)
      expect(result).toBe(expectedDto)
    })
  })

  describe('getAllUsers', () => {
    it('should get all users', async () => {
      const expectedUsers = [new GetUserProfileDto(), new GetUserProfileDto()]

      mockUserService.getAllUsers.mockResolvedValue(expectedUsers)

      const result = await controller.getAllUsers()

      expect(mockUserService.getAllUsers).toHaveBeenCalled()
      expect(result).toBe(expectedUsers)
    })
  })
})
