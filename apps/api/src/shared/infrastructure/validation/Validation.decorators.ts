import { applyDecorators } from '@nestjs/common'
import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

import { VALIDATION } from '~/shared/domain/validation'

export const IsPassword = () =>
  applyDecorators(
    IsString({ message: 'Password must be a string' }),
    MinLength(VALIDATION.PASSWORD.MIN_LENGTH, {
      message: `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters long`
    }),
    MaxLength(VALIDATION.PASSWORD.MAX_LENGTH, {
      message: `Password must not exceed ${VALIDATION.PASSWORD.MAX_LENGTH} characters`
    }),
    Matches(VALIDATION.PASSWORD.PATTERN, {
      message: VALIDATION.PASSWORD.MESSAGE
    })
  )

export const IsUsername = () =>
  applyDecorators(
    IsString({ message: 'Username must be a string' }),
    MinLength(VALIDATION.USERNAME.MIN_LENGTH, {
      message: `Username must be at least ${VALIDATION.USERNAME.MIN_LENGTH} characters long`
    }),
    MaxLength(VALIDATION.USERNAME.MAX_LENGTH, {
      message: `Username must not exceed ${VALIDATION.USERNAME.MAX_LENGTH} characters`
    }),
    Matches(VALIDATION.USERNAME.PATTERN, {
      message: VALIDATION.USERNAME.MESSAGE
    })
  )

export const IsName = () =>
  applyDecorators(
    IsString({ message: 'Must be a string' }),
    MaxLength(VALIDATION.NAME.MAX_LENGTH, {
      message: `Must not exceed ${VALIDATION.NAME.MAX_LENGTH} characters`
    }),
    Matches(VALIDATION.NAME.PATTERN, {
      message: VALIDATION.NAME.MESSAGE
    })
  )
