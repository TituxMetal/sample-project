import { LoginDto, RegisterDto } from '~/auth/application/dtos'
import type { AuthUserEntity } from '~/auth/domain/entities'

export class AuthUserMapper {
  static toLoginDto(data: { emailOrUsername: string; password: string }): LoginDto {
    return new LoginDto(data.emailOrUsername, data.password)
  }

  static toRegisterDto(data: {
    email: string
    username: string
    password: string
    firstName?: string
    lastName?: string
  }): RegisterDto {
    return new RegisterDto(data.email, data.username, data.password, data.firstName, data.lastName)
  }

  static toResponseDto(authUser: AuthUserEntity) {
    return {
      id: authUser.id,
      email: authUser.email.value,
      username: authUser.username,
      confirmed: authUser.confirmed,
      blocked: authUser.blocked,
      createdAt: authUser.createdAt
    }
  }
}
