import { Injectable } from '@nestjs/common'

import type { GetUserProfileDto, UpdateUserProfileDto } from '~/users/application/dtos'
import { UserMapper } from '~/users/application/mappers'
import { UserNotFoundException } from '~/users/domain/exceptions'
import type { IUserRepository } from '~/users/domain/repositories'
import { UserIdValueObject } from '~/users/domain/value-objects'

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, updateDto: UpdateUserProfileDto): Promise<GetUserProfileDto> {
    const userIdVO = new UserIdValueObject(userId)
    const existingUser = await this.userRepository.findById(userIdVO)

    if (!existingUser) {
      throw new UserNotFoundException(userId)
    }

    const updatedUser = UserMapper.fromUpdateUserProfileDto(updateDto, existingUser)
    const savedUser = await this.userRepository.update(updatedUser)

    return UserMapper.toGetUserProfileDto(savedUser)
  }
}
