import { ErrorCode } from '../constant';

export interface IApiErrorDetail {
  field?: string;
  message?: string;
}

export interface IApiErrorResponse {
  success: boolean;
  statusCode: number;
  errorCode: ErrorCode;
  message: string;
  details?: IApiErrorDetail[] | null;
}
