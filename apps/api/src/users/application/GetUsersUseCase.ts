import { Inject, Injectable } from '@nestjs/common'

import type { IUserRepository } from '~/users/domain/IUserRepository.interface'
import type { User } from '~/users/domain/User.entity'

@Injectable()
export class GetUsersUseCase {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll()
  }
}
