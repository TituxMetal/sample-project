export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(email: string): User {
    const now = new Date()
    return new User(crypto.randomUUID(), email, now, now)
  }
}
