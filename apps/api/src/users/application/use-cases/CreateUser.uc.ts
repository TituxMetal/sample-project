import { Injectable } from '@nestjs/common'

import type { CreateUserDto, GetUserProfileDto } from '~/users/application/dtos'
import { UserMapper } from '~/users/application/mappers'
import type { IUserRepository } from '~/users/domain/repositories'

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(createDto: CreateUserDto): Promise<GetUserProfileDto> {
    const existingUserByEmail = await this.userRepository.findByEmail(createDto.email)
    if (existingUserByEmail) {
      throw new Error('Email already exists')
    }

    const existingUserByUsername = await this.userRepository.findByUsername(createDto.username)
    if (existingUserByUsername) {
      throw new Error('Username already exists')
    }

    const userEntity = UserMapper.fromCreateUserDto(createDto)
    const savedUser = await this.userRepository.create(userEntity)

    return UserMapper.toGetUserProfileDto(savedUser)
  }
}
