import { Module } from '@nestjs/common'

import { GetUsersUseCase } from './application/GetUsersUseCase'
import { UserController } from './infrastructure/UserController'
import { UserRepository } from './infrastructure/UserRepository'

@Module({
  controllers: [UserController],
  providers: [
    GetUsersUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository
    }
  ]
})
export class UsersModule {}
