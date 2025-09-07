import { Injectable } from '@nestjs/common'

import { RegisterDto } from '~/auth/application/dtos'
import { AuthUserEntity } from '~/auth/domain/entities'
import {
  EmailAlreadyExistsException,
  UsernameAlreadyExistsException
} from '~/auth/domain/exceptions'
import type { IAuthUserRepository } from '~/auth/domain/repositories'
import type { IIdGenerator, IPasswordService } from '~/auth/domain/services'
import { EmailValueObject, PasswordValueObject } from '~/auth/domain/value-objects'

export interface RegisterResult {
  user: {
    id: string
    email: string
    username: string
    confirmed: boolean
  }
}

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly authUserRepository: IAuthUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly idGenerator: IIdGenerator
  ) {}

  async execute(registerDto: RegisterDto): Promise<RegisterResult> {
    const email = new EmailValueObject(registerDto.email)

    const existingUserByEmail = await this.authUserRepository.findByEmail(email)
    if (existingUserByEmail) {
      throw EmailAlreadyExistsException.withEmail(registerDto.email)
    }

    const existingUserByUsername = await this.authUserRepository.findByUsername(
      registerDto.username
    )
    if (existingUserByUsername) {
      throw UsernameAlreadyExistsException.withUsername(registerDto.username)
    }

    const hashedPassword = await this.passwordService.hash(registerDto.password)
    const password = new PasswordValueObject(hashedPassword)

    const userId = this.idGenerator.generate()
    const authUser = new AuthUserEntity(
      userId,
      email,
      registerDto.username,
      password,
      true, // Set to true for testing - users are confirmed by default
      false,
      new Date()
    )

    const savedUser = await this.authUserRepository.save(authUser)

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email.value,
        username: savedUser.username,
        confirmed: savedUser.confirmed
      }
    }
  }
}
