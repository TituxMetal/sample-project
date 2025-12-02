import { Test } from '@nestjs/testing'
import type { TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'bun:test'

import { PasswordService } from './Password.service'

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
    it('should hash a password using argon2id', async () => {
      const password = 'Password123!'

      const result = await service.hash(password)

      expect(result).toStartWith('$argon2id$')
      expect(result).not.toBe(password)
      expect(result.length).toBeGreaterThan(50)
    })

    it('should produce different hashes for same password', async () => {
      const password = 'Password123!'

      const hash1 = await service.hash(password)
      const hash2 = await service.hash(password)

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const plainPassword = 'Password123!'
      const hashedPassword = await service.hash(plainPassword)

      const result = await service.compare(plainPassword, hashedPassword)

      expect(result).toBe(true)
    })

    it('should return false for non-matching password', async () => {
      const originalPassword = 'Password123!'
      const wrongPassword = 'WrongPassword'
      const hashedPassword = await service.hash(originalPassword)

      const result = await service.compare(wrongPassword, hashedPassword)

      expect(result).toBe(false)
    })

    it('should return false for invalid hash format', async () => {
      const plainPassword = 'Password123!'
      const invalidHash = 'invalid-hash-format'

      const result = await service.compare(plainPassword, invalidHash)

      expect(result).toBe(false)
    })

    it('should return false for empty hash', async () => {
      const plainPassword = 'Password123!'

      const result = await service.compare(plainPassword, '')

      expect(result).toBe(false)
    })
  })
})
