import { Injectable } from '@nestjs/common'

import type { GetUserProfileDto } from '~/users/application/dtos'
import { UserMapper } from '~/users/application/mappers'
import { UserNotFoundException } from '~/users/domain/exceptions'
import type { IUserRepository } from '~/users/domain/repositories'
import { UserIdValueObject } from '~/users/domain/value-objects'

@Injectable()
export class GetUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<GetUserProfileDto> {
    const userIdVO = new UserIdValueObject(userId)
    const user = await this.userRepository.findById(userIdVO)

    if (!user) {
      throw new UserNotFoundException(userId)
    }

    return UserMapper.toGetUserProfileDto(user)
  }
}
