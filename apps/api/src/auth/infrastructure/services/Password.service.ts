import { Injectable } from '@nestjs/common'

@Injectable()
export class PasswordService {
  async hash(plainPassword: string): Promise<string> {
    return Bun.password.hash(plainPassword, {
      algorithm: 'argon2id',
      memoryCost: 65536, // 64 MiB
      timeCost: 3
    })
  }

  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await Bun.password.verify(plainPassword, hashedPassword)
    } catch {
      return false
    }
  }
}
