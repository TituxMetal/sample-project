import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common'
import { Roles, Session } from '@thallesp/nestjs-better-auth'

import { AuthSession } from '~/auth/domain/types'
import { LoggerService } from '~/shared/infrastructure/services'
import type {
  CreateUserDto,
  GetUserProfileDto,
  UpdateUserProfileDto
} from '~/users/application/dtos'
import { UserService } from '~/users/application/services'

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly loggerService: LoggerService
  ) {}

  @Get('me')
  async getProfile(@Session() session: AuthSession): Promise<GetUserProfileDto> {
    return this.userService.getUserProfile(session.user.id)
  }

  @Patch('me')
  async updateProfile(
    @Session() session: AuthSession,
    @Body() updateDto: UpdateUserProfileDto
  ): Promise<GetUserProfileDto> {
    this.loggerService.info('Profile update attempt', {
      userId: session.user.id,
      email: session.user.email,
      updateFields: Object.keys(updateDto)
    })

    const result = await this.userService.updateUserProfile(session.user.id, updateDto)

    this.loggerService.info('Profile update successful', {
      userId: session.user.id,
      email: session.user.email
    })

    return result
  }

  @Delete('me')
  async deleteAccount(@Session() session: AuthSession): Promise<void> {
    this.loggerService.warn('Account deletion attempt', {
      userId: session.user.id,
      email: session.user.email
    })

    await this.userService.deleteUserAccount(session.user.id)

    this.loggerService.warn('Account deletion successful', {
      userId: session.user.id,
      email: session.user.email
    })
  }

  @Post()
  @Roles(['admin'])
  async createUser(@Body() createDto: CreateUserDto): Promise<GetUserProfileDto> {
    return this.userService.createUser(createDto)
  }

  @Get()
  @Roles(['admin'])
  async getAllUsers(): Promise<GetUserProfileDto[]> {
    return this.userService.getAllUsers()
  }
}
