export class GetUserProfileDto {
  id!: string
  email!: string
  username!: string
  firstName?: string
  lastName?: string
  emailVerified!: boolean
  banned!: boolean
  role!: string
  createdAt!: Date
  updatedAt!: Date
}
