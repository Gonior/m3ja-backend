export interface IApiErrorDetail {
  field?:string;
  message : string;
}

export interface IApiErrorResponse {
  statusCode: number;
  message: string;
  errors?: IApiErrorDetail[] | null;
}
