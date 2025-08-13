export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly originalError?: Error
  ) {
    super(message)
    this.name = this.constructor.name
  }
}
