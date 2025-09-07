import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'

import { VALIDATION } from '~/shared/domain/validation'

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @MinLength(VALIDATION.USERNAME.MIN_LENGTH, {
    message: `Username must be at least ${VALIDATION.USERNAME.MIN_LENGTH} characters long`
  })
  @MaxLength(VALIDATION.USERNAME.MAX_LENGTH, {
    message: `Username must be at most ${VALIDATION.USERNAME.MAX_LENGTH} characters long`
  })
  @Matches(VALIDATION.USERNAME.PATTERN, { message: VALIDATION.USERNAME.MESSAGE })
  username?: string

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
}
