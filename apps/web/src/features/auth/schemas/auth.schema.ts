import { z } from 'zod'

// Login schema
export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
})

// Signup schema
export const signupSchema = z.object({
  name: z.string().optional(),
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(50, { message: 'Username must not exceed 50 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores'
    }),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
})

export const forgotPasswordSchema = z.object({
  email: z.email({ message: 'Invalid email address' })
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    newPassword: z
      .string()
      .min(1, { message: 'New password is required' })
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' })
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

// Types
export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
export type AuthSchema = LoginSchema | SignupSchema
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
