import { IApiErrorDetail, IApiErrorResponse } from "@app/shared";
import { HttpException, HttpStatus } from "@nestjs/common";

export class ApiError extends HttpException {
  constructor(
    message : string,
    status : HttpStatus = HttpStatus.BAD_REQUEST,
    errors? : IApiErrorDetail[]
  ) {
    const response : IApiErrorResponse = {
      statusCode: status,
      message,
      errors :errors ?? null
    }
    super(response,status)
    this.name = 'ApiError'
  }

  static BadRequest(message:string, errors?: IApiErrorDetail[]) {
    return new ApiError(message, HttpStatus.BAD_REQUEST, errors)
  }

  static Unathorized(message = "Forbidden") {
    return new ApiError(message, HttpStatus.FORBIDDEN)
  }

  static NotFound(message = 'Not Found') {
    return new ApiError(message, HttpStatus.NOT_FOUND)
  }

  static Conflict(message = 'Conflict') {
    return new ApiError(message, HttpStatus.CONFLICT)
  }

  static Database(message = 'Database error') {
    return new ApiError(message, HttpStatus.INTERNAL_SERVER_ERROR)
  }

  static Internal(message = "Internal server error") {
    return new ApiError(message, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}