import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'

import { VALIDATION } from '~/shared/domain/validation'

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: VALIDATION.EMAIL.MESSAGE })
  @MaxLength(VALIDATION.EMAIL.MAX_LENGTH, {
    message: `Email must be at most ${VALIDATION.EMAIL.MAX_LENGTH} characters long`
  })
  email!: string

  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(VALIDATION.USERNAME.MIN_LENGTH, {
    message: `Username must be at least ${VALIDATION.USERNAME.MIN_LENGTH} characters long`
  })
  @MaxLength(VALIDATION.USERNAME.MAX_LENGTH, {
    message: `Username must be at most ${VALIDATION.USERNAME.MAX_LENGTH} characters long`
  })
  @Matches(VALIDATION.USERNAME.PATTERN, { message: VALIDATION.USERNAME.MESSAGE })
  username!: string

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(VALIDATION.PASSWORD.MIN_LENGTH, {
    message: `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters long`
  })
  @MaxLength(VALIDATION.PASSWORD.MAX_LENGTH, {
    message: `Password must be at most ${VALIDATION.PASSWORD.MAX_LENGTH} characters long`
  })
  @Matches(VALIDATION.PASSWORD.PATTERN, { message: VALIDATION.PASSWORD.MESSAGE })
  password!: string

  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MaxLength(VALIDATION.NAME.MAX_LENGTH, {
    message: `First name must be at most ${VALIDATION.NAME.MAX_LENGTH} characters long`
  })
  @Matches(VALIDATION.NAME.PATTERN, { message: VALIDATION.NAME.MESSAGE })
  firstName?: string

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(VALIDATION.NAME.MAX_LENGTH, {
    message: `Last name must be at most ${VALIDATION.NAME.MAX_LENGTH} characters long`
  })
  @Matches(VALIDATION.NAME.PATTERN, { message: VALIDATION.NAME.MESSAGE })
  lastName?: string

  constructor(
    email?: string,
    username?: string,
    password?: string,
    firstName?: string,
    lastName?: string
  ) {
    if (email) this.email = email
    if (username) this.username = username
    if (password) this.password = password
    if (firstName) this.firstName = firstName
    if (lastName) this.lastName = lastName
  }
}
