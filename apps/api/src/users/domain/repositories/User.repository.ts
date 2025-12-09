import type { UserEntity } from '~/users/domain/entities'
import type { UserIdValueObject } from '~/users/domain/value-objects'

export interface IUserRepository {
  findById(id: UserIdValueObject): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
  findByUsername(username: string): Promise<UserEntity | null>
  update(user: UserEntity): Promise<UserEntity>
  delete(id: UserIdValueObject): Promise<void>
  exists(id: UserIdValueObject): Promise<boolean>
}
