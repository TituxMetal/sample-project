import { Global, Module } from '@nestjs/common'

import { LoggerService } from './infrastructure/services/Logger.service'

@Global()
@Module({
  providers: [
    {
      provide: LoggerService,
      useFactory: () => new LoggerService('SharedModule')
    }
  ],
  exports: [LoggerService]
})
export class SharedModule {}
