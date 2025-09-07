import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { ClassConstructor, plainToClass } from 'class-transformer'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map((data: unknown) =>
        plainToClass(this.dto, data, {
          excludeExtraneousValues: true
        })
      )
    )
  }
}
