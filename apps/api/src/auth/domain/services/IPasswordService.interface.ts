/**
 * Password service interface for domain layer
 * Defines the contract for password-related operations
 */
export interface IPasswordService {
  /**
   * Compare a plain password with a hashed password
   * @param plainPassword - The plain text password
   * @param hashedPassword - The hashed password to compare against
   * @returns Promise resolving to true if passwords match
   */
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>

  /**
   * Hash a plain password
   * @param plainPassword - The plain text password to hash
   * @returns Promise resolving to the hashed password
   */
  hash(plainPassword: string): Promise<string>
}
