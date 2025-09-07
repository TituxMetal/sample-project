import { applyDecorators, UseInterceptors } from '@nestjs/common'
import type { ClassConstructor } from 'class-transformer'

import { SerializeInterceptor } from '~/shared/infrastructure/interceptors/Serialize.interceptor'

export const Serialize = <T>(dto: ClassConstructor<T>) =>
  applyDecorators(UseInterceptors(new SerializeInterceptor(dto)))
