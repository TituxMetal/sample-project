import { Injectable } from '@nestjs/common'

import type { GetUserProfileDto } from '~/users/application/dtos'
import { UserMapper } from '~/users/application/mappers'
import type { IUserRepository } from '~/users/domain/repositories'

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<GetUserProfileDto[]> {
    const users = await this.userRepository.findAll()
    return users.map(user => UserMapper.toGetUserProfileDto(user))
  }
}
