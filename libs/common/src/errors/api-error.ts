import { IApiErrorDetail } from '@app/shared';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@app/shared';

export class ApiError extends HttpException {
  constructor(
    errorCode: ErrorCode,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    params?: Record<string, any>,
    details?: IApiErrorDetail[],
  ) {
    const response = {
      errorCode,
      params: params ?? null,
      details: details ?? null,
    };
    super(response, status);
  }

  static BadRequest(
    errorCode: ErrorCode,
    params?: Record<string, any>,
    details?: IApiErrorDetail[],
  ) {
    return new ApiError(errorCode, HttpStatus.BAD_REQUEST, params, details);
  }

  static NotFound(
    errorCode: ErrorCode = 'NOT_FOUND',
    params?: Record<string, any>,
    details?: IApiErrorDetail[],
  ) {
    return new ApiError(errorCode, HttpStatus.NOT_FOUND, params, details);
  }

  static Unathorized(errorCode: ErrorCode = 'UNAUTHORIZED') {
    return new ApiError(errorCode, HttpStatus.FORBIDDEN);
  }

  static Conflict(errorCode: ErrorCode) {
    return new ApiError(errorCode, HttpStatus.CONFLICT);
  }

  static Forbidden(errorCode: ErrorCode = 'FORBIDDEN') {
    return new ApiError(errorCode, HttpStatus.FORBIDDEN);
  }

  static Internal(errorCode: ErrorCode = 'INTERNAL_SERVER_ERROR') {
    return new ApiError(errorCode, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
