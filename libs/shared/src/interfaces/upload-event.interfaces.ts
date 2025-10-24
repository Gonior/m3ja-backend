import { IUploadFileResponse } from './upload-service.interface';

export interface IUploadEvent extends IUploadFileResponse {
  userId: number;
}
