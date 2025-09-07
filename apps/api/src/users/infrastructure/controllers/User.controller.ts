import { Controller, Get, Patch, Delete, Post, Body, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '~/auth/infrastructure/guards'
import type { AuthenticatedUser } from '~/shared/domain/types'
import { GetCurrentUser } from '~/shared/infrastructure/decorators'
import { LoggerService } from '~/shared/infrastructure/services'
import type {
  GetUserProfileDto,
  UpdateUserProfileDto,
  CreateUserDto
} from '~/users/application/dtos'
import { UserService } from '~/users/application/services'

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly loggerService: LoggerService
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetCurrentUser() user: AuthenticatedUser): Promise<GetUserProfileDto> {
    return this.userService.getUserProfile(user.sub)
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @GetCurrentUser() user: AuthenticatedUser,
    @Body() updateDto: UpdateUserProfileDto
  ): Promise<GetUserProfileDto> {
    this.loggerService.info('Profile update attempt', {
      userId: user.sub,
      email: user.email,
      updateFields: Object.keys(updateDto)
    })

    const result = await this.userService.updateUserProfile(user.sub, updateDto)

    this.loggerService.info('Profile update successful', {
      userId: user.sub,
      email: user.email
    })

    return result
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@GetCurrentUser() user: AuthenticatedUser): Promise<void> {
    this.loggerService.warn('Account deletion attempt', {
      userId: user.sub,
      email: user.email
    })

    await this.userService.deleteUserAccount(user.sub)

    this.loggerService.warn('Account deletion successful', {
      userId: user.sub,
      email: user.email
    })
  }

  @Post()
  @UseGuards(JwtAuthGuard) // Admin endpoint - requires authentication
  async createUser(@Body() createDto: CreateUserDto): Promise<GetUserProfileDto> {
    return this.userService.createUser(createDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard) // Admin endpoint - requires authentication
  async getAllUsers(): Promise<GetUserProfileDto[]> {
    return this.userService.getAllUsers()
  }
}
