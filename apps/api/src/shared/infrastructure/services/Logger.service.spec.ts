import { Logger } from '@nestjs/common'

import { LoggerService } from './Logger.service'

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  Logger: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }))
}))

describe('LoggerService', () => {
  let loggerService: LoggerService
  let mockNestLogger: jest.Mocked<Logger>

  beforeEach(() => {
    mockNestLogger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    } as unknown as jest.Mocked<Logger>

    const mockLogger = Logger as unknown as jest.Mock
    mockLogger.mockImplementation(() => mockNestLogger)

    loggerService = new LoggerService('TestContext')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('info', () => {
    it('should log info message without context', () => {
      loggerService.info('Test message')

      expect(mockNestLogger.log).toHaveBeenCalledWith('Test message')
    })

    it('should log info message with context', () => {
      const context = { userId: '123', action: 'login' }

      loggerService.info('Test message', context)

      expect(mockNestLogger.log).toHaveBeenCalledWith(
        'Test message {"userId":"123","action":"login"}'
      )
    })

    it('should sanitize sensitive data in context', () => {
      const context = {
        userId: '123',
        password: 'secretPassword123',
        token: 'jwt.token.here'
      }

      loggerService.info('Test message', context)

      expect(mockNestLogger.log).toHaveBeenCalledWith(
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

      expect(mockNestLogger.warn).toHaveBeenCalledWith(
        'Warning message {"email":"test@example.com","authorization":"Bear***"}'
      )
    })
  })

  describe('error', () => {
    it('should log error message with trace', () => {
      const context = { error: 'Database connection failed' }
      const trace = 'Error stack trace...'

      loggerService.error('Error message', context, trace)

      expect(mockNestLogger.error).toHaveBeenCalledWith(
        'Error message {"error":"Database connection failed"}',
        trace
      )
    })
  })

  describe('debug', () => {
    it('should log debug message with context', () => {
      const context = { debugInfo: 'some data' }

      loggerService.debug('Debug message', context)

      expect(mockNestLogger.debug).toHaveBeenCalledWith('Debug message {"debugInfo":"some data"}')
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
      expect(mockNestLogger.log).toHaveBeenCalledWith(
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

      expect(mockNestLogger.log).toHaveBeenCalledWith(
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

      expect(mockNestLogger.log).toHaveBeenCalledWith(
        'Test case insensitive {"PASSWORD":"secr***","Token":"jwt-***","AUTHORIZATION":"bear***","secret_key":"my-s***"}'
      )
    })
  })
})
