import type { AuthUserEntity } from '~/auth/domain/entities'
import type { EmailValueObject } from '~/auth/domain/value-objects'

export interface IAuthUserRepository {
  findById(id: string): Promise<AuthUserEntity | null>
  findByEmail(email: EmailValueObject): Promise<AuthUserEntity | null>
  findByUsername(username: string): Promise<AuthUserEntity | null>
  save(authUser: AuthUserEntity): Promise<AuthUserEntity>
  update(authUser: AuthUserEntity): Promise<AuthUserEntity>
  delete(id: string): Promise<void>
}
