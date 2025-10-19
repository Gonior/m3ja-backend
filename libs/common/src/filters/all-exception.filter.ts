import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { AppLogger } from '../logger/app.logger';
import { Response, Request } from 'express';
import { IApiErrorResponse } from '@app/shared';
import 'dotenv-flow/config'
@Catch()
export class AllExceptionFilter implements ExceptionFilter {

  constructor(private readonly logger : AppLogger) {
    this.logger.setContext('ExceptionHandler')
  }
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
   
    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let body : IApiErrorResponse={
      statusCode : status,
      message : 'Internal server error',
      errors : null
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const res = exception.getResponse()
      if (typeof res === 'object') {
        const r = res as IApiErrorResponse
        body = {
          statusCode: r.statusCode ?? status,
          message : r.message ?? 'Error',
          errors : r.errors ?? null
        }
      } else {
        body  = {
          statusCode: status,
          message : res as string,
          errors : null
        }
      }
    } else if (exception instanceof Error) {
      body = {
        statusCode: status,
        message : exception.message,
        errors : null
      }
    }
    let stack = exception instanceof Error ? exception.stack : undefined
    if(process.env.NODE_ENV === 'production') stack = undefined
    this.logger.error(
      `${request.method} ${request.url} -> ${body.statusCode} ${body.message}`,
      stack
    )

    response.status(status).json({
      ...body,
      path : request.url,
      timestamp : new Date().toISOString()
    })
  }

}
