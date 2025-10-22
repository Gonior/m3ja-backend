import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { AppLogger } from '../logger/app.logger';
import { Response, Request } from 'express';
import {
  formatErrors,
  IApiErrorDetail,
  IApiErrorResponse,
  translateValidationError,
} from '@app/shared';
import 'dotenv-flow/config';
import { ApiError } from '../errors';
import { Lang } from '../errors/error-message';
import { ErrorCode } from '../errors/error-code';
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext('ExceptionHandler');
  }
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const lang = (request.headers['accept-language'] as Lang) || 'en';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: IApiErrorResponse = {
      success: false,
      statusCode: status,
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
      details: null,
    };

    if (exception instanceof ApiError) {
      console.log('thrown by ApiError');
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object') {
        const r = res as {
          errorCode: ErrorCode;
          params: Record<string, any>;
          details: IApiErrorDetail[];
        };
        body = {
          success: false,
          errorCode: r.errorCode,
          statusCode: status,
          message: translateValidationError(r.errorCode, lang, r.params),
          details: r.details ?? null,
        };
      }
    } else if (exception instanceof HttpException) {
      console.log('thrown by HttpException');
      status = exception.getStatus();
      const res: any = exception.getResponse();
      body = {
        success: false,
        errorCode: 'VALIDATE_ERROR',
        statusCode: status,
        message: translateValidationError('VALIDATE_ERROR', lang),
        details: typeof res === 'object' ? (formatErrors(res.message, lang) as any) : null,
      };
    } else if (exception instanceof Error) {
      console.log('thrown by Error');
      body = {
        success: false,
        errorCode: 'INTERNAL_SERVER_ERROR',
        statusCode: status,
        message: exception.message,
        details: null,
      };
    }
    let stack = exception instanceof Error ? exception.stack : undefined;
    this.logger.error(
      `${request.method} ${request.url} -> ${body.statusCode} ${body.message}`,
      stack,
    );

    response.status(status).json({
      ...body,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
