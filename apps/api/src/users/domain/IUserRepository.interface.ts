import type { User } from './User.entity'

export interface IUserRepository {
  findAll(): Promise<User[]>
  findById(id: string): Promise<User | null>
}
