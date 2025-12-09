import { Injectable } from '@nestjs/common'

import type { GetUserProfileDto, UpdateUserProfileDto } from '~/users/application/dtos'
import {
  DeleteUserAccountUseCase,
  GetUserProfileUseCase,
  UpdateUserProfileUseCase
} from '~/users/application/use-cases'

@Injectable()
export class UserService {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly deleteUserAccountUseCase: DeleteUserAccountUseCase
  ) {}

  async getUserProfile(userId: string): Promise<GetUserProfileDto> {
    return this.getUserProfileUseCase.execute(userId)
  }

  async updateUserProfile(
    userId: string,
    updateDto: UpdateUserProfileDto
  ): Promise<GetUserProfileDto> {
    return this.updateUserProfileUseCase.execute(userId, updateDto)
  }

  async deleteUserAccount(userId: string): Promise<void> {
    return this.deleteUserAccountUseCase.execute(userId)
  }
}
