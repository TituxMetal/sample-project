declare namespace App {
  interface Locals {
    user: import('./user.types').User | undefined
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string
  readonly DEV: boolean
  readonly PROD: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
