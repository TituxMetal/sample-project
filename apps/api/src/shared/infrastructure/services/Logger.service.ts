import { Injectable, Logger } from '@nestjs/common'

export interface LogContext {
  [key: string]: unknown
}

@Injectable()
export class LoggerService {
  private readonly logger: Logger

  constructor(context?: string) {
    this.logger = new Logger(context || LoggerService.name)
  }

  /**
   * Log an info message with optional context
   */
  info(message: string, context?: LogContext): void {
    this.logger.log(this.formatMessage(message, context))
  }

  /**
   * Log a warning message with optional context
   */
  warn(message: string, context?: LogContext): void {
    this.logger.warn(this.formatMessage(message, context))
  }

  /**
   * Log an error message with optional context
   */
  error(message: string, context?: LogContext, trace?: string): void {
    this.logger.error(this.formatMessage(message, context), trace)
  }

  /**
   * Log a debug message with optional context (only in development)
   */
  debug(message: string, context?: LogContext): void {
    this.logger.debug(this.formatMessage(message, context))
  }

  /**
   * Log a verbose message with optional context
   */
  verbose(message: string, context?: LogContext): void {
    this.logger.verbose(this.formatMessage(message, context))
  }

  /**
   * Create a child logger with a specific context
   */
  child(context: string): LoggerService {
    return new LoggerService(context)
  }

  /**
   * Sanitize sensitive data from context before logging
   */
  private sanitizeContext(context: LogContext): LogContext {
    const sensitiveKeys = ['password', 'token', 'authorization', 'secret', 'key']
    const sanitized = { ...context }

    for (const [key, value] of Object.entries(sanitized)) {
      const lowerKey = key.toLowerCase()

      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        if (typeof value === 'string' && value.length > 0) {
          // Show only first few characters for debugging purposes
          sanitized[key] = `${value.substring(0, Math.min(4, value.length))}***`
        } else {
          sanitized[key] = '[REDACTED]'
        }
      }
    }

    return sanitized
  }

  /**
   * Format log message with context
   */
  private formatMessage(message: string, context?: LogContext): string {
    if (!context || Object.keys(context).length === 0) {
      return message
    }

    const sanitizedContext = this.sanitizeContext(context)
    return `${message} ${JSON.stringify(sanitizedContext)}`
  }
}
