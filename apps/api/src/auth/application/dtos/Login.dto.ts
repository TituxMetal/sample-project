import { IsNotEmpty, IsString, MinLength } from 'class-validator'

import { VALIDATION } from '~/shared/domain/validation'

export class LoginDto {
  @IsNotEmpty({ message: 'Email or username is required' })
  @IsString({ message: 'Email or username must be a string' })
  emailOrUsername!: string

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(VALIDATION.PASSWORD.MIN_LENGTH, {
    message: `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters long`
  })
  password!: string

  constructor(emailOrUsername?: string, password?: string) {
    if (emailOrUsername !== undefined) this.emailOrUsername = emailOrUsername
    if (password !== undefined) this.password = password
  }
}
