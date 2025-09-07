import { Injectable } from '@nestjs/common'

import type {
  CreateUserDto,
  GetUserProfileDto,
  UpdateUserProfileDto
} from '~/users/application/dtos'
import {
  CreateUserUseCase,
  DeleteUserAccountUseCase,
  GetAllUsersUseCase,
  GetUserProfileUseCase,
  UpdateUserProfileUseCase
} from '~/users/application/use-cases'

@Injectable()
export class UserService {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly deleteUserAccountUseCase: DeleteUserAccountUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase
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

  async createUser(createDto: CreateUserDto): Promise<GetUserProfileDto> {
    return this.createUserUseCase.execute(createDto)
  }

  async getAllUsers(): Promise<GetUserProfileDto[]> {
    return this.getAllUsersUseCase.execute()
  }
}
