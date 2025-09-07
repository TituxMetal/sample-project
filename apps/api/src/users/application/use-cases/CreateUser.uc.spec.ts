import { CreateUserDto } from '~/users/application/dtos'
import { UserMapper } from '~/users/application/mappers'
import { UserEntity } from '~/users/domain/entities'
import type { IUserRepository } from '~/users/domain/repositories'
import { UserIdValueObject, UsernameValueObject } from '~/users/domain/value-objects'

import { CreateUserUseCase } from './CreateUser.uc'

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase
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
    useCase = new CreateUserUseCase(mockUserRepository)
  })

  describe('execute', () => {
    it('should create a new user successfully', async () => {
      const createDto = new CreateUserDto()
      createDto.email = 'john@example.com'
      createDto.username = 'johndoe'
      createDto.password = 'password123'
      createDto.firstName = 'John'
      createDto.lastName = 'Doe'

      const expectedUser = UserMapper.fromCreateUserDto(createDto)

      mockUserRepository.findByEmail.mockResolvedValue(null)
      mockUserRepository.findByUsername.mockResolvedValue(null)
      mockUserRepository.create.mockResolvedValue(expectedUser)

      const result = await useCase.execute(createDto)

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(createDto.email)
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(createDto.username)
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: createDto.email,
          username: expect.objectContaining({ value: createDto.username }),
          firstName: expect.objectContaining({ value: createDto.firstName }),
          lastName: expect.objectContaining({ value: createDto.lastName })
        })
      )
      expect(result).toEqual(UserMapper.toGetUserProfileDto(expectedUser))
    })

    it('should create a user without optional names', async () => {
      const createDto = new CreateUserDto()
      createDto.email = 'john@example.com'
      createDto.username = 'johndoe'
      createDto.password = 'password123'

      const expectedUser = UserMapper.fromCreateUserDto(createDto)

      mockUserRepository.findByEmail.mockResolvedValue(null)
      mockUserRepository.findByUsername.mockResolvedValue(null)
      mockUserRepository.create.mockResolvedValue(expectedUser)

      const result = await useCase.execute(createDto)

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: createDto.email,
          username: expect.objectContaining({ value: createDto.username }),
          firstName: undefined,
          lastName: undefined
        })
      )
      expect(result).toEqual(UserMapper.toGetUserProfileDto(expectedUser))
    })

    it('should throw error when email already exists', async () => {
      const createDto = new CreateUserDto()
      createDto.email = 'john@example.com'
      createDto.username = 'johndoe'
      createDto.password = 'password123'

      const existingUser = new UserEntity(
        UserIdValueObject.generate(),
        'john@example.com',
        new UsernameValueObject('existinguser'),
        undefined,
        undefined,
        true,
        false,
        new Date(),
        new Date()
      )

      mockUserRepository.findByEmail.mockResolvedValue(existingUser)

      await expect(useCase.execute(createDto)).rejects.toThrow('Email already exists')
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    it('should throw error when username already exists', async () => {
      const createDto = new CreateUserDto()
      createDto.email = 'john@example.com'
      createDto.username = 'johndoe'
      createDto.password = 'password123'

      const existingUser = new UserEntity(
        UserIdValueObject.generate(),
        'different@example.com',
        new UsernameValueObject('johndoe'),
        undefined,
        undefined,
        true,
        false,
        new Date(),
        new Date()
      )

      mockUserRepository.findByEmail.mockResolvedValue(null)
      mockUserRepository.findByUsername.mockResolvedValue(existingUser)

      await expect(useCase.execute(createDto)).rejects.toThrow('Username already exists')
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })
  })
})
