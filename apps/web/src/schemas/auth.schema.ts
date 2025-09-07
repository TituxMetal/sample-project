import { z } from 'zod'

// Login schema
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: 'Identifier is required' })
    .min(3, { message: 'Identifier must be at least 3 characters long' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
})

// Signup schema
export const signupSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(50, { message: 'Username must not exceed 50 characters' }),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
})

// Types
export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
export type AuthSchema = LoginSchema | SignupSchema
