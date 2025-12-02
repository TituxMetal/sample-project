import type { User } from './user.types'

declare global {
  namespace App {
    interface Locals {
      user: User | undefined
    }
  }
}

export {}
