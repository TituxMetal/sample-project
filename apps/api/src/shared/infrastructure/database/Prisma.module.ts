import { Global, Module } from '@nestjs/common'

import { PrismaProvider } from './Prisma.provider'

@Global()
@Module({
  providers: [PrismaProvider],
  exports: [PrismaProvider]
})
export class PrismaModule {}
