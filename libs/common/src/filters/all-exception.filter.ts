import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { AppLogger } from '../logger/logger.service';
import { Response, Request } from 'express';
import {
  formatErrors,
  IApiErrorDetail,
  IApiErrorResponse,
  translateValidationError,
} from '@app/shared';
import 'dotenv-flow/config';
import { ApiError } from '../errors';
import { Lang, ErrorCode } from '@app/shared';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}
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
      console.log('thrown by apierror');
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
      console.log('thrown by httpexception');
      status = exception.getStatus();
      const res: any = exception.getResponse();
      if (status === 400) {
        // get error from class-validator
        body = {
          success: false,
          errorCode: 'VALIDATE_ERROR',
          statusCode: status,
          message: translateValidationError('VALIDATE_ERROR', lang),
          details:
            typeof res?.message === 'object'
              ? (formatErrors(res.message, lang) as any)
              : res.message,
        };
      }
      // } else if (status === 401) {
      //   body = {
      //     success: false,
      //     errorCode: 'UNAUTHORIZED',
      //     statusCode: status,
      //     message: translateValidationError('UNAUTHORIZED', lang),
      //     details: res.message ?? null,
      //   };

      // }
      else if (status === 413) {
        // get error from multer middleware
        const maxSize = request['multerMaxSize'] / 1024 / 1024;
        body = {
          success: false,
          errorCode: 'FILE_TOO_LARGE',
          statusCode: status,
          message: translateValidationError('FILE_TOO_LARGE', lang, {
            max: isNaN(maxSize) ? 'max' : maxSize,
          }),
          details:
            typeof res?.message === 'object'
              ? (formatErrors(res.message, lang) as any)
              : res.message,
        };
      } else if (status === 404) {
        // get error from not Found
        body = {
          success: false,
          errorCode: 'NOT_FOUND',
          statusCode: status,
          message: res.message ?? null,
          details: null,
        };
      } else {
        // get error from unregitered error
        body = {
          success: false,
          errorCode: 'UNREGISTERED_ERROR',
          statusCode: status,
          message: translateValidationError('UNREGISTERED_ERROR', lang),
          details: res.message ?? null,
        };
      }
    } else if (exception instanceof Error) {
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
      AllExceptionFilter.name,
    );

    response.status(status).json({
      ...body,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
