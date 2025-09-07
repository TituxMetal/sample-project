/**
 * ID generator service interface for domain layer
 * Defines the contract for generating unique identifiers
 */
export interface IIdGenerator {
  /**
   * Generate a unique identifier
   * @returns A unique string identifier
   */
  generate(): string
}
