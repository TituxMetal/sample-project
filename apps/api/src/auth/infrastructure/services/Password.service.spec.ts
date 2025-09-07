import { Test } from '@nestjs/testing'
import type { TestingModule } from '@nestjs/testing'
import * as argon2 from 'argon2'

import { PasswordService } from './Password.service'

jest.mock('argon2')

describe('PasswordService', () => {
  let service: PasswordService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService]
    }).compile()

    service = module.get<PasswordService>(PasswordService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'Password123!'
      const hashedPassword = '$argon2id$v=19$m=65536,t=3,p=4$hashedpassword'

      jest.spyOn(argon2, 'hash').mockResolvedValue(hashedPassword)

      const result = await service.hash(password)

      expect(result).toBe(hashedPassword)
      expect(argon2.hash).toHaveBeenCalledWith(password)
    })
  })

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const plainPassword = 'Password123!'
      const hashedPassword = '$argon2id$v=19$m=65536,t=3,p=4$hashedpassword'

      jest.spyOn(argon2, 'verify').mockResolvedValue(true)

      const result = await service.compare(plainPassword, hashedPassword)

      expect(result).toBe(true)
      expect(argon2.verify).toHaveBeenCalledWith(hashedPassword, plainPassword)
    })

    it('should return false for non-matching password', async () => {
      const plainPassword = 'WrongPassword'
      const hashedPassword = '$argon2id$v=19$m=65536,t=3,p=4$hashedpassword'

      jest.spyOn(argon2, 'verify').mockResolvedValue(false)

      const result = await service.compare(plainPassword, hashedPassword)

      expect(result).toBe(false)
      expect(argon2.verify).toHaveBeenCalledWith(hashedPassword, plainPassword)
    })

    it('should return false when verification throws error', async () => {
      const plainPassword = 'Password123!'
      const hashedPassword = 'invalid-hash'

      jest.spyOn(argon2, 'verify').mockRejectedValue(new Error('Invalid hash'))

      const result = await service.compare(plainPassword, hashedPassword)

      expect(result).toBe(false)
    })
  })
})
