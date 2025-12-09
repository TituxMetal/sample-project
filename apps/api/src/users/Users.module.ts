import { Module } from '@nestjs/common'

import { AuthModule } from '~/auth/Auth.module'
import { PrismaProvider } from '~/shared/infrastructure/database'

import { UserService } from './application/services'
import {
  DeleteUserAccountUseCase,
  GetUserProfileUseCase,
  UpdateUserProfileUseCase
} from './application/use-cases'
import type { IUserRepository } from './domain/repositories'
import { UserController } from './infrastructure/controllers'
import { PrismaUserRepository } from './infrastructure/repositories'

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    // Repository binding
    {
      provide: 'IUserRepository',
      useFactory: (prisma: PrismaProvider) => new PrismaUserRepository(prisma),
      inject: [PrismaProvider]
    },
    // Use cases
    {
      provide: GetUserProfileUseCase,
      useFactory: (userRepository: IUserRepository) => new GetUserProfileUseCase(userRepository),
      inject: ['IUserRepository']
    },
    {
      provide: UpdateUserProfileUseCase,
      useFactory: (userRepository: IUserRepository) => new UpdateUserProfileUseCase(userRepository),
      inject: ['IUserRepository']
    },
    {
      provide: DeleteUserAccountUseCase,
      useFactory: (userRepository: IUserRepository) => new DeleteUserAccountUseCase(userRepository),
      inject: ['IUserRepository']
    },
    // Application service
    UserService
  ],
  exports: [UserService]
})
export class UsersModule {}
