/**
 * Base domain exception class
 * All domain-specific exceptions should extend this class
 */
export abstract class DomainException extends Error {
  public readonly code: string
  public readonly timestamp: Date
  public readonly cause?: Error

  constructor(message: string, code: string, cause?: Error) {
    super(message)

    // Set the prototype explicitly to maintain instanceof behavior
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = this.constructor.name
    this.code = code
    this.timestamp = new Date()
    this.cause = cause

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Get a serializable representation of the exception
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    }
  }

  /**
   * Check if this is a domain exception
   */
  static isDomainException(error: unknown): error is DomainException {
    return error instanceof DomainException
  }
}
