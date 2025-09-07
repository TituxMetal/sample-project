declare namespace App {
  interface Locals {
    user: import('./user.types').User | undefined
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
