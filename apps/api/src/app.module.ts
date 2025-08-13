import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DatabaseModule } from '~/shared/infrastructure'

import { UsersModule } from './users/UsersModule'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, UsersModule],
  controllers: [],
  providers: []
})
export class AppModule {}
