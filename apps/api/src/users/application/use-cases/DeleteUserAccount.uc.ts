import { Injectable } from '@nestjs/common'

import { UserNotFoundException } from '~/users/domain/exceptions'
import type { IUserRepository } from '~/users/domain/repositories'
import { UserIdValueObject } from '~/users/domain/value-objects'

@Injectable()
export class DeleteUserAccountUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const userIdVO = new UserIdValueObject(userId)
    const existingUser = await this.userRepository.findById(userIdVO)

    if (!existingUser) {
      throw new UserNotFoundException(userId)
    }

    await this.userRepository.delete(userIdVO)
  }
}
