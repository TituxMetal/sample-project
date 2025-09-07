import type { IJwtPayload } from '~/auth/domain/interfaces'

import { JwtPayloadValueObject } from './JwtPayload.vo'

describe('JwtPayloadValueObject', () => {
  const validPayload = {
    sub: 'user-123',
    identifier: 'john@example.com'
  }

  describe('constructor validation', () => {
    it('should create a valid JwtPayload value object', () => {
      const payload = new JwtPayloadValueObject(validPayload.sub, validPayload.identifier)

      expect(payload).toBeInstanceOf(JwtPayloadValueObject)
      expect(payload.getSub()).toBe(validPayload.sub)
      expect(payload.getIdentifier()).toBe(validPayload.identifier)
      expect(payload.getIat()).toBeUndefined()
      expect(payload.getExp()).toBeUndefined()
    })

    it('should create a valid JwtPayload with iat and exp', () => {
      const iat = Math.floor(Date.now() / 1000)
      const exp = iat + 3600

      const payload = new JwtPayloadValueObject(validPayload.sub, validPayload.identifier, iat, exp)

      expect(payload.getSub()).toBe(validPayload.sub)
      expect(payload.getIdentifier()).toBe(validPayload.identifier)
      expect(payload.getIat()).toBe(iat)
      expect(payload.getExp()).toBe(exp)
    })

    describe('sub validation', () => {
      it('should throw error for empty sub', () => {
        expect(() => new JwtPayloadValueObject('', validPayload.identifier)).toThrow(
          'JWT payload sub (subject) must be a non-empty string'
        )
      })

      it('should throw error for whitespace-only sub', () => {
        expect(() => new JwtPayloadValueObject('   ', validPayload.identifier)).toThrow(
          'JWT payload sub (subject) must be a non-empty string'
        )
      })

      it('should throw error for null sub', () => {
        expect(
          () => new JwtPayloadValueObject(null as unknown as string, validPayload.identifier)
        ).toThrow('JWT payload sub (subject) must be a non-empty string')
      })

      it('should throw error for undefined sub', () => {
        expect(
          () => new JwtPayloadValueObject(undefined as unknown as string, validPayload.identifier)
        ).toThrow('JWT payload sub (subject) must be a non-empty string')
      })
    })

    describe('identifier validation', () => {
      it('should throw error for empty identifier', () => {
        expect(() => new JwtPayloadValueObject(validPayload.sub, '')).toThrow(
          'JWT payload identifier must be a non-empty string'
        )
      })

      it('should throw error for whitespace-only identifier', () => {
        expect(() => new JwtPayloadValueObject(validPayload.sub, '   ')).toThrow(
          'JWT payload identifier must be a non-empty string'
        )
      })

      it('should throw error for null identifier', () => {
        expect(
          () => new JwtPayloadValueObject(validPayload.sub, null as unknown as string)
        ).toThrow('JWT payload identifier must be a non-empty string')
      })

      it('should throw error for undefined identifier', () => {
        expect(
          () => new JwtPayloadValueObject(validPayload.sub, undefined as unknown as string)
        ).toThrow('JWT payload identifier must be a non-empty string')
      })
    })

    describe('iat validation', () => {
      it('should throw error for negative iat', () => {
        expect(
          () => new JwtPayloadValueObject(validPayload.sub, validPayload.identifier, -1)
        ).toThrow('JWT payload iat (issued at) must be a positive number')
      })

      it('should throw error for non-number iat', () => {
        expect(
          () =>
            new JwtPayloadValueObject(
              validPayload.sub,
              validPayload.identifier,
              'invalid' as unknown as number
            )
        ).toThrow('JWT payload iat (issued at) must be a positive number')
      })

      it('should accept zero iat', () => {
        expect(
          () => new JwtPayloadValueObject(validPayload.sub, validPayload.identifier, 0)
        ).not.toThrow()
      })
    })

    describe('exp validation', () => {
      it('should throw error for negative exp', () => {
        expect(
          () => new JwtPayloadValueObject(validPayload.sub, validPayload.identifier, undefined, -1)
        ).toThrow('JWT payload exp (expiration) must be a positive number')
      })

      it('should throw error for non-number exp', () => {
        expect(
          () =>
            new JwtPayloadValueObject(
              validPayload.sub,
              validPayload.identifier,
              undefined,
              'invalid' as unknown as number
            )
        ).toThrow('JWT payload exp (expiration) must be a positive number')
      })

      it('should accept zero exp', () => {
        expect(
          () => new JwtPayloadValueObject(validPayload.sub, validPayload.identifier, undefined, 0)
        ).not.toThrow()
      })
    })

    describe('iat/exp relationship validation', () => {
      it('should throw error when exp is equal to iat', () => {
        const timestamp = 1000
        expect(
          () =>
            new JwtPayloadValueObject(
              validPayload.sub,
              validPayload.identifier,
              timestamp,
              timestamp
            )
        ).toThrow('JWT payload exp (expiration) must be greater than iat (issued at)')
      })

      it('should throw error when exp is less than iat', () => {
        const iat = 2000
        const exp = 1000
        expect(
          () => new JwtPayloadValueObject(validPayload.sub, validPayload.identifier, iat, exp)
        ).toThrow('JWT payload exp (expiration) must be greater than iat (issued at)')
      })

      it('should accept when exp is greater than iat', () => {
        const iat = 1000
        const exp = 2000
        expect(
          () => new JwtPayloadValueObject(validPayload.sub, validPayload.identifier, iat, exp)
        ).not.toThrow()
      })
    })
  })

  describe('toPlainObject', () => {
    it('should convert to plain object without timestamps', () => {
      const payload = new JwtPayloadValueObject(validPayload.sub, validPayload.identifier)
      const plainObject = payload.toPlainObject()

      expect(plainObject).toEqual({
        sub: validPayload.sub,
        identifier: validPayload.identifier
      })
    })

    it('should convert to plain object with timestamps', () => {
      const iat = 1000
      const exp = 2000
      const payload = new JwtPayloadValueObject(validPayload.sub, validPayload.identifier, iat, exp)
      const plainObject = payload.toPlainObject()

      expect(plainObject).toEqual({
        sub: validPayload.sub,
        identifier: validPayload.identifier,
        iat,
        exp
      })
    })
  })

  describe('fromPlainObject', () => {
    it('should create value object from plain object without timestamps', () => {
      const plainPayload: IJwtPayload = {
        sub: validPayload.sub,
        identifier: validPayload.identifier
      }

      const payload = JwtPayloadValueObject.fromPlainObject(plainPayload)

      expect(payload.getSub()).toBe(plainPayload.sub)
      expect(payload.getIdentifier()).toBe(plainPayload.identifier)
      expect(payload.getIat()).toBeUndefined()
      expect(payload.getExp()).toBeUndefined()
    })

    it('should create value object from plain object with timestamps', () => {
      const plainPayload: IJwtPayload = {
        sub: validPayload.sub,
        identifier: validPayload.identifier,
        iat: 1000,
        exp: 2000
      }

      const payload = JwtPayloadValueObject.fromPlainObject(plainPayload)

      expect(payload.getSub()).toBe(plainPayload.sub)
      expect(payload.getIdentifier()).toBe(plainPayload.identifier)
      expect(payload.getIat()).toBe(plainPayload.iat)
      expect(payload.getExp()).toBe(plainPayload.exp)
    })

    it('should validate when creating from plain object', () => {
      const invalidPayload: IJwtPayload = {
        sub: '',
        identifier: validPayload.identifier
      }

      expect(() => JwtPayloadValueObject.fromPlainObject(invalidPayload)).toThrow(
        'JWT payload sub (subject) must be a non-empty string'
      )
    })
  })
})
