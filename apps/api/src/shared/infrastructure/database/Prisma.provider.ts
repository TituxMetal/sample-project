import { PrismaClient } from '@generated'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'

@Injectable()
export class PrismaProvider extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: ConfigService) {
    const adapter = new PrismaLibSql({
      url: config.get<string>('DATABASE_URL') ?? 'file:./dev.db'
    })
    super({
      adapter,
      log: ['query', 'info', 'warn', 'error']
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
