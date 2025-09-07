import { z } from 'zod'

const usernameField = z
  .string()
  .min(3)
  .max(30)
  .regex(/^[a-zA-Z0-9_]+$/)
const nameField = z
  .string()
  .min(2)
  .max(50)
  .regex(/^[a-zA-Z\s-]+$/)

export const userSchema = z.object({
  username: usernameField,
  firstName: nameField,
  lastName: nameField
})

export const updateProfileSchema = z.object({
  username: usernameField.optional(),
  firstName: nameField.optional(),
  lastName: nameField.optional()
})

export type UserSchema = z.infer<typeof userSchema>
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
