import { defineConfig, env } from 'prisma/config'

try {
  process.loadEnvFile('.env')
} catch (error) {
  // .env is optional, DATABASE_URL can come from environment variables
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations'
  },
  datasource: {
    url: env('DATABASE_URL')
  }
})
