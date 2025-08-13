import { Controller, Get } from '@nestjs/common'

import { GetUsersUseCase } from '~/users/application/GetUsersUseCase'
import type { User } from '~/users/domain/User.entity'

@Controller('users')
export class UserController {
  constructor(private readonly getUsersUseCase: GetUsersUseCase) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.getUsersUseCase.execute()
  }
}
