export class GetUserProfileDto {
  id!: string
  email!: string
  username!: string
  firstName?: string
  lastName?: string
  confirmed!: boolean
  blocked!: boolean
  createdAt!: Date
  updatedAt!: Date
}
