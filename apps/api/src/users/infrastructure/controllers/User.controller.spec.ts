import { Test } from '@nestjs/testing'

import { JwtAuthGuard } from '~/auth/infrastructure/guards'
import type { AuthenticatedUser } from '~/shared/domain/types'
import { LoggerService } from '~/shared/infrastructure/services'
import { TestDataFactory } from '~/shared/infrastructure/testing'
import { GetUserProfileDto, UpdateUserProfileDto, CreateUserDto } from '~/users/application/dtos'
import { UserService } from '~/users/application/services'

import { UserController } from './User.controller'

describe('UserController', () => {
  let controller: UserController
  let mockUserService: jest.Mocked<UserService>

  const mockLoggerService = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }

  beforeEach(async () => {
    mockUserService = {
      getUserProfile: jest.fn(),
      updateUserProfile: jest.fn(),
      deleteUserAccount: jest.fn(),
      createUser: jest.fn(),
      getAllUsers: jest.fn()
    } as unknown as jest.Mocked<UserService>

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
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile()

    controller = module.get<UserController>(UserController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getProfile', () => {
    it('should get current user profile', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000'
      const expectedDto = new GetUserProfileDto()
      expectedDto.id = userId
      expectedDto.email = 'john@example.com'
      expectedDto.username = 'johndoe'

      const mockUser = TestDataFactory.createAuthenticatedUser({
        sub: userId,
        email: 'john@example.com',
        username: 'johndoe'
      })
      mockUserService.getUserProfile.mockResolvedValue(expectedDto)

      const result = await controller.getProfile(mockUser)

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

      const mockUser: AuthenticatedUser = {
        sub: userId,
        email: 'john@example.com',
        username: 'johndoe'
      }
      mockUserService.updateUserProfile.mockResolvedValue(expectedDto)

      const result = await controller.updateProfile(mockUser, updateDto)

      expect(mockUserService.updateUserProfile).toHaveBeenCalledWith(userId, updateDto)
      expect(result).toBe(expectedDto)
    })
  })

  describe('deleteAccount', () => {
    it('should delete current user account', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000'
      const mockUser: AuthenticatedUser = {
        sub: userId,
        email: 'john@example.com',
        username: 'johndoe'
      }

      mockUserService.deleteUserAccount.mockResolvedValue(undefined)

      await controller.deleteAccount(mockUser)

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
