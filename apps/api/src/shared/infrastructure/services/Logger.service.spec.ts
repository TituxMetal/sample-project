import { Logger } from '@nestjs/common'
import { beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { LoggerService } from './Logger.service'

describe('LoggerService', () => {
  let loggerService: LoggerService
  let logSpy: ReturnType<typeof spyOn>
  let warnSpy: ReturnType<typeof spyOn>
  let errorSpy: ReturnType<typeof spyOn>
  let debugSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    loggerService = new LoggerService('TestContext')

    // Spy on the internal logger methods
    logSpy = spyOn(Logger.prototype, 'log').mockImplementation(() => {})
    warnSpy = spyOn(Logger.prototype, 'warn').mockImplementation(() => {})
    errorSpy = spyOn(Logger.prototype, 'error').mockImplementation(() => {})
    debugSpy = spyOn(Logger.prototype, 'debug').mockImplementation(() => {})
  })

  describe('info', () => {
    it('should log info message without context', () => {
      loggerService.info('Test message')

      expect(logSpy).toHaveBeenCalledWith('Test message')
    })

    it('should log info message with context', () => {
      const context = { userId: '123', action: 'login' }

      loggerService.info('Test message', context)

      expect(logSpy).toHaveBeenCalledWith('Test message {"userId":"123","action":"login"}')
    })

    it('should sanitize sensitive data in context', () => {
      const context = {
        userId: '123',
        password: 'secretPassword123',
        token: 'jwt.token.here'
      }

      loggerService.info('Test message', context)

      expect(logSpy).toHaveBeenCalledWith(
        'Test message {"userId":"123","password":"secr***","token":"jwt.***"}'
      )
    })
  })

  describe('warn', () => {
    it('should log warn message with sanitized context', () => {
      const context = {
        email: 'test@example.com',
        authorization: 'Bearer token123'
      }

      loggerService.warn('Warning message', context)

      expect(warnSpy).toHaveBeenCalledWith(
        'Warning message {"email":"test@example.com","authorization":"Bear***"}'
      )
    })
  })

  describe('error', () => {
    it('should log error message with trace', () => {
      const context = { error: 'Database connection failed' }
      const trace = 'Error stack trace...'

      loggerService.error('Error message', context, trace)

      expect(errorSpy).toHaveBeenCalledWith(
        'Error message {"error":"Database connection failed"}',
        trace
      )
    })
  })

  describe('debug', () => {
    it('should log debug message with context', () => {
      const context = { debugInfo: 'some data' }

      loggerService.debug('Debug message', context)

      expect(debugSpy).toHaveBeenCalledWith('Debug message {"debugInfo":"some data"}')
    })
  })

  describe('sanitization', () => {
    it('should only sanitize top-level keys (not nested)', () => {
      const context = {
        user: {
          id: '123',
          password: 'secret123',
          profile: {
            token: 'nested.token.here'
          }
        },
        password: 'toplevel-secret'
      }

      loggerService.info('Test nested', context)

      // Only top-level password should be sanitized, nested ones remain as-is
      expect(logSpy).toHaveBeenCalledWith(
        'Test nested {"user":{"id":"123","password":"secret123","profile":{"token":"nested.token.here"}},"password":"topl***"}'
      )
    })

    it('should handle empty and null values', () => {
      const context = {
        emptyString: '',
        nullValue: null,
        password: '',
        token: null
      }

      loggerService.info('Test empty values', context)

      expect(logSpy).toHaveBeenCalledWith(
        'Test empty values {"emptyString":"","nullValue":null,"password":"[REDACTED]","token":"[REDACTED]"}'
      )
    })

    it('should sanitize case-insensitive sensitive keys', () => {
      const context = {
        PASSWORD: 'secret',
        Token: 'jwt-token',
        AUTHORIZATION: 'bearer token',
        secret_key: 'my-secret'
      }

      loggerService.info('Test case insensitive', context)

      expect(logSpy).toHaveBeenCalledWith(
        'Test case insensitive {"PASSWORD":"secr***","Token":"jwt-***","AUTHORIZATION":"bear***","secret_key":"my-s***"}'
      )
    })
  })
})
