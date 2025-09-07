/**
 * Token blacklist service interface for domain layer
 * Defines the contract for token blacklisting operations
 */
export interface ITokenBlacklistService {
  /**
   * Add a token to the blacklist
   * @param token - The JWT token to blacklist
   * @returns Promise that resolves when token is blacklisted
   */
  blacklistToken(token: string): Promise<void>

  /**
   * Check if a token is blacklisted
   * @param token - The JWT token to check
   * @returns Promise resolving to true if token is blacklisted
   */
  isTokenBlacklisted?(token: string): Promise<boolean>
}
