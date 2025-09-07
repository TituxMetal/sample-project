/**
 * JWT service interface for domain layer
 * Defines the contract for JWT token operations
 */
export interface IJwtService {
  /**
   * Generate a JWT token with the given payload
   * @param payload - The payload to include in the token
   * @returns The generated JWT token string
   */
  generateToken(payload: { sub: string; email: string; username: string }): string
}
