import { Injectable } from '@nestjs/common'
import * as argon2 from 'argon2'

@Injectable()
export class PasswordService {
  async hash(plainPassword: string): Promise<string> {
    return argon2.hash(plainPassword)
  }

  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword)
    } catch {
      return false
    }
  }
}
