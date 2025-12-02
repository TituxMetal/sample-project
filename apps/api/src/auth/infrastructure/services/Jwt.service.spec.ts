import { JwtService as NestJwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import type { TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, mock } from 'bun:test'
import type { Mock } from 'bun:test'

import { JwtService } from './Jwt.service'

describe('JwtService', () => {
  let service: JwtService
  let nestJwtService: NestJwtService

  const mockNestJwtService = {
    sign: mock(() => {}) as unknown as Mock<(payload: object) => string>,
    verify: mock(() => {}) as unknown as Mock<(token: string) => object | null>,
    decode: mock(() => {}) as unknown as Mock<(token: string) => object | null>
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: NestJwtService,
          useValue: mockNestJwtService
        }
      ]
    }).compile()

    service = module.get<JwtService>(JwtService)
    nestJwtService = module.get<NestJwtService>(NestJwtService)
    mockNestJwtService.sign.mockClear()
    mockNestJwtService.verify.mockClear()
    mockNestJwtService.decode.mockClear()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        username: 'testuser'
      }

      const expectedToken = 'jwt-token'
      mockNestJwtService.sign.mockReturnValue(expectedToken)

      const result = service.generateToken(payload)

      expect(result).toBe(expectedToken)
      const signCalls = (nestJwtService.sign as unknown as Mock<(payload: object) => string>).mock
        .calls as [typeof payload][]
      expect(signCalls).toHaveLength(1)
      expect(signCalls[0]?.[0]).toEqual(payload)
    })
  })

  describe('verifyToken', () => {
    it('should verify and decode a JWT token', () => {
      const token = 'jwt-token'
      const expectedPayload = {
        sub: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        iat: 1234567890,
        exp: 1234567890
      }

      mockNestJwtService.verify.mockReturnValue(expectedPayload)

      const result = service.verifyToken(token)

      expect(result).toEqual(expectedPayload)
      const verifyCalls = (nestJwtService.verify as Mock<typeof nestJwtService.verify>).mock
        .calls as [string][]
      expect(verifyCalls).toHaveLength(1)
      expect(verifyCalls[0]?.[0]).toBe(token)
    })
  })

  describe('decodeToken', () => {
    it('should decode a JWT token', () => {
      const token = 'jwt-token'
      const expectedPayload = {
        sub: 'user-id',
        email: 'test@example.com',
        username: 'testuser'
      }

      mockNestJwtService.decode.mockReturnValue(expectedPayload)

      const result = service.decodeToken(token)

      expect(result).toEqual(expectedPayload)
      const decodeCalls = (nestJwtService.decode as Mock<typeof nestJwtService.decode>).mock
        .calls as [string][]
      expect(decodeCalls).toHaveLength(1)
      expect(decodeCalls[0]?.[0]).toBe(token)
    })

    it('should return null when decoding fails', () => {
      const token = 'invalid-token'

      mockNestJwtService.decode.mockReturnValue(null)

      const result = service.decodeToken(token)

      expect(result).toBeNull()
      const decodeCalls = (nestJwtService.decode as Mock<typeof nestJwtService.decode>).mock
        .calls as [string][]
      expect(decodeCalls).toHaveLength(1)
      expect(decodeCalls[0]?.[0]).toBe(token)
    })
  })
})
