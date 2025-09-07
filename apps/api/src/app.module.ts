import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '~/auth/Auth.module'
import { PrismaModule } from '~/shared/infrastructure/database'
import { SharedModule } from '~/shared/Shared.module'
import { UsersModule } from '~/users/Users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    SharedModule,
    PrismaModule,
    UsersModule,
    AuthModule
  ]
})
export class AppModule {}
