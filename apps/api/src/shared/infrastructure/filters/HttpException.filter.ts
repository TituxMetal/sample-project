import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const status = exception instanceof HttpException ? exception.getStatus() : 500
    const message = exception instanceof Error ? exception.message : 'Internal server error'

    this.logger.error(`${status} - ${message}`)

    response.status(status).json({
      statusCode: status,
      message
    })
  }
}
